/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./pedido.css";

interface ProductoPedido {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tiendaNombre?: string;
}

interface Pedido {
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
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

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
      <h1>📦 Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="pedido-vacio">
          <p>Todavía no tienes pedidos realizados.</p>
          <Link href="/cliente/tiendas">Explorar tiendas</Link>
        </div>
      ) : (
        pedidos.map((pedido, index) => {
          const totalSeguro = Number(pedido.total) || 0;

          return (
            <div key={`${pedido.id}-${index}`} className="pedido-card">
              <h2>Pedido #{pedido.id ? pedido.id.slice(0, 8) : "N/D"}</h2>
              <p>📅 Fecha: {formatearFecha(pedido.fecha)}</p>
              <p>💳 Método de pago: {pedido.metodoPago}</p>
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