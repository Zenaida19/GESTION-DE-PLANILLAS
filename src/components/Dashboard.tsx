import React from "react";
import type { User } from "./Login.css";
import "./Dashboard.css";

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="dash">
      <header className="dash-topbar">
        <div className="brand">
          <div className="brand-icon">📄</div>
          <div className="brand-text">
            <strong>Gestor de Planillas</strong>
            <small>Sistema de Docentes</small>
          </div>
        </div>
        <div className="userbox">
          <span className="user-mail">{user?.email}</span>
          <button
            className="btn-secondary"
            onClick={() => { localStorage.removeItem("sessionUser"); onLogout(); }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dash-grid">
        <aside className="dash-sidebar">
          <nav className="side-nav">
            <a className="side-item active">🏠 Inicio</a>
            <a className="side-item">📑 Documentos</a>
            <a className="side-item">🖨️ Digitalizar</a>
            <a className="side-item">✍️ Ingreso Manual</a>
            <a className="side-item">📊 Reportes</a>
          </nav>
        </aside>

        <main className="dash-main">
          <section className="panel">
            <h2 className="panel-title">Bienvenido al Sistema</h2>
            <p className="panel-sub">Hola {user?.name?.split(" ")[0] || "usuario"}, ¡que tengas un gran día de trabajo! ✨</p>

            <div className="stats">
              <div className="stat"><div className="stat-inner"><div className="stat-icon">📄</div><div><div className="stat-num">24</div><div className="stat-label">Documentos</div></div></div></div>
              <div className="stat"><div className="stat-inner"><div className="stat-icon">👩‍🏫</div><div><div className="stat-num">156</div><div className="stat-label">Docentes</div></div></div></div>
              <div className="stat"><div className="stat-inner"><div className="stat-icon">🏫</div><div><div className="stat-num">8</div><div className="stat-label">Colegios</div></div></div></div>
              <div className="stat"><div className="stat-inner"><div className="stat-icon">📈</div><div><div className="stat-num">12</div><div className="stat-label">Reportes</div></div></div></div>
            </div>
          </section>

          <section className="panel">
            <h3 className="panel-title-sm">Funcionalidades Principales</h3>
            <ul className="features">
              <li>Gestión centralizada de planillas de docentes</li>
              <li>Digitalización inteligente (imagen/PDF) con OCR</li>
              <li>Ingreso manual de datos con validación</li>
              <li>Reportes en PDF y Excel por colegio</li>
              <li>Búsqueda avanzada por DNI, nombre o apellido</li>
              <li>Descarga de documentos procesados</li>
            </ul>

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
