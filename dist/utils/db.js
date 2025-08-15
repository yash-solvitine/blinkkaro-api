"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const config_1 = require("../config/config");
const logger_1 = require("./logger");
const pool = new pg_1.Pool({
    connectionString: config_1.config.db.url,
});
pool.on("error", (err) => {
    logger_1.log.error("Unexpected error on idle client", err);
    process.exit(-1);
});
function formatValue(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}
async function executeQuery(query, params) {
    const client = await pool.connect();
    try {
        const formattedParams = params === null || params === void 0 ? void 0 : params.map(formatValue);
        const result = await client.query(query, formattedParams);
        return result;
    }
    catch (error) {
        logger_1.log.error("Database query error", {
            error,
            query,
            params,
        });
        throw error;
    }
    finally {
        client.release();
    }
}
exports.db = {
    async select({ table, columns = ["*"], where = "", params = [], orderBy = "", limit = 0, offset = 0, }) {
        let query = `SELECT ${columns.join(", ")} FROM ${table}`;
        if (where)
            query += ` WHERE ${where}`;
        if (orderBy)
            query += ` ORDER BY ${orderBy}`;
        if (limit > 0)
            query += ` LIMIT ${limit}`;
        if (offset > 0)
            query += ` OFFSET ${offset}`;
        const result = await executeQuery(query, params);
        return result.rows;
    },
    async insert({ table, data, returning = ["*"], }) {
        const columns = Object.keys(data);
        const values = Object.values(data).map(formatValue);
        const placeholders = values.map((_, i) => `$${i + 1}`);
        const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING ${returning.join(", ")}
    `;
        const result = await executeQuery(query, values);
        return result.rows[0];
    },
    async update({ table, data, where, params = [], returning = ["*"], }) {
        const dataEntries = Object.entries(data);
        const setColumns = dataEntries
            .map((_, i) => `${dataEntries[i][0]} = $${i + 1}`)
            .join(", ");
        const values = [
            ...dataEntries.map(([_, value]) => formatValue(value)),
            ...params.map(formatValue),
        ];
        const paramOffset = dataEntries.length;
        const whereClause = where.replace(/\$(\d+)/g, (_, num) => `$${parseInt(num) + paramOffset}`);
        const query = `
      UPDATE ${table}
      SET ${setColumns}
      WHERE ${whereClause}
      RETURNING ${returning.join(", ")}
    `;
        const result = await executeQuery(query, values);
        return result.rows;
    },
    async delete({ table, where, params = [], returning = ["*"], }) {
        const query = `
      DELETE FROM ${table}
      WHERE ${where}
      RETURNING ${returning.join(", ")}
    `;
        const result = await executeQuery(query, params.map(formatValue));
        return result.rows;
    },
    async query(query, params) {
        return executeQuery(query, params === null || params === void 0 ? void 0 : params.map(formatValue));
    },
    async beginTransaction() {
        const client = await pool.connect();
        await client.query("BEGIN");
        return client;
    },
    async commitTransaction(client) {
        await client.query("COMMIT");
        client.release();
    },
    async rollbackTransaction(client) {
        await client.query("ROLLBACK");
        client.release();
    },
};
//# sourceMappingURL=db.js.map