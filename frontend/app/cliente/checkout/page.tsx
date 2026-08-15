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
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);

  // Estados para los datos del cliente vinculados a los inputs
  const [nombreCliente, setNombreCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");
  
  const router = useRouter();

  const productos: ProductoCheckout[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("carritoPago") || "[]")
      : [];

  const subtotal = productos.reduce(
  (total, producto) =>
    total + Number(producto.precio) * Number(producto.cantidad),
  0
);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const entregaGuardada = localStorage.getItem("tipoEntregaSeleccionado");
      const envioGuardado = localStorage.getItem("costoEnvioSeleccionado");

      if (entregaGuardada) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTipoEntrega(entregaGuardada);
      }
      if (envioGuardado) {
        setCostoEnvio(parseFloat(envioGuardado) || 0);
      }

      // Cargar datos del usuario logueado en los inputs
      const usuarioStorage = localStorage.getItem("usuario");
      if (usuarioStorage) {
        try {
          const parsedUser = JSON.parse(usuarioStorage);
          setNombreCliente(parsedUser.nombre || parsedUser.name || "");
          setCorreoCliente(parsedUser.email || parsedUser.correo || "");
        } catch (e) {
          console.error("Error al parsear usuario", e);
        }
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
    qrDeUnaUrl?: string;
    qrUrl?: string;
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
            qrDeUnaUrl: data.qrDeUnaUrl || "",
            qrUrl: data.qrUrl || "",
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

    const clienteBase = JSON.parse(usuario);
    const cliente = {
      ...clienteBase,
      nombre: nombreCliente,
      correo: correoCliente
    };

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
      let comprobanteUrl = "";
      if (comprobanteFile) {
        setSubiendoComprobante(true);
        const formData = new FormData();
        formData.append("imagen", comprobanteFile);
        const resImagen = await fetch("http://localhost:3001/imagenes", {
          method: "POST",
          body: formData,
        });
        const dataImagen = await resImagen.json();
        comprobanteUrl = dataImagen.url || "";
        setSubiendoComprobante(false);
      }
      const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos") || "[]");
      pedidosGuardados.push(pedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
      
      const res = await fetch("http://localhost:3001/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: cliente.id,
          vendedorId: vendedorId,
          pedidoId: pedidoId,
          producto: nombreProductos,
          productos,
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
          ciudadDestino,
          cliente,
          comprobanteUrl
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

    } catch (error: unknown) {
      console.error("Error creando compra", error);
      alert("Error al procesar la compra: " + (error instanceof Error ? error.message : "Error desconocido"));
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Cabecera */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #eaeaea", paddingBottom: "15px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111", margin: 0 }}>Finalizar Compra</h1>
        <Link 
          href="/cliente/carrito" 
          style={{ 
            padding: "10px 16px", 
            background: "#fff", 
            border: "1px solid #d1d5db", 
            borderRadius: "8px", 
            textDecoration: "none", 
            color: "#374151", 
            fontSize: "14px", 
            fontWeight: "600",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.2s"
          }}
        >
          ← Volver al carrito
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* COLUMNA IZQUIERDA: Datos, Pago y Entrega */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Datos del cliente */}
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              👤 Datos del cliente
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Nombre completo</label>
                <input 
                  type="text" 
                  placeholder="Ingrese su nombre" 
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Correo electrónico</label>
                <input 
                  type="email" 
                  placeholder="Ingrese su correo" 
                  value={correoCliente}
                  onChange={(e) => setCorreoCliente(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              💳 Método de pago
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: `1px solid ${metodoPago === "Transferencia" ? "#2563eb" : "#e5e7eb"}`, borderRadius: "8px", background: metodoPago === "Transferencia" ? "#eff6ff" : "#f9fafb", cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="pago"
                  value="Transferencia"
                  checked={metodoPago === "Transferencia"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  style={{ accentColor: "#2563eb" }}
                />
                Transferencia bancaria (Pago Total)
              </label>

              {metodoPago === "Transferencia" && (
                <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                  <div style={{ flex: 1, fontSize: "13px", color: "#334155", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Datos para transferencia</h3>
                    {datosVendedor ? (
                      <>
                        <p>🏪 <strong>Tienda:</strong> {datosVendedor.nombreNegocio}</p>
                        <p>🏦 <strong>Banco:</strong> {datosVendedor.banco}</p>
                        <p>💳 <strong>Cuenta:</strong> {datosVendedor.numeroCuenta}</p>
                        <p>📱 <strong>Cédula/RUC:</strong> {datosVendedor.cedula}</p>
                        <p style={{ fontWeight: "700", color: "#2563eb", marginTop: "4px" }}>Total a pagar: ${totalGeneral.toFixed(2)}</p>
                      </>
                    ) : (
                      <p>Cargando datos de la tienda...</p>
                    )}
                    <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Realice la transferencia total y envíe el comprobante.</p>
                  </div>
                  <div style={{ textAlign: "center", background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: "11px", marginBottom: "6px", fontWeight: "700" }}>QR de Pago</p>
                    <div style={{ width: "76px", height: "76px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto", overflow: "hidden", borderRadius: "6px" }}>
                      {datosVendedor?.qrUrl ? (
                        <img src={datosVendedor.qrUrl} alt="QR de pago" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>[Sin QR]</span>
                      )}
                    </div>
                    <a 
                      href={`https://wa.me/${datosVendedor?.whatsapp || '593900000000'}?text=${encodeURIComponent(`Hola, aquí adjunto mi comprobante de transferencia total por un valor de $${totalGeneral.toFixed(2)}.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", textDecoration: "none", display: "block" }}
                    >
                      Enviar WhatsApp ↗
                    </a>
                  </div>
                </div>
              )}

              <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: `1px solid ${metodoPago === "DeUna" ? "#7c3aed" : "#e5e7eb"}`, borderRadius: "8px", background: metodoPago === "DeUna" ? "#f5f3ff" : "#f9fafb", cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="pago"
                  value="DeUna"
                  checked={metodoPago === "DeUna"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  style={{ accentColor: "#7c3aed" }}
                />
                Pago con DeUna (Pago Total)
              </label>

              {metodoPago === "DeUna" && (
                <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", background: "#faf5ff", padding: "16px", borderRadius: "8px", border: "1px solid #d8b4fe" }}>
                  <div style={{ flex: 1, fontSize: "13px", color: "#4c1d95", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#581c87", marginBottom: "4px" }}>Pago con DeUna</h3>
                    {datosVendedor ? (
                      <>
                        <p>🏪 <strong>Tienda:</strong> {datosVendedor.nombreNegocio}</p>
                        <p>📱 <strong>Celular DeUna:</strong> {datosVendedor.numeroCuenta}</p>
                        <p style={{ fontWeight: "700", color: "#7c3aed", marginTop: "4px" }}>Total a pagar: ${totalGeneral.toFixed(2)}</p>
                      </>
                    ) : (
                      <p>Cargando datos de la tienda...</p>
                    )}
                    <p style={{ fontSize: "11px", color: "#6b21a8", marginTop: "4px" }}>Escanee el QR y envíe su comprobante.</p>
                  </div>
                  <div style={{ textAlign: "center", background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
                    <p style={{ fontSize: "11px", marginBottom: "6px", fontWeight: "700" }}>QR DeUna</p>
                    <div style={{ width: "76px", height: "76px", background: "#f8f7fc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto", overflow: "hidden", borderRadius: "6px" }}>
                      {datosVendedor?.qrDeUnaUrl ? (
                        <img src={datosVendedor.qrDeUnaUrl} alt="QR DeUna" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>[Sin QR]</span>
                      )}
                    </div>
                    <a 
                      href={`https://wa.me/${datosVendedor?.whatsapp || '593900000000'}?text=${encodeURIComponent(`Hola, aquí adjunto el comprobante de mi pago con DeUna por un valor total de $${totalGeneral.toFixed(2)}.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", textDecoration: "none", display: "block" }}
                    >
                      Enviar WhatsApp ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Método de entrega */}
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              🚚 Método de entrega
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: `1px solid ${tipoEntrega === "Servientrega" ? "#2563eb" : "#e5e7eb"}`, borderRadius: "8px", background: tipoEntrega === "Servientrega" ? "#eff6ff" : "#f9fafb", cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="entrega"
                  value="Servientrega"
                  checked={tipoEntrega === "Servientrega"}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                  style={{ accentColor: "#2563eb" }}
                />
                Servientrega
              </label>

              {tipoEntrega === "Servientrega" && (
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Datos para Servientrega</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Provincia</label>
                      <input
                        type="text"
                        placeholder="Ej. Pichincha"
                        value={provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Ciudad</label>
                      <input
                        type="text"
                        placeholder="Ej. Quito"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Tipo de entrega</label>
                    <select 
                      value={tipoServientrega} 
                      onChange={(e) => setTipoServientrega(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="domicilio">Dirección a domicilio</option>
                      <option value="agencia">Agencia de Servientrega</option>
                    </select>
                  </div>

                  {tipoServientrega === "domicilio" ? (
                    <>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Dirección exacta</label>
                        <input
                          type="text"
                          placeholder="Ej. Av. Amazonas y Corella"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Referencia</label>
                        <input
                          type="text"
                          placeholder="Ej. Casa blanca de dos pisos"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Agencia de destino</label>
                      <input
                        type="text"
                        placeholder="Ej. Agencia Centro Comercial"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                  )}
                </div>
              )}

              <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: `1px solid ${tipoEntrega === "Cooperativa" ? "#2563eb" : "#e5e7eb"}`, borderRadius: "8px", background: tipoEntrega === "Cooperativa" ? "#eff6ff" : "#f9fafb", cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="entrega"
                  value="Cooperativa"
                  checked={tipoEntrega === "Cooperativa"}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                  style={{ accentColor: "#2563eb" }}
                />
                Cooperativa de transporte
              </label>

              {tipoEntrega === "Cooperativa" && (
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Datos por Cooperativa</h3>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Cooperativa</label>
                    <input
                      type="text"
                      placeholder="Ej. Cooperativa Loja"
                      value={cooperativa}
                      onChange={(e) => setCooperativa(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Ciudad destino</label>
                    <input
                      type="text"
                      placeholder="Ej. Loja"
                      value={ciudadDestino}
                      onChange={(e) => setCiudadDestino(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Resumen de productos y confirmación */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", position: "sticky", top: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            🛒 Resumen del pedido
          </h2>

          {productos.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>No hay productos en el carrito</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                {productos.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4b5563" }}>
                    <span>{p.nombre} <strong style={{ color: "#111" }}>x {p.cantidad}</strong></span>
                    <span style={{ fontWeight: "600", color: "#111" }}>${(p.precio * p.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "4px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#374151" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: "600" }}>${subtotal.toFixed(2)}</span>
              </div>

              {/* COSTO DE ENVÍO CON BOTÓN */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", flexDirection: "column", fontSize: "13px" }}>
                  <span style={{ color: "#64748b" }}>Envío ({tipoEntrega || "Pendiente"})</span>
                  <strong style={{ color: "#0f172a", fontSize: "14px" }}>${costoEnvio.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setEnvioAceptado(!envioAceptado)}
                  style={{
                    padding: "6px 12px",
                    background: envioAceptado ? "#16a34a" : "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "700",
                    transition: "background 0.2s"
                  }}
                >
                  {envioAceptado ? "Aceptado ✅" : "Aceptar cargo"}
                </button>
              </div>

              <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "12px", border: "1px solid #7dd3fc", marginTop: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#0c4a6e", display: "block", marginBottom: "10px" }}>
                  📎 Comprobante de pago
                </label>
                <label
                  htmlFor="inputComprobante"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#0284c7",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "13px",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  📤 Subir comprobante
                </label>
                <input
                  id="inputComprobante"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
                  style={{ display: "none" }}
                />
                {comprobanteFile && (
                  <p style={{ fontSize: "12px", color: "#0284c7", marginTop: "8px" }}>
                    ✓ Archivo seleccionado: {comprobanteFile.name}
                  </p>
                )}
                {subiendoComprobante && (
                  <p style={{ fontSize: "12px", color: "#0284c7", marginTop: "6px" }}>
                    Subiendo comprobante...
                  </p>
                )}
              </div>
              {/* TÉRMINOS Y CONDICIONES */}
              <div style={{ background: "#fffbeb", padding: "12px", borderRadius: "8px", border: "1px solid #fde68a", marginTop: "6px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", fontSize: "12px", color: "#92400e", lineHeight: "1.4" }}>
                  <input
                    type="checkbox"
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    style={{ width: "15px", height: "15px", marginTop: "1px", accentColor: "#d97706" }}
                  />
                  <span>Estoy de acuerdo con todos los campos y datos ingresados antes de proceder con la compra.</span>
                </label>
              </div>

              <div style={{ borderTop: "2px dashed #e5e7eb", marginTop: "10px", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#111" }}>Total General</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#2563eb" }}>${totalGeneral.toFixed(2)}</span>
              </div>

              <button
                className="btn-confirmar"
                disabled={!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados || productos.length === 0}
                onClick={confirmarCompra}
                style={{ 
                  marginTop: "6px", 
                  width: "100%", 
                  padding: "14px", 
                  background: (!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados) ? "#9ca3af" : "#2563eb", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: (!metodoPago || !tipoEntrega || !envioAceptado || !terminosAceptados) ? "not-allowed" : "pointer", 
                  fontWeight: "700",
                  fontSize: "15px",
                  boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                  transition: "background 0.2s"
                }}
              >
                Confirmar compra
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}