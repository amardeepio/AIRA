import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  Property,
  UploadResponse,
  AddPropertyResponse,
  PinataResponse,
} from './entities/property.entity';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PropertiesService {
  private readonly propertiesFilePath = path.resolve(
    __dirname,
    '../../data/properties.data.json',
  );

  private readProperties(): Property[] {
    const fileContent = fs.readFileSync(this.propertiesFilePath, 'utf8');
    return JSON.parse(fileContent) as Property[];
  }

  private writeProperties(properties: Property[]): void {
    fs.writeFileSync(
      this.propertiesFilePath,
      JSON.stringify(properties, null, 2),
      'utf8',
    );
  }

  async uploadToIpfs(
    createPropertyDto: CreatePropertyDto,
    file: Express.Multer.File,
  ): Promise<UploadResponse> {
    const formData = new FormData();
    const stream = Readable.from(file.buffer);
    formData.append('file', stream, { filename: file.originalname });

    const metadata = JSON.stringify({
      name: createPropertyDto.propertyName,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
      const res = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        },
      );

      console.log('File uploaded to Pinata:', res.data);

      return {
        message: 'Image uploaded to IPFS successfully',
        ipfsHash: res.data.IpfsHash,
      };
    } catch (error) {
      console.error('Error uploading to Pinata or updating file:', error);
      throw new Error(
        'Failed to upload image to IPFS or update properties file',
      );
    }
  }

  add(
    createPropertyDto: CreatePropertyDto,
    ipfsHash: string,
    tokenId: string,
  ): AddPropertyResponse {
    const properties = this.readProperties();

    const newProperty: Property = {
      id: tokenId,
      name: createPropertyDto.propertyName,
      description: createPropertyDto.description,
      location: createPropertyDto.location,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      totalShares: parseInt(createPropertyDto.totalShares, 10),
      price: `${(parseInt(createPropertyDto.totalShares, 10) * parseFloat(createPropertyDto.pricePerShare)).toLocaleString()}`,
      yield: '5.0%', // Placeholder yield
      sharesAvailable: parseInt(createPropertyDto.totalShares, 10),
    };

    properties.unshift(newProperty);
    this.writeProperties(properties);

    return {
      message: 'Property added successfully',
      property: newProperty,
    };
  }

  findAll(): Property[] {
    return this.readProperties();
  }

  findOne(id: string): Property | undefined {
    const properties = this.readProperties();
    return properties.find((p) => p.id === id);
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto): string {
    return `This action updates a #${id} property with ${JSON.stringify(updatePropertyDto)}`;
  }

  remove(id: number): string {
    return `This action removes a #${id} property`;
  }
}
