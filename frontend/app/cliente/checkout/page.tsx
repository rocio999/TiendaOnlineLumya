"use client";

import Link from "next/link";
import "./checkout.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductoCheckout {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tiendaNombre: string;
  vendedorId: string;
  peso?: number;
}

export default function Checkout() {
  const [metodoPago, setMetodoPago] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [envioAceptado, setEnvioAceptado] = useState(false);
  const [tipoServientrega, setTipoServientrega] = useState("domicilio");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [cooperativa, setCooperativa] = useState("");
  const [ciudadDestino, setCiudadDestino] = useState("");
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  
  const router = useRouter();

  const productos: ProductoCheckout[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("carritoPago") || "[]")
      : [];

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const entregaGuardada = localStorage.getItem("tipoEntregaSeleccionado");
      const envioGuardado = localStorage.getItem("costoEnvioSeleccionado");

      if (entregaGuardada) {
        setTipoEntrega(entregaGuardada);
      }
      if (envioGuardado) {
        setCostoEnvio(parseFloat(envioGuardado) || 0);
      }
    }
  }, []);

  const totalGeneral = subtotal + costoEnvio;

  const [datosVendedor, setDatosVendedor] = useState<{ 
    nombreNegocio: string; 
    banco: string; 
    numeroCuenta: string; 
    cedula: string;
    whatsapp?: string; 
  } | null>(null);

  useEffect(() => {
    const cargarVendedor = async () => {
      if (productos.length === 0) return;
      const vendedorId = productos[0].vendedorId;
      if (!vendedorId) return;
      try {
        const res = await fetch(`http://localhost:3001/vendedores/${vendedorId}`);
        const data = await res.json();
        if (res.ok) {
          setDatosVendedor({
            nombreNegocio: data.nombreNegocio || data.nombre || "Tienda",
            banco: data.banco || "No especificado",
            numeroCuenta: data.numeroCuenta || "No especificado",
            cedula: data.cedula || "No especificado",
            whatsapp: data.whatsapp || "593900000000",
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del vendedor:", error);
      }
    };
    cargarVendedor();
  }, [productos]);

  const confirmarCompra = async () => {
    if (!metodoPago) {
      alert("Seleccione un método de pago");
      return;
    }

    if (!tipoEntrega) {
      alert("Seleccione un método de entrega");
      return;
    }

    if (!envioAceptado && costoEnvio > 0) {
      alert("Debe aceptar el cargo del costo de envío antes de proceder.");
      return;
    }

    if (!terminosAceptados) {
      alert("Debe confirmar que está de acuerdo con todos los campos antes de proceder la compra.");
      return;
    }

    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      alert("Debe iniciar sesión para comprar");
      router.push("/login");
      return;
    }

    const cliente = JSON.parse(usuario);
    const pedidoId = crypto.randomUUID();
    const entregaFinal = tipoEntrega === "Servientrega" ? `Servientrega (${tipoServientrega})` : tipoEntrega;
    const vendedorId = productos.length > 0 ? productos[0].vendedorId : "";
    const nombreProductos = productos.map(p => `${p.nombre} x${p.cantidad}`).join(", ");

    const pedido = {
      id: pedidoId,
      cliente,
      productos,
      subtotal,
      costoEnvio,
      total: totalGeneral,
      metodoPago,
      tipoEntrega: entregaFinal,
      provincia,
      ciudad,
      direccion,
      referencia,
      cooperativa,
      ciudadDestino,
      estado: "pendiente",
      fecha: new Date().toISOString()
    };

    try {
      // 1. Guardar localmente
      const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos") || "[]");
      pedidosGuardados.push(pedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
      
      // 2. Enviar al backend incluyendo correctamente subtotal y costo de envío (envio)
      const res = await fetch("http://localhost:3001/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: cliente.id,
          vendedorId: vendedorId,
          pedidoId: pedidoId,
          producto: nombreProductos,
          subtotal: subtotal,
          envio: costoEnvio,
          monto: totalGeneral,
          metodo: metodoPago,
          tipoEntrega: entregaFinal,
          provincia,
          ciudad,
          direccion,
          referencia,
          cooperativa,
          ciudadDestino
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al procesar el pago en el servidor");
      }

      localStorage.removeItem("carritoPago");
      localStorage.removeItem("tipoEntregaSeleccionado");
      localStorage.removeItem("costoEnvioSeleccionado");
      alert("✅ Compra realizada correctamente");
      router.push("/cliente/pedidos");

    } catch (error: any) {
      console.error("Error creando compra", error);
      alert("Error al procesar la compra: " + error.message);
    }
  };

  return (
    <div className="checkout-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Finalizar compra</h1>
        <Link 
          href="/cliente/carrito" 
          style={{ 
            padding: "8px 14px", 
            background: "#f0f0f0", 
            border: "1px solid #ccc", 
            borderRadius: "5px", 
            textDecoration: "none", 
            color: "#333", 
            fontSize: "14px", 
            fontWeight: "bold" 
          }}
        >
          ← Volver al carrito
        </Link>
      </div>

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

              <div className="checkout-item" style={{ borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* COSTO DE ENVÍO CON BOTÓN DE ACEPTACIÓN AL LADO */}
              <div className="checkout-item" style={{ alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>Envío ({tipoEntrega || "Seleccionado"})</span>
                  <strong style={{ color: "#333" }}>${costoEnvio.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setEnvioAceptado(!envioAceptado)}
                  style={{
                    padding: "6px 12px",
                    background: envioAceptado ? "#28a745" : "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    transition: "background 0.2s"
                  }}
                >
                  {envioAceptado ? "Cargo Aceptado ✅" : "Aceptar cargo"}
                </button>
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="checkout-card mt-4">
                <h2>💳 Método de pago</h2>

                <label>
                  <input
                    type="radio"
                    name="pago"
                    value="Transferencia"
                    checked={metodoPago === "Transferencia"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  {" "}Transferencia bancaria (Pago Total)
                </label>

                {metodoPago === "Transferencia" && (
                  <div className="transferencia-card" style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", marginTop: "8px", background: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ flex: 1 }}>
                      <h3>Datos para transferencia</h3>
                      {datosVendedor ? (
                        <>
                          <p>🏪 Tienda: {datosVendedor.nombreNegocio}</p>
                          <p>🏦 Banco: {datosVendedor.banco}</p>
                          <p>💳 Cuenta: {datosVendedor.numeroCuenta}</p>
                          <p>📱 Cédula/RUC: {datosVendedor.cedula}</p>
                          <p style={{ fontWeight: "bold", color: "#0070f3" }}>Total a pagar: ${totalGeneral.toFixed(2)}</p>
                        </>
                      ) : (
                        <p>Cargando datos de la tienda...</p>
                      )}
                      <p className="nota">Realice la transferencia total y envíe el comprobante por WhatsApp.</p>
                    </div>
                    <div style={{ textAlign: "center", background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
                      <p style={{ fontSize: "12px", marginBottom: "5px", fontWeight: "bold" }}>QR / WhatsApp</p>
                      <div style={{ width: "80px", height: "80px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px auto", fontSize: "10px", color: "#666" }}>
                        [Código QR]
                      </div>
                      <a 
                        href={`https://wa.me/${datosVendedor?.whatsapp || '593900000000'}?text=${encodeURIComponent(`Hola, aquí adjunto mi comprobante de transferencia total por un valor de $${totalGeneral.toFixed(2)}.`)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: "11px", color: "#25D366", fontWeight: "bold", textDecoration: "underline" }}
                      >
                        Enviar por WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                <label className="block mt-4">
                  <input
                    type="radio"
                    name="pago"
                    value="DeUna"
                    checked={metodoPago === "DeUna"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  {" "}Pago con DeUna (Pago Total)
                </label>

                {metodoPago === "DeUna" && (
                  <div className="deuna-card" style={{ borderLeft: "4px solid #673ab7", paddingLeft: "10px", marginTop: "8px", background: "#f3e5f5", padding: "10px", borderRadius: "6px" }}>
                    <h3>Pago con DeUna</h3>
                    <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                      Escanee el código QR de DeUna de la tienda para realizar el pago completo del pedido.
                    </p>
                    
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", marginTop: "10px", background: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                      <div style={{ flex: 1 }}>
                        <h4>Datos DeUna / Celular:</h4>
                        {datosVendedor ? (
                          <>
                            <p>🏪 Tienda: {datosVendedor.nombreNegocio}</p>
                            <p>📱 Celular DeUna: {datosVendedor.numeroCuenta}</p>
                            <p style={{ fontWeight: "bold", color: "#673ab7" }}>Total a pagar: ${totalGeneral.toFixed(2)}</p>
                          </>
                        ) : (
                          <p>Cargando datos de la tienda...</p>
                        )}
                        <p className="nota">Realice el pago total y envíe el comprobante por WhatsApp.</p>
                      </div>
                      <div style={{ textAlign: "center", background: "#f9f9f9", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
                        <p style={{ fontSize: "12px", marginBottom: "5px", fontWeight: "bold" }}>QR DeUna</p>
                        <div style={{ width: "80px", height: "80px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px auto", fontSize: "10px", color: "#666" }}>
                          [QR DeUna]
                        </div>
                        <a 
                          href={`https://wa.me/${datosVendedor?.whatsapp || '593900000000'}?text=${encodeURIComponent(`Hola, aquí adjunto el comprobante de mi pago con DeUna por un valor total de $${totalGeneral.toFixed(2)}.`)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: "11px", color: "#25D366", fontWeight: "bold", textDecoration: "underline" }}
                        >
                          Enviar por WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MÉTODO DE ENTREGA */}
              <div className="checkout-card mt-4">
                <h2>🚚 Método de entrega</h2>

                <label>
                  <input
                    type="radio"
                    name="entrega"
                    value="Servientrega"
                    checked={tipoEntrega === "Servientrega"}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                  />
                  {" "}Servientrega
                </label>

                {tipoEntrega === "Servientrega" && (
                  <div className="entrega-card">
                    <h3>🚚 Datos para el envío por Servientrega</h3>

                    <label>Provincia</label>
                    <input
                      type="text"
                      placeholder="Ej. Pichincha"
                      value={provincia}
                      onChange={(e) => setProvincia(e.target.value)}
                    />

                    <label>Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ej. Quito"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                    />

                    <label>Tipo de entrega</label>
                    <select 
                      value={tipoServientrega} 
                      onChange={(e) => setTipoServientrega(e.target.value)}
                      style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value="domicilio">Dirección a domicilio</option>
                      <option value="agencia">Agencia de Servientrega</option>
                    </select>

                    {tipoServientrega === "domicilio" ? (
                      <>
                        <label>Dirección exacta del domicilio (Calles / N° de casa)</label>
                        <input
                          type="text"
                          placeholder="Ej. Av. Amazonas y Corella, N34-12"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        />
                        <label>Referencia</label>
                        <input
                          type="text"
                          placeholder="Ej. Frente al parque, casa blanca de dos pisos"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <label>Dirección exacta de la agencia de Servientrega</label>
                        <input
                          type="text"
                          placeholder="Ej. Agencia Servientrega Centro Comercial X"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        />
                      </>
                    )}
                  </div>
                )}

                <label className="block mt-4">
                  <input
                    type="radio"
                    name="entrega"
                    value="Cooperativa"
                    checked={tipoEntrega === "Cooperativa"}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                  />
                  {" "}Cooperativa de transporte
                </label>

                {tipoEntrega === "Cooperativa" && (
                  <div className="entrega-card">
                    <h3>🚌 Datos del envío por Cooperativa</h3>

                    <label>Nombre del transporte / Cooperativa</label>
                    <input
                      type="text"
                      placeholder="Ej. Cooperativa Loja / Terminal Terrestre"
                      value={cooperativa}
                      onChange={(e) => setCooperativa(e.target.value)}
                    />

                    <label>Ciudad de destino</label>
                    <input
                      type="text"
                      placeholder="Ej. Loja"
                      value={ciudadDestino}
                      onChange={(e) => setCiudadDestino(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* VALIDACIÓN Y TÉRMINOS */}
              <div className="checkout-card mt-4" style={{ background: "#fffdf0", padding: "12px", border: "1px solid #ffeeba" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                  <input
                    type="checkbox"
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>Estoy de acuerdo con todos los campos y datos ingresados antes de proceder con la compra.</span>
                </label>
              </div>

              <button
                className="btn-confirmar"
                disabled={!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados || productos.length === 0}
                onClick={confirmarCompra}
                style={{ 
                  marginTop: "15px", 
                  width: "100%", 
                  padding: "12px", 
                  background: (!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados) ? "#ccc" : "#0070f3", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px", 
                  cursor: (!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados) ? "not-allowed" : "pointer", 
                  fontWeight: "bold" 
                }}
              >
                Confirmar compra
              </button>
            </>
          )}

          <hr style={{ margin: "20px 0" }} />

          <div className="checkout-total">
            <strong>Total General: ${totalGeneral.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}