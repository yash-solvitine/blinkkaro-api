import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/config";
import { errorHandler } from "./middleware/error.middleware";
import { log } from "./utils/logger";
import authRoutes from "./routes/auth.routes";
import serviceRoutes from "./routes/service.routes";
import waitlistRoutes from "./routes/waitlist.routes";

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/waitlist", waitlistRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Error logging
app.on("error", (err: any) => {
  log.error("Server error", {
    error: err instanceof Error ? err.message : String(err),
  });
});

export default app;
