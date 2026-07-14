"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const timer = setTimeout(() => {
      router.replace("/cliente/tiendas");
    }, 5000);

    return () => clearTimeout(timer);

  }, [router]);


  return (

    <div className="home-container">

      {/* Fondo */}
      <div className="home-background" />


      {/* Capa oscura */}
      <div className="home-overlay" />


      {/* Contenido */}
      <main className="home-content">

        <h2 className="home-title">
          Bienvenido a Lumya 🛍️
        </h2>


        <p className="home-description">
          Una plataforma donde clientes pueden comprar productos fácilmente y
          vendedores pueden publicar y gestionar su catálogo en línea.
        </p>


        <div className="home-loader-container">

          <div className="home-loader" />

        </div>


      </main>

    </div>

  );
}