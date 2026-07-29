"use client";
import "./tiendas.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface Vendedor {
  id: string;
  nombre?: string;
  nombreNegocio?: string;
  descripcion?: string;
  estado: string;
}

interface Tienda {
  id: string;
  nombreNegocio: string;
  descripcion: string;
}

export default function Tiendas() {
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTiendas = async () => {
      try {
        const res = await fetch("http://localhost:3001/vendedores");
        const data: Vendedor[] = await res.json();
        const activos = data
        .filter((v) => v.estado === "activo")
        .map((v) => ({
           id: v.id,
    nombreNegocio: v.nombreNegocio ?? v.nombre ?? "Sin nombre",
    descripcion: v.descripcion ?? "Tienda en Lumya",
  }));

setTiendas(activos);
      } catch (error) {
        console.error("Error al cargar tiendas:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarTiendas();
  }, []);

  return (
    <div className="tiendas-page contenedor">
      <h1 className="titulo">Tiendas Disponibles</h1>

      {cargando ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Cargando tiendas...
        </p>
      ) : tiendas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Aún no hay tiendas disponibles.
        </p>
      ) : (
        <div className="gridTiendas">
          {tiendas.map((tienda) => (
            <div
              key={tienda.id}
              className="card"
              onClick={() => router.push(`/cliente/tiendas/${tienda.id}`)}
            >
              <div
                className="portada"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                🏪
              </div>
              <div className="contenido">
                <h2>{tienda.nombreNegocio}</h2>
                <p>{tienda.descripcion}</p>
                <button className="boton">Entrar a la tienda</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
