"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

interface Perfil {
  nombre: string;
  nombreNegocio: string;
  correo: string;
  telefono: string;
  descripcion: string;
  cedula: string;
  banco: string;
  numeroCuenta: string;
}

export default function PerfilVendedor() {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [vendedorId, setVendedorId] = useState<string | null>(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      const id = localStorage.getItem("vendedorId");
      setVendedorId(id);

      if (!id) {
        setCargando(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "usuarios", id));
        if (docSnap.exists()) {
          setPerfil(docSnap.data() as Perfil);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!perfil) return;
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    if (!vendedorId || !perfil) return;
    setGuardando(true);
    try {
      await updateDoc(doc(db, "usuarios", vendedorId), { ...perfil });
      setEditando(false);
      setMensaje("Perfil actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setMensaje("Ocurrió un error al guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando perfil...</p>
      </div>
    );
  }

  if (!vendedorId || !perfil) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-500">Debes iniciar sesión para ver tu perfil.</p>
        <Link href="/vendedor/login">
          <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-5 py-3 rounded-xl transition">
            Ir al login
          </button>
        </Link>
      </div>
    );
  }

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
          <div className={`p-3 rounded-xl mb-5 text-center font-semibold text-sm ${
            mensaje.includes("error")
              ? "bg-red-100 border border-red-300 text-red-700"
              : "bg-emerald-100 border border-emerald-300 text-emerald-700"
          }`}>
            {mensaje.includes("error") ? "⚠️" : "✅"} {mensaje}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-white text-2xl font-bold">
                {perfil.nombreNegocio?.charAt(0) || "?"}
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">{perfil.nombreNegocio}</h1>
                <p className="text-slate-400 text-sm">{perfil.nombre}</p>
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
                type="text" name="nombre" value={perfil.nombre}
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
                type="email" value={perfil.correo}
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
                  disabled={guardando}
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
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