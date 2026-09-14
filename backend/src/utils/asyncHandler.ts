import { Request, Response, NextFunction, RequestHandler } from "express";

// Express does not automatically catch errors thrown inside async functions.
// This wrapper catches them and forwards them to our error handler middleware,
// so every controller can just "throw new AppError(...)" without try/catch blocks.
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
