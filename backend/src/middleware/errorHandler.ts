import { Request, Response, NextFunction } from "express";

// Custom error class so we can attach a status code to any error we throw
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 404 handler - runs when no route matched the request
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

// Central error handler - every error in the app ends up here
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    // Only show the stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
