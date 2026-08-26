"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}
interface RegistroBackend {
  id: string;
  usuario: string;
  rol: string;
  accion: string;
  tipo: string;
  fecha: Timestamp;
}

interface Registro {
  id: string;
  usuario: string;
  rol: string;
  accion: string;
  tipo: string;
  fecha: Timestamp;
}

export default function Auditoria() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await fetch("http://brown-lark-804410.hostingersite.com/historial");
        const data = await res.json();
        if (!res.ok) {
          setError("No se pudo cargar el historial");
          return;
        }

        const lista: Registro[] = data.map((h: RegistroBackend) => {
          const tipoNormalizado =
            h.tipo === "categoria" ? "Producto" :
            h.tipo === "producto" ? "Producto" :
            h.tipo === "pago" ? "Pago" :
            h.tipo === "usuario" || h.tipo === "vendedor" ? "Usuario" :
            "Producto";

          return {
            id: h.id,
            usuario: h.usuario,
            rol: h.rol === "admin" ? "Admin" : h.rol === "vendedor" ? "Vendedor" : "Cliente",
            accion: h.accion,
            tipo: tipoNormalizado,
            fecha: h.fecha,
          };
        });

        setRegistros(lista);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);

  const formatearFechaHora = (fecha: Timestamp | null | undefined) => {
    if (!fecha) return { fecha: "Sin fecha", hora: "" };
    if (fecha._seconds) {
      const d = new Date(fecha._seconds * 1000);
      return {
        fecha: d.toLocaleDateString("es-EC"),
        hora: d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      };
    }
    return { fecha: typeof fecha === "string" ? fecha : "Sin fecha", hora: "" };
  };

  const registrosFiltrados = registros.filter((r) => {
    const coincideFiltro = filtro === "Todos" || r.tipo === filtro;
    const coincideBusqueda =
      r.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.accion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  const getColor = (tipo: string) => {
    switch (tipo) {
      case "Pago": return "bg-green-100 text-green-700";
      case "Producto": return "bg-blue-100 text-blue-700";
      case "Usuario": return "bg-red-100 text-red-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getEmoji = (tipo: string) => {
    switch (tipo) {
      case "Pago": return "💳";
      case "Producto": return "📦";
      case "Usuario": return "👤";
      default: return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Historial de Actividad</span>
          </div>
          <span className="bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-blue-800">{registros.length}</p>
            <p className="text-slate-400 text-sm">Total Registros</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">{registros.filter(r => r.tipo === "Pago").length}</p>
            <p className="text-slate-400 text-sm">Pagos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{registros.filter(r => r.tipo === "Producto").length}</p>
            <p className="text-slate-400 text-sm">Productos</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por usuario o acción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-sm"
          />
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Pago", "Producto", "Usuario"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                filtro === f
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando historial...</div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No hay registros que coincidan.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {registrosFiltrados.map((registro) => {
              const { fecha, hora } = formatearFechaHora(registro.fecha);
              return (
                <div
                  key={registro.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getColor(registro.tipo)}`}>
                    <span className="text-2xl">{getEmoji(registro.tipo)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800">{registro.accion}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getColor(registro.tipo)}`}>
                        {registro.tipo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">Por: {registro.usuario}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        registro.rol === "Admin"
                          ? "bg-cyan-100 text-cyan-700"
                          : registro.rol === "Vendedor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {registro.rol}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-600">{fecha}</p>
                    <p className="text-xs text-slate-400">{hora}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}