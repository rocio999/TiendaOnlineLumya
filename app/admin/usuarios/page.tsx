"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}
interface UsuarioBackend {
  id: string;
  nombre?: string;
  nombreNegocio?: string;
  correo?: string;
  rol?: string;
  estado?: string;
}

const estiloEstado: Record<string, string> = {
  activo: "bg-green-100 text-green-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  suspendido: "bg-red-100 text-red-600",
  rechazado: "bg-slate-200 text-slate-600",
};

const textoEstado: Record<string, string> = {
  activo: "Activo",
  pendiente: "Pendiente",
  suspendido: "Suspendido",
  rechazado: "Rechazado",
};

const estiloRol: Record<string, string> = {
  vendedor: "bg-cyan-100 text-cyan-700",
  cliente: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
};

const textoRol: Record<string, string> = {
  vendedor: "Vendedor",
  cliente: "Cliente",
  admin: "Admin",
};

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://brown-lark-804410.hostingersite.com/usuarios");
        const data = await res.json();
        if (!res.ok) {
          setError("No se pudieron cargar los usuarios");
          return;
        }
        const lista: Usuario[] = data.map((d: UsuarioBackend) => ({
          id: d.id,
          nombre: d.nombre || d.nombreNegocio || "Sin nombre",
          correo: d.correo || "",
          rol: d.rol || "cliente",
          estado: d.estado || "activo",
        }));
        setUsuarios(lista);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuarios();
  }, []);

  const toggleEstado = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activo" ? "suspendido" : "activo";
    setActualizandoId(id);
    try {
      const res = await fetch(`http://brown-lark-804410.hostingersite.com/usuarios/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": "lumya-admin-2026" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        console.error("Error al cambiar estado");
        return;
      }

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, estado: nuevoEstado } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideFiltro =
      filtro === "Todos" ||
      (filtro === "Cliente" && u.rol === "cliente") ||
      (filtro === "Vendedor" && u.rol === "vendedor") ||
      (filtro === "Activo" && u.estado === "activo") ||
      (filtro === "Suspendido" && u.estado === "suspendido");
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (

  <div className="min-h-screen bg-slate-50">

```
{/* HEADER */}
<header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 sticky top-0 z-50 shadow-lg">
  <div className="max-w-6xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Link href="/admin">
          <button className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-xl transition-all">
            <span className="text-lg">←</span>
            <span className="hidden sm:inline text-sm font-semibold">
              Volver
            </span>
          </button>
        </Link>

        <Image
          src="/logo-lumya.png"
          alt="Lumya"
          width={42}
          height={42}
          className="rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">
            Gestión de Usuarios
          </h1>

          <p className="text-blue-200 text-xs hidden sm:block">
            Administración de clientes y vendedores
          </p>
        </div>

      </div>

      <div className="bg-cyan-400 text-blue-950 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide">
        ADMIN
      </div>

    </div>
  </div>
</header>


{/* CONTENIDO */}
<main className="max-w-6xl mx-auto px-4 py-7 sm:py-9">

  {/* ERROR */}
  {error && (
    <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow-sm">
      <span className="text-xl">⚠️</span>

      <p className="text-sm font-semibold">
        {error}
      </p>
    </div>
  )}


  {/* TÍTULO */}
  <div className="mb-6">
    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
      Usuarios
    </h2>

    <p className="text-slate-500 text-sm mt-1">
      Administra y controla las cuentas registradas en Lumya.
    </p>
  </div>


  {/* BUSCADOR */}
  <div className="relative mb-5">

    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
      🔍
    </span>

    <input
      type="text"
      placeholder="Buscar usuario por nombre o correo..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
    />

  </div>


  {/* FILTROS */}
  <div className="flex gap-2 mb-7 overflow-x-auto pb-1">

    {["Todos", "Cliente", "Vendedor", "Activo", "Suspendido"].map((f) => (

      <button
        key={f}
        onClick={() => setFiltro(f)}
        className={`
          flex-shrink-0
          px-4 py-2.5
          rounded-xl
          text-sm
          font-semibold
          transition-all
          ${
            filtro === f
              ? "bg-blue-900 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
          }
        `}
      >
        {f}
      </button>

    ))}

  </div>


  {/* ESTADÍSTICAS */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

    {/* TOTAL */}
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
            Total usuarios
          </p>

          <p className="text-3xl font-extrabold text-blue-900 mt-1">
            {usuarios.length}
          </p>
        </div>

        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 text-xl">
          👥
        </div>

      </div>

    </div>


    {/* ACTIVOS */}
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
            Usuarios activos
          </p>

          <p className="text-3xl font-extrabold text-green-600 mt-1">
            {usuarios.filter(
              (u) => u.estado === "activo"
            ).length}
          </p>
        </div>

        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-50 text-xl">
          ✓
        </div>

      </div>

    </div>


    {/* SUSPENDIDOS */}
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
            Suspendidos
          </p>

          <p className="text-3xl font-extrabold text-red-500 mt-1">
            {usuarios.filter(
              (u) => u.estado === "suspendido"
            ).length}
          </p>
        </div>

        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-xl">
          !
        </div>

      </div>

    </div>

  </div>


  {/* ENCABEZADO DE RESULTADOS */}
  <div className="flex items-center justify-between mb-4">

    <div>
      <h3 className="font-bold text-slate-800">
        Lista de usuarios
      </h3>

      <p className="text-xs text-slate-400 mt-0.5">
        {usuariosFiltrados.length} resultado
        {usuariosFiltrados.length !== 1 ? "s" : ""}
      </p>
    </div>

  </div>


  {/* CARGANDO */}
  {cargando ? (

    <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center shadow-sm">

      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-4" />

      <p className="text-slate-500 text-sm font-medium">
        Cargando usuarios...
      </p>

    </div>

  ) : usuariosFiltrados.length === 0 ? (

    /* SIN RESULTADOS */
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-16 px-5 text-center">

      <div className="text-4xl mb-3">
        🔎
      </div>

      <h3 className="font-bold text-slate-700">
        No encontramos usuarios
      </h3>

      <p className="text-sm text-slate-400 mt-1">
        Intenta cambiar los filtros o realizar otra búsqueda.
      </p>

    </div>

  ) : (

    /* LISTA DE USUARIOS */
    <div className="flex flex-col gap-3">

      {usuariosFiltrados.map((usuario) => (

        <div
          key={usuario.id}
          className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
        >

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* AVATAR */}
            <div className={`
              w-12 h-12
              rounded-2xl
              flex items-center justify-center
              flex-shrink-0
              font-extrabold
              text-lg
              shadow-sm
              ${
                estiloRol[usuario.rol] ||
                "bg-slate-100 text-slate-600"
              }
            `}>
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>


            {/* INFORMACIÓN */}
            <div className="flex-1 min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <p className="font-bold text-slate-800 truncate">
                  {usuario.nombre}
                </p>

                <span className={`
                  text-[11px]
                  font-bold
                  px-2.5 py-1
                  rounded-full
                  ${
                    estiloRol[usuario.rol] ||
                    "bg-slate-100 text-slate-600"
                  }
                `}>
                  {textoRol[usuario.rol] || usuario.rol}
                </span>

              </div>

              <p className="text-slate-400 text-sm mt-1 truncate">
                {usuario.correo || "Sin correo registrado"}
              </p>

            </div>


            {/* ESTADO */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:min-w-[125px]">

              <span className={`
                text-xs
                font-bold
                px-3 py-1.5
                rounded-full
                whitespace-nowrap
                ${
                  estiloEstado[usuario.estado] ||
                  "bg-slate-100 text-slate-600"
                }
              `}>
                {textoEstado[usuario.estado] || usuario.estado}
              </span>


              {(usuario.estado === "activo" ||
                usuario.estado === "suspendido") && (

                <button
                  onClick={() =>
                    toggleEstado(
                      usuario.id,
                      usuario.estado
                    )
                  }
                  disabled={
                    actualizandoId === usuario.id
                  }
                  className={`
                    text-xs
                    font-bold
                    px-3 py-1.5
                    rounded-lg
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    ${
                      usuario.estado === "activo"
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }
                  `}
                >
                  {actualizandoId === usuario.id
                    ? "Actualizando..."
                    : usuario.estado === "activo"
                    ? "Suspender"
                    : "Activar"}
                </button>

              )}

            </div>

          </div>

        </div>

      ))}

    </div>

  )}

</main>
```

  </div>
);
}