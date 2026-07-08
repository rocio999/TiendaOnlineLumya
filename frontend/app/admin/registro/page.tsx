"use client";

import "./RegistroAdmin.css";

export default function RegistroAdmin() {
  return (
    <div className="container">

      <div className="card">

        <div className="avatar">
          🛒
        </div>

        <div className="titulo">
          <div className="linea"></div>
          <h2>REGISTRO DE ADMINISTRADOR</h2>
          <div className="linea"></div>
        </div>

        <form>

          <div className="fila">

            <input
              type="text"
              placeholder="Nombre"
            />

            <input
              type="text"
              placeholder="Apellido"
            />

          </div>

          <div className="fila">
          </div>

          <input
            type="email"
            placeholder="Correo electrónico"
            className="full"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="full"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="full"
          />

          <div className="terminos">

          </div>

          <button>
            REGISTRAR
          </button>

        </form>

      </div>

    </div>
  );
}