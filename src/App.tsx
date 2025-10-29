import React, { useEffect, useState } from "react";
import Login, { type User } from "./components/auth/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sessionUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  return user ? (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("sessionUser");
        setUser(null);
      }}
    />
  ) : (
    <Login onLogin={(u) => setUser(u)} />
  );
}
