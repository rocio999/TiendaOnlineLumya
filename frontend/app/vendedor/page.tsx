"use client";
import Link from "next/link";
import Image from "next/image";

export default function PanelVendedor() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Panel de Vendedor</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Bienvenido</h1>
          <p className="text-slate-500 mt-1">Aquí puedes gestionar tus productos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/vendedor/productos">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Mis Productos</h2>
              <p className="text-slate-400 text-sm">Ver y gestionar tus productos</p>
            </div>
          </Link>

          <Link href="/vendedor/productos/nuevo">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">➕</span>
              </div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Subir Producto</h2>
              <p className="text-slate-400 text-sm">Publicar un nuevo producto</p>
            </div>
          </Link>

          <Link href="/vendedor/perfil">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Mi Perfil</h2>
              <p className="text-slate-400 text-sm">Ver y editar tu información</p>
            </div>
          </Link>
           <Link href="/vendedor/panel">
  <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
    Panel del administracion
    
  </button>
</Link>
        </div>
      </div>
    </div>
  );
}