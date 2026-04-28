import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  // Dacă nu ai token, te trimite la autentificare. Dacă ai, te lasă să treci.
  return token ? <Outlet /> : <Navigate to="/autentificare" replace />;
};

export default ProtectedRoute;