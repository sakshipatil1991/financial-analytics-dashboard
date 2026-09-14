import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// We extend Express's Request type so TypeScript knows about req.user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// This middleware checks for a valid JWT token in the Authorization header
// and protects any route it is attached to.
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: number };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Not authorized, user no longer exists" });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};
