import Link from "next/link";
import Image from "next/image";

export default function MisProductos() {
  return (
    <div className="min-h-screen relative">

      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo-lumya.png"
          alt="Fondo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">

        {/* Encabezado */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Mis Productos
            </h1>
            <p className="text-yellow-300 mt-1 font-medium">
              Gestiona tu catálogo de productos
            </p>
          </div>
          <Link href="/vendedor/productos/nuevo">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30">
              + Nuevo Producto
            </button>
          </Link>
        </div>

        {/* Mensaje vacío */}
        <div className="flex flex-col items-center justify-center mt-32">
          <span className="text-7xl mb-6">🛍️</span>
          <p className="text-white text-xl font-semibold mb-2">
            Aún no tienes productos publicados
          </p>
          <p className="text-cyan-300 text-sm mb-8">
            Comienza subiendo tu primer producto
          </p>
          <Link href="/vendedor/productos/nuevo">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30">
              + Subir mi primer producto
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}