"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginVendedor() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const res = await fetch("http://brown-lark-804410.hostingersite.com/login-vendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Correo o contraseña incorrectos");
        setCargando(false);
        return;
      }

      localStorage.setItem("vendedorId", data.vendedor.id);
      localStorage.setItem("vendedorNombre", data.vendedor.nombreNegocio || data.vendedor.nombre);
      localStorage.setItem("vendedorToken", data.token);

      router.push("/vendedor");
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center items-center">
          <Image src="/logo-lumya.png" alt="Lumya" width={80} height={80} className="mb-4 rounded-xl shadow-sm" />
          
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 text-2xl mb-6 shadow-sm">
            🏪
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-1">Portal de Vendedores</h2>
          <p className="text-slate-400 text-xs mb-6 text-center">Ingresa tus credenciales para acceder</p>

          {mensaje && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-center text-xs font-semibold">
              ⚠️ {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
            <div>
              <label className="text-slate-600 font-semibold text-xs block mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-cyan-400 transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold text-xs block mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-cyan-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-sm mt-2 disabled:opacity-50 text-sm cursor-pointer"
            >
              {cargando ? "Verificando..." : "Iniciar Sesión"}
            </button>

            <p className="text-center text-slate-500 text-xs mt-3">
              ¿No tienes una cuenta de vendedor?{" "}
              <Link href="/vendedor/registro" className="text-blue-700 font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center items-center text-white p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]"></div>
          <div className="relative z-10">
            <span className="bg-blue-800/60 text-cyan-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block border border-blue-600/40">
              Panel Comercial
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Bienvenido, Vendedor</h1>
            <p className="text-sm md:text-base text-blue-100 max-w-xs mx-auto leading-relaxed">
              Gestiona tus productos, visualiza tus pedidos y haz crecer tu negocio en la plataforma de Lumya.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}