"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface ProductoBackend {
  id?: string;
  nombre?: string;
  precio?: number;
  cantidad?: number;
  tiendaNombre?: string;
}

interface PagoBackend {
  id: string;
  pedidoId?: string;
  usuarioId?: string;
  clienteId?: string;
  cliente?: { id?: string };
  producto?: string;
  productos?: ProductoBackend[];
  monto?: number;
  montoTotal?: number;
  metodo?: string;
  metodoPago?: string;
  tipoEntrega?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  referencia?: string;
  cooperativa?: string;
  ciudadDestino?: string;
  comprobante?: string;
  estado?: string;
  fecha?: Timestamp | string;
  anticipo?: number;
  saldoPendiente?: number;
}

import "./pedido.css";
import { useRouter } from "next/navigation";

interface ProductoPedido {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tiendaNombre?: string;
}

interface Pedido {
  comprobante?: string;
  id: string;
  cliente: {
    id?: string;
    nombre?: string;
  };
  productos: ProductoPedido[];
  total: number;
  metodoPago: string;
  tipoEntrega?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  referencia?: string;
  cooperativa?: string;
  ciudadDestino?: string;
  estado: string;
  fecha: Timestamp | string | null;
}

/* =========================================================
   CORRECCIÓN DE FECHA
   Se mantiene todo lo demás igual.
   ========================================================= */

