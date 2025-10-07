// routes/protectedroute.tsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { ROUTES } from "./routes";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  // Wait until AuthProvider finishes restoring state
  if (!auth.isInitialized) {
    return <div>Loading...</div>; // could be a spinner
  }

  if (!auth.accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
