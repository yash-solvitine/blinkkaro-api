"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./config/config");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const waitlist_routes_1 = __importDefault(require("./routes/waitlist.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.windowMs,
    max: config_1.config.rateLimit.max,
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);
app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/services", service_routes_1.default);
app.use("/api/v1/waitlist", waitlist_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.use((_, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});
app.on("error", (err) => {
    logger_1.log.error("Server error", {
        error: err instanceof Error ? err.message : String(err),
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map