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
}


export default function Carrito() {
const [productos, setProductos] = useState<ProductoCarrito[]>([]);  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const [ultimaTienda, setUltimaTienda] = useState("");
const [tiendaActual, setTiendaActual] = useState("");


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
    guardar(productos.map((p) =>
      p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
    ));
  };

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

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

localStorage.setItem(
  "carritoPago",
  JSON.stringify(productosPago)
);
  router.push("/cliente/checkout");

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
<div className="flex flex-col gap-6 mb-6">
 
               {Object.entries(tiendasAgrupadas).map(
  ([nombreTienda, productosTienda]) => {

    const totalTienda = productosTienda.reduce(
      (acc: number, producto: ProductoCarrito) =>
        acc + producto.precio * producto.cantidad,
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
              ${producto.precio}
            </p>
            

          </div>


         <div className="flex items-center gap-4">

  <div className="text-blue-900 font-semibold">
    Cantidad: {producto.cantidad}
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
      <div className="border-t mt-4 pt-4 flex justify-between items-center">

  <div className="font-bold text-blue-900 text-lg">
    Total: ${totalTienda}
  </div>

  <button
    onClick={() => procederAlPago(nombreTienda)}
    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
  >
    Proceder al pago
  </button>

</div>


          </div>

    );

  }
)}
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

      

    </div>
  );
}