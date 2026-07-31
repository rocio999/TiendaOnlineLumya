"use client";

import { useState } from "react";
import Link from "next/link";
import "./pedido.css";

interface Pedido {
  id: number;
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
  estado: string;
  fecha: string;
}

export default function PedidosCliente() {
  // Estado tipado correctamente
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("pedidos") || "[]");
    }
    return [];
  });

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
              📌 Estado: <strong>{pedido.estado}</strong>
            </p>

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
