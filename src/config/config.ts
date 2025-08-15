import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_URL: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().default("15"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

  // EmailJS
  EMAILJS_PUBLIC_KEY: z.string(),
  EMAILJS_SERVICE_ID: z.string(),
  EMAILJS_WAITLIST_TEMPLATE_ID: z.string(),
  EMAILJS_ADMIN_TEMPLATE_ID: z.string(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("❌ Invalid environment variables:", envVars.error.format());
  throw new Error("Invalid environment variables");
}

export const config = {
  server: {
    port: parseInt(envVars.data.PORT, 10),
    nodeEnv: envVars.data.NODE_ENV,
  },
  db: {
    url: envVars.data.DATABASE_URL,
  },
  redis: {
    host: envVars.data.REDIS_HOST,
    url: envVars.data.REDIS_URL,
    port: parseInt(envVars.data.REDIS_PORT, 10),
    password: envVars.data.REDIS_PASSWORD,
  },
  jwt: {
    secret: envVars.data.JWT_SECRET,
    expiresIn: envVars.data.JWT_EXPIRES_IN,
    refreshExpiresIn: envVars.data.JWT_REFRESH_EXPIRES_IN,
  },
  rateLimit: {
    windowMs: parseInt(envVars.data.RATE_LIMIT_WINDOW, 10) * 60 * 1000, // minutes to ms
    max: parseInt(envVars.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  logging: {
    level: envVars.data.LOG_LEVEL,
  },
  email: {
    publicKey: envVars.data.EMAILJS_PUBLIC_KEY,
    serviceId: envVars.data.EMAILJS_SERVICE_ID,
    waitlistTemplateId: envVars.data.EMAILJS_WAITLIST_TEMPLATE_ID,
    adminNotificationTemplateId: envVars.data.EMAILJS_ADMIN_TEMPLATE_ID,
    adminEmail: envVars.data.ADMIN_NOTIFICATION_EMAIL,
  },
} as const;
