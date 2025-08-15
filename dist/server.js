"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const logger_1 = require("./utils/logger");
const init_1 = __importDefault(require("./db/init"));
async function startServer() {
    try {
        await (0, init_1.default)();
        logger_1.log.info('Database initialized successfully');
        const server = app_1.default.listen(config_1.config.server.port, () => {
            logger_1.log.info(`Server is running on port ${config_1.config.server.port}`);
        });
        const shutdown = async () => {
            logger_1.log.info('Shutting down server...');
            server.close(() => {
                logger_1.log.info('Server closed');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        logger_1.log.error('Failed to start server', { error });
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map