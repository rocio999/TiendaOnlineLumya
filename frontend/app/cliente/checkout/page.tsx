"use client";

import Link from "next/link";
import "./checkout.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductoCheckout {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tiendaNombre: string;
}

export default function Checkout() {
  const [metodoPago, setMetodoPago] = useState("");
  const router = useRouter();

  const productos: ProductoCheckout[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("carritoPago") || "[]")
      : [];

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const confirmarCompra = () => {
    if (!metodoPago) {
      alert("Seleccione un método de pago");
      return;
    }

    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      alert("Debe iniciar sesión para comprar");
      router.push("/login");
      return;
    }

    const pedido = {
      id: crypto.randomUUID(),
      cliente: JSON.parse(usuario),
      productos,
      total,
      metodoPago,
      anticipo: metodoPago === "Efectivo" ? 10 : 0,
      estado: "pendiente",
      fecha: new Date().toISOString(),
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidosGuardados.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
    localStorage.removeItem("carritoPago");

    alert("✅ Compra realizada correctamente. Puedes revisar tu pedido en Mis Pedidos.");
    router.push("/cliente/pedidos");
  };

  return (
    <div className="checkout-container">
      <h1>Finalizar compra</h1>

      <div className="checkout-grid">
        {/* Datos del cliente */}
        <div className="checkout-card">
          <h2>👤 Datos del cliente</h2>
          <label>Nombre completo</label>
          <input type="text" placeholder="Ingrese su nombre" />
          <label>Correo</label>
          <input type="email" placeholder="Ingrese su correo" />
        </div>

        {/* Resumen del pedido */}
        <div className="checkout-card">
          <h2>🛒 Resumen</h2>

          {productos.length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            <>
              {productos.map((p) => (
                <div key={p.id} className="checkout-item">
                  <span>{p.nombre} x {p.cantidad}</span>
                  <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                </div>
              ))}

              {/* Método de pago */}
              <div className="checkout-card">
                <h2>💳 Método de pago</h2>

                <label>
                  <input
                    type="radio"
                    name="pago"
                    value="Transferencia"
                    checked={metodoPago === "Transferencia"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  {" "}Transferencia bancaria
                </label>

                {metodoPago === "Transferencia" && (
                  <div className="transferencia-card">
                    <h3>Datos para transferencia</h3>
                    <p>🏦 Banco: Banco Pichincha</p>
                    <p>👤 Titular: Tienda Lumya</p>
                    <p>💳 Cuenta: 1234567890</p>
                    <p>📱 Cédula/RUC: 9999999999001</p>
                    <p className="nota">Realice la transferencia y conserve el comprobante.</p>
                  </div>
                )}

                <label className="block mt-4">
                  <input
                    type="radio"
                    name="pago"
                    value="Efectivo"
                    checked={metodoPago === "Efectivo"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  {" "}Pago en efectivo
                </label>

                {metodoPago === "Efectivo" && (
                  <div className="efectivo-card">
                    <h3>Pago en efectivo</h3>
                    <p>Para confirmar su pedido debe entregar un anticipo.</p>
                    <p className="anticipo">Anticipo requerido: $10.00</p>
                    <p className="nota">El valor restante se cancela al recibir el pedido.</p>
                  </div>
                )}

                <button
                  className="btn-confirmar"
                  disabled={!metodoPago || productos.length === 0}
                  onClick={confirmarCompra}
                >
                  Confirmar compra
                </button>
              </div>

              <hr />

              <div className="checkout-total">
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
