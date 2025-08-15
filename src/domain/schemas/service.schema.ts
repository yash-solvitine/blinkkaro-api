import { z } from 'zod';

export const serviceCreateSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be a positive number'),
  duration: z.number().int().positive('Duration must be a positive integer'),
});

export const serviceUpdateSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  duration: z.number().int().positive('Duration must be a positive integer').optional(),
}); 