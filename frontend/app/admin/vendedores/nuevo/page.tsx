"use client";

import "./CrearVendedor.css";
import { useState } from "react";

const BANCOS = [
  "Banco Pichincha",
  "Banco Guayaquil",
  "Banco del Pacífico",
  "Banco Bolivariano",
  "Banco Produbanco",
  "Banco Internacional",
  "Banco General Rumiñahui",
  "Banco de Loja",
  "Banco Solidario",
  "Banco ProCredit",
  "Banco Machala",
  "Banco Amazonas",
  "Banco Capital",
  "Banco Diners Club",
  "Banco D-Miro",
  "Banco VisionFund Ecuador",
];

const COOPERATIVAS = [
  "Cooperativa JEP",
  "Cooperativa Jardín Azuayo",
  "Cooperativa Policía Nacional (COOPAC)",
  "Cooperativa 29 de Octubre",
  "Cooperativa Andalucía",
  "Cooperativa Riobamba",
  "Cooperativa Alianza del Valle",
  "Cooperativa CACPECO",
  "Cooperativa San Francisco",
  "Cooperativa Mego",
  "Cooperativa Cámara de Comercio de Ambato",
];

export default function CrearVendedor() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    cedula: "",
    banco: "",
    numeroCuenta: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formulario.password !== formulario.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí luego conectamos con el backend: POST /vendedores
    console.log("Datos del nuevo vendedor:", formulario);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="avatar">🏪</div>

        <div className="titulo">
          <div className="linea"></div>
          <h2>CREAR VENDEDOR</h2>
          <div className="linea"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fila">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formulario.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            className="full"
            value={formulario.correo}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña temporal"
            className="full"
            value={formulario.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmarPassword"
            placeholder="Confirmar contraseña"
            className="full"
            value={formulario.confirmarPassword}
            onChange={handleChange}
            required
          />

          <div className="separador">Información de pago</div>

          <input
            type="text"
            name="cedula"
            placeholder="Cédula (10 dígitos)"
            className="full"
            maxLength={10}
            value={formulario.cedula}
            onChange={handleChange}
            required
          />

          <select
            name="banco"
            className="full"
            value={formulario.banco}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona banco o cooperativa
            </option>
            <optgroup label="Bancos">
              {BANCOS.map((banco) => (
                <option key={banco} value={banco}>
                  {banco}
                </option>
              ))}
            </optgroup>
            <optgroup label="Cooperativas">
              {COOPERATIVAS.map((coop) => (
                <option key={coop} value={coop}>
                  {coop}
                </option>
              ))}
            </optgroup>
          </select>

          <input
            type="text"
            name="numeroCuenta"
            placeholder="Número de cuenta"
            className="full"
            value={formulario.numeroCuenta}
            onChange={handleChange}
            required
          />

          <button type="submit">CREAR VENDEDOR</button>
        </form>
      </div>
    </div>
  );
}