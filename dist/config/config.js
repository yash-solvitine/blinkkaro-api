"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("3000"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    DATABASE_URL: zod_1.z.string(),
    REDIS_HOST: zod_1.z.string().default("localhost"),
    REDIS_URL: zod_1.z.string().default("localhost"),
    REDIS_PORT: zod_1.z.string().default("6379"),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default("1h"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    RATE_LIMIT_WINDOW: zod_1.z.string().default("15"),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().default("100"),
    LOG_LEVEL: zod_1.z.enum(["error", "warn", "info", "debug"]).default("info"),
    EMAILJS_PUBLIC_KEY: zod_1.z.string(),
    EMAILJS_SERVICE_ID: zod_1.z.string(),
    EMAILJS_WAITLIST_TEMPLATE_ID: zod_1.z.string(),
    EMAILJS_ADMIN_TEMPLATE_ID: zod_1.z.string(),
    ADMIN_NOTIFICATION_EMAIL: zod_1.z.string().email(),
});
const envVars = envSchema.safeParse(process.env);
if (!envVars.success) {
    console.error("❌ Invalid environment variables:", envVars.error.format());
    throw new Error("Invalid environment variables");
}
exports.config = {
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
        windowMs: parseInt(envVars.data.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
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
};
//# sourceMappingURL=config.js.map