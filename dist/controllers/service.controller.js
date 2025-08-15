"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const service_repository_1 = require("../repositories/service.repository");
const service_schema_1 = require("../domain/schemas/service.schema");
const response_1 = require("../utils/response");
const redis_1 = __importDefault(require("../config/redis"));
class ServiceController {
    static async create(req, res) {
        try {
            const validatedData = service_schema_1.serviceCreateSchema.parse(req.body);
            const service = await service_repository_1.ServiceRepository.create(validatedData);
            return (0, response_1.createdResponse)(res, service);
        }
        catch (error) {
            throw error;
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cacheKey = `${this.DETAIL_CACHE_KEY}${id}`;
            const cachedService = await redis_1.default.get(cacheKey);
            if (cachedService) {
                return (0, response_1.successResponse)(res, JSON.parse(cachedService));
            }
            const service = await service_repository_1.ServiceRepository.getById(id);
            await redis_1.default.set(cacheKey, JSON.stringify(service), "EX", this.CACHE_TTL);
            return (0, response_1.successResponse)(res, service);
        }
        catch (error) {
            throw error;
        }
    }
    static async getList(req, res) {
        try {
            const filters = service_schema_1.serviceListQuerySchema.parse(req.query);
            const cacheKey = `${this.LIST_CACHE_KEY}${JSON.stringify(filters)}`;
            const cachedList = await redis_1.default.get(cacheKey);
            if (cachedList) {
                return (0, response_1.successResponse)(res, JSON.parse(cachedList));
            }
            const { services, total } = await service_repository_1.ServiceRepository.getList(filters);
            const response = {
                services,
                pagination: {
                    total,
                    page: filters.page,
                    limit: filters.limit,
                    total_pages: Math.ceil(total / filters.limit),
                },
            };
            await redis_1.default.set(cacheKey, JSON.stringify(response), "EX", this.CACHE_TTL);
            return (0, response_1.successResponse)(res, response);
        }
        catch (error) {
            throw error;
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const validatedData = service_schema_1.serviceUpdateSchema.parse(req.body);
            const service = await service_repository_1.ServiceRepository.update(id, validatedData);
            await Promise.all([
                redis_1.default.del(`${this.DETAIL_CACHE_KEY}${id}`),
                redis_1.default.del(this.LIST_CACHE_KEY + "*"),
            ]);
            return (0, response_1.successResponse)(res, service);
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await service_repository_1.ServiceRepository.delete(id);
            await Promise.all([
                redis_1.default.del(`${this.DETAIL_CACHE_KEY}${id}`),
                redis_1.default.del(this.LIST_CACHE_KEY + "*"),
            ]);
            return (0, response_1.successResponse)(res, null, "Service deleted successfully");
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ServiceController = ServiceController;
ServiceController.CACHE_TTL = 300;
ServiceController.LIST_CACHE_KEY = "services:list:";
ServiceController.DETAIL_CACHE_KEY = "services:detail:";
//# sourceMappingURL=service.controller.js.map