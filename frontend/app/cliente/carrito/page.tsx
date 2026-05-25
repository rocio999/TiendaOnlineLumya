"use client";
import Link from "next/link";

export default function Carrito() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>

            <div className="border rounded-lg p-6 text-center">
                <span className="text-5xl">🛒</span>
                <p className="text-gray-500 mt-4">Tu carrito está vacío</p>
                <Link href="/cliente/productos">
                    <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                        Ver Productos
                    </button>
                </Link>
            </div>
        </div>
    );
}