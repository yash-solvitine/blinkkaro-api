"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const config_1 = require("../config/config");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof errors_1.AppError) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: "error",
                message: err.message,
            });
        }
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            status: "error",
            message: "Validation error",
            errors: err.errors,
        });
    }
    logger_1.log.error("Unexpected error", {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    const message = config_1.config.server.nodeEnv === "production"
        ? "Something went wrong"
        : err.message;
    return res.status(500).json(Object.assign({ status: "error", message }, (config_1.config.server.nodeEnv !== "production" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map