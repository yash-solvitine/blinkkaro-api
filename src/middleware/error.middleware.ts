import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { log } from '../utils/logger';
import { config } from '../config/config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Log unexpected errors
  log.error('Unexpected error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const message = config.server.nodeEnv === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(500).json({
    status: 'error',
    message,
    ...(config.server.nodeEnv !== 'production' && { stack: err.stack }),
  });
}; 