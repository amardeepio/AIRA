import { Controller, Post, Body } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { AdvisorDto } from './dto/advisor.dto';

@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Post()
  async getAdvice(@Body() advisorDto: AdvisorDto) {
    return this.advisorService.getAdvice(advisorDto);
  }
}
