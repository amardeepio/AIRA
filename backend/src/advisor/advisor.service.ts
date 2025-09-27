import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { PropertiesService } from '../properties/properties.service';
import { Property } from '../properties/entities/property.entity';
import { AdvisorDto } from './dto/advisor.dto';
import JSON5 from 'json5';

// Define the expected structure of the AI's JSON response
interface AIAdvisorResponse {
  portfolioTitle: string;
  portfolioAnalysis: string;
  recommendations: { id: string; reason: string }[];
}

// Type guard to check if an object conforms to the AIAdvisorResponse interface
function isValidAIResponse(obj: unknown): obj is AIAdvisorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'portfolioTitle' in obj &&
    'portfolioAnalysis' in obj &&
    'recommendations' in obj &&
    Array.isArray((obj as AIAdvisorResponse).recommendations) &&
    (obj as AIAdvisorResponse).recommendations.every(
      (rec: unknown) =>
        typeof rec === 'object' &&
        rec !== null &&
        'id' in rec &&
        'reason' in rec,
    )
  );
}

@Injectable()
export class AdvisorService {
  private readonly chat: ChatGoogleGenerativeAI;

  constructor(private readonly propertiesService: PropertiesService) {
    this.chat = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
    });
  }

  private getGoalInstructions(goal: string): string {
    switch (goal.toLowerCase()) {
      case 'high growth':
        return "Prioritize properties with the highest 'yield' percentage. Also, favor properties in desirable or up-and-coming locations mentioned in their description. Your summary should highlight the growth potential.";
      case 'stable income':
        return "Prioritize properties with solid, moderate 'yield' percentages (e.g., 4-6%). Favor properties in major, well-established cities like 'New York', 'Tokyo', or 'Miami'. Your summary should emphasize consistency and lower risk.";
      case 'quick flip':
        return "Look for properties that seem undervalued for their location. A lower price is more important than a high yield for this goal. Check the description for keywords like 'potential' or 'opportunity'. Your summary should explain why it might be a good short-term investment.";
      default:
        return 'Provide a balanced list of properties with a mix of yield and stability.';
    }
  }

  async getAdvice(advisorDto: AdvisorDto): Promise<{
    portfolioTitle: string;
    portfolioAnalysis: string;
    recommendations: (Property & { reason: string })[];
  }> {
    const { goal, budget } = advisorDto;

    const allProperties = this.propertiesService.findAll();
    const affordableProperties = allProperties.filter((p) => {
      if (!p.price || !p.totalShares) return false;
      const pricePerShare =
        parseFloat(p.price.replace(/[^\d.]/g, '')) / p.totalShares;
      return pricePerShare <= budget;
    });

    if (affordableProperties.length === 0) {
      return {
        portfolioTitle: 'No Properties Found',
        portfolioAnalysis: `Unfortunately, I couldn't find any properties that match your budget of $${budget.toLocaleString()}. Try increasing your budget to see more options.`,
        recommendations: [],
      };
    }

    const propertiesForAI = affordableProperties.map(
      ({ id, name, description, location, price, yield: estYield }) => ({
        id,
        name,
        description,
        location,
        price,
        yield: estYield,
      }),
    );
    const goalInstructions = this.getGoalInstructions(goal);

    const advicePrompt = `
        You are an expert real estate investment analyst for AIRA. Your task is to recommend the best properties for a user based on their goals and budget.
        The user's goal is: "${goal}".
        The user's budget is: $${budget.toLocaleString()}.

        Here are the available properties that fit the user's budget:
        ${JSON.stringify(propertiesForAI, null, 2)}

        Your instructions for this goal are: "${goalInstructions}"

        Based on your analysis, please provide the following:
        1. A catchy, one-line 'portfolioTitle' for this recommendation.
        2. A detailed 'portfolioAnalysis' paragraph (3-4 sentences) explaining the overall strategy and why these properties work well together for the user's goal.
        3. An array named 'recommendations' containing objects for the top 2 properties. Each object must have an 'id' and a short, one-sentence 'reason' explaining why that specific property was chosen.
        
        IMPORTANT: Return ONLY a single, valid JSON object. All keys and string values must be enclosed in double quotes.
    `;

    try {
      const res = await this.chat.invoke([new HumanMessage(advicePrompt)]);

      let rawResponse: string;
      if (typeof res.content === 'string') {
        rawResponse = res.content;
      } else {
        rawResponse = JSON.stringify(res.content);
      }

      // Clean the response to extract only the JSON part
      const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

      const jsonResponse: unknown = JSON5.parse(jsonString);

      if (!isValidAIResponse(jsonResponse)) {
        throw new Error('AI response is not in the expected format.');
      }

      const recommendedProperties = jsonResponse.recommendations
        .map((rec) => {
          const property = allProperties.find((p) => p.id === rec.id);
          if (!property) return null;
          return { ...property, reason: rec.reason };
        })
        .filter((p): p is Property & { reason: string } => p !== null);

      return {
        portfolioTitle: jsonResponse.portfolioTitle,
        portfolioAnalysis: jsonResponse.portfolioAnalysis,
        recommendations: recommendedProperties,
      };
    } catch (error) {
      console.error('Error getting AI advice:', error);
      return {
        portfolioTitle: 'Analysis Error',
        portfolioAnalysis:
          'Sorry, I had trouble analyzing the properties. Please try again.',
        recommendations: [],
      };
    }
  }
}
