export interface IService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
  providerId: string;
}

export interface IServiceUpdate {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
} 