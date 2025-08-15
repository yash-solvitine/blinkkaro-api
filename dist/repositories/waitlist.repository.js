"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistRepository = void 0;
const db_1 = require("../utils/db");
const errors_1 = require("../utils/errors");
class WaitlistRepository {
    static async create(data) {
        try {
            const existingEmail = await db_1.db.select({
                table: this.TABLE,
                where: "email = $1",
                params: [data.email],
            });
            if (existingEmail.length > 0) {
                throw new errors_1.ConflictError("Email already registered in waitlist");
            }
            const existingPhone = await db_1.db.select({
                table: this.TABLE,
                where: "phone = $1",
                params: [data.phone],
            });
            if (existingPhone.length > 0) {
                throw new errors_1.ConflictError("Phone number already registered in waitlist");
            }
            return db_1.db.insert({
                table: this.TABLE,
                data,
            });
        }
        catch (error) {
            if (error instanceof errors_1.ConflictError) {
                throw error;
            }
            if (error.code === "23505") {
                if (error.constraint === "waitlist_email_unique") {
                    throw new errors_1.ConflictError("Email already registered in waitlist");
                }
                if (error.constraint === "waitlist_phone_unique") {
                    throw new errors_1.ConflictError("Phone number already registered in waitlist");
                }
            }
            throw error;
        }
    }
    static async getById(id) {
        const result = await db_1.db.select({
            table: this.TABLE,
            where: "id = $1",
            params: [id],
        });
        if (!result.length) {
            throw new errors_1.NotFoundError("Waitlist entry not found");
        }
        return result[0];
    }
    static async getByEmail(email) {
        const result = await db_1.db.select({
            table: this.TABLE,
            where: "email = $1",
            params: [email],
        });
        return result[0] || null;
    }
    static async getByPhone(phone) {
        const result = await db_1.db.select({
            table: this.TABLE,
            where: "phone = $1",
            params: [phone],
        });
        return result[0] || null;
    }
    static async getList(page = 1, limit = 10) {
        const countResult = await db_1.db.query("SELECT COUNT(*) as count FROM waitlist");
        const total = parseInt(countResult.rows[0].count);
        const entries = (await db_1.db.select({
            table: this.TABLE,
            orderBy: "created_at DESC",
            limit,
            offset: (page - 1) * limit,
        }));
        return {
            entries,
            total,
        };
    }
    static async delete(id) {
        const result = await db_1.db.delete({
            table: this.TABLE,
            where: "id = $1",
            params: [id],
        });
        if (!result.length) {
            throw new errors_1.NotFoundError("Waitlist entry not found");
        }
    }
}
exports.WaitlistRepository = WaitlistRepository;
WaitlistRepository.TABLE = "waitlist";
//# sourceMappingURL=waitlist.repository.js.map