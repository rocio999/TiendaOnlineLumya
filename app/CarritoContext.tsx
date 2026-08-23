"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  emoji: string;
}

interface CarritoContextType {
  productos: Producto[];
  agregarProducto: (producto: Omit<Producto, "cantidad">) => void;
  eliminarProducto: (id: number) => void;
  cambiarCantidad: (id: number, delta: number) => void;
  total: number;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Cargar del localStorage al iniciar
  useEffect(() => {

    const guardado = localStorage.getItem("carrito");
    if (guardado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductos(JSON.parse(guardado));
    }
  }, []);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = (producto: Omit<Producto, "cantidad">) => {
    setProductos((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarProducto = (id: number) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
      )
    );
  };

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ productos, agregarProducto, eliminarProducto, cambiarCantidad, total }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
}