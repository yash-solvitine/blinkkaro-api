import { Request, Response } from "express";
import { ServiceRepository } from "../repositories/service.repository";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceListQuerySchema,
} from "../domain/schemas/service.schema";
import { successResponse, createdResponse } from "../utils/response";
import redis from "../config/redis";

export class ServiceController {
  private static readonly CACHE_TTL = 300; // 5 minutes in seconds
  private static readonly LIST_CACHE_KEY = "services:list:";
  private static readonly DETAIL_CACHE_KEY = "services:detail:";

  /**
   * Create a new service
   */
  public static async create(req: Request, res: Response) {
    try {
      const validatedData = serviceCreateSchema.parse(req.body);
      const service = await ServiceRepository.create(validatedData);
      return createdResponse(res, service);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service details by ID with caching
   */
  public static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `${this.DETAIL_CACHE_KEY}${id}`;

      // Try to get from cache
      const cachedService = await redis.get(cacheKey);
      if (cachedService) {
        return successResponse(res, JSON.parse(cachedService));
      }

      // Get from database
      const service = await ServiceRepository.getById(id);

      // Store in cache
      await redis.set(cacheKey, JSON.stringify(service), "EX", this.CACHE_TTL);

      return successResponse(res, service);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get services list with filters, pagination, and caching
   */
  public static async getList(req: Request, res: Response) {
    try {
      const filters = serviceListQuerySchema.parse(req.query);

      // Generate cache key based on filters
      const cacheKey = `${this.LIST_CACHE_KEY}${JSON.stringify(filters)}`;

      // Try to get from cache
      const cachedList = await redis.get(cacheKey);
      if (cachedList) {
        return successResponse(res, JSON.parse(cachedList));
      }

      // Get from database
      const { services, total } = await ServiceRepository.getList(filters);

      const response = {
        services,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          total_pages: Math.ceil(total / filters.limit),
        },
      };

      // Store in cache
      await redis.set(cacheKey, JSON.stringify(response), "EX", this.CACHE_TTL);

      return successResponse(res, response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service by ID
   */
  public static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = serviceUpdateSchema.parse(req.body);

      const service = await ServiceRepository.update(id, validatedData);

      // Invalidate caches
      await Promise.all([
        redis.del(`${this.DETAIL_CACHE_KEY}${id}`),
        redis.del(this.LIST_CACHE_KEY + "*"),
      ]);

      return successResponse(res, service);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete service by ID
   */
  public static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ServiceRepository.delete(id);

      // Invalidate caches
      await Promise.all([
        redis.del(`${this.DETAIL_CACHE_KEY}${id}`),
        redis.del(this.LIST_CACHE_KEY + "*"),
      ]);

      return successResponse(res, null, "Service deleted successfully");
    } catch (error) {
      throw error;
    }
  }
}
