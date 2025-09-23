export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  totalShares: number;
  price: string;
  yield: string;
  sharesAvailable: number;
}

export interface PinataResponse {
  IpfsHash: string;
  [key: string]: any;
}

export interface UploadResponse {
  message: string;
  ipfsHash: string;
}

export interface AddPropertyResponse {
  message: string;
  property: Property;
}
