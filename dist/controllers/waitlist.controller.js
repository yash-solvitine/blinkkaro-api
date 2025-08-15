"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistController = void 0;
const waitlist_repository_1 = require("../repositories/waitlist.repository");
const waitlist_schema_1 = require("../domain/schemas/waitlist.schema");
const response_1 = require("../utils/response");
class WaitlistController {
    static async join(req, res) {
        try {
            const validatedData = waitlist_schema_1.waitlistCreateSchema.parse(req.body);
            const entry = await waitlist_repository_1.WaitlistRepository.create(validatedData);
            return (0, response_1.createdResponse)(res, entry, "Successfully joined the waitlist");
        }
        catch (error) {
            throw error;
        }
    }
    static async getList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { entries, total } = await waitlist_repository_1.WaitlistRepository.getList(page, limit);
            return (0, response_1.successResponse)(res, {
                entries,
                pagination: {
                    total,
                    page,
                    limit,
                    total_pages: Math.ceil(total / limit),
                },
            });
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await waitlist_repository_1.WaitlistRepository.delete(id);
            return (0, response_1.successResponse)(res, null, "Waitlist entry deleted successfully");
        }
        catch (error) {
            throw error;
        }
    }
}
exports.WaitlistController = WaitlistController;
//# sourceMappingURL=waitlist.controller.js.map