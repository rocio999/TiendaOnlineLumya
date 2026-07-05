"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/cliente");
    }, 3000); // Espera 3 segundos

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lumia.png')",
        }}
      />

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenido a Lumya 🛍️
        </h2>

        <p className="text-lg md:text-xl max-w-2xl">
          Una plataforma donde clientes pueden comprar productos fácilmente y
          vendedores pueden publicar y gestionar su catálogo en línea.
        </p>

        <p className="mt-8 text-sm text-gray-300 animate-pulse">
          Redirigiendo...
        </p>
      </main>
    </div>
  );
}