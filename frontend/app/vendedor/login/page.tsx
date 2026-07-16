"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginVendedor() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login vendedor:", { correo, password });
    router.push("/vendedor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <Image src="/logo-lumya.png" alt="Lumya" width={100} height={100} className="mb-6 rounded-xl" />
          <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-white text-3xl mb-6">
            🏪
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-full transition"
            >
              Iniciar Sesión
            </button>
            <p className="text-center text-slate-500 text-sm mt-1">
              ¿No tienes cuenta?{" "}
              <Link href="/vendedor/registro" className="text-blue-700 font-semibold hover:underline">
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center items-center text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Bienvenido, Vendedor</h1>
          <p className="text-lg text-blue-100">Gestiona tus productos en Lumya</p>
        </div>

      </div>
    </div>
  );
}