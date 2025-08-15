"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("../interfaces/user.interface");
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
const phoneNumberSchema = zod_1.z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');
const countryCodeSchema = zod_1.z
    .string()
    .regex(/^\+\d{1,4}$/, 'Invalid country code format (e.g., +91)');
exports.userCreateSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: passwordSchema,
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    phoneNumber: phoneNumberSchema,
    countryCode: countryCodeSchema,
    country: zod_1.z.string().min(2, 'Country must be at least 2 characters'),
    birthDate: zod_1.z.string().transform((str) => new Date(str)),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender),
    role: zod_1.z.nativeEnum(user_interface_1.UserRole).optional(),
}).refine((data) => {
    const birthDate = new Date(data.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 13;
}, {
    message: 'User must be at least 13 years old',
    path: ['birthDate'],
});
exports.userUpdateSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phoneNumber: phoneNumberSchema.optional(),
    countryCode: countryCodeSchema.optional(),
    country: zod_1.z.string().min(2, 'Country must be at least 2 characters').optional(),
    password: passwordSchema.optional(),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
    role: zod_1.z.nativeEnum(user_interface_1.UserRole).optional(),
});
//# sourceMappingURL=user.schema.js.map