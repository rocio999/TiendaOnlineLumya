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
  stock: number;
  tiendaNombre: string;
  peso?: number; // Peso unitario del producto en kg
}

type TipoEntrega = "Servientrega" | "Cooperativa";

export default function Carrito() {
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  // Estado para guardar el método de envío seleccionado por cada tienda (ej. { "Tienda Jorge": "Servientrega" })
  const [tiposEntregaPorTienda, setTiposEntregaPorTienda] = useState<Record<string, TipoEntrega>>({});

  useEffect(() => {
    const cargarCarrito = () => {
      const guardado = localStorage.getItem("carrito");
      let productosCargados: ProductoCarrito[] = [];
      if (guardado) {
        productosCargados = JSON.parse(guardado) as ProductoCarrito[];
        setProductos(productosCargados);
      }

      // Inicializar por defecto el método de envío como "Servientrega" para cada tienda presente
      const tiendasUnicas = Array.from(new Set(productosCargados.map((p) => p.tiendaNombre || "Tienda")));
      const enviosIniciales: Record<string, TipoEntrega> = {};
      tiendasUnicas.forEach((tienda) => {
        enviosIniciales[tienda] = "Servientrega";
      });
      setTiposEntregaPorTienda(enviosIniciales);

    };

    cargarCarrito();
  }, []);

  const guardar = (nuevos: ProductoCarrito[]) => {
    setProductos(nuevos);
    localStorage.setItem("carrito", JSON.stringify(nuevos));

    // Re-sincronizar tiendas en caso de que se eliminen productos
    const tiendasUnicas = Array.from(new Set(nuevos.map((p) => p.tiendaNombre || "Tienda")));
    setTiposEntregaPorTienda((prev) => {
      const actualizado: Record<string, TipoEntrega> = {};
      tiendasUnicas.forEach((t) => {
        actualizado[t] = prev[t] || "Servientrega";
      });
      return actualizado;
    });
  };

  const eliminar = (id: string) => {
    guardar(productos.filter((p) => p.id !== id));
  };

  const cambiarCantidad = (id: string, delta: number) => {
    const nuevosProductos = productos.map((p) => {
      if (p.id !== id) return p;

      const nuevaCantidad = p.cantidad + delta;

      if (nuevaCantidad < 1) {
        return p;
      }

      if (nuevaCantidad > p.stock) {
        setMensaje(`Solo hay ${p.stock} unidades disponibles de ${p.nombre}`);
        return p;
      }

      return {
        ...p,
        cantidad: nuevaCantidad,
      };
    });

    guardar(nuevosProductos);
  };

  // Función para calcular el costo de envío según el peso y tipo de entrega seleccionado
  const calcularCostoEnvioParaTienda = (pesoTienda: number, tipoEntrega: TipoEntrega) => {
    if (tipoEntrega === "Servientrega") {
      if (pesoTienda <= 2) {
        return 4.50;
      } else {
        const kilosExtras = Math.ceil(pesoTienda - 2);
        return 4.50 + kilosExtras * 1.25;
      }
    } 
    
    if (tipoEntrega === "Cooperativa") {
      if (pesoTienda <= 4.5) {
        return 4.00; 
      } else if (pesoTienda <= 22) {
        return 5.75; 
      } else {
        return 7.00; 
      }
    }

    return 0;
  };

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

    const tipoEntregaTienda = tiposEntregaPorTienda[nombreTienda] || "Servientrega";
    const pesoTienda = productosPago.reduce((acc, p) => acc + (p.peso || 1) * p.cantidad, 0);
    const costoEnvioTienda = calcularCostoEnvioParaTienda(pesoTienda, tipoEntregaTienda);

    // Guardamos los datos específicos de la tienda seleccionada para el pago
    localStorage.setItem("carritoPago", JSON.stringify(productosPago));
    localStorage.setItem("tipoEntregaSeleccionado", tipoEntregaTienda);
    localStorage.setItem("costoEnvioSeleccionado", costoEnvioTienda.toString());

    router.push("/cliente/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* CORREGIDO: Redirige explícitamente al catálogo en lugar de usar router.back() */}
            <button
              onClick={() => router.push("/cliente/catalogo")}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition font-medium"
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
            <p className="text-blue-500 text-sm mb-8">
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

                  const tipoEntregaActual = tiposEntregaPorTienda[nombreTienda] || "Servientrega";
                  const costoEnvioTienda = calcularCostoEnvioParaTienda(pesoTienda, tipoEntregaActual);
                  const totalTiendaConEnvio = totalTienda + costoEnvioTienda;

                  return (
                    <div
                      key={nombreTienda}
                      className="bg-white rounded-2xl p-5 shadow-sm border mb-5 text-gray-900"
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
                            <p className="font-bold text-gray-900">
                              {producto.nombre}
                            </p>
                            <p className="text-blue-600 font-medium">
                              ${producto.precio} <span className="text-xs text-gray-500">({producto.peso || 1} kg c/u)</span>
                            </p>
                            <p className="text-xs text-gray-600">
                              Stock disponible: {producto.stock}
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
                      
                      {/* SELECTOR DE MÉTODO DE ENVÍO INDEPENDIENTE POR TIENDA */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-bold text-blue-900 mb-2">Método de envío para esta tienda:</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <button
                            type="button"
                            onClick={() =>
                              setTiposEntregaPorTienda((prev) => ({
                                ...prev,
                                [nombreTienda]: "Servientrega",
                              }))
                            }
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                              tipoEntregaActual === "Servientrega"
                                ? "border-blue-600 bg-blue-50 text-blue-900"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            📦 Servientrega
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTiposEntregaPorTienda((prev) => ({
                                ...prev,
                                [nombreTienda]: "Cooperativa",
                              }))
                            }
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                              tipoEntregaActual === "Cooperativa"
                                ? "border-blue-600 bg-blue-50 text-blue-900"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            🚌 Cooperativa
                          </button>
                        </div>
                      </div>

                      {/* RESUMEN Y BOTÓN DE PAGO POR TIENDA */}
                      <div className="border-t pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1 text-sm">
                          <div className="text-gray-700">
                            Subtotal Tienda: <span className="font-semibold text-gray-900">${totalTienda.toFixed(2)}</span>
                          </div>
                          <div className="text-gray-700">
                            Peso total: <span className="font-semibold text-blue-900">{pesoTienda.toFixed(1)} kg</span>
                          </div>
                          <div className="text-gray-700">
                            Envío ({tipoEntregaActual}): <span className="font-semibold text-gray-900">${costoEnvioTienda.toFixed(2)}</span>
                          </div>
                          <div className="font-bold text-blue-900 text-base pt-1">
                            Total Tienda: ${totalTiendaConEnvio.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => procederAlPago(nombreTienda)}
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition w-full sm:w-auto shadow-md"
                        >
                          Proceder al pago
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* BOTÓN GENERAL PARA VACIAR TODO EL CARRITO */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center text-gray-900">
              <div>
                <h3 className="text-lg font-bold text-blue-900">¿Deseas vaciar el carrito?</h3>
                <p className="text-xs text-gray-600">Se eliminarán todos los productos agregados de las diferentes tiendas.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("¿Deseas vaciar todo el carrito?")) {
                    guardar([]);
                    localStorage.removeItem("carrito");
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold transition shadow-sm"
              >
                🗑 Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}