"use client";

import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      setMensaje("Login exitoso 🚀");

      window.location.href = "/dashboard";
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/loginlumia.png')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-8 text-white">
            Accede a tu cuenta
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="p-3 bg-gray-100 text-black border-2 border-purple-500"
            />

            <Link href="/recuperar-correo">
              <span className="text-sm underline mt-1 cursor-pointer italic">
                ¿Olvidaste tu correo?
              </span>
            </Link>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 bg-gray-100 text-black"
            />

            <Link href="/recuperar-contrasena">
              <span className="text-sm underline mt-1 cursor-pointer italic">
                ¿Olvidaste tu contraseña?
              </span>
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="bg-blue-900 text-white py-3 px-8 mt-4 hover:bg-blue-800 transition-colors"
          >
            Ingresar
          </button>

          {mensaje && <p className="text-white">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}