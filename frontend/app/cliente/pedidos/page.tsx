/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./pedido.css";


interface Pedido {
  id: string;
  cliente: {
    id?: string;
    nombre?: string;
    correo?: string;
  };
  productos: {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    tiendaNombre: string;
  }[];
  total: number;
  metodoPago: string;

  tipoEntrega?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  referencia?: string;
  cooperativa?: string;
  ciudadDestino?: string;

  estado: string;
  fecha: string;
}


export default function PedidosCliente() {


const [pedidos, setPedidos] = useState<Pedido[]>([]);



useEffect(() => {


  const usuarioGuardado = localStorage.getItem("usuario");


  if (!usuarioGuardado) {
    setPedidos([]);
    return;
  }


  const usuario = JSON.parse(usuarioGuardado);



  const todosLosPedidos: Pedido[] = JSON.parse(
    localStorage.getItem("pedidos") || "[]"
  );



  const pedidosUsuario = todosLosPedidos.filter(
    (pedido) =>
      pedido.cliente.id === usuario.id
  );



  setPedidos(pedidosUsuario);



}, []);



return (

<div className="pedidos-container">


<h1>📦 Mis pedidos</h1>



{pedidos.length === 0 ? (

<div className="pedido-vacio">

<p>
Todavía no tienes pedidos realizados.
</p>


<Link href="/cliente/tiendas">
Explorar tiendas
</Link>


</div>


) : (


pedidos.map((pedido)=>(


<div key={pedido.id} className="pedido-card">


<h2>
Pedido #{pedido.id.slice(0,8)}
</h2>



<p>
📅 Fecha:
{" "}
{new Date(pedido.fecha).toLocaleDateString()}
</p>



<p>
💳 Pago:
{" "}
{pedido.metodoPago}
</p>




<p>
🚚 Entrega:
{" "}
<strong>
{pedido.tipoEntrega || "No definido"}
</strong>
</p>




<p>
📌 Estado:
{" "}
<strong>
{pedido.estado}
</strong>
</p>





{pedido.tipoEntrega === "Servientrega" && (

<div className="detalle-entrega">


<p>
📍 Provincia:
{" "}
{pedido.provincia?.toUpperCase()}
</p>


<p>
🏙 Ciudad:
{" "}
{pedido.ciudad?.toUpperCase()}
</p>



<p>
🏠 Dirección:
{" "}
{pedido.direccion?.toUpperCase()}
</p>



{pedido.referencia && (

<p>
📌 Referencia:
{" "}
{pedido.referencia.toUpperCase()}
</p>

)}


</div>

)}




{pedido.tipoEntrega === "Cooperativa" && (

<div className="detalle-entrega">


<p>
🚌 Cooperativa:
{" "}
{pedido.cooperativa?.toUpperCase()}
</p>


<p>
📍 Ciudad destino:
{" "}
{pedido.ciudadDestino?.toUpperCase()}
</p>


</div>

)}





<h3>
Productos:
</h3>



{pedido.productos.map((producto)=>(


<div
key={producto.id}
className="producto-pedido"
>


<span>

{producto.nombre}
{" x "}
{producto.cantidad}

</span>



<span>

$
{(
producto.precio *
producto.cantidad
).toFixed(2)}

</span>


</div>


))}




<hr />


<h3>
Total:
{" "}
${pedido.total.toFixed(2)}
</h3>



</div>


))


)}


</div>

);


}