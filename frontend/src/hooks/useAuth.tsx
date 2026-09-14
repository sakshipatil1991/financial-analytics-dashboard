import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Wraps the whole app so any component can read/update the logged-in user
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = (newUser: User, newToken: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can call useAuth() instead of useContext(AuthContext)
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
