import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async getChatResponse(
    @Body() chatDto: ChatDto,
  ): Promise<{ response: string }> {
    const response = await this.chatService.generateResponse(chatDto);
    return { response };
  }
}