const formatearFecha = (
  fechaInput: Timestamp | string | null | undefined
) => {
  if (!fechaInput) return "Fecha no disponible";

  let fecha: Date;

  // Fecha proveniente de Firestore como Timestamp serializado
  if (
    typeof fechaInput === "object" &&
    "_seconds" in fechaInput &&
    typeof fechaInput._seconds === "number"
  ) {
    fecha = new Date(fechaInput._seconds * 1000);
  } else if (typeof fechaInput === "string") {
    fecha = new Date(fechaInput);
  } else {
    return "Fecha no disponible";
  }

  if (isNaN(fecha.getTime())) {
    return "Fecha no disponible";
  }

  return fecha.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function PedidosCliente() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    const cargarPedidos = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setPedidos([]);
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);
      const idUsuarioActual = usuario.id || usuario._id;

      try {
        const res = await fetch("http://brown-lark-804410.hostingersite.com/pagos");

        if (!res.ok) return;

        const data = await res.json();

        const misPagos = data.filter((p: PagoBackend) => {
          const idVenta =
            p.usuarioId || p.clienteId || p.cliente?.id;

          return String(idVenta) === String(idUsuarioActual);
        });

        const pedidosAgrupadosMap: {
          [key: string]: Pedido;
        } = {};

        misPagos.forEach((p: PagoBackend, index: number) => {
          const pedidoIdKey =
            p.pedidoId || p.id || `pedido-${index}`;

          let productosDelPago: ProductoPedido[] = [];

          if (p.productos && Array.isArray(p.productos)) {
            productosDelPago = p.productos.map(
              (prod: ProductoBackend, prodIdx: number) => ({
                id:
                  prod.id ||
                  `${pedidoIdKey}-prod-${prodIdx}`,
                nombre: prod.nombre || "Producto",
                precio: Number(prod.precio) || 0,
                cantidad: Number(prod.cantidad) || 1,
                tiendaNombre: prod.tiendaNombre || "",
              })
            );
          } else {
            // Extraer la cantidad si viene en el texto
            // (ej: "kids de belleza x2")
            let textoProducto = p.producto || "Producto";
            let cantidadExtraida = 1;

            const matchCantidad =
              textoProducto.match(/x(\d+)/i);

            if (matchCantidad) {
              cantidadExtraida = parseInt(
                matchCantidad[1],
                10
              );

              textoProducto = textoProducto
                .replace(/x\d+/gi, "")
                .trim();
            }

            const montoTotalDoc = Number(p.monto) || 0;

            const precioUnitarioEstimado =
              cantidadExtraida > 0
                ? montoTotalDoc / cantidadExtraida
                : montoTotalDoc;

            productosDelPago = [
              {
                id: `${pedidoIdKey}-prod-0`,
                nombre: textoProducto,
                precio: precioUnitarioEstimado,
                cantidad: cantidadExtraida,
                tiendaNombre: "Tienda",
              },
            ];
          }

          const totalVal =
            Number(p.montoTotal || p.monto) || 0;

          if (pedidosAgrupadosMap[pedidoIdKey]) {
            pedidosAgrupadosMap[pedidoIdKey].productos.push(
              ...productosDelPago
            );
          } else {
            pedidosAgrupadosMap[pedidoIdKey] = {
              id: pedidoIdKey,
              cliente: {
                id: idUsuarioActual,
                nombre: usuario.nombre,
              },
              productos: productosDelPago,
              total: totalVal,
              metodoPago:
                p.metodo ||
                p.metodoPago ||
                "Transferencia",
              comprobante: p.comprobante || "",
              tipoEntrega:
                p.tipoEntrega || "No definido",
              provincia: p.provincia || "",
              ciudad: p.ciudad || "",
              direccion: p.direccion || "",
              referencia: p.referencia || "",
              cooperativa: p.cooperativa || "",
              ciudadDestino: p.ciudadDestino || "",
              estado: p.estado || "pendiente",
              fecha: p.fecha || null,
            };
          }
        });

        setPedidos(
          Object.values(pedidosAgrupadosMap)
        );
      } catch (error) {
        console.error(
          "Error al cargar pedidos:",
          error
        );
      }
    };

    cargarPedidos();
  }, []);

  return (
    <div className="pedidos-container">
      <button
        onClick={() => router.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        ← Volver
      </button>

      <h1>📦 Mis pedidos</h1>
      <div className="filtro-fecha">
  <div className="filtro-fecha-contenido">
    <div className="filtro-icono">📅</div>

```
<div className="filtro-texto">
  <label htmlFor="fecha-pedido">
    Filtrar pedidos
  </label>
  <span>
    Consulta tus pedidos por fecha
  </span>
</div>

<input
  id="fecha-pedido"
  type="date"
  value={fechaFiltro}
  onChange={(e) =>
    setFechaFiltro(e.target.value)
  }
  className="fecha-input"
/>

{fechaFiltro && (
  <button
    onClick={() => setFechaFiltro("")}
    className="quitar-filtro"
    type="button"
  >
    ✕ Limpiar
  </button>
)}
```

  </div>

{fechaFiltro && ( <div className="fecha-seleccionada">
Mostrando pedidos del{" "} <strong>
{new Date(
`${fechaFiltro}T00:00:00`
).toLocaleDateString("es-EC", {
day: "2-digit",
month: "long",
year: "numeric",
})} </strong> </div>
)}

</div>


      


      {pedidos.length === 0 ? (
        <div className="pedido-vacio">
          <p>
            Todavía no tienes pedidos realizados.
          </p>

          <Link href="/cliente/tiendas">
            Explorar tiendas
          </Link>
        </div>
      ) : (
        pedidos
          .filter((pedido) => {
            if (!fechaFiltro) return true;

            if (!pedido.fecha) return false;

            let fechaPedido: Date;

            /*
             * CORRECCIÓN:
             * No usamos toISOString() para comparar
             * la fecha porque convierte a UTC y puede
             * cambiar el día.
             */
            if (
              typeof pedido.fecha === "object" &&
              "_seconds" in pedido.fecha &&
              typeof pedido.fecha._seconds === "number"
            ) {
              fechaPedido = new Date(
                pedido.fecha._seconds * 1000
              );
            } else if (
              typeof pedido.fecha === "string"
            ) {
              fechaPedido = new Date(pedido.fecha);
            } else {
              return false;
            }

            if (isNaN(fechaPedido.getTime())) {
              return false;
            }

            /*
             * Obtenemos año, mes y día usando la zona
             * horaria local del navegador (Ecuador).
             */
            const año = fechaPedido.getFullYear();

            const mes = String(
              fechaPedido.getMonth() + 1
            ).padStart(2, "0");

            const dia = String(
              fechaPedido.getDate()
            ).padStart(2, "0");

            const fechaLocal =
              `${año}-${mes}-${dia}`;

            return fechaLocal === fechaFiltro;
          })
          .map((pedido, index) => {
            const totalSeguro =
              Number(pedido.total) || 0;

            return (
              <div
                key={`${pedido.id}-${index}`}
                className="pedido-card"
              >
                <h2>
                  Pedido #
                  {pedido.id
                    ? pedido.id.slice(0, 8)
                    : "N/D"}
                </h2>

                <p>
                  📅 Fecha:{" "}
                  {formatearFecha(pedido.fecha)}
                </p>

                <p>
                  💳 Método de pago:{" "}
                  {pedido.metodoPago}
                </p>

                {pedido.comprobante &&
                pedido.comprobante !==
                  "sin_comprobante.jpg" ? (
                  <p>
                    📎 Comprobante:{" "}
                    <a
                      href={pedido.comprobante}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0284c7",
                        fontWeight: "bold",
                      }}
                    >
                      Ver imagen
                    </a>
                  </p>
                ) : (
                  <p
                    style={{
                      color: "#d97706",
                      fontWeight: "600",
                    }}
                  >
                    📎 Sin comprobante
                  </p>
                )}

                <p>
                  🔎 Estado:{" "}
                  <strong>{pedido.estado}</strong>
                </p>

                <p>
                  🚚 Entrega:{" "}
                  <strong>
                    {pedido.tipoEntrega}
                  </strong>{" "}
                  {pedido.cooperativa
                    ? `(${pedido.cooperativa})`
                    : ""}
                </p>

                <h3>Productos:</h3>

                {pedido.productos?.map(
                  (producto, idx) => (
                    <div
                      key={`${producto.id}-${idx}`}
                      className="producto-pedido"
                    >
                      <span>
                        {producto.nombre} x{" "}
                        {producto.cantidad}
                      </span>

                      <span>
                        $
                        {(
                          producto.precio *
                          producto.cantidad
                        ).toFixed(2)}
                      </span>
                    </div>
                  )
                )}

                <hr
                  style={{
                    margin: "10px 0",
                  }}
                />

                <h3
                  style={{
                    color: "#0070f3",
                  }}
                >
                  Total Pagado: $
                  {totalSeguro.toFixed(2)}
                </h3>
              </div>
            );
          })
      )}
    </div>
  );
}