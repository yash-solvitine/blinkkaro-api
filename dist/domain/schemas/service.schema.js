"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceListQuerySchema = exports.serviceUpdateSchema = exports.serviceCreateSchema = void 0;
const zod_1 = require("zod");
const service_interface_1 = require("../interfaces/service.interface");
exports.serviceCreateSchema = zod_1.z
    .object({
    provider_id: zod_1.z.string().uuid("Invalid provider ID"),
    category_id: zod_1.z.string().uuid("Invalid category ID"),
    sub_category_id: zod_1.z.string().uuid("Invalid sub-category ID").optional(),
    name: zod_1.z.string().min(3, "Service name must be at least 3 characters"),
    price: zod_1.z.number().positive("Price must be positive"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters")
        .optional(),
    duration_days: zod_1.z.number().min(0).default(0),
    duration_hours: zod_1.z.number().min(0).default(0),
    duration_minutes: zod_1.z.number().min(0).default(0),
    advance_payment_percent: zod_1.z.number().min(0).max(100).default(0),
    service_location: zod_1.z.string().optional(),
    at_customer_location: zod_1.z.boolean().default(false),
    images: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).default([]),
})
    .refine((data) => data.duration_days > 0 ||
    data.duration_hours > 0 ||
    data.duration_minutes > 0, {
    message: "Service duration must be specified",
    path: ["duration"],
});
exports.serviceUpdateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Service name must be at least 3 characters")
        .optional(),
    price: zod_1.z.number().positive("Price must be positive").optional(),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters")
        .optional(),
    duration_days: zod_1.z.number().min(0).optional(),
    duration_hours: zod_1.z.number().min(0).optional(),
    duration_minutes: zod_1.z.number().min(0).optional(),
    advance_payment_percent: zod_1.z.number().min(0).max(100).optional(),
    service_location: zod_1.z.string().optional(),
    at_customer_location: zod_1.z.boolean().optional(),
    images: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional(),
    status: zod_1.z.nativeEnum(service_interface_1.ServiceStatus).optional(),
});
exports.serviceListQuerySchema = zod_1.z.object({
    provider_id: zod_1.z.string().uuid("Invalid provider ID").optional(),
    category_id: zod_1.z.string().uuid("Invalid category ID").optional(),
    sub_category_id: zod_1.z.string().uuid("Invalid sub-category ID").optional(),
    status: zod_1.z.nativeEnum(service_interface_1.ServiceStatus).optional(),
    min_price: zod_1.z.number().positive("Minimum price must be positive").optional(),
    max_price: zod_1.z.number().positive("Maximum price must be positive").optional(),
    location: zod_1.z.string().optional(),
    at_customer_location: zod_1.z.boolean().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
    sort_by: zod_1.z.enum(["price", "created_at", "name"]).default("created_at"),
    sort_order: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
//# sourceMappingURL=service.schema.js.map