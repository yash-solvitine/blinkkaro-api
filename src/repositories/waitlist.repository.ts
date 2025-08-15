import { db } from "../utils/db";
import {
  IWaitlist,
  IWaitlistCreate,
} from "../domain/interfaces/waitlist.interface";
import { ConflictError, NotFoundError } from "../utils/errors";

export class WaitlistRepository {
  private static readonly TABLE = "waitlist";

  /**
   * Add a new entry to waitlist
   */
  static async create(data: IWaitlistCreate): Promise<IWaitlist> {
    try {
      // Check for existing email
      const existingEmail = await db.select({
        table: this.TABLE,
        where: "email = $1",
        params: [data.email],
      });

      if (existingEmail.length > 0) {
        throw new ConflictError("Email already registered in waitlist");
      }

      // Check for existing phone
      const existingPhone = await db.select({
        table: this.TABLE,
        where: "phone = $1",
        params: [data.phone],
      });

      if (existingPhone.length > 0) {
        throw new ConflictError("Phone number already registered in waitlist");
      }

      // Create new entry
      return db.insert({
        table: this.TABLE,
        data,
      });
    } catch (error) {
      // If error is already a custom error, rethrow it
      if (error instanceof ConflictError) {
        throw error;
      }
      // Otherwise, check for unique constraint violations
      if (error.code === "23505") {
        if (error.constraint === "waitlist_email_unique") {
          throw new ConflictError("Email already registered in waitlist");
        }
        if (error.constraint === "waitlist_phone_unique") {
          throw new ConflictError(
            "Phone number already registered in waitlist"
          );
        }
      }
      throw error;
    }
  }

  /**
   * Get waitlist entry by ID
   */
  static async getById(id: string): Promise<IWaitlist> {
    const result = await db.select({
      table: this.TABLE,
      where: "id = $1",
      params: [id],
    });

    if (!result.length) {
      throw new NotFoundError("Waitlist entry not found");
    }

    return result[0];
  }

  /**
   * Get waitlist entry by email
   */
  static async getByEmail(email: string): Promise<IWaitlist | null> {
    const result = await db.select({
      table: this.TABLE,
      where: "email = $1",
      params: [email],
    });

    return result[0] || null;
  }

  /**
   * Get waitlist entry by phone
   */
  static async getByPhone(phone: string): Promise<IWaitlist | null> {
    const result = await db.select({
      table: this.TABLE,
      where: "phone = $1",
      params: [phone],
    });

    return result[0] || null;
  }

  /**
   * Get all waitlist entries with pagination
   */
  static async getList(
    page: number = 1,
    limit: number = 10
  ): Promise<{ entries: IWaitlist[]; total: number }> {
    // Get total count
    const countResult = await db.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM waitlist"
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const entries = await db.select({
      table: this.TABLE,
      orderBy: "created_at DESC",
      limit,
      offset: (page - 1) * limit,
    });

    return {
      entries,
      total,
    };
  }

  /**
   * Delete waitlist entry
   */
  static async delete(id: string): Promise<void> {
    const result = await db.delete({
      table: this.TABLE,
      where: "id = $1",
      params: [id],
    });

    if (!result.length) {
      throw new NotFoundError("Waitlist entry not found");
    }
  }
}
