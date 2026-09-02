"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Vendedor {
  id: string;
  nombreNegocio: string;
  nombre: string;
  correo: string;
  estado: string;
}

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
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cargarVendedores = async () => {
    try {
      const res = await fetch("http://brown-lark-804410.hostingersite.com/vendedores");
      const data = await res.json();
      if (!res.ok) {
        setError("No se pudieron cargar los vendedores");
        return;
      }
      setVendedores(data);
    } catch (err) {
      console.error("Error al cargar vendedores:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarVendedores();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      const res = await fetch(`http://brown-lark-804410.hostingersite.com/vendedores/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": "lumya-admin-2026" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        console.error("Error al cambiar estado");
        return;
      }

      setVendedores((prev) =>
        prev.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

  return (

  <div className="min-h-screen bg-slate-50">


{/* ================= HEADER ================= */}
<header className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 shadow-lg">
  <div className="max-w-6xl mx-auto px-4 py-4">

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Link href="/admin">
          <button
            className="
              flex items-center gap-2
              px-3 py-2
              rounded-xl
              text-white
              bg-white/10
              hover:bg-white/20
              border border-white/10
              transition-all
            "
          >
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
          <h1 className="text-white font-bold text-lg sm:text-xl">
            Gestión de Vendedores
          </h1>

          <p className="hidden sm:block text-blue-200 text-xs">
            Administración de tiendas y solicitudes
          </p>
        </div>

      </div>

      <div className="
        hidden sm:block
        bg-cyan-400
        text-blue-950
        px-3 py-1.5
        rounded-full
        text-xs
        font-extrabold
        tracking-wide
      ">
        ADMIN
      </div>

    </div>

  </div>
</header>


{/* ================= CONTENIDO ================= */}
<main className="max-w-6xl mx-auto px-4 py-8">

  {/* TÍTULO */}
  <div className="mb-7">

    <div className="flex items-center gap-3 mb-2">

      <div className="
        w-11 h-11
        flex items-center justify-center
        rounded-xl
        bg-blue-100
        text-xl
      ">
        🏪
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Vendedores
        </h2>

        <p className="text-slate-500 text-sm">
          Revisa solicitudes y administra las tiendas de Lumya.
        </p>
      </div>

    </div>

  </div>


  {/* ================= ERROR ================= */}
  {error && (
    <div className="
      mb-6
      flex items-center gap-3
      bg-red-50
      border border-red-200
      text-red-700
      px-4 py-3
      rounded-2xl
      shadow-sm
    ">
      <span className="text-xl">⚠️</span>

      <p className="text-sm font-semibold">
        {error}
      </p>
    </div>
  )}


  {/* ================= ESTADÍSTICAS ================= */}
  {!cargando && vendedores.length > 0 && (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-3
      gap-4
      mb-7
    ">

      {/* TOTAL */}
      <div className="
        bg-white
        border border-slate-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
      ">

        <div className="flex items-center justify-between">

          <div>
            <p className="
              text-xs
              uppercase
              tracking-wide
              font-bold
              text-slate-400
            ">
              Total vendedores
            </p>

            <p className="
              text-3xl
              font-extrabold
              text-blue-900
              mt-1
            ">
              {vendedores.length}
            </p>
          </div>

          <div className="
            w-11 h-11
            flex items-center justify-center
            rounded-xl
            bg-blue-50
            text-xl
          ">
            👥
          </div>

        </div>

      </div>


      {/* ACTIVOS */}
      <div className="
        bg-white
        border border-slate-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
      ">

        <div className="flex items-center justify-between">

          <div>
            <p className="
              text-xs
              uppercase
              tracking-wide
              font-bold
              text-slate-400
            ">
              Tiendas activas
            </p>

            <p className="
              text-3xl
              font-extrabold
              text-emerald-600
              mt-1
            ">
              {
                vendedores.filter(
                  (v) => v.estado === "activo"
                ).length
              }
            </p>
          </div>

          <div className="
            w-11 h-11
            flex items-center justify-center
            rounded-xl
            bg-emerald-50
            text-xl
          ">
            ✓
          </div>

        </div>

      </div>


      {/* PENDIENTES */}
      <div className="
        bg-white
        border border-slate-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
      ">

        <div className="flex items-center justify-between">

          <div>
            <p className="
              text-xs
              uppercase
              tracking-wide
              font-bold
              text-slate-400
            ">
              Solicitudes pendientes
            </p>

            <p className="
              text-3xl
              font-extrabold
              text-yellow-500
              mt-1
            ">
              {
                vendedores.filter(
                  (v) => v.estado === "pendiente"
                ).length
              }
            </p>
          </div>

          <div className="
            w-11 h-11
            flex items-center justify-center
            rounded-xl
            bg-yellow-50
            text-xl
          ">
            !
          </div>

        </div>

      </div>

    </div>

  )}


  {/* ================= ENCABEZADO LISTA ================= */}
  {!cargando && vendedores.length > 0 && (

    <div className="flex items-center justify-between mb-4">

      <div>
        <h3 className="font-bold text-slate-800">
          Lista de vendedores
        </h3>

        <p className="text-xs text-slate-400 mt-0.5">
          {vendedores.length} vendedor
          {vendedores.length !== 1 ? "es" : ""}
          {" "}registrado
          {vendedores.length !== 1 ? "s" : ""}
        </p>
      </div>

    </div>

  )}


  {/* ================= CARGANDO ================= */}
  {cargando ? (

    <div className="
      bg-white
      border border-slate-200
      rounded-2xl
      py-16
      text-center
      shadow-sm
    ">

      <div className="
        w-10 h-10
        border-4
        border-slate-200
        border-t-blue-700
        rounded-full
        animate-spin
        mx-auto
        mb-4
      " />

      <p className="text-slate-500 text-sm font-medium">
        Cargando vendedores...
      </p>

    </div>

  ) : vendedores.length === 0 ? (

    /* ================= SIN VENDEDORES ================= */
    <div className="
      bg-white
      border border-dashed border-slate-300
      rounded-2xl
      py-16
      px-5
      text-center
      shadow-sm
    ">

      <div className="text-5xl mb-4">
        🏪
      </div>

      <h3 className="font-bold text-slate-700 text-lg">
        Aún no hay vendedores
      </h3>

      <p className="text-sm text-slate-400 mt-1">
        Cuando se registren vendedores aparecerán aquí.
      </p>

    </div>

  ) : (

    <>
      {/* ================= TABLA DESKTOP ================= */}
      <div className="
        hidden
        md:block
        bg-white
        rounded-2xl
        shadow-sm
        border border-slate-200
        overflow-hidden
      ">

        <table className="w-full text-left">

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

              <th className="
                px-6 py-4
                text-xs
                uppercase
                tracking-wide
                font-bold
                text-slate-500
              ">
                Negocio
              </th>

              <th className="
                px-6 py-4
                text-xs
                uppercase
                tracking-wide
                font-bold
                text-slate-500
              ">
                Propietario
              </th>

              <th className="
                px-6 py-4
                text-xs
                uppercase
                tracking-wide
                font-bold
                text-slate-500
              ">
                Correo
              </th>

              <th className="
                px-6 py-4
                text-xs
                uppercase
                tracking-wide
                font-bold
                text-slate-500
              ">
                Estado
              </th>

              <th className="
                px-6 py-4
                text-xs
                uppercase
                tracking-wide
                font-bold
                text-slate-500
                text-right
              ">
                Acción
              </th>

            </tr>

          </thead>


          <tbody>

            {vendedores.map((vendedor, index) => (

              <tr
                key={vendedor.id}
                className="
                  border-b
                  border-slate-100
                  last:border-0
                  hover:bg-slate-50
                  transition-colors
                "
              >

                {/* NEGOCIO */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-10 h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-700
                      flex items-center justify-center
                      font-bold
                      text-sm
                    ">
                      {vendedor.nombreNegocio
                        ?.charAt(0)
                        .toUpperCase() || "N"}
                    </div>

                    <div>
                      <p className="
                        font-bold
                        text-slate-800
                      ">
                        {vendedor.nombreNegocio}
                      </p>

                      <p className="
                        text-xs
                        text-slate-400
                        mt-0.5
                      ">
                        Tienda Lumya
                      </p>
                    </div>

                  </div>

                </td>


                {/* PROPIETARIO */}
                <td className="px-6 py-5">

                  <p className="
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    {vendedor.nombre}
                  </p>

                </td>


                {/* CORREO */}
                <td className="px-6 py-5">

                  <p className="
                    text-sm
                    text-slate-500
                  ">
                    {vendedor.correo}
                  </p>

                </td>


                {/* ESTADO */}
                <td className="px-6 py-5">

                  <span className={`
                    inline-flex
                    items-center
                    gap-1.5
                    px-3 py-1.5
                    rounded-full
                    text-xs
                    font-bold
                    ${
                      estiloEstado[vendedor.estado] ||
                      "bg-slate-100 text-slate-600"
                    }
                  `}>

                    <span className="w-1.5 h-1.5 rounded-full bg-current" />

                    {
                      textoEstado[vendedor.estado] ||
                      vendedor.estado
                    }

                  </span>

                </td>


                {/* ACCIONES */}
                <td className="px-6 py-5 text-right">

                  {vendedor.estado === "pendiente" ? (

                    <Link
                      href={`/admin/vendedores/nuevo?id=${vendedor.id}`}
                    >
                      <button className="
                        inline-flex
                        items-center
                        gap-2
                        bg-blue-50
                        hover:bg-blue-100
                        text-blue-700
                        px-4 py-2
                        rounded-xl
                        text-xs
                        font-bold
                        transition
                      ">
                        Revisar solicitud
                        <span>→</span>
                      </button>
                    </Link>

                  ) : (

                    <button
                      onClick={() =>
                        cambiarEstado(
                          vendedor.id,
                          vendedor.estado === "activo"
                            ? "suspendido"
                            : "activo"
                        )
                      }
                      disabled={
                        actualizandoId === vendedor.id
                      }
                      className={`
                        inline-flex
                        items-center
                        justify-center
                        min-w-[100px]
                        px-4 py-2
                        rounded-xl
                        text-xs
                        font-bold
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        ${
                          vendedor.estado === "activo"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }
                      `}
                    >
                      {actualizandoId === vendedor.id
                        ? "Actualizando..."
                        : vendedor.estado === "activo"
                        ? "Suspender"
                        : "Reactivar"}
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ================= TARJETAS MÓVILES ================= */}
      <div className="md:hidden flex flex-col gap-3">

        {vendedores.map((vendedor) => (

          <div
            key={vendedor.id}
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              p-4
              shadow-sm
            "
          >

            {/* CABECERA */}
            <div className="flex items-start gap-3">

              <div className="
                w-11 h-11
                flex-shrink-0
                rounded-xl
                bg-blue-50
                text-blue-700
                flex items-center justify-center
                font-bold
              ">
                {vendedor.nombreNegocio
                  ?.charAt(0)
                  .toUpperCase() || "N"}
              </div>

              <div className="flex-1 min-w-0">

                <p className="
                  font-bold
                  text-slate-800
                  truncate
                ">
                  {vendedor.nombreNegocio}
                </p>

                <p className="
                  text-sm
                  text-slate-500
                  truncate
                ">
                  {vendedor.nombre}
                </p>

              </div>

              <span className={`
                flex-shrink-0
                px-2.5 py-1
                rounded-full
                text-[11px]
                font-bold
                ${
                  estiloEstado[vendedor.estado] ||
                  "bg-slate-100 text-slate-600"
                }
              `}>
                {textoEstado[vendedor.estado] ||
                  vendedor.estado}
              </span>

            </div>


            {/* CORREO */}
            <div className="
              mt-4
              px-3 py-2.5
              bg-slate-50
              rounded-xl
            ">

              <p className="text-[11px] text-slate-400 font-semibold uppercase">
                Correo
              </p>

              <p className="
                text-sm
                text-slate-600
                mt-0.5
                truncate
              ">
                {vendedor.correo}
              </p>

            </div>


            {/* ACCIÓN */}
            <div className="mt-3">

              {vendedor.estado === "pendiente" ? (

                <Link
                  href={`/admin/vendedores/nuevo?id=${vendedor.id}`}
                  className="block"
                >
                  <button className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                    transition
                  ">
                    Revisar solicitud →
                  </button>
                </Link>

              ) : (

                <button
                  onClick={() =>
                    cambiarEstado(
                      vendedor.id,
                      vendedor.estado === "activo"
                        ? "suspendido"
                        : "activo"
                    )
                  }
                  disabled={
                    actualizandoId === vendedor.id
                  }
                  className={`
                    w-full
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                    transition
                    disabled:opacity-50
                    ${
                      vendedor.estado === "activo"
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }
                  `}
                >
                  {actualizandoId === vendedor.id
                    ? "Actualizando..."
                    : vendedor.estado === "activo"
                    ? "Suspender vendedor"
                    : "Reactivar vendedor"}
                </button>

              )}

            </div>

          </div>

        ))}

      </div>
    </>
  )}

</main>

  </div>
);
}