import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("sensora_admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sensora_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setAdmin(res.data.admin);
        localStorage.setItem("sensora_admin", JSON.stringify(res.data.admin));
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("sensora_admin_token", res.data.token);
    localStorage.setItem("sensora_admin", JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data.admin;
  }

  function logout() {
    localStorage.removeItem("sensora_admin_token");
    localStorage.removeItem("sensora_admin");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
