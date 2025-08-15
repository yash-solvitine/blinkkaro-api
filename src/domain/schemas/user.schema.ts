import { z } from 'zod';
import { Gender, UserRole } from '../interfaces/user.interface';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

const phoneNumberSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

const countryCodeSchema = z
  .string()
  .regex(/^\+\d{1,4}$/, 'Invalid country code format (e.g., +91)');

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: phoneNumberSchema,
  countryCode: countryCodeSchema,
  country: z.string().min(2, 'Country must be at least 2 characters'),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.nativeEnum(Gender),
  role: z.nativeEnum(UserRole).optional(),
}).refine(
  (data) => {
    const birthDate = new Date(data.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 13;
  },
  {
    message: 'User must be at least 13 years old',
    path: ['birthDate'],
  }
);

export const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  phoneNumber: phoneNumberSchema.optional(),
  countryCode: countryCodeSchema.optional(),
  country: z.string().min(2, 'Country must be at least 2 characters').optional(),
  password: passwordSchema.optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  role: z.nativeEnum(UserRole).optional(),
}); 