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
  imagenUrl?: string;
  descripcion?: string;
}

export default function CatalogoGeneral() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [agregado, setAgregado] = useState<string | null>(null);
  const [productoAbierto, setProductoAbierto] = useState<Producto | null>(null);
  const [mensaje, setMensaje] = useState(false);
  const [tiendas, setTiendas] = useState<{ id: string; nombreNegocio: string }[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [vistaMenu, setVistaMenu] = useState<"categorias" | "tiendas" | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

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

  useEffect(() => {
    const cargarTiendas = async () => {
      try {
        const res = await fetch("http://localhost:3001/vendedores");
        const data = await res.json();
        const activos = data
          .filter((v: any) => v.estado === "activo")
          .map((v: any) => ({ id: v.id, nombreNegocio: v.nombreNegocio || v.nombre || "Tienda" }));
        setTiendas(activos);
      } catch (error) {
        console.error("Error al cargar tiendas:", error);
      }
    };
    cargarTiendas();
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

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaActiva || p.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

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

      {productoAbierto && (
        <div
          onClick={() => setProductoAbierto(null)}
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="w-full bg-gray-100 flex items-center justify-center" style={{ minHeight: "250px" }}>
              {productoAbierto.imagenUrl ? (
                <Image
                  src={productoAbierto.imagenUrl}
                  alt={productoAbierto.nombre}
                  width={500}
                  height={500}
                  className="object-contain w-full max-h-[400px]"
                />
              ) : (
                <span className="text-8xl py-16">📦</span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-blue-900">{productoAbierto.nombre}</h3>
                <button
                  onClick={() => setProductoAbierto(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-semibold text-cyan-700 bg-cyan-50 inline-block px-2 py-1 rounded-full mb-3">
                {productoAbierto.categoria}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {productoAbierto.descripcion || "Sin descripción disponible."}
              </p>
              <p className="text-2xl font-bold text-blue-700">${productoAbierto.precio}</p>
            </div>
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

        <div className="max-w-5xl mx-auto mt-3 flex gap-2 relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-white rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none shadow-md"
          />
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="bg-white rounded-xl px-4 py-2 shadow-md text-gray-700 font-bold text-xl hover:bg-gray-50"
          >
            ⋮
          </button>
          {mostrarMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <button
                onClick={() => { setVistaMenu("categorias"); setMostrarMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-100"
              >
                🏷️ Ver categorías
              </button>
              <button
                onClick={() => { setVistaMenu("tiendas"); setMostrarMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
              >
                🏪 Ver tiendas
              </button>
              <button
      onClick={() => { 
        setMostrarMenu(false); 
        router.push("/cliente/pedidos"); 
      }}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-t border-gray-100"
    >
      📦 Mis pedidos
    </button>
            </div>
          )}
        </div>
      </div>

      {vistaMenu === "tiendas" && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-blue-900 text-lg">Tiendas disponibles</h3>
              <button onClick={() => setVistaMenu(null)} className="text-gray-400 hover:text-gray-600 text-sm">
                Cerrar ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tiendas.map((tienda) => (
                <button
                  key={tienda.id}
                  onClick={() => router.push(`/cliente/tiendas/${tienda.id}`)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-xl px-4 py-3 text-sm transition text-left"
                >
                  🏪 {tienda.nombreNegocio}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {vistaMenu === "categorias" && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-blue-900 text-lg">Categorías</h3>
              <button onClick={() => setVistaMenu(null)} className="text-gray-400 hover:text-gray-600 text-sm">
                Cerrar ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from(new Set(productos.map((p) => p.categoria))).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoriaActiva(cat); setVistaMenu(null); }}
                  className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold rounded-xl px-4 py-3 text-sm transition text-left"
                >
                  🏷️ {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            {categoriaActiva ? `Categoría: ${categoriaActiva}` : "Todos los productos"}
          </h2>
          {categoriaActiva && (
            <button
              onClick={() => setCategoriaActiva(null)}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-xl transition"
            >
              ← Volver al catálogo
            </button>
          )}
        </div>

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
                <div
                  onClick={() => setProductoAbierto(producto)}
                  className="h-32 w-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  {producto.imagenUrl ? (
                    <Image
                      src={producto.imagenUrl}
                      alt={producto.nombre}
                      width={300}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
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
