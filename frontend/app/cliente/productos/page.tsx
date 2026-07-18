"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Productos() {

  const router = useRouter();

  const [agregado, setAgregado] = useState<number | null>(null);


  const productos = [
    {
      id: 1,
      nombre: "Mochila Urbana",
      precio: 55,
      categoria: "Accesorios",
      emoji: "🎒"
    },
    {
      id: 2,
      nombre: "Zapatillas Runner",
      precio: 90,
      categoria: "Calzado",
      emoji: "👟"
    },
    {
      id: 3,
      nombre: "Cámara Digital",
      precio: 350,
      categoria: "Electrónica",
      emoji: "📷"
    },
    {
      id: 4,
      nombre: "Auriculares Bluetooth",
      precio: 110,
      categoria: "Electrónica",
      emoji: "🎧"
    },
    {
      id: 5,
      nombre: "Camiseta Deportiva",
      precio: 25,
      categoria: "Ropa",
      emoji: "👕"
    },
    {
      id: 6,
      nombre: "Reloj Inteligente",
      precio: 199,
      categoria: "Electrónica",
      emoji: "⌚"
    }
  ];


  const handleAgregar = (producto: typeof productos[0]) => {

    const carritoActual = JSON.parse(
      localStorage.getItem("carrito") || "[]"
    );


    const existe = carritoActual.find(
      (p: { id:number }) => p.id === producto.id
    );


    if (existe) {

      const actualizado = carritoActual.map(
        (p: {id:number, cantidad:number}) =>
          p.id === producto.id
          ? {
              ...p,
              cantidad: p.cantidad + 1
            }
          : p
      );


      localStorage.setItem(
        "carrito",
        JSON.stringify(actualizado)
      );


    } else {


      localStorage.setItem(
        "carrito",
        JSON.stringify([
          ...carritoActual,
          {
            ...producto,
            cantidad:1
          }
        ])
      );

    }


    setAgregado(producto.id);


    setTimeout(() => {
      setAgregado(null);
    },1500);

  };



  return (

    <div className="min-h-screen bg-gray-50 p-6">


      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        Productos Lumya 🛍️
      </h1>


      <p className="text-gray-500 mb-8">
        Encuentra los mejores productos
      </p>



      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-6
      ">


      {productos.map((producto)=>(


        <div
          key={producto.id}
          className="
            bg-white
            rounded-xl
            shadow-md
            p-5
          "
        >


          <div className="
            bg-blue-50
            rounded-xl
            h-32
            flex
            items-center
            justify-center
            mb-4
          ">
            <span className="text-6xl">
              {producto.emoji}
            </span>
          </div>



          <h2 className="
            font-bold
            text-lg
            text-gray-800
          ">
            {producto.nombre}
          </h2>



          <p className="text-gray-400 text-sm">
            {producto.categoria}
          </p>



          <p className="
            text-blue-700
            font-bold
            text-xl
            mt-2
          ">
            ${producto.precio}
          </p>



          <button
            onClick={()=>{


              const usuario =
                localStorage.getItem("usuario");



              if(!usuario){

                alert(
                  "Debes registrarte o iniciar sesión antes de agregar productos al carrito 🛒"
                );


                router.push(
                  "/cliente/registro"
                );


                return;

              }



              handleAgregar(producto);



            }}


            className={`
              mt-4
              w-full
              text-white
              py-2
              rounded-lg
              font-semibold
              transition

              ${
                agregado === producto.id
                ?
                "bg-green-500"
                :
                "bg-blue-600 hover:bg-blue-700"
              }

            `}
          >


            {
              agregado === producto.id
              ?
              "✓ Agregado"
              :
              "🛒 Agregar al carrito"
            }


          </button>



        </div>


      ))}



      </div>


    </div>

  );

}