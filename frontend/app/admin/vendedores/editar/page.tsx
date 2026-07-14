"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const BANCOS = [
  "Banco Pichincha", "Banco Guayaquil", "Banco del Pacífico", "Banco Bolivariano",
  "Banco Produbanco", "Banco Internacional", "Banco General Rumiñahui", "Banco de Loja",
  "Banco Solidario", "Banco ProCredit", "Banco Machala", "Banco Amazonas",
  "Banco Capital", "Banco Diners Club", "Banco D-Miro", "Banco VisionFund Ecuador",
];

const COOPERATIVAS = [
  "Cooperativa JEP", "Cooperativa Jardín Azuayo", "Cooperativa Policía Nacional (COOPAC)",
  "Cooperativa 29 de Octubre", "Cooperativa Andalucía", "Cooperativa Riobamba",
  "Cooperativa Alianza del Valle", "Cooperativa CACPECO", "Cooperativa San Francisco",
  "Cooperativa Mego", "Cooperativa Cámara de Comercio de Ambato",
];

const vendedorMock = {
  nombrePropietario: "Carlos Ramírez",
  nombreNegocio: "Tienda Carlos",
  correo: "carlos.vendedor@lumya.com",
  telefono: "0991234567",
  descripcion: "Venta de mochilas, cámaras y accesorios tecnológicos.",
  cedula: "1712345678",
  banco: "Banco Pichincha",
  numeroCuenta: "2201234567",
  estado: "activo",
};

export default function EditarVendedor() {
  const [vendedor, setVendedor] = useState(vendedorMock);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setVendedor({ ...vendedor, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    console.log("Vendedor actualizado por admin:", vendedor);
    setMensaje("Cambios guardados correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/vendedores">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Editar Vendedor</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Editar Vendedor</h1>
          <p className="text-slate-500 text-sm mt-1">Actualiza la información de la tienda</p>
        </div>

        {mensaje && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ✅ {mensaje}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
          <div className="flex flex-col gap-4">

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide">Datos personales</p>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Nombre del propietario</label>
              <input
                type="text" name="nombrePropietario" value={vendedor.nombrePropietario}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Cédula</label>
              <input
                type="text" name="cedula" value={vendedor.cedula} maxLength={10}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Correo</label>
              <input
                type="email" value={vendedor.correo} disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Teléfono</label>
              <input
                type="tel" name="telefono" value={vendedor.telefono}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Negocio</p>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Nombre del negocio</label>
              <input
                type="text" name="nombreNegocio" value={vendedor.nombreNegocio}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Descripción</label>
              <textarea
                name="descripcion" value={vendedor.descripcion} rows={3}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Información de pago</p>

            <select
              name="banco" value={vendedor.banco} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
            >
              <optgroup label="Bancos">
                {BANCOS.map((b) => <option key={b} value={b}>{b}</option>)}
              </optgroup>
              <optgroup label="Cooperativas">
                {COOPERATIVAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Número de cuenta</label>
              <input
                type="text" name="numeroCuenta" value={vendedor.numeroCuenta}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex gap-4 mt-2">
              <button
                onClick={guardarCambios}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition"
              >
                Guardar Cambios
              </button>
              <Link href="/admin/vendedores" className="flex-1">
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition">
                  Cancelar
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}