"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./panel.css";


interface Pedido {
  id: string;

  pagoId?: string;

  cliente: {
    nombre?: string;
    apellido?: string;
    correo?: string;
  };

  productos: Producto[];

  total: number;

  metodoPago: string;

  estadoPago?: "pendiente" | "aprobado" | "rechazado";

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


export default function PanelVendedor() {

const [pedidos, setPedidos] = useState<Pedido[]>([]);


useEffect(() => {
  const cargarPedidos = async () => {
    const vendedorId = localStorage.getItem("vendedorId");
    if (!vendedorId) return;
    try {
      const res = await fetch("http://localhost:3001/pagos");
      const data = await res.json();
      const misPagos = data.filter((p: any) => p.vendedorId === vendedorId);
      const pedidosTransformados: Pedido[] = misPagos.map((p: any) => ({
        id: p.id,
        pagoId: p.id,
        cliente: { nombre: p.clienteNombreResuelto || "Cliente" },
        productos: [{ nombre: p.producto, precio: p.monto, cantidad: 1 }] as any,
        total: p.monto,
        metodoPago: p.metodo || "efectivo",
        tipoEntrega: p.tipoEntrega || "",
        provincia: p.provincia || "",
        ciudad: p.ciudad || "",
        direccion: p.direccion || "",
        referencia: p.referencia || "",
        cooperativa: p.cooperativa || "",
        ciudadDestino: p.ciudadDestino || "",
        estadoPago: p.estado,
        estado: p.estado,
        fecha: p.fecha?._seconds
          ? new Date(p.fecha._seconds * 1000).toISOString()
          : new Date().toISOString(),
      }));
      setPedidos(pedidosTransformados);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };
  cargarPedidos();
}, []);



// cambiar estado pedido

const cambiarEstado = (id:string, nuevoEstado:string)=>{

const actualizados = pedidos.map((pedido)=>
pedido.id === id
? {...pedido, estado:nuevoEstado}
: pedido
);


setPedidos(actualizados);


localStorage.setItem(
"pedidos",
JSON.stringify(actualizados)
);

};



const pendientes = pedidos.filter(
(p)=>p.estado==="pendiente"
).length;


const preparando = pedidos.filter(
(p)=>p.estado==="preparando"
).length;


const entregados = pedidos.filter(
(p)=>p.estado==="entregado"
).length;


const ingresos = pedidos.reduce(
(acc,p)=>acc+p.total,
0
);


const cambiarEstadoPago = async (
id:string,
nuevoEstado:"pendiente"|"aprobado"|"rechazado"
)=>{

try{

const pedido = pedidos.find(
(p)=>p.id===id
);

if(!pedido?.pagoId) return;

await fetch(
`http://localhost:3001/pagos/${pedido.pagoId}/estado`,
{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

estado:nuevoEstado

})

}

);

const nuevos = pedidos.map((p)=>

p.id===id
?{
...p,
estadoPago:nuevoEstado
}
:p

);

setPedidos(nuevos);

localStorage.setItem(
"pedidos",
JSON.stringify(nuevos)
);

}catch(error){

console.log(error);

}

};
return (

<div className="panel-container">


<h1 className="panel-title">
Panel del Vendedor
</h1>



<div className="panel-cards">


<div className="card">
<h2>Pedidos pendientes</h2>
<p className="yellow">
{pendientes}
</p>
</div>



<div className="card">
<h2>En preparación</h2>
<p className="blue">
{preparando}
</p>
</div>



<div className="card">
<h2>Entregados</h2>
<p className="green">
{entregados}
</p>
</div>



<div className="card">
<h2>Ingresos</h2>
<p className="purple">
${ingresos}
</p>
</div>


</div>





<div className="orders-box">


<h2 className="text-2xl font-semibold mb-5">
Pedidos recibidos
</h2>



<table className="orders-table">


<thead>

<tr className="bg-blue-600 text-white">

<th>Pedido</th>
<th>Cliente</th>
<th>Productos</th>
<th>Entrega</th>
<th>Pago</th>
<th>Estado Pago</th>
<th>Total</th>
<th>Estado</th>
<th>Acción</th>

</tr>

</thead>



<tbody>


{pedidos.map((pedido)=>(


<tr key={pedido.id}>


<td>
#{pedido.id.slice(0,6)}
</td>



<td>

{pedido.cliente.nombre}
{" "}
{pedido.cliente.apellido}

</td>




<td>
  {pedido.productos.map((p, index) => (
    <div key={p.id || index}>
      {p.nombre} x {p.cantidad}
    </div>
  ))}
</td>





<td>

{pedido.tipoEntrega==="Servientrega" && (
<div>
🚚 Servientrega
<br/>
{pedido.ciudad}
<br/>
{pedido.direccion}
</div>
)}



{pedido.tipoEntrega==="Cooperativa" && (
<div>
🚌Cooperativa {pedido.cooperativa}
<br/>
Destino: 
{pedido.ciudadDestino}
</div>
)}



{pedido.tipoEntrega==="Retiro" && (
<div>
🏪 Retiro tienda
</div>
)}


</td>




<td>

{pedido.metodoPago === "Transferencia"
  ? "🏦 Transferencia"
  : "💵 Efectivo"}

</td>
<td>

<span
className={`estado-pago ${
pedido.estadoPago || "pendiente"
}`}
>

{pedido.estadoPago || "pendiente"}

</span>

</td>




<td>

${pedido.total}

</td>




<td>

<span className={`estado ${pedido.estado}`}>
{pedido.estado}
</span>

</td>


<td>
{pedido.estadoPago==="pendiente" ? (
<div className="acciones-pago">
<button
className="btn-aprobar"
onClick={()=>cambiarEstadoPago(
pedido.id,
"aprobado"
)}
>
✓ Pago
</button>
<button
className="btn-rechazar"
onClick={()=>cambiarEstadoPago(
pedido.id,
"rechazado"
)}
>
✗ Pago
</button>
</div>
) : (
<button
className="btn-revertir"
onClick={()=>cambiarEstadoPago(pedido.id, "pendiente")}
>
↺ Revertir
</button>
)}
</td>
<td>


{pedido.estado==="pendiente" && (

pedido.estadoPago==="aprobado"

?

(

<button

className="btn-ver"

onClick={()=>cambiarEstado(

pedido.id,

"preparando"

)}

>

Aceptar pedido

</button>

)

:

(

<span className="text-red-600 text-sm">

Esperando aprobación del pago

</span>

)

)}



{pedido.estado==="preparando" && (

<button
className="btn-ver"
onClick={()=>cambiarEstado(
pedido.id,
"enviado"
)}
>
Enviar
</button>

)}



{pedido.estado==="enviado" && (

<button
className="btn-ver"
onClick={()=>cambiarEstado(
pedido.id,
"entregado"
)}
>
Entregado
</button>

)}



</td>



</tr>


))}


</tbody>


</table>


</div>




<Link href="/vendedor">

<button className="btn-volver">
← Volver a Productos
</button>

</Link>



</div>

);

}