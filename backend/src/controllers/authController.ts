import { Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

// POST /api/auth/register
// Creates a new user account
export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are all required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    throw new AppError("A user with this email already exists", 409);
  }

  const user = await User.create({ name, email: email.toLowerCase(), password });

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

// POST /api/auth/login
// Logs in an existing user and returns a JWT token
export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

// GET /api/auth/me
// Returns the currently logged in user's profile (protected route)
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
