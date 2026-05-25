import Link from "next/link";

export default function InicioCliente() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">Bienvenido a Lumya</h1>
            <p className="text-gray-500 mb-8">Encuentra los mejores productos</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/cliente/productos">
                    <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">🛍️ Ver Productos</h2>
                        <p className="text-gray-500">Explora nuestro catálogo</p>
                    </div>
                </Link>

                <Link href="/cliente/carrito">
                    <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">🛒 Mi Carrito</h2>
                        <p className="text-gray-500">Ver productos seleccionados</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}