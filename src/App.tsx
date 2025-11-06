import React, { useCallback, useEffect, useState } from "react";
import Login, { type User } from "./components/Login";
import Dashboard from "./components/Dashboard";

const STORAGE_KEY = "sessionUser";

function isUser(x: any): x is User {
  return (
    x &&
    typeof x === "object" &&
    typeof x.name === "string" &&
    typeof x.email === "string" &&
    typeof x.password === "string"
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (isUser(parsed)) setUser(parsed);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue);
          setUser(isUser(parsed) ? parsed : null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogin = useCallback((u: User) => {
    setUser(u);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch {}
  }, []);

  const handleLogout = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } finally { setUser(null); }
  }, []);

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
