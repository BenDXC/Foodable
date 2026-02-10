import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Send success response
 */
export const sendSuccess = <T = any>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 */
export const sendCreated = <T = any>(
  res: Response,
  message: string,
  data?: T
): void => {
  sendSuccess(res, message, data, 201);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T = any>(
  res: Response,
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): void => {
  const response: PaginatedResponse<T[]> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  res.status(200).json(response);
};

/**
 * Send no content response (204)
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

/**
 * Extract pagination params from request query
 */
export const getPaginationParams = (query: any): { page: number; limit: number; offset: number } => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export default {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendNoContent,
  getPaginationParams,
};
