import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly chat: ChatGoogleGenerativeAI;
  private readonly systemPrompt = `You are AIRA’s floating chatbox assistant. You are built with LangChain and connected to Gemini 2.5 Flash.
Your role is to help users understand and interact with AIRA (Artificial Intelligence Real-estate Assets), a marketplace for fractional real estate NFTs. You can also provide personalized investment advice.

Guidelines:
1. Remember only the last 10 messages of the conversation for context.
2. Be brief, clear, and easy to understand in replies.
3. Do not provide or engage in political content or any sexual content.
4. Focus only on AIRA, real estate investing, fractional NFTs, blockchain, and related AI-powered insights.
5. If a user asks for investment advice, recommendations, or a portfolio, you can help them. Ask for their goals (e.g., 'High Growth' or 'Stable Income') and their budget.
6. If a question is outside your scope, politely say: "I can only help with AIRA-related queries."

Your goal is to make real estate investing concepts simple for everyone using the chatbox.`;

  constructor() {
    this.chat = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
    });
  }

  async generateResponse(chatDto: ChatDto): Promise<string> {
    const { message, history } = chatDto;

    const chatHistory = history.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.parts[0].text)
        : new AIMessage(msg.parts[0].text),
    );

    const recentHistory = chatHistory.slice(-10);

    const messages = [
      new HumanMessage(this.systemPrompt),
      ...recentHistory,
      new HumanMessage(message),
    ];

    try {
      const res = await this.chat.invoke(messages);
      if (typeof res.content === 'string') {
        return res.content;
      }
      return JSON.stringify(res.content);
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      return 'Sorry, I am having trouble connecting to my brain right now. Please try again later.';
    }
  }
}
