/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  fecha: any;
}

const formatearFecha = (fechaInput: any) => {
  if (!fechaInput) return "Fecha no disponible";
  if (typeof fechaInput === "object" && fechaInput._seconds) {
    return new Date(fechaInput._seconds * 1000).toLocaleDateString();
  }
  const fechaParsed = new Date(fechaInput);
  if (!isNaN(fechaParsed.getTime())) {
    return fechaParsed.toLocaleDateString();
  }
  return "Fecha no disponible";
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
        const res = await fetch("http://localhost:3001/pagos");
        if (!res.ok) return;

        const data = await res.json();
        
        const misPagos = data.filter((p: any) => {
          const idVenta = p.usuarioId || p.clienteId || p.cliente?.id;
          return String(idVenta) === String(idUsuarioActual);
        });
        
        const pedidosAgrupadosMap: { [key: string]: Pedido } = {};

        misPagos.forEach((p: any, index: number) => {
          const pedidoIdKey = p.pedidoId || p.id || `pedido-${index}`;
          
          let productosDelPago: ProductoPedido[] = [];

          if (p.productos && Array.isArray(p.productos)) {
            productosDelPago = p.productos.map((prod: any, prodIdx: number) => ({
              id: prod.id || `${pedidoIdKey}-prod-${prodIdx}`,
              nombre: prod.nombre || "Producto",
              precio: Number(prod.precio) || 0,
              cantidad: Number(prod.cantidad) || 1,
              tiendaNombre: prod.tiendaNombre || ""
            }));
          } else {
            // Extraer la cantidad si viene en el texto (ej: "kids de belleza x2")
            let textoProducto = p.producto || "Producto";
            let cantidadExtraida = 1;

            const matchCantidad = textoProducto.match(/x(\d+)/i);
            if (matchCantidad) {
              cantidadExtraida = parseInt(matchCantidad[1], 10);
              textoProducto = textoProducto.replace(/x\d+/gi, "").trim();
            }

            const montoTotalDoc = Number(p.monto) || 0;
            const precioUnitarioEstimado = cantidadExtraida > 0 ? montoTotalDoc / cantidadExtraida : montoTotalDoc;

            productosDelPago = [{
              id: `${pedidoIdKey}-prod-0`,
              nombre: textoProducto,
              precio: precioUnitarioEstimado,
              cantidad: cantidadExtraida,
              tiendaNombre: "Tienda"
            }];
          }

          const totalVal = Number(p.montoTotal || p.monto) || 0;

          if (pedidosAgrupadosMap[pedidoIdKey]) {
            pedidosAgrupadosMap[pedidoIdKey].productos.push(...productosDelPago);
          } else {
            pedidosAgrupadosMap[pedidoIdKey] = {
              id: pedidoIdKey,
              cliente: { id: idUsuarioActual, nombre: usuario.nombre },
              productos: productosDelPago,
              total: totalVal,
              metodoPago: p.metodo || p.metodoPago || "Transferencia",
              comprobante: p.comprobante || "",
              tipoEntrega: p.tipoEntrega || "No definido",
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

        setPedidos(Object.values(pedidosAgrupadosMap));

      } catch (error) {
        console.error("Error al cargar pedidos:", error);
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
      <div style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "linear-gradient(135deg, #e0f2fe, #cffafe)",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1px solid #7dd3fc",
        flexWrap: "wrap"
      }}>
        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#0c4a6e" }}>
          📅 Filtrar por fecha:
        </label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #38bdf8",
            background: "#fff",
            color: "#0c4a6e",
            fontWeight: "600",
            outline: "none"
          }}
        />
        {fechaFiltro && (
          <button
            onClick={() => setFechaFiltro("")}
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#fff",
              background: "#0284c7",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer"
            }}
          >
            ✕ Quitar filtro
          </button>
        )}
      </div>

      {pedidos.length === 0 ? (
        <div className="pedido-vacio">
          <p>Todavía no tienes pedidos realizados.</p>
          <Link href="/cliente/tiendas">Explorar tiendas</Link>
        </div>
      ) : (
        pedidos
          .filter((pedido) => {
            if (!fechaFiltro) return true;
            const fechaPedido = pedido.fecha && pedido.fecha._seconds
              ? new Date(pedido.fecha._seconds * 1000)
              : new Date(pedido.fecha);
            const fechaISO = fechaPedido.toISOString().split("T")[0];
            return fechaISO === fechaFiltro;
          })
          .map((pedido, index) => {
          const totalSeguro = Number(pedido.total) || 0;

          return (
            <div key={`${pedido.id}-${index}`} className="pedido-card">
              <h2>Pedido #{pedido.id ? pedido.id.slice(0, 8) : "N/D"}</h2>
              <p>📅 Fecha: {formatearFecha(pedido.fecha)}</p>
              <p>💳 Método de pago: {pedido.metodoPago}</p>
              {pedido.comprobante && pedido.comprobante !== "sin_comprobante.jpg" ? (
                <p>
                  📎 Comprobante:{" "}
                  <a href={pedido.comprobante} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", fontWeight: "bold" }}>
                    Ver imagen
                  </a>
                </p>
              ) : (
                <p style={{ color: "#d97706", fontWeight: "600" }}>📎 Sin comprobante</p>
              )}
              <p>🔎 Estado: <strong>{pedido.estado}</strong></p>
              <p>🚚 Entrega: <strong>{pedido.tipoEntrega}</strong> {pedido.cooperativa ? `(${pedido.cooperativa})` : ""}</p>

              <h3>Productos:</h3>
              {pedido.productos?.map((producto, idx) => (
                <div key={`${producto.id}-${idx}`} className="producto-pedido">
                  <span>{producto.nombre} x {producto.cantidad}</span>
                  <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
                </div>
              ))}

              <hr style={{ margin: "10px 0" }} />

              <h3 style={{ color: "#0070f3" }}>
                Total Pagado: ${totalSeguro.toFixed(2)}
              </h3>
            </div>
          
          );
        })
      )}
    </div>
  );
}