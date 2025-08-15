import { Pool, QueryResult, QueryResultRow } from "pg";
import { config } from "../config/config";
import { log } from "./logger";

// Create a connection pool
const pool = new Pool({
  connectionString: config.db.url,
});

// Log pool events
pool.on("error", (err) => {
  log.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Helper function to format values for SQL
function formatValue(value: any): any {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

// Generic query executor with error handling
async function executeQuery<T extends QueryResultRow>(
  query: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    const formattedParams = params?.map(formatValue);
    const result = await client.query<T>(query, formattedParams);
    return result;
  } catch (error) {
    log.error("Database query error", {
      error,
      query,
      params,
    });
    throw error;
  } finally {
    client.release();
  }
}

// Common database operations
export const db = {
  /**
   * Execute a SELECT query
   */
  async select<T extends QueryResultRow>({
    table,
    columns = ["*"],
    where = "",
    params = [],
    orderBy = "",
    limit = 0,
    offset = 0,
  }: {
    table: string;
    columns?: string[];
    where?: string;
    params?: any[];
    orderBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    let query = `SELECT ${columns.join(", ")} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit > 0) query += ` LIMIT ${limit}`;
    if (offset > 0) query += ` OFFSET ${offset}`;

    const result = await executeQuery<T>(query, params);
    return result.rows;
  },

  /**
   * Execute an INSERT query
   */
  async insert<T extends QueryResultRow>({
    table,
    data,
    returning = ["*"],
  }: {
    table: string;
    data: Record<string, any>;
    returning?: string[];
  }): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data).map(formatValue);
    const placeholders = values.map((_, i) => `$${i + 1}`);

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING ${returning.join(", ")}
    `;

    const result = await executeQuery<T>(query, values);
    return result.rows[0];
  },

  /**
   * Execute an UPDATE query
   */
  async update<T extends QueryResultRow>({
    table,
    data,
    where,
    params = [],
    returning = ["*"],
  }: {
    table: string;
    data: Record<string, any>;
    where: string;
    params?: any[];
    returning?: string[];
  }): Promise<T[]> {
    const dataEntries = Object.entries(data);
    const setColumns = dataEntries
      .map((_, i) => `${dataEntries[i][0]} = $${i + 1}`)
      .join(", ");

    const values = [
      ...dataEntries.map(([_, value]) => formatValue(value)),
      ...params.map(formatValue),
    ];

    const paramOffset = dataEntries.length;
    const whereClause = where.replace(
      /\$(\d+)/g,
      (_, num) => `$${parseInt(num) + paramOffset}`
    );

    const query = `
      UPDATE ${table}
      SET ${setColumns}
      WHERE ${whereClause}
      RETURNING ${returning.join(", ")}
    `;

    const result = await executeQuery<T>(query, values);
    return result.rows;
  },

  /**
   * Execute a DELETE query
   */
  async delete<T extends QueryResultRow>({
    table,
    where,
    params = [],
    returning = ["*"],
  }: {
    table: string;
    where: string;
    params?: any[];
    returning?: string[];
  }): Promise<T[]> {
    const query = `
      DELETE FROM ${table}
      WHERE ${where}
      RETURNING ${returning.join(", ")}
    `;

    const result = await executeQuery<T>(query, params.map(formatValue));
    return result.rows;
  },

  /**
   * Execute a custom query
   */
  async query<T extends QueryResultRow>(
    query: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    return executeQuery<T>(query, params?.map(formatValue));
  },

  /**
   * Begin a transaction
   */
  async beginTransaction(): Promise<any> {
    const client = await pool.connect();
    await client.query("BEGIN");
    return client;
  },

  /**
   * Commit a transaction
   */
  async commitTransaction(client: any): Promise<void> {
    await client.query("COMMIT");
    client.release();
  },

  /**
   * Rollback a transaction
   */
  async rollbackTransaction(client: any): Promise<void> {
    await client.query("ROLLBACK");
    client.release();
  },
};
