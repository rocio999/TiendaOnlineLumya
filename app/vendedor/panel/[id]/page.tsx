"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import "./pedidos.css";

export default function DetallePedido() {

  const params = useParams();

  const id = params.id;

  const [estado, setEstado] = useState("Pendiente");
    const actualizarEstado = () => {
  console.log("Pedido:", id);
  console.log("Nuevo estado:", estado);

  alert(`Pedido actualizado a: ${estado}`);
};

  return (
    <div className="pedido-container">

      <div className="pedido-header">

        <h1>
          Detalle del Pedido #{id}
        </h1>

        <Link href="/vendedor">
          <button className="btn-volver">
            ← Volver a pedidos
          </button>
        </Link>

      </div>


      <div className="pedido-grid">


        {/* Datos del cliente */}
        <div className="pedido-card">

          <h2>
            👤 Datos del Cliente
          </h2>

          <p>
            <strong>Nombre:</strong> Juan Pérez
          </p>

          <p>
            <strong>Teléfono:</strong> 0999999999
          </p>

          <p>
            <strong>Correo:</strong> juan@gmail.com
          </p>

        </div>



        {/* Entrega */}
        <div className="pedido-card">

          <h2>
            🚚 Entrega
          </h2>

          <p>
            Servientrega
          </p>

          <p>
            Dirección:
            Quito - Ecuador
          </p>

        </div>



        {/* Pago */}
        <div className="pedido-card">

          <h2>
            💰 Información del Pago
          </h2>

          <p>
            Método:
            Transferencia
          </p>

          <p>
            Estado:
          </p>
            <p>
                
            </p>
          <span className="estado-pendiente">
  {estado}
</span>

        </div>



        {/* Totales */}
        <div className="pedido-card">

          <h2>
            📦 Resumen
          </h2>


          <p>
            Total:
            <strong> $30</strong>
          </p>


          <p>
            Abono:
            <strong> $10</strong>
          </p>


          <p>
            Saldo pendiente:
            <strong> $20</strong>
          </p>


        </div>


      </div>



      {/* Productos */}
      <div className="productos-card">

        <h2>
          🛒 Productos comprados
        </h2>


        <table>

          <thead>

            <tr>

              <th>
                Producto
              </th>

              <th>
                Cantidad
              </th>

              <th>
                Precio
              </th>

            </tr>

          </thead>


          <tbody>

            <tr>

              <td>
                Camiseta negra
              </td>

              <td>
                2
              </td>

              <td>
                $20
              </td>

            </tr>


            <tr>

              <td>
                Gorra deportiva
              </td>

              <td>
                1
              </td>

              <td>
                $10
              </td>

            </tr>


          </tbody>


        </table>


      </div>



      {/* Estado pedido */}

      <div className="acciones-card">

        <h2>
          🔄 Estado del pedido
        </h2>


        <select
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
>

  <option value="Pendiente">
    Pendiente
  </option>

  <option value="Preparando">
    Preparando
  </option>

  <option value="Enviado">
    Enviado
  </option>

  <option value="Entregado">
    Entregado
  </option>

</select>


        <button 
  className="btn-actualizar"
  onClick={actualizarEstado}
>
  Actualizar estado
</button>


      </div>


    </div>
  );
}