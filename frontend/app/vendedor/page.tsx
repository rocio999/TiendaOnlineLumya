import Link from "next/link";

export default function PanelVendedor() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">Panel del Vendedor</h1>
            <p className="text-gray-500 mb-8">Bienvenidos Aquí puedes subir tu producto</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/vendedor/productos">
                    <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">📦 Mis Productos</h2>
                        <p className="text-gray-500">Ver y gestionar tus productos</p>
                    </div>
                </Link>

                <Link href="/vendedor/productos/nuevo">
                    <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">➕ Subir Producto</h2>
                        <p className="text-gray-500">Publicar un nuevo producto</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}