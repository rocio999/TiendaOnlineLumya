"use client";

import "../../styles/registro.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rol, setRol] = useState("cliente");

  const router = useRouter();

  const handleRegistro = async (e: any) => {
    e.preventDefault();

    if (!nombre || !correo || !password) {
      setMensaje("Completa todos los campos");
      return;
    }

    if (password.length < 4) {
      setMensaje("Contraseña muy corta");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          password,
          rol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Error al registrar");
        return;
      }

      setMensaje("Usuario creado 🚀. Redirigiendo a login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      setMensaje("Error de conexión con el servidor");
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
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Apellido"
            onChange={(e) => setApellido(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo"
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="password" placeholder="Confirmar Contraseña" />

          <div className="roles">
            <p>Tipo de cuenta:</p>

            <label>
              <input
                type="radio"
                name="rol"
                value="cliente"
                checked={rol === "cliente"}
                onChange={(e) => setRol(e.target.value)}
              />
              Cliente
            </label>

            <label>
              <input
                type="radio"
                name="rol"
                value="vendedor"
                checked={rol === "vendedor"}
                onChange={(e) => setRol(e.target.value)}
              />
              Vendedor
            </label>
          </div>

          <button type="submit">CREAR CUENTA</button>
        </form>

        {mensaje && <p>{mensaje}</p>}

      </div>
    </div>
  );
}