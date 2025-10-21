import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function normRoles(arrOrStr) {
  if (!arrOrStr) return [];
  const arr = Array.isArray(arrOrStr) ? arrOrStr : String(arrOrStr).split(",");
  return arr.map((r) => (r || "").toString().trim().toLowerCase()).filter(Boolean);
}

export default function ProtectedRoute({ children, allow = "any", roles = [] }) {
  const { user } = useAuth();

  // nu e logat
  if (!user) return <Navigate to="/autentificare" replace />;

  // are nevoie de rol
  if (allow === "roles" && roles.length > 0) {
    const required = normRoles(roles);
    const mine = normRoles(user.roles);
    const ok = required.some((r) => mine.includes(r));
    if (!ok) return <Navigate to="/access-denied" replace />;
  }

  return children;
}
