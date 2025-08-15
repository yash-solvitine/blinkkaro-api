"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const config_1 = require("../config/config");
const logger_1 = require("../utils/logger");
async function initializeDatabase() {
    const defaultPool = new pg_1.Pool({
        connectionString: config_1.config.db.url.replace('/blinkkaro', '/postgres'),
    });
    try {
        try {
            const result = await defaultPool.query('SELECT 1 FROM pg_database WHERE datname = $1', ['blinkkaro']);
            if (result.rowCount === 0) {
                logger_1.log.info('Creating database...');
                await defaultPool.query('CREATE DATABASE blinkkaro');
                logger_1.log.info('Database created successfully');
            }
        }
        catch (error) {
            logger_1.log.error('Error checking/creating database', { error });
            throw error;
        }
        finally {
            await defaultPool.end();
        }
        const pool = new pg_1.Pool({
            connectionString: config_1.config.db.url,
        });
        try {
            const schemaPath = path_1.default.join(__dirname, 'schema.sql');
            const schema = fs_1.default.readFileSync(schemaPath, 'utf8');
            await pool.query(schema);
            logger_1.log.info('Database schema initialized successfully');
        }
        finally {
            await pool.end();
        }
    }
    catch (error) {
        logger_1.log.error('Error initializing database schema', { error });
        throw error;
    }
}
if (require.main === module) {
    initializeDatabase()
        .then(() => {
        logger_1.log.info('Database initialization completed');
        process.exit(0);
    })
        .catch((error) => {
        logger_1.log.error('Database initialization failed', { error });
        process.exit(1);
    });
}
exports.default = initializeDatabase;
//# sourceMappingURL=init.js.map