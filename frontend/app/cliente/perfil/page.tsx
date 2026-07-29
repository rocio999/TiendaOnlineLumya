"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  nombre: string;
  apellido: string;
  correo: string;
}

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("clienteId");
    localStorage.removeItem("clienteNombre");
    router.push("/cliente/login");
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <p className="text-blue-900">Debes iniciar sesión para ver tu perfil.</p>
        <Link href="/cliente/login">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
            Ir al login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cliente">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl"/>
            <span className="text-xl font-bold text-white">Mi Perfil</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 w-full max-w-md text-center">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-1">Mi Cuenta</h2>
          <p className="text-blue-400 text-sm mb-6">Gestiona tu información personal</p>
          <div className="flex flex-col gap-3 text-left">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Nombre</p>
              <p className="font-semibold text-gray-800">{usuario.nombre} {usuario.apellido}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Correo</p>
              <p className="font-semibold text-gray-800">{usuario.correo}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Mis pedidos</p>
              <p className="font-semibold text-gray-800">0 pedidos realizados</p>
            </div>
          </div>
          <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
            Editar Perfil
          </button>
          <button
            onClick={cerrarSesion}
            className="mt-3 w-full border-2 border-red-200 text-red-400 font-bold py-3 rounded-xl hover:bg-red-50 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}