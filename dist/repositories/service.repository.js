"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const db_1 = require("../utils/db");
const errors_1 = require("../utils/errors");
class ServiceRepository {
    static async create(data) {
        return db_1.db.insert({
            table: this.TABLE,
            data,
        });
    }
    static async getById(id) {
        const query = `
      SELECT ${this.DEFAULT_SELECT}
      FROM ${this.TABLE} s
      ${this.DEFAULT_JOINS}
      WHERE s.id = $1
    `;
        const result = await db_1.db.query(query, [id]);
        if (!result.rows.length) {
            throw new errors_1.NotFoundError("Service not found");
        }
        return result.rows[0];
    }
    static async getList(filters) {
        const conditions = ["s.status = $1"];
        const params = [filters.status || "APPROVED"];
        let paramCount = 1;
        if (filters.provider_id) {
            paramCount++;
            conditions.push(`s.provider_id = $${paramCount}`);
            params.push(filters.provider_id);
        }
        if (filters.category_id) {
            paramCount++;
            conditions.push(`s.category_id = $${paramCount}`);
            params.push(filters.category_id);
        }
        if (filters.sub_category_id) {
            paramCount++;
            conditions.push(`s.sub_category_id = $${paramCount}`);
            params.push(filters.sub_category_id);
        }
        if (filters.min_price) {
            paramCount++;
            conditions.push(`s.price >= $${paramCount}`);
            params.push(filters.min_price);
        }
        if (filters.max_price) {
            paramCount++;
            conditions.push(`s.price <= $${paramCount}`);
            params.push(filters.max_price);
        }
        if (filters.location) {
            paramCount++;
            conditions.push(`s.service_location ILIKE $${paramCount}`);
            params.push(`%${filters.location}%`);
        }
        if (typeof filters.at_customer_location === "boolean") {
            paramCount++;
            conditions.push(`s.at_customer_location = $${paramCount}`);
            params.push(filters.at_customer_location);
        }
        if (filters.search) {
            paramCount++;
            conditions.push(`(
        s.name ILIKE $${paramCount} OR
        s.description ILIKE $${paramCount} OR
        p.business_name ILIKE $${paramCount}
      )`);
            params.push(`%${filters.search}%`);
        }
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
        const sortClause = `ORDER BY s.${filters.sort_by || "created_at"} ${filters.sort_order || "desc"}`;
        const limitClause = `LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const countQuery = `
      SELECT COUNT(*) as total
      FROM ${this.TABLE} s
      ${this.DEFAULT_JOINS}
      ${whereClause}
    `;
        const countResult = await db_1.db.query(countQuery, params);
        const total = Number(countResult.rows[0].total);
        const query = `
      SELECT ${this.DEFAULT_SELECT}
      FROM ${this.TABLE} s
      ${this.DEFAULT_JOINS}
      ${whereClause}
      ${sortClause}
      ${limitClause}
    `;
        const result = await db_1.db.query(query, [...params, limit, offset]);
        return {
            services: result.rows,
            total,
        };
    }
    static async update(id, data) {
        const result = await db_1.db.update({
            table: this.TABLE,
            data,
            where: "id = $1",
            params: [id],
        });
        if (!result.length) {
            throw new errors_1.NotFoundError("Service not found");
        }
        return result[0];
    }
    static async delete(id) {
        const result = await db_1.db.delete({
            table: this.TABLE,
            where: "id = $1",
            params: [id],
        });
        if (!result.length) {
            throw new errors_1.NotFoundError("Service not found");
        }
    }
}
exports.ServiceRepository = ServiceRepository;
ServiceRepository.TABLE = "services";
ServiceRepository.DEFAULT_SELECT = `
    s.*,
    c.name as category_name,
    sc.name as sub_category_name,
    p.business_name as provider_name,
    p.description as provider_description
  `;
ServiceRepository.DEFAULT_JOINS = `
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN sub_categories sc ON s.sub_category_id = sc.id
    LEFT JOIN providers p ON s.provider_id = p.id
  `;
//# sourceMappingURL=service.repository.js.map