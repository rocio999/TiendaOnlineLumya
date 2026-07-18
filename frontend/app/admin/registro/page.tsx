"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !correo || !password) {
      setMensaje("Completa todos los campos");
      return;
    }
    if (password.length < 4) {
      setMensaje("Contraseña muy corta");
      return;
    }
    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch("http://localhost:3001/registro-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, correo, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.message || "Error al registrar");
        setCargando(false);
        return;
      }
      setMensaje("Usuario creado 🚀. Redirigiendo a login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
            🛒
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-0.5 bg-slate-200"></div>
          <h1 className="text-xl font-bold text-blue-900 mx-3 whitespace-nowrap">CREAR UNA CUENTA</h1>
          <div className="flex-1 h-0.5 bg-slate-200"></div>
        </div>

        {mensaje && (
          <div className={`p-3 rounded-xl mb-4 text-center font-semibold text-sm ${
            mensaje.includes("🚀")
              ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
              : "bg-red-100 border border-red-300 text-red-700"
          }`}>
            {mensaje.includes("🚀") ? "✅" : "⚠️"} {mensaje}
          </div>
        )}

        <form onSubmit={handleRegistro} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-full transition disabled:opacity-50 mt-2"
          >
            {cargando ? "Registrando..." : "REGISTRARME"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-1">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-700 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}