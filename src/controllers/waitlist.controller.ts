import { Request, Response } from "express";
import { WaitlistRepository } from "../repositories/waitlist.repository";
import { waitlistCreateSchema } from "../domain/schemas/waitlist.schema";
import { successResponse, createdResponse } from "../utils/response";

export class WaitlistController {
  /**
   * Join waitlist
   */
  public static async join(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = waitlistCreateSchema.parse(req.body);

      // Create waitlist entry
      const entry = await WaitlistRepository.create(validatedData);

      return createdResponse(res, entry, "Successfully joined the waitlist");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get waitlist entries (admin only)
   */
  public static async getList(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { entries, total } = await WaitlistRepository.getList(page, limit);

      return successResponse(res, {
        entries,
        pagination: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete waitlist entry (admin only)
   */
  public static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await WaitlistRepository.delete(id);
      return successResponse(res, null, "Waitlist entry deleted successfully");
    } catch (error) {
      throw error;
    }
  }
}
