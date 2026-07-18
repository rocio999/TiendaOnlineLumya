"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc,
  query, where, serverTimestamp,
} from "firebase/firestore";
import { registrarAuditoria } from "@/lib/auditoria";

interface ProductoReal {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  vendedorId: string;
  vendedorNombre: string;
  estado: string;
}

interface CategoriaReal {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  estado: string;
}

interface VendedorOpcion {
  id: string;
  nombreNegocio: string;
}

export default function GestionProductos() {
  const [vista, setVista] = useState<"productos" | "categorias" | "nuevo">("productos");

  const [productosReales, setProductosReales] = useState<ProductoReal[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<CategoriaReal[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  const [vendedoresOpciones, setVendedoresOpciones] = useState<VendedorOpcion[]>([]);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion: "", emoji: "" });
  const [mensaje, setMensaje] = useState("");
  const [publicando, setPublicando] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "", precio: "", descripcion: "", categoria: "", stock: "", vendedorId: ""
  });

  const construirMapaVendedores = (docs: any[]) => {
    const mapa: Record<string, string> = {};
    docs.forEach((v) => {
      mapa[v.id] = v.data().nombreNegocio || v.data().nombre || "Vendedor";
    });
    return mapa;
  };

  const cargarProductos = async () => {
    try {
      const productosSnap = await getDocs(collection(db, "productos"));
      const vendedoresQ = query(collection(db, "usuarios"), where("rol", "==", "vendedor"));
      const vendedoresSnap = await getDocs(vendedoresQ);
      const mapaVendedores = construirMapaVendedores(vendedoresSnap.docs);

      const lista: ProductoReal[] = productosSnap.docs.map((p) => {
        const data = p.data();
        return {
          id: p.id,
          nombre: data.nombre,
          precio: data.precio,
          stock: data.stock,
          categoria: data.categoria,
          vendedorId: data.vendedorId,
          vendedorNombre: mapaVendedores[data.vendedorId] || "Desconocido",
          estado: data.estado || "activo",
        };
      });

      setProductosReales(lista);

      setVendedoresOpciones(
        vendedoresSnap.docs.map((v) => ({
          id: v.id,
          nombreNegocio: v.data().nombreNegocio || v.data().nombre || "Vendedor",
        }))
      );
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargandoProductos(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const snap = await getDocs(collection(db, "categorias"));
      const lista = snap.docs.map((c) => ({
        id: c.id,
        nombre: c.data().nombre,
        descripcion: c.data().descripcion,
        emoji: c.data().emoji || "📦",
        estado: c.data().estado || "Activa",
      }));
      setCategorias(lista);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setCargandoCategorias(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const toggleEstadoProducto = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activo" ? "suspendido" : "activo";
    setActualizandoId(id);
    try {
      await updateDoc(doc(db, "productos", id), { estado: nuevoEstado });
      const producto = productosReales.find((p) => p.id === id);
      const accion = nuevoEstado === "suspendido" ? "Suspendió" : "Activó";
      await registrarAuditoria("admin", `${accion} el producto ${producto?.nombre}`, "producto");
      setProductosReales((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
    } finally {
      setActualizandoId(null);
    }
  };

  const toggleEstadoCategoria = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "Activa" ? "Inactiva" : "Activa";
    try {
      await updateDoc(doc(db, "categorias", id), { estado: nuevoEstado });
      const categoria = categorias.find((c) => c.id === id);
      const accion = nuevoEstado === "Inactiva" ? "Desactivó" : "Activó";
      await registrarAuditoria("admin", `${accion} la categoría ${categoria?.nombre}`, "categoria");
      setCategorias(categorias.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
    }
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      setMensaje("Por favor completa todos los campos");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "categorias"), {
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion,
        emoji: nuevaCategoria.emoji || "📦",
        estado: "Activa",
        createdAt: serverTimestamp(),
      });
      await registrarAuditoria("admin", `Creó categoría ${nuevaCategoria.nombre}`, "categoria");
      setCategorias([...categorias, {
        id: docRef.id,
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion,
        emoji: nuevaCategoria.emoji || "📦",
        estado: "Activa",
      }]);
      setNuevaCategoria({ nombre: "", descripcion: "", emoji: "" });
      setMostrarFormCategoria(false);
      setMensaje("Categoría agregada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      setMensaje("Ocurrió un error al agregar la categoría");
    }
  };

  const eliminarCategoria = async (id: string) => {
    try {
      const categoria = categorias.find((c) => c.id === id);
      await deleteDoc(doc(db, "categorias", id));
      await registrarAuditoria("admin", `Eliminó la categoría ${categoria?.nombre}`, "categoria");
      setCategorias(categorias.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const subirProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria || !nuevoProducto.stock || !nuevoProducto.vendedorId) {
      setMensaje("Por favor completa todos los campos obligatorios, incluido el vendedor");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }
    setPublicando(true);
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nuevoProducto.nombre,
        precio: Number(nuevoProducto.precio),
        descripcion: nuevoProducto.descripcion,
        categoria: nuevoProducto.categoria,
        stock: Number(nuevoProducto.stock),
        vendedorId: nuevoProducto.vendedorId,
        estado: "activo",
        createdAt: serverTimestamp(),
      });

      await registrarAuditoria("admin", `Subió el producto ${nuevoProducto.nombre}`, "producto");

      setNuevoProducto({ nombre: "", precio: "", descripcion: "", categoria: "", stock: "", vendedorId: "" });
      setVista("productos");
      setMensaje("Producto subido correctamente");
      setTimeout(() => setMensaje(""), 3000);

      cargarProductos();
    } catch (error) {
      console.error("Error al subir producto:", error);
      setMensaje("Ocurrió un error al subir el producto");
    } finally {
      setPublicando(false);
    }
  };

  const productosFiltrados = productosReales.filter((p) => {
    const coincideFiltro =
      filtro === "Todos" ||
      p.categoria === filtro ||
      (filtro === "Activo" && p.estado === "activo") ||
      (filtro === "Suspendido" && p.estado === "suspendido");
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.vendedorNombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Gestión de Productos</span>
          </div>
          <span className="bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-3 flex gap-2">
          <button
            onClick={() => setVista("productos")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
              vista === "productos" ? "bg-white text-blue-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            📦 Productos
          </button>
          <button
            onClick={() => setVista("nuevo")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
              vista === "nuevo" ? "bg-white text-blue-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            ➕ Subir Producto
          </button>
          <button
            onClick={() => setVista("categorias")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
              vista === "categorias" ? "bg-white text-blue-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            🏷️ Categorías
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Mensaje */}
        {mensaje && (
          <div className={`px-4 py-3 rounded-xl mb-6 font-semibold ${
            mensaje.includes("completa") || mensaje.includes("error")
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-emerald-100 border border-emerald-400 text-emerald-700"
          }`}>
            {mensaje.includes("completa") || mensaje.includes("error") ? "⚠️" : "✅"} {mensaje}
          </div>
        )}

        {/* VISTA PRODUCTOS */}
        {vista === "productos" && (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por producto o vendedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-sm"
              />
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {["Todos", "Ropa", "Calzado", "Electrónica", "Accesorios", "Activo", "Suspendido"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                    filtro === f ? "bg-blue-800 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-bold text-blue-800">{productosReales.length}</p>
                <p className="text-slate-400 text-sm">Total Productos</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-bold text-emerald-600">{productosReales.filter(p => p.stock > 0).length}</p>
                <p className="text-slate-400 text-sm">Con Stock</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-bold text-red-500">{productosReales.filter(p => p.stock === 0).length}</p>
                <p className="text-slate-400 text-sm">Sin Stock</p>
              </div>
            </div>

            {cargandoProductos ? (
              <div className="text-center py-16 text-slate-400">Cargando productos...</div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-slate-400">No hay productos que coincidan.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0 font-bold text-lg text-blue-800">
                      {producto.nombre.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{producto.nombre}</p>
                      <p className="text-slate-400 text-sm">Vendedor: {producto.vendedorNombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{producto.categoria}</span>
                        <span className={`text-xs font-semibold ${producto.stock === 0 ? "text-red-500" : "text-emerald-600"}`}>Stock: {producto.stock}</span>
                        <span className="text-xs font-bold text-blue-900">${producto.precio}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        producto.estado === "activo" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                      }`}>
                        {producto.estado === "activo" ? "Activo" : "Suspendido"}
                      </span>
                      <button
                        onClick={() => toggleEstadoProducto(producto.id, producto.estado)}
                        disabled={actualizandoId === producto.id}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap disabled:opacity-50 ${
                          producto.estado === "activo" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {actualizandoId === producto.id ? "..." : producto.estado === "activo" ? "Suspender" : "Activar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* VISTA SUBIR PRODUCTO */}
        {vista === "nuevo" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Subir Nuevo Producto</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-blue-800 font-semibold block mb-1">Nombre del producto *</label>
                <input
                  type="text"
                  placeholder="Ej: Camiseta deportiva"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-800 font-semibold block mb-1">Precio ($) *</label>
                  <input
                    type="number"
                    placeholder="Ej: 29.99"
                    value={nuevoProducto.precio}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-blue-800 font-semibold block mb-1">Stock *</label>
                  <input
                    type="number"
                    placeholder="Ej: 10"
                    value={nuevoProducto.stock}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-blue-800 font-semibold block mb-1">Categoría *</label>
                <select
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.filter(c => c.estado === "Activa").map(c => (
                    <option key={c.id} value={c.nombre}>{c.emoji} {c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-800 font-semibold block mb-1">Descripción</label>
                <textarea
                  placeholder="Describe el producto"
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-blue-800 font-semibold block mb-1">Vendedor asignado *</label>
                <select
                  value={nuevoProducto.vendedorId}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, vendedorId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Selecciona un vendedor</option>
                  {vendedoresOpciones.map((v) => (
                    <option key={v.id} value={v.id}>{v.nombreNegocio}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-800 font-semibold block mb-1">Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-800 file:text-white file:font-semibold hover:file:bg-blue-900 transition cursor-pointer"
                />
                <p className="text-slate-400 text-xs mt-1">
                  Nota: la imagen aún no se sube a almacenamiento, se agrega en la siguiente fase.
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={subirProducto}
                  disabled={publicando}
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
                >
                  {publicando ? "Publicando..." : "Publicar Producto"}
                </button>
                <button
                  onClick={() => setVista("productos")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA CATEGORIAS */}
        {vista === "categorias" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-blue-800">{categorias.length}</p>
                  <p className="text-slate-400 text-sm">Total</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{categorias.filter(c => c.estado === "Activa").length}</p>
                  <p className="text-slate-400 text-sm">Activas</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFormCategoria(!mostrarFormCategoria)}
                className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-3 rounded-xl transition shadow-md whitespace-nowrap"
              >
                + Nueva Categoría
              </button>
            </div>

            {mostrarFormCategoria && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-200 mb-6">
                <h3 className="font-bold text-blue-900 text-lg mb-4">Nueva Categoría</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={nuevaCategoria.nombre}
                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={nuevaCategoria.descripcion}
                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Emoji (opcional) ej: 👕"
                    value={nuevaCategoria.emoji}
                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, emoji: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={agregarCategoria}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition"
                    >
                      Guardar Categoría
                    </button>
                    <button
                      onClick={() => setMostrarFormCategoria(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {cargandoCategorias ? (
              <div className="text-center py-16 text-slate-400">Cargando categorías...</div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-16 text-slate-400">Aún no hay categorías.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0 text-3xl">
                      {categoria.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-lg">{categoria.nombre}</p>
                      <p className="text-slate-400 text-sm">{categoria.descripcion}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        categoria.estado === "Activa" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                      }`}>
                        {categoria.estado}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleEstadoCategoria(categoria.id, categoria.estado)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap ${
                            categoria.estado === "Activa" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {categoria.estado === "Activa" ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => eliminarCategoria(categoria.id)}
                          className="text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap bg-slate-100 text-slate-500 hover:bg-slate-200"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}