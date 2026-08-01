"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  vendedorId: string;
  vendedorNombre: string;
}

export default function CatalogoGeneral() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [agregado, setAgregado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState(false);

  function suscribirseUsuario(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }
  function obtenerUsuarioCliente() {
    return !!localStorage.getItem("usuario");
  }
  function obtenerUsuarioServidor() {
    return false;
  }
  const usuarioLogueado = useSyncExternalStore(
    suscribirseUsuario,
    obtenerUsuarioCliente,
    obtenerUsuarioServidor
  );

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:3001/productos");
        const data = await res.json();
        setProductos(data.filter((p: any) => p.stock > 0));
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    router.push("/cliente/catalogo");
  };

  const handleAgregar = (producto: Producto) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carritoActual.find((p: any) => p.id === producto.id);
    if (existe) {
      const actualizado = carritoActual.map((p: any) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      localStorage.setItem("carrito", JSON.stringify(actualizado));
    } else {
      localStorage.setItem(
        "carrito",
        JSON.stringify([
          ...carritoActual,
          { ...producto, cantidad: 1, tiendaId: producto.vendedorId, tiendaNombre: producto.vendedorNombre },
        ])
      );
    }
    setAgregado(producto.id);
    setTimeout(() => setAgregado(null), 1500);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {mensaje && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🛒</div>
            <h2 className="modal-title">Necesitas una cuenta</h2>
            <p className="modal-text">
              Para agregar productos al carrito debes iniciar sesión o registrarte primero.
            </p>
            <div className="modal-buttons">
              <Link href="/cliente/login">
                <button className="btn-login">Iniciar sesión</button>
              </Link>
              <Link href="/cliente/registro">
                <button className="btn-register">Registrarse</button>
              </Link>
            </div>
            <button onClick={() => setMensaje(false)} className="btn-close">
              Continuar viendo productos
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Catálogo General</span>
          </div>

          <div className="flex items-center gap-3">
            {!usuarioLogueado ? (
              <>
                <Link href="/cliente/registro">
                  <button className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-xl font-semibold transition-all text-sm">
                    Registrarse
                  </button>
                </Link>
                <button
                  className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-xl font-semibold transition-all text-sm"
                  onClick={() => {
                    localStorage.setItem("redirectAfterLogin", window.location.pathname);
                    router.push("/cliente/login");
                  }}
                >
                  Iniciar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/cliente/carrito")}
                  className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-xl font-semibold transition-all text-sm"
                >
                  🛒 Carrito
                </button>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-xl font-semibold transition-all text-sm"
                >
                  🚪 Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-3">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none shadow-md"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Todos los productos</h2>

        {cargando ? (
          <div className="text-center py-20 text-gray-400">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No hay productos disponibles.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 h-32 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm">{producto.nombre}</p>
                  <p className="text-xs text-gray-400 mb-1">{producto.vendedorNombre}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-700 font-bold">${producto.precio}</p>
                    <button
                      onClick={() => {
                        const usuario = localStorage.getItem("usuario");
                        if (!usuario) {
                          setMensaje(true);
                          return;
                        }
                        handleAgregar(producto);
                      }}
                      className={`text-white text-xs px-3 py-1 rounded-lg transition font-semibold ${
                        agregado === producto.id
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
                      }`}
                    >
                      {agregado === producto.id ? "✓ Agregado" : "+ Carrito"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
