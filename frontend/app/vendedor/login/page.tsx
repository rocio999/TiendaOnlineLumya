"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginVendedor() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí luego conectamos con el backend/Firestore
    console.log("Login vendedor:", { correo, password });
    router.push("/vendedor");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image src="/fondo-lumya.png" alt="Fondo" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-md px-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo-lumya.png" alt="Lumya" width={90} height={90} className="rounded-xl mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-wide">Panel de Vendedor</h1>
          <p className="text-yellow-300 text-sm mt-1">Inicia sesión para gestionar tus productos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 placeholder-slate-400 focus:outline-none focus:border-cyan-300 transition"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 placeholder-slate-400 focus:outline-none focus:border-cyan-300 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}