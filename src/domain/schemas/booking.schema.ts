import { z } from 'zod';

export const bookingCreateSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  notes: z.string().optional(),
}).refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export const bookingUpdateSchema = z.object({
  startTime: z.string().datetime('Invalid start time format').optional(),
  endTime: z.string().datetime('Invalid end time format').optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
); 