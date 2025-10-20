import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loader from "./common/Loader";

export default function ProtectedRoute({ children, allow = "any", roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/autentificare" replace />;

  if (allow === "roles" && roles.length > 0) {
    const hasRole = (user.roles || []).some((r) => roles.includes(r));
    if (!hasRole) return <Navigate to="/access-denied" replace />;
  }

  return children;
}
