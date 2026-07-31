"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import "./pedido.css";


interface Pedido {
  id: string;
  cliente: {
    nombre?: string;
    correo?: string;
  };
  productos: {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    tiendaNombre: string;
  }[];
  total: number;
  metodoPago: string;

  tipoEntrega: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  referencia?: string;
  cooperativa?: string;
  ciudadDestino?: string;

  estado: string;
  fecha: string;
}

export default function PedidosCliente() {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
}, []);

if (!mounted) {
  return null;
}

const pedidos: Pedido[] = JSON.parse(
  localStorage.getItem("pedidos") || "[]"
);

console.log(JSON.stringify(pedidos, null, 2));

  return (
    <div className="pedidos-container">
      <h1>📦 Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="pedido-vacio">
          <p>Todavía no tienes pedidos realizados.</p>
          <Link href="/cliente/tiendas">Explorar tiendas</Link>
        </div>
      ) : (
        pedidos.map((pedido: Pedido) => (
          <div key={pedido.id} className="pedido-card">
            <h2>Pedido #{pedido.id}</h2>

            <p>
              📅 Fecha: {new Date(pedido.fecha).toLocaleDateString()}
            </p>

            <p>
              💳 Pago: {pedido.metodoPago}
            </p>
            <p>
         🚚 Entrega: <strong>{pedido.tipoEntrega}</strong>
          </p>

            <p>
              📌 Estado: <strong>{pedido.estado}</strong>
            </p>
            {pedido.tipoEntrega === "Servientrega" && (
  <div className="detalle-entrega">

    <p>📍 Provincia: {pedido.provincia}</p>

    <p>🏙 Ciudad: {pedido.ciudad}</p>

    <p>🏠 Dirección: {pedido.direccion}</p>

    {pedido.referencia && (
      <p>📌 Referencia: {pedido.referencia}</p>
    )}

  </div>
)}
{pedido.tipoEntrega === "Cooperativa" && (
  <div className="detalle-entrega">

    <p>🚌 Cooperativa: {pedido.cooperativa}</p>

    <p>📍 Ciudad destino: {pedido.ciudadDestino}</p>

  </div>
)}

            <h3>Productos:</h3>

            {pedido.productos.map((producto) => (
              <div key={producto.id} className="producto-pedido">
                <span>
                  {producto.nombre} x {producto.cantidad}
                </span>
                <span>${producto.precio * producto.cantidad}</span>
              </div>
            ))}

            <hr />

            <h3>Total: ${pedido.total}</h3>
          </div>
        ))
      )}
    </div>
  );
}
