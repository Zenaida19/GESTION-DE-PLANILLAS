import React, { useMemo, useState } from "react";
import type { User } from "./Login";
import "./Dashboard.css";

// Pequeños íconos SVG reutilizables (sin dependencias)
const Icon = {
  doc: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path fill="currentColor" d="M14 2v6h6"/>
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  scan: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M4 7V4h3V2H2v5h2Zm0 10v3h3v2H2v-5h2Zm16 0v5h-5v-2h3v-3h2ZM15 2h5v5h-2V4h-3V2Z"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
      <path fill="currentColor" d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M3 5h18v2H3zM3 11h12v2H3zm0 6h18v2H3z"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M10 17l5-5-5-5v3H3v4h7z"/>
      <path fill="currentColor" d="M19 3h-6v2h6v14h-6v2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  ),
};

export type Section = "Inicio" | "Documentos" | "Digitalizar" | "Ingreso Manual" | "Reportes";

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [active, setActive] = useState<Section>("Inicio");
  const firstName = useMemo(() => user?.name?.split(" ")[0] || "usuario", [user]);

  // Mock de estadísticas: en el futuro puedes traer del backend
  const stats = [
    { label: "Documentos", value: 24, icon: "📄" },
    { label: "Docentes", value: 156, icon: "👩‍🏫" },
    { label: "Colegios", value: 8, icon: "🏫" },
    { label: "Reportes", value: 12, icon: "📈" },
  ];

  const quickActions = [
    { key: "upload", title: "Subir PDF/Imagen", icon: Icon.doc },
    { key: "scan", title: "Digitalizar (OCR)", icon: Icon.scan },
    { key: "edit", title: "Ingreso Manual", icon: Icon.edit },
    { key: "rep", title: "Generar Reporte", icon: Icon.report },
  ];

  const recent = [
    { id: 1, who: "María Pérez", what: "Planilla 1993 – DNI 42158963", when: "hace 2 h" },
    { id: 2, who: "Juan Quispe", what: "PDF cargado – Colegio N° 80879", when: "ayer" },
    { id: 3, who: "R. Torres", what: "Reporte Excel – Recursos Humanos", when: "hace 3 días" },
  ];

  return (
    <div className="dash" data-section={active}>
      <header className="dash-topbar" role="banner">
        <div className="brand" aria-label="Marca">
          <div className="brand-icon" aria-hidden>{Icon.doc}</div>
          <div className="brand-text">
            <strong>Gestor de Planillas</strong>
            <small>Sistema de Docentes</small>
          </div>
        </div>

        <div className="top-actions">
          <div className="search-wrap" role="search">
            <span className="icon" aria-hidden>{Icon.search}</span>
            <input className="search" type="search" placeholder="Buscar por DNI, nombre o colegio…" aria-label="Buscar" />
          </div>

          <div className="userbox">
            <span className="user-mail" title={user?.email}>{user?.email}</span>
            <button
              className="btn-secondary"
              onClick={() => {
                localStorage.removeItem("sessionUser");
                onLogout();
              }}
              aria-label="Cerrar sesión"
            >
              <span className="btn-ico" aria-hidden>{Icon.logout}</span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dash-grid">
        <aside className="dash-sidebar" role="navigation" aria-label="Secciones">
          <nav className="side-nav">
            {(["Inicio", "Documentos", "Digitalizar", "Ingreso Manual", "Reportes"] as Section[]).map((s) => (
              <button
                key={s}
                className={`side-item ${active === s ? "active" : ""}`}
                aria-current={active === s ? "page" : undefined}
                onClick={() => setActive(s)}
              >
                <span className="side-ico" aria-hidden>
                  {s === "Inicio" && Icon.home}
                  {s === "Documentos" && Icon.doc}
                  {s === "Digitalizar" && Icon.scan}
                  {s === "Ingreso Manual" && Icon.edit}
                  {s === "Reportes" && Icon.report}
                </span>
                <span>{s}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dash-main">
          {/* Encabezado dinámico */}
          <section className="panel hero">
            <div>
              <h2 className="panel-title">{active === "Inicio" ? "Bienvenido al Sistema" : active}</h2>
              <p className="panel-sub">Hola {firstName}, ¡que tengas un gran día de trabajo! ✨</p>
            </div>
            <div className="hero-actions">
              {quickActions.map((q) => (
                <button key={q.key} className="btn-primary outline">
                  <span className="btn-ico" aria-hidden>{q.icon}</span>
                  <span>{q.title}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="panel">
            <div className="stats">
              {stats.map((s) => (
                <article key={s.label} className="stat" role="status" aria-live="polite">
                  <div className="stat-inner">
                    <div className="stat-icon" aria-hidden>{s.icon}</div>
                    <div>
                      <div className="stat-num">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Cuerpo según sección */}
          {active === "Inicio" && (
            <section className="panel grid-2">
              <div className="card">
                <h3 className="panel-title-sm">Funcionalidades Principales</h3>
                <ul className="features">
                  <li>Gestión centralizada de planillas de docentes</li>
                  <li>Digitalización inteligente (imagen/PDF) con OCR</li>
                  <li>Ingreso manual de datos con validación</li>
                  <li>Reportes en PDF y Excel por colegio</li>
                  <li>Búsqueda avanzada por DNI, nombre o apellido</li>
                  <li>Descarga de documentos procesados</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="panel-title-sm">Actividad reciente</h3>
                <ul className="recent">
                  {recent.map((r) => (
                    <li key={r.id} className="recent-item">
                      <div className="recent-dot" aria-hidden></div>
                      <div className="recent-body">
                        <strong>{r.who}</strong>
                        <span className="muted"> · {r.what}</span>
                      </div>
                      <span className="recent-time">{r.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {active === "Documentos" && (
            <section className="panel empty">
              <p>📄 Aún no hay documentos listados aquí. Usa <b>Subir PDF/Imagen</b> o la <b>Búsqueda</b> para empezar.</p>
              <button className="btn-primary">Nuevo documento</button>
            </section>
          )}

          {active === "Digitalizar" && (
            <section className="panel empty">
              <p>🖨️ Arrastra y suelta archivos o usa el botón para iniciar la digitalización con OCR.</p>
              <button className="btn-primary">Seleccionar archivos</button>
            </section>
          )}

          {active === "Ingreso Manual" && (
            <section className="panel empty">
              <p>✍️ Completa el formulario para registrar datos manualmente.</p>
              <button className="btn-primary">Abrir formulario</button>
            </section>
          )}

          {active === "Reportes" && (
            <section className="panel empty">
              <p>📊 Genera reportes por colegio, rango de fechas o docente.</p>
              <button className="btn-primary">Crear reporte</button>
            </section>
          )}

          {/* Posters */}
          <section className="panel">
            <div className="posters-row">
              <div className="poster-card"><div className="poster-title">Panel de inicio</div></div>
              <div className="poster-card"><div className="poster-title">Carga de archivos</div></div>
              <div className="poster-card"><div className="poster-title">Validación de datos</div></div>
              <div className="poster-card"><div className="poster-title">Análisis y reportes</div></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

