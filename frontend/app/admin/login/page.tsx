"use client";

import "./LoginAdmin.css";

export default function LoginAdmin() {
  return (
    <div className="contenedor">

      <div className="login">

        <div className="izquierda">

          <img
            src="/imagendos.png"
            className="logo"
            alt="Lumya"
         >
            
         </img>

          <div className="avatar">

            👤

          </div>

          <input
            type="text"
            placeholder="Correo"
          />

          <input
            type="password"
            placeholder="Contraseña"
          />

          <button>

            Iniciar Sesión

          </button>

        </div>

        <div className="derecha">

          <div className="overlay">

            <h1>Bienvenido a Lumya</h1>

            <p>

              Panel Administrativo

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}