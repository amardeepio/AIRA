import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
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

  private readProperties() {
    const fileContent = fs.readFileSync(this.propertiesFilePath, 'utf8');
    return JSON.parse(fileContent);
  }

  private writeProperties(properties: any) {
    fs.writeFileSync(this.propertiesFilePath, JSON.stringify(properties, null, 2), 'utf8');
  }

  async uploadToIpfs(createPropertyDto: CreatePropertyDto, file: Express.Multer.File) {
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
      const res = await axios.post(
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
      throw new Error('Failed to upload image to IPFS or update properties file');
    }
  }

  add(createPropertyDto: CreatePropertyDto, ipfsHash: string, tokenId: string) {
    const properties = this.readProperties();

    const newProperty = {
      id: tokenId,
      name: createPropertyDto.propertyName,
      description: createPropertyDto.description,
      location: createPropertyDto.location,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      totalShares: parseInt(createPropertyDto.totalShares, 10),
      price: `$${(parseInt(createPropertyDto.totalShares, 10) * parseFloat(createPropertyDto.pricePerShare)).toLocaleString()}`,
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

  findAll() {
    return this.readProperties();
  }

  findOne(id: number) {
    const properties = this.readProperties();
    return properties.find((p: any) => p.id === id.toString());
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
