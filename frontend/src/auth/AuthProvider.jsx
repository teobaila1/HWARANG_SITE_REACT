import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LS_KEY = "hwarang:user";

const AuthCtx = createContext({
  user: null,
  loading: false,
  setFromLogin: () => {},  // o chemăm după 200 la /api/login
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // încarcă din localStorage la mount + sync între taburi
  useEffect(() => {
    try { const raw = localStorage.getItem(LS_KEY); if (raw) setUser(JSON.parse(raw)); } catch {}
    const onStorage = (e) => { if (e.key === LS_KEY) setUser(e.newValue ? JSON.parse(e.newValue) : null); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // setează userul pe baza răspunsului de la /api/login
  const setFromLogin = (data) => {
    const roles = (data?.rol || data?.roles || "")
      .toString()
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const u = {
      id: data?.id || data?.userId || null,
      username: data?.user || data?.username || "",
      email: data?.email || "",
      roles,
      grupe: data?.grupe ?? null,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading: false, setFromLogin, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
