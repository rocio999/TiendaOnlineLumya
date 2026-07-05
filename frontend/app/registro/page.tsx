"use client";

import "../../styles/registro.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegistro = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMensaje("");

  // Validaciones locales
  if (!nombre.trim() || !apellido.trim() || !correo.trim() || !password.trim()) {
    setMensaje("Todos los campos son obligatorios");
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setMensaje("Las contraseñas no coinciden");
    setLoading(false);
    return;
  }

  const datos = { nombre, apellido, correo, password };

  try {
    const res = await fetch("http://localhost:3001/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al registrar");
    }

    setMensaje("Usuario creado 🚀. Redirigiendo...");
    setTimeout(() => router.push("/login"), 1200);

  } catch (error) {
    setMensaje(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container">
      <div className="left">
        <img src="/imagenuno.png" />
      </div>

      <div className="right">
        <div className="top">
          <h1>CREAR UNA CUENTA</h1>
          <img src="/registrolumia.jpeg" className="img-below" />
          <p>Regístrate para continuar</p>
        </div>

        <form onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "CREANDO..." : "CREAR CUENTA"}
          </button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}