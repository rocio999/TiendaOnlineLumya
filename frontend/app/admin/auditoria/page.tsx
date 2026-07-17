"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface Registro {
  id: string;
  usuario: string;
  rol: string;
  accion: string;
  tipo: string;
  fecha: string;
  hora: string;
}

export default function Auditoria() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const usuariosSnap = await getDocs(collection(db, "usuarios"));
        const mapaUsuarios: Record<string, { nombre: string; rol: string }> = {};
        usuariosSnap.docs.forEach((u) => {
          mapaUsuarios[u.id] = {
            nombre: u.data().nombreNegocio || u.data().nombre || "Usuario",
            rol: u.data().rol || "cliente",
          };
        });

        let historialQuery;
        try {
          historialQuery = query(collection(db, "historial"), orderBy("fecha", "desc"));
        } catch {
          historialQuery = collection(db, "historial");
        }

        const historialSnap = await getDocs(historialQuery);

        const lista: Registro[] = historialSnap.docs.map((h) => {
          const data = h.data();
          const usuarioInfo = mapaUsuarios[data.usuarioId] || { nombre: "Sistema", rol: "admin" };

          const fechaObj = data.fecha?.toDate ? data.fecha.toDate() : null;
          const fechaTexto = fechaObj
            ? fechaObj.toLocaleDateString("es-EC")
            : (typeof data.fecha === "string" ? data.fecha : "Sin fecha");
          const horaTexto = fechaObj
            ? fechaObj.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
            : "";

          const tipoNormalizado =
            data.tipo === "categoria" ? "Producto" :
            data.tipo === "producto" ? "Producto" :
            data.tipo === "pago" ? "Pago" :
            data.tipo === "usuario" || data.tipo === "vendedor" ? "Usuario" :
            "Producto";

          return {
            id: h.id,
            usuario: usuarioInfo.nombre,
            rol: usuarioInfo.rol === "admin" ? "Admin" : usuarioInfo.rol === "vendedor" ? "Vendedor" : "Cliente",
            accion: data.accion || "Acción sin descripción",
            tipo: tipoNormalizado,
            fecha: fechaTexto,
            hora: horaTexto,
          };
        });

        setRegistros(lista);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);

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

      {/* Header */}
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

        {/* Stats */}
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

        {/* Búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por usuario o acción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-sm"
          />
        </div>

        {/* Filtros */}
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

        {/* Lista registros */}
        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando historial...</div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No hay registros que coincidan.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {registrosFiltrados.map((registro) => (
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
                  <p className="text-sm font-semibold text-slate-600">{registro.fecha}</p>
                  <p className="text-xs text-slate-400">{registro.hora}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}