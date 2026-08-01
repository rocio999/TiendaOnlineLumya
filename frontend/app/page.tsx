"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen w-full cursor-pointer"
      onClick={() => router.push("/cliente/tiendas")}
    >
      
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lumia.png')",
         }}
        />

      
      <div className="absolute inset-0 bg-black/60" />

      <header className="relative z-10 flex justify-between items-center px-8 py-5 text-white">
        <h1 className="text-xl font-bold">
          Tienda Online Lumya
        </h1>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenido a Lumya 🛍️
        </h2>

        <p className="text-lg md:text-xl max-w-2xl">
          Una plataforma donde clientes pueden comprar productos fácilmente
          y vendedores pueden publicar y gestionar su catálogo en línea.
        </p>
        <button
        onClick={(e) => { e.stopPropagation(); router.push("/cliente/catalogo"); }}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
         Explorar catálogo
        </button>



      </main>
    </div>
  );
}