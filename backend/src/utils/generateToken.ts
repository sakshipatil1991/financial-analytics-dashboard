import jwt from "jsonwebtoken";

// Generates a signed JWT token containing the user's id
export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  } as jwt.SignOptions);
};
