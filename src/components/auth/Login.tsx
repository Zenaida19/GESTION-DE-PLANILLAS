import React, { useEffect, useRef, useState } from "react"
import "./Login.css"

export interface User {
  name: string
  email: string
  password: string
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login")

  // Campos
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // Estado
  const [showPass, setShowPass] = useState(false)
  const [showPassReg, setShowPassReg] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [capsOn, setCapsOn] = useState(false)

  // Persistencia
  const [users, setUsers] = useState<User[]>(() => {
    try { return JSON.parse(localStorage.getItem("users") || "[]") as User[] } catch { return [] }
  })
  const saveUsers = (arr: User[]) => {
    setUsers(arr)
    localStorage.setItem("users", JSON.stringify(arr))
  }

  // Limpiar timeouts al desmontar
  const timeoutsRef = useRef<number[]>([])
  useEffect(() => () => { timeoutsRef.current.forEach((id) => clearTimeout(id)) }, [])

  // Restaurar sesión si existe
  useEffect(() => {
    const last = localStorage.getItem("sessionUser")
    if (last) {
      try { onLogin(JSON.parse(last) as User) } catch { localStorage.removeItem("sessionUser") }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincroniza usuarios entre pestañas (incluye borrado)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "users") {
        try { setUsers(e.newValue ? (JSON.parse(e.newValue) as User[]) : []) } catch { setUsers([]) }
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const switchMode = (m: "login" | "register") => {
    setMode(m)
    setError(null)
    setLoading(false)
    setShowPass(false)
    setShowPassReg(false)
    setCapsOn(false)
    setPassword("")
    setConfirm("")
    if (m === "register") setName("")
  }

  const handleRegister = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return
    setError(null)

    const n = name.trim()
    const eLower = email.trim().toLowerCase()

    if (!n) return setError("Ingresa tu nombre.")
    if (!EMAIL_RE.test(eLower)) return setError("Correo inválido.")
    if (password.length < 6) return setError("Mínimo 6 caracteres.")
    if (password !== confirm) return setError("Las contraseñas no coinciden.")
    if (users.some((u) => u.email === eLower)) return setError("Este correo ya está registrado.")

    const u: User = { name: n, email: eLower, password }
    saveUsers([...users, u])
    localStorage.setItem("sessionUser", JSON.stringify(u))
    setLoading(true)
    const id = window.setTimeout(() => onLogin(u), 400)
    timeoutsRef.current.push(id)
  }

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return
    setError(null)

    const eLower = email.trim().toLowerCase()
    if (!EMAIL_RE.test(eLower)) return setError("Ingresa un correo válido.")
    if (!password) return setError("Ingresa tu contraseña.")

    const u = users.find((uu) => uu.email === eLower && uu.password === password)
    if (!u) return setError("Correo y/o contraseña incorrectos.")

    localStorage.setItem("sessionUser", JSON.stringify(u))
    setLoading(true)
    const id = window.setTimeout(() => onLogin(u), 350)
    timeoutsRef.current.push(id)
  }

  // Caps Lock
  const onKeyEvent = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    const caps = ev.getModifierState && ev.getModifierState("CapsLock")
    setCapsOn(!!caps)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <div className="logo" aria-hidden="true">🗂️</div>
          <div className="brand-text">
            <h1>Sistema de Gestión</h1>
            <p>Accede con tu cuenta</p>
          </div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Autenticación">
          <button
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
            type="button"
          >
            Registrarse
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="field">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="pass">Contraseña</label>
              <div className="password">
                <input
                  id="pass"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={onKeyEvent}
                  onKeyDown={onKeyEvent}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPass((s) => !s)}
                  aria-pressed={showPass}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
              {capsOn && <span className="hint">Bloq Mayús activado</span>}
            </div>

            {error && <p className="error" role="alert" aria-live="assertive">{error}</p>}

            <button className="primary" type="submit" disabled={loading || !email || !password}>
              {loading ? "Ingresando…" : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                placeholder="Nombre y Apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email2">Correo</label>
              <input
                id="email2"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="pass2">Contraseña</label>
              <div className="password">
                <input
                  id="pass2"
                  type={showPassReg ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={onKeyEvent}
                  onKeyDown={onKeyEvent}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPassReg((s) => !s)}
                  aria-pressed={showPassReg}
                  aria-label={showPassReg ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassReg ? "Ocultar" : "Ver"}
                </button>
              </div>
              {capsOn && <span className="hint">Bloq Mayús activado</span>}
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirmar</label>
              <input
                id="confirm"
                type={showPassReg ? "text" : "password"}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && <p className="error" role="alert" aria-live="assertive">{error}</p>}

            <button
              className="primary"
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !password || !confirm}
            >
              {loading ? "Creando…" : "Crear cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
