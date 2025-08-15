"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitlistCreateSchema = void 0;
const zod_1 = require("zod");
exports.waitlistCreateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .max(255, "Email must not exceed 255 characters"),
    country_code: zod_1.z
        .string()
        .regex(/^\+\d{1,4}$/, "Invalid country code format (e.g., +91)")
        .max(5, "Country code must not exceed 5 characters"),
    phone: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must not exceed 10 digits"),
    message: zod_1.z
        .string()
        .max(500, "Message must not exceed 500 characters")
        .optional(),
});
//# sourceMappingURL=waitlist.schema.js.map