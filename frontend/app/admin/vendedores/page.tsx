"use client";
import Link from "next/link";

const vendedoresMock = [
  {
    id: "1",
    nombre: "Carlos Ramírez",
    correo: "carlos.vendedor@lumya.com",
    cedula: "1712345678",
    banco: "Banco Pichincha",
    estado: "activo",
  },
  {
    id: "2",
    nombre: "María Jiménez",
    correo: "maria.tienda@lumya.com",
    cedula: "0923456789",
    banco: "Cooperativa JEP",
    estado: "activo",
  },
  {
    id: "3",
    nombre: "Luis Torres",
    correo: "luis.torres@lumya.com",
    cedula: "1345678901",
    banco: "Banco Guayaquil",
    estado: "suspendido",
  },
];

export default function GestionVendedores() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Gestión de Vendedores</h1>
            <p className="text-slate-500 mt-1">Administra las cuentas de los vendedores de Lumya</p>
          </div>
          <Link href="/admin/vendedores/nuevo">
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition">
              + Nuevo Vendedor
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-cyan-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Correo</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Cédula</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Banco</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Estado</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vendedoresMock.map((vendedor, index) => (
                <tr
                  key={vendedor.id}
                  className={index !== vendedoresMock.length - 1 ? "border-b border-slate-100" : ""}
                >
                  <td className="px-6 py-4 font-medium text-blue-900">{vendedor.nombre}</td>
                  <td className="px-6 py-4 text-slate-500">{vendedor.correo}</td>
                  <td className="px-6 py-4 text-slate-500">{vendedor.cedula}</td>
                  <td className="px-6 py-4 text-slate-500">{vendedor.banco}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vendedor.estado === "activo"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendedor.estado === "activo" ? "Activo" : "Suspendido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-700 hover:text-blue-900 text-sm font-semibold mr-4">
                      Editar
                    </button>
                    <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
                      {vendedor.estado === "activo" ? "Suspender" : "Reactivar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vendedoresMock.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            Aún no hay vendedores registrados.
          </div>
        )}

      </div>
    </div>
  );
}