"use client";
import Link from "next/link";
import Image from "next/image";

export default function PanelAdmin() {
  const stats = [
    { titulo: "Total Usuarios", valor: "24", emoji: "👥", color: "from-blue-600 to-blue-800" },
    { titulo: "Vendedores Activos", valor: "8", emoji: "🏪", color: "from-cyan-500 to-cyan-700" },
    { titulo: "Productos", valor: "142", emoji: "📦", color: "from-emerald-500 to-emerald-700" },
    { titulo: "Pagos Pendientes", valor: "5", emoji: "💳", color: "from-orange-500 to-red-600" },
  ];

  const menuItems = [
    { titulo: "Gestión de Usuarios", descripcion: "Ver, suspender y gestionar usuarios", emoji: "👥", href: "/admin/usuarios" },
    { titulo: "Gestión de Vendedores", descripcion: "Crear y administrar vendedores", emoji: "🏪", href: "/admin/vendedores" },
    { titulo: "Gestión de Productos", descripcion: "Ver, administrar productos y categorías", emoji: "📦", href: "/admin/productos" },
    { titulo: "Aprobar Pagos", descripcion: "Revisar y aprobar transferencias", emoji: "💳", href: "/admin/pagos" },
    { titulo: "Historial de Actividad", descripcion: "Registro de acciones del sistema", emoji: "📋", href: "/admin/auditoria" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl"/>
            <div>
              <span className="text-xl font-bold text-white">lumya</span>
              <span className="ml-2 bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-200 text-sm">Administrador</span>
            <div className="bg-white/20 w-9 h-9 rounded-full flex items-center justify-center">
              <span className="text-white">👤</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Panel de Administración</h1>
          <p className="text-slate-500 mt-1">Gestiona todos los aspectos de Lumya</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.titulo} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg`}>
              <span className="text-3xl">{stat.emoji}</span>
              <p className="text-3xl font-bold mt-2">{stat.valor}</p>
              <p className="text-white/80 text-sm mt-1">{stat.titulo}</p>
            </div>
          ))}
        </div>

        {/* Menú principal */}
        <h2 className="text-xl font-bold text-blue-900 mb-4">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.titulo} href={item.href}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex items-center gap-4 h-full">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">{item.titulo}</h3>
                  <p className="text-slate-400 text-sm">{item.descripcion}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}