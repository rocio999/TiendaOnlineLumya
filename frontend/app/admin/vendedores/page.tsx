"use client";
import Link from "next/link";
import Image from "next/image";

const vendedoresMock = [
  {
    id: "1",
    nombreNegocio: "Artesanías María",
    propietario: "María Jiménez",
    correo: "maria.tienda@lumya.com",
    estado: "pendiente",
  },
  {
    id: "2",
    nombreNegocio: "Tienda Carlos",
    propietario: "Carlos Ramírez",
    correo: "carlos.vendedor@lumya.com",
    estado: "activo",
  },
  {
    id: "3",
    nombreNegocio: "Moda Luis",
    propietario: "Luis Torres",
    correo: "luis.torres@lumya.com",
    estado: "suspendido",
  },
];

const estiloEstado: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  suspendido: "bg-red-100 text-red-700",
};

const textoEstado: Record<string, string> = {
  activo: "Activo",
  pendiente: "Pendiente",
  suspendido: "Suspendido",
};

export default function GestionVendedores() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Gestión de Vendedores</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Vendedores</h1>
          <p className="text-slate-500 mt-1">Revisa solicitudes y administra las tiendas de Lumya</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-cyan-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Negocio</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Propietario</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-900">Correo</th>
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
                  <td className="px-6 py-4 font-medium text-blue-900">{vendedor.nombreNegocio}</td>
                  <td className="px-6 py-4 text-slate-500">{vendedor.propietario}</td>
                  <td className="px-6 py-4 text-slate-500">{vendedor.correo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estiloEstado[vendedor.estado]}`}>
                      {textoEstado[vendedor.estado]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {vendedor.estado === "pendiente" ? (
                      <Link href="/admin/vendedores/nuevo">
                        <button className="text-cyan-700 hover:text-cyan-900 text-sm font-semibold">
                          Revisar solicitud
                        </button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/admin/vendedores/editar">
                          <button className="text-blue-700 hover:text-blue-900 text-sm font-semibold mr-4">
                            Editar
                          </button>
                        </Link>
                        <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
                          {vendedor.estado === "activo" ? "Suspender" : "Reactivar"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}