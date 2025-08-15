import { Response } from 'express';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return successResponse(res, data, message, 201);
};

export const errorResponse = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: any[]
): Response => {
  const response: ApiResponse<null> = {
    status: 'error',
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

export const validationErrorResponse = (
  res: Response,
  errors: any[],
  message: string = 'Validation failed'
): Response => {
  return errorResponse(res, message, 422, errors);
};

export const notFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return errorResponse(res, message, 404);
};

export const unauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized access'
): Response => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (
  res: Response,
  message: string = 'Access forbidden'
): Response => {
  return errorResponse(res, message, 403);
}; 