"use client";
import Image from "next/image";
import Link from "next/link";
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

export default function PerfilVendedor() {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Datos de ejemplo — luego vendrán de Firestore según el vendedor logueado
  const [perfil, setPerfil] = useState({
    nombrePropietario: "Carlos Ramírez",
    nombreNegocio: "Tienda Carlos",
    correo: "carlos.vendedor@lumya.com",
    telefono: "0991234567",
    descripcion: "Venta de mochilas, cámaras y accesorios tecnológicos.",
    cedula: "1712345678",
    banco: "Banco Pichincha",
    numeroCuenta: "2201234567",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    // Aquí luego conectamos con el backend para actualizar el perfil
    console.log("Perfil actualizado:", perfil);
    setEditando(false);
    setMensaje("Perfil actualizado correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Mi Perfil</span>
          </div>
          <Link href="/vendedor">
            <button className="text-white hover:bg-white/20 px-3 py-2 rounded-xl text-sm transition">
              ← Volver
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {mensaje && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ✅ {mensaje}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-white text-2xl font-bold">
                {perfil.nombreNegocio.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">{perfil.nombreNegocio}</h1>
                <p className="text-slate-400 text-sm">{perfil.nombrePropietario}</p>
              </div>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
              >
                Editar
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide">Datos personales</p>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Nombre del propietario</label>
              <input
                type="text" name="nombrePropietario" value={perfil.nombrePropietario}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Cédula</label>
              <input
                type="text" name="cedula" value={perfil.cedula} maxLength={10}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Correo</label>
              <input
                type="email" name="correo" value={perfil.correo}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Teléfono</label>
              <input
                type="tel" name="telefono" value={perfil.telefono}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Mi negocio</p>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Nombre del negocio</label>
              <input
                type="text" name="nombreNegocio" value={perfil.nombreNegocio}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Descripción</label>
              <textarea
                name="descripcion" value={perfil.descripcion} rows={3}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {editando && (
              <div>
                <label className="text-slate-500 text-xs block mb-1">Cambiar foto o logo</label>
                <input
                  type="file" accept="image/*"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-800 file:text-white file:font-semibold hover:file:bg-blue-900 transition cursor-pointer"
                />
              </div>
            )}

            <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Información de pago</p>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Banco o cooperativa</label>
              {editando ? (
                <select
                  name="banco" value={perfil.banco} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <optgroup label="Bancos">
                    {BANCOS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </optgroup>
                  <optgroup label="Cooperativas">
                    {COOPERATIVAS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </select>
              ) : (
                <input
                  type="text" value={perfil.banco} disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500"
                />
              )}
            </div>

            <div>
              <label className="text-slate-500 text-xs block mb-1">Número de cuenta</label>
              <input
                type="text" name="numeroCuenta" value={perfil.numeroCuenta}
                onChange={handleChange} disabled={!editando}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {editando && (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={guardarCambios}
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setEditando(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}