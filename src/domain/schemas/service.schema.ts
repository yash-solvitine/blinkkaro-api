import { z } from "zod";
import { ServiceStatus } from "../interfaces/service.interface";

export const serviceCreateSchema = z
  .object({
    provider_id: z.string().uuid("Invalid provider ID"),
    category_id: z.string().uuid("Invalid category ID"),
    sub_category_id: z.string().uuid("Invalid sub-category ID").optional(),
    name: z.string().min(3, "Service name must be at least 3 characters"),
    price: z.number().positive("Price must be positive"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    duration_days: z.number().min(0).default(0),
    duration_hours: z.number().min(0).default(0),
    duration_minutes: z.number().min(0).default(0),
    advance_payment_percent: z.number().min(0).max(100).default(0),
    service_location: z.string().optional(),
    at_customer_location: z.boolean().default(false),
    images: z.array(z.string().url("Invalid image URL")).default([]),
  })
  .refine(
    (data) =>
      data.duration_days > 0 ||
      data.duration_hours > 0 ||
      data.duration_minutes > 0,
    {
      message: "Service duration must be specified",
      path: ["duration"],
    }
  );

export const serviceUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Service name must be at least 3 characters")
    .optional(),
  price: z.number().positive("Price must be positive").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  duration_days: z.number().min(0).optional(),
  duration_hours: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
  advance_payment_percent: z.number().min(0).max(100).optional(),
  service_location: z.string().optional(),
  at_customer_location: z.boolean().optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  status: z.nativeEnum(ServiceStatus).optional(),
});

export const serviceListQuerySchema = z.object({
  provider_id: z.string().uuid("Invalid provider ID").optional(),
  category_id: z.string().uuid("Invalid category ID").optional(),
  sub_category_id: z.string().uuid("Invalid sub-category ID").optional(),
  status: z.nativeEnum(ServiceStatus).optional(),
  min_price: z.number().positive("Minimum price must be positive").optional(),
  max_price: z.number().positive("Maximum price must be positive").optional(),
  location: z.string().optional(),
  at_customer_location: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort_by: z.enum(["price", "created_at", "name"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});
