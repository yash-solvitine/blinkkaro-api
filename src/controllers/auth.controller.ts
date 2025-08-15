import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { userCreateSchema, userLoginSchema } from '../domain/schemas/user.schema';
import { successResponse, createdResponse, errorResponse } from '../utils/response';
import { ValidationError } from '../utils/errors';

export class AuthController {
  public static async register(req: Request, res: Response) {
    try {
      const validatedData = userCreateSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      return createdResponse(res, result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const validatedData = userLoginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);
      return successResponse(res, result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

    public static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      const tokens = await AuthService.refreshToken(refreshToken);
      return successResponse(res, tokens);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      await AuthService.logout(userId);
      return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }
} 