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
  vendedorId?: string;
}


export default function Carrito() {
const [productos, setProductos] = useState<ProductoCarrito[]>([]);  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const [ultimaTienda, setUltimaTienda] = useState("");



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
    guardar(productos.map((p) =>
      p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
    ));
  };

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const procederAlPago = async () => {
    const clienteId = localStorage.getItem("clienteId");
    const usuarioGuardado = localStorage.getItem("usuario");
    let usuarioId = clienteId;

    if (!usuarioId && usuarioGuardado) {
      usuarioId = JSON.parse(usuarioGuardado).id;
    }

    if (!usuarioId) {
      setMensaje("Debes iniciar sesión para completar tu compra.");
      setTimeout(() => router.push("/cliente/login"), 2000);
      return;
    }

    if (productos.length === 0) return;

    setProcesando(true);
    try {
      for (const producto of productos) {
        await fetch("http://localhost:3001/pagos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId,
            vendedorId: producto.vendedorId || "",
            producto: producto.nombre,
            monto: producto.precio * producto.cantidad,
            metodo: "efectivo",
          }),
        });
      }

      localStorage.removeItem("carrito");
      setProductos([]);
      setMensaje("¡Pedido realizado con éxito! El vendedor confirmará tu pago pronto.");
      setTimeout(() => router.push("/cliente"), 2500);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setMensaje("Ocurrió un error al procesar tu pedido. Intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
  <Link href={ultimaTienda ? `/cliente/tiendas/${ultimaTienda}` : "/cliente/tiendas"}>
    <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
      ← Volver
    </button>
  </Link>
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
          <div className={`p-4 rounded-xl mb-6 text-center font-semibold ${
            mensaje.includes("error") || mensaje.includes("Debes")
              ? "bg-red-100 border border-red-300 text-red-700"
              : "bg-emerald-100 border border-emerald-300 text-emerald-700"
          }`}>
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
            <Link href={ultimaTienda ? `/cliente/tiendas/${ultimaTienda}` : "/cliente/tiendas"}>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg">
                Ver Productos
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">📦</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{producto.nombre}</p>
                    <p className="text-blue-700 font-semibold">${producto.precio}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => cambiarCantidad(producto.id, -1)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 w-7 h-7 rounded-lg font-bold transition"
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-700 w-4 text-center">
                        {producto.cantidad}
                      </span>
                      <button
                        onClick={() => cambiarCantidad(producto.id, 1)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 w-7 h-7 rounded-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-blue-900">
                      ${producto.precio * producto.cantidad}
                    </p>
                    <button
                      onClick={() => eliminar(producto.id)}
                      className="text-red-400 hover:text-red-600 text-sm transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Resumen del pedido
              </h3>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Envío</span>
                <span className="text-green-500 font-semibold">Gratis</span>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-blue-900 text-lg">Total</span>
                <span className="font-bold text-blue-900 text-lg">${total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {productos.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={procederAlPago}
              disabled={procesando}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {procesando ? "Procesando..." : `Proceder al Pago — $${total}`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}