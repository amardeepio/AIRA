import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type {
  Property,
  UploadResponse,
  AddPropertyResponse,
} from './entities/property.entity';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadToIpfs(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<UploadResponse> {
    return this.propertiesService.uploadToIpfs(createPropertyDto, file);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  add(
    @Body()
    {
      createPropertyDto,
      ipfsHash,
      tokenId,
    }: {
      createPropertyDto: CreatePropertyDto;
      ipfsHash: string;
      tokenId: string;
    },
  ): AddPropertyResponse {
    return this.propertiesService.add(createPropertyDto, ipfsHash, tokenId);
  }

  @Get()
  findAll(): Property[] {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Property | undefined {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): string {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.propertiesService.remove(+id);
  }
}
