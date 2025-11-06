import React, { useEffect, useRef, useState } from "react";
import "./HeroLogin.css";

export interface User {
  name: string;
  email: string;
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTO_LOGIN = false;

export default function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("admin@demo.com");
  const [pass, setPass]   = useState("admin123");
  const [show, setShow] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef  = useRef<HTMLInputElement>(null);

  // Si ya hay sesión, entra de frente
  useEffect(() => {
    const raw = localStorage.getItem("sessionUser");
    if (!raw) return;
    try {
      const u = JSON.parse(raw) as User;
      onLogin(u);
    } catch {
      localStorage.removeItem("sessionUser");
    }
  }, [onLogin]);

  // (Opcional) Entrar solo automáticamente en modo demo
  useEffect(() => {
    if (!AUTO_LOGIN) return;
    const user: User = { name: "Administrador", email: "admin@demo.com", password: "admin123" };
    localStorage.setItem("sessionUser", JSON.stringify(user));
    onLogin(user);
  }, [onLogin]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const caps = e.getModifierState && e.getModifierState("CapsLock");
    setCapsOn(Boolean(caps));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    const emailNorm = email.trim().toLowerCase();
    if (!EMAIL_RE.test(emailNorm)) {
      setError("Correo inválido.");
      setTimeout(() => { emailRef.current?.focus(); emailRef.current?.select(); }, 0);
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setPass("");
      setShow(false);
      setTimeout(() => passRef.current?.focus(), 0);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // pequeña animación

    // 🔒 Demo fija: NO hay registro, solo estas credenciales funcionan
    if (emailNorm !== "admin@demo.com" || pass !== "admin123") {
      setLoading(false);
      setError("Credenciales incorrectas. Usa admin@demo.com / admin123");
      setPass("");
      setShow(false);
      setCapsOn(false);
      setTimeout(() => passRef.current?.focus(), 0);
      return;
    }

    const user: User = { name: "Administrador", email: emailNorm, password: pass };
    if (remember) {
      localStorage.setItem("sessionUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("sessionUser");
    }
    setLoading(false);
    onLogin(user);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit} noValidate>
        <div className="brand">
          <div className="brand-icon">GP</div>
          <div className="brand-text">
            <strong>Gestor de Planillas</strong>
            <small>Acceso administrador</small>
          </div>
        </div>

        {error && (
          <div className="alert" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <label className="field">
          <span>Correo</span>
          <input
            ref={emailRef}
            name="email"
            type="email"
            inputMode="email"
            placeholder="admin@demo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={handleKey}
            onKeyDown={handleKey}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            required
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <div className="pass">
            <input
              ref={passRef}
              name="password"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyUp={handleKey}
              onKeyDown={handleKey}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="eye"
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShow((s) => !s)}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
          {capsOn && <small className="hint">Bloq Mayús activado</small>}
        </label>

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Recordarme en este equipo</span>
        </label>

        <button className="btn" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="demo">
          Prueba: <b>admin@demo.com</b> / <b>admin123</b>
        </p>
      </form>
    </div>
  );
}
