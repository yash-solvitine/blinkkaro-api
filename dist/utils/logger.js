"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config/config");
const logger = winston_1.default.createLogger({
    level: config_1.config.logging.level,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    defaultMeta: { service: 'blinkkaro-api' },
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
});
if (config_1.config.server.nodeEnv !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }));
}
exports.log = {
    error: (message, meta) => logger.error(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    info: (message, meta) => logger.info(message, meta),
    debug: (message, meta) => logger.debug(message, meta),
};
//# sourceMappingURL=logger.js.map