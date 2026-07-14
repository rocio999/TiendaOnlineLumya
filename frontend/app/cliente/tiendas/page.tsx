"use client";

import "./tiendas.css";
import { useRouter } from "next/navigation";

export default function Tiendas() {
  const router = useRouter();

  const tiendas = [
    {
      id: 1,
      nombre: "Lumya Fashion",
      descripcion: "Accesorios para dama",
      logo: "/logo.png",
      portada: "/portada1.jpg",
    },
    {
      id: 2,
      nombre: "Mundo Gamer",
      descripcion: "Todo para gamers",
      logo: "/logo.png",
      portada: "/portada2.jpg",
    },
    {
      id: 3,
      nombre: "Artesanías Ecuador",
      descripcion: "Productos hechos a mano",
      logo: "/logo.png",
      portada: "/portada3.jpg",
    },
  ];

  return (
    <div className="contenedor">
      <h1 className="titulo">Tiendas Disponibles</h1>

      <div className="gridTiendas">
        {tiendas.map((tienda) => (
          <div
            key={tienda.id}
            className="card"
            onClick={() => router.push(`/cliente/tiendas/${tienda.id}`)}
          >
            <img
              src={tienda.portada}
              alt="Portada"
              className="portada"
            />

            <div className="contenido">

              <img
                src={tienda.logo}
                alt="Logo"
                className="logo"
              />

              <h2>{tienda.nombre}</h2>

              <p>{tienda.descripcion}</p>

              <button className="boton">
                Entrar a la tienda
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}