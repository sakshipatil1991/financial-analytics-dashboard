import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

// Wrap any page with this component to require a logged-in user.
// If not authenticated, the user is redirected to /login.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
