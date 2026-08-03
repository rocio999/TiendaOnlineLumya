"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductoCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tiendaNombre: string;
  peso?: number; // Peso unitario del producto en kg
}

export default function Carrito() {
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const [ultimaTienda, setUltimaTienda] = useState("");
  const [tiendaActual, setTiendaActual] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"Servientrega" | "Cooperativa">("Servientrega");

  useEffect(() => {
    const cargarCarrito = () => {
      const guardado = localStorage.getItem("carrito");
      if (guardado) {
        setProductos(JSON.parse(guardado) as ProductoCarrito[]);
      }

      const tienda = localStorage.getItem("ultimaTienda");
      if (tienda) {
        setUltimaTienda(tienda);
      }

      const tiendaActualGuardada = localStorage.getItem("tiendaActual");
      if (tiendaActualGuardada) {
        setTiendaActual(tiendaActualGuardada);
      }
    };

    cargarCarrito();
  }, []);

  const guardar = (nuevos: ProductoCarrito[]) => {
    setProductos(nuevos);
    localStorage.setItem("carrito", JSON.stringify(nuevos));
  };

  const eliminar = (id: string) => {
    guardar(productos.filter((p) => p.id !== id));
  };

  const cambiarCantidad = (id: string, delta: number) => {
    guardar(
      productos.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
      )
    );
  };

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // Cálculo del peso total general en el carrito
  const pesoTotalGeneral = productos.reduce(
    (acc, p) => acc + (p.peso || 1) * p.cantidad,
    0
  );

  // --- CÁLCULO DE ENVÍO SEGÚN LOS PARÁMETROS ESTABLECIDOS ---
  const calcularEnvio = () => {
    if (productos.length === 0) return 0;

    if (tipoEntrega === "Servientrega") {
      // Hasta 2kg cuesta $4.50. Por cada kilo adicional se suman $1.25.
      if (pesoTotalGeneral <= 2) {
        return 4.50;
      } else {
        const kilosExtras = Math.ceil(pesoTotalGeneral - 2);
        return 4.50 + kilosExtras * 1.25;
      }
    } 
    
    if (tipoEntrega === "Cooperativa") {
      // Rangos de peso para cooperativa
      if (pesoTotalGeneral <= 4.5) {
        return 4.00; 
      } else if (pesoTotalGeneral <= 22) {
        return 5.75; 
      } else {
        return 7.00; 
      }
    }

    return 0;
  };

  const costoEnvio = calcularEnvio();
  const totalGeneral = subtotal + costoEnvio;

  const tiendasAgrupadas: Record<string, ProductoCarrito[]> = productos.reduce(
    (acc, producto) => {
      const nombreTienda = producto.tiendaNombre || "Tienda";
      if (!acc[nombreTienda]) {
        acc[nombreTienda] = [];
      }
      acc[nombreTienda].push(producto);
      return acc;
    },
    {} as Record<string, ProductoCarrito[]>
  );

  const procederAlPago = (nombreTienda: string) => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      setMensaje("Debes iniciar sesión para continuar.");
      setTimeout(() => {
        router.push("/cliente/login");
      }, 2000);
      return;
    }

    if (productos.length === 0) {
      setMensaje("Tu carrito está vacío.");
      return;
    }

    const productosPago = productos.filter(
      (p) => p.tiendaNombre === nombreTienda
    );

    // Guardamos también el tipo de entrega y costo de envío calculado para pasarlo al checkout
    localStorage.setItem("carritoPago", JSON.stringify(productosPago));
    localStorage.setItem("tipoEntregaSeleccionado", tipoEntrega);
    localStorage.setItem("costoEnvioSeleccionado", costoEnvio.toString());

    router.push("/cliente/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
                  onClick={() => router.back()}
                     className="text-white hover:bg-white/20 p-2 rounded-xl transition"
                        >
                  ← Volver
              </button>


            <Image
              src="/logo-lumya.png"
              alt="Lumya"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">Mi Carrito</span>
            {productos.length > 0 && productos[0].tiendaNombre && (
              <span className="text-white text-sm">
                🏪 {productos[0].tiendaNombre}
              </span>
            )}
          </div>
          <span className="bg-white/20 text-white px-3 py-1 rounded-xl text-sm font-semibold">
            {productos.length} items
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-40">
        {mensaje && (
          <div
            className={`p-4 rounded-xl mb-6 text-center font-semibold ${
              mensaje.includes("error") || mensaje.includes("Debes")
                ? "bg-red-100 border border-red-300 text-red-700"
                : "bg-emerald-100 border border-emerald-300 text-emerald-700"
            }`}
          >
            {mensaje.includes("error") || mensaje.includes("Debes") ? "⚠️" : "✅"} {mensaje}
          </div>
        )}

        {productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <span className="text-8xl mb-6">🛒</span>
            <p className="text-xl font-bold text-blue-900 mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-blue-400 text-sm mb-8">
              Agrega productos para continuar
            </p>
            <Link href="/cliente/catalogo">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg">
                Ver Productos
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-6">
              {Object.entries(tiendasAgrupadas).map(
                ([nombreTienda, productosTienda]) => {
                  const totalTienda = productosTienda.reduce(
                    (acc: number, producto: ProductoCarrito) =>
                      acc + producto.precio * producto.cantidad,
                    0
                  );

                  const pesoTienda = productosTienda.reduce(
                    (acc: number, producto: ProductoCarrito) =>
                      acc + (producto.peso || 1) * producto.cantidad,
                    0
                  );

                  return (
                    <div
                      key={nombreTienda}
                      className="bg-white rounded-2xl p-5 shadow-sm border mb-5"
                    >
                      <h2 className="text-xl font-bold text-blue-900 mb-4">
                        🏪 {nombreTienda}
                      </h2>

                      {productosTienda.map((producto: ProductoCarrito) => (
                        <div
                          key={producto.id}
                          className="flex justify-between items-center border-b py-3"
                        >
                          <div>
                            <p className="font-bold text-gray-800">
                              {producto.nombre}
                            </p>
                            <p className="text-blue-600">
                              ${producto.precio} <span className="text-xs text-gray-400">({producto.peso || 1} kg c/u)</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                              <button
                                onClick={() => cambiarCantidad(producto.id, -1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-black text-lg font-bold"
                              >
                                −
                              </button>
                              <span className="px-4 py-1 font-semibold text-gray-900">
                                {producto.cantidad}
                              </span>
                              <button
                                onClick={() => cambiarCantidad(producto.id, 1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-black text-lg font-bold"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => eliminar(producto.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                            >
                              🗑 Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="font-bold text-blue-900 text-lg">
                            Subtotal Tienda: ${totalTienda.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            ⚖️ Peso total de tienda: {pesoTienda.toFixed(1)} kg
                          </div>
                        </div>

                        <button
                          onClick={() => procederAlPago(nombreTienda)}
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition w-full sm:w-auto"
                        >
                          Proceder al pago
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* SECCIÓN DE MÉTODO DE ENVÍO Y RESUMEN GENERAL */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Método de envío
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setTipoEntrega("Servientrega")}
                  className={`p-3 rounded-xl border text-sm font-semibold transition ${
                    tipoEntrega === "Servientrega"
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  📦 Servientrega
                </button>
                <button
                  type="button"
                  onClick={() => setTipoEntrega("Cooperativa")}
                  className={`p-3 rounded-xl border text-sm font-semibold transition ${
                    tipoEntrega === "Cooperativa"
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🚌 Cooperativa
                </button>
              </div>

              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Resumen del pedido
              </h3>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Peso Total Estimado</span>
                <span className="font-semibold text-blue-900">{pesoTotalGeneral.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Envío ({tipoEntrega})</span>
                <span className="font-semibold text-gray-800">${costoEnvio.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-blue-900 text-lg">Total General</span>
                <span className="font-bold text-blue-900 text-lg">${totalGeneral.toFixed(2)}</span>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (confirm("¿Deseas vaciar todo el carrito?")) {
                      guardar([]);
                      localStorage.removeItem("carrito");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  🗑 Vaciar carrito
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}