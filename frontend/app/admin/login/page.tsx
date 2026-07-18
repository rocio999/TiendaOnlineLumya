"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.message);
        setCargando(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("clienteId", data.usuario.id);
      localStorage.setItem("clienteNombre", data.usuario.nombre);
      window.location.href = "/cliente";
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-lumya.png" alt="Lumya" width={80} height={80} className="rounded-xl mb-3" />
          <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-white text-3xl mb-4">
            👤
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-0.5 bg-slate-200"></div>
          <h1 className="text-xl font-bold text-blue-900 mx-3">INICIAR SESIÓN</h1>
          <div className="flex-1 h-0.5 bg-slate-200"></div>
        </div>

        {mensaje && (
          <div className="w-full bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-4 text-center text-sm font-semibold">
            ⚠️ {mensaje}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
            required
          />
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              required
            />
            <Link href="/recuperar-contrasena">
              <span className="text-xs text-slate-400 underline mt-1 ml-2 inline-block cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
            </Link>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-full transition disabled:opacity-50 mt-2"
          >
            {cargando ? "Verificando..." : "Iniciar Sesión"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-1">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-blue-700 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}