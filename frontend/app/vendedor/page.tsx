import Link from "next/link";
import Image from "next/image";

export default function PanelVendedor() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center">
      
      {/* Fondo tecnológico */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo-lumya.png"
          alt="Fondo Lumya"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-8 text-center">

        {/* Título */}
        <h1 className="text-5xl font-bold text-white mb-3 tracking-wide drop-shadow-lg">
          Panel del Vendedor
        </h1>
        <p className="text-yellow-300 mb-12 text-lg font-semibold drop-shadow">
          Bienvenido — aquí puedes gestionar tus productos
        </p>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          
          <Link href="/vendedor/productos">
            <div className="bg-cyan-400/20 backdrop-blur-lg border-2 border-cyan-300 rounded-2xl p-8 hover:bg-cyan-400/35 transition-all cursor-pointer flex flex-col items-center text-center shadow-xl shadow-cyan-500/20">
              <span className="text-5xl mb-4">📦</span>
              <h2 className="text-xl font-bold text-white mb-2">
                Mis Productos
              </h2>
              <p className="text-yellow-200 text-sm font-medium">
                Ver y gestionar tus productos
              </p>
            </div>
          </Link>

          <Link href="/vendedor/productos/nuevo">
            <div className="bg-blue-400/20 backdrop-blur-lg border-2 border-blue-300 rounded-2xl p-8 hover:bg-blue-400/35 transition-all cursor-pointer flex flex-col items-center text-center shadow-xl shadow-blue-500/20">
              <span className="text-5xl mb-4">➕</span>
              <h2 className="text-xl font-bold text-white mb-2">
                Subir Producto
              </h2>
              <p className="text-yellow-200 text-sm font-medium">
                Publicar un nuevo producto
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}