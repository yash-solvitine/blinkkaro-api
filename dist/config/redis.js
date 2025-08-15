"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const logger_1 = require("../utils/logger");
const redis = new ioredis_1.default(config_1.config.redis.url, {
    tls: {}
});
redis.on('error', (error) => {
    logger_1.log.error('Redis connection error', { error: error.message });
});
redis.on('connect', () => {
    logger_1.log.info('Redis connected successfully');
});
exports.default = redis;
//# sourceMappingURL=redis.js.map