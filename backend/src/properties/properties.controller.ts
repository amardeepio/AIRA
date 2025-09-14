import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadToIpfs(@UploadedFile() file: Express.Multer.File, @Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.uploadToIpfs(createPropertyDto, file);
  }

  @Post('add')
  add(@Body() { createPropertyDto, ipfsHash, tokenId }: { createPropertyDto: CreatePropertyDto, ipfsHash: string, tokenId: string }) {
    return this.propertiesService.add(createPropertyDto, ipfsHash, tokenId);
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}
