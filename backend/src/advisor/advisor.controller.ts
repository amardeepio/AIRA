import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { AdvisorDto } from './dto/advisor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async getAdvice(@Body() advisorDto: AdvisorDto) {
    return this.advisorService.getAdvice(advisorDto);
  }
}
