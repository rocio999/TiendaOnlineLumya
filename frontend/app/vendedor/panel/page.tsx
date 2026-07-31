"use client";

import Link from "next/link";
import "./panel.css";

export default function PanelVendedor() {
  return (
<div className="panel-container">
      <h1 className="panel-title">
    Panel del Vendedor
</h1>

      {/* Tarjetas */}
            <div className="panel-cards">
            <div className="card">
              <h2 className="text-gray-500">Pedidos pendientes</h2>
<p className="yellow">5</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">En preparación</h2>
<p className="blue">2</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Entregados</h2>
<p className="green">18</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Ingresos</h2>
<p className="purple">$420</p>
        </div>

      </div>

      {/* Lista */}
<div className="orders-box">
<div className="orders-header">
          <h2 className="text-2xl font-semibold">
            Pedidos
          </h2>

          <input
            type="text"
            placeholder="Buscar pedido..."
            className="border rounded-lg px-4 py-2"
          />

        </div>

<table className="orders-table">
          <thead>

            <tr className="bg-blue-600 text-white">

              <th className="p-3">Pedido</th>
<th className="p-3">Cliente</th>
<th className="p-3">Entrega</th>
<th className="p-3">Pago</th>
<th className="p-3">Total</th>
<th className="p-3">Estado Pago</th>
<th className="p-3">Estado Pedido</th>
<th className="p-3">Acción</th>
            </tr>

          </thead>

          <tbody>

            <tr className="border-b">

  <td className="p-3">#001</td>

  <td className="p-3">Juan Pérez</td>

  <td className="p-3">🚚 Servientrega</td>

  <td className="p-3">💳 Transferencia</td>

  <td className="p-3">$30</td>

  <td className="p-3">
  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
    Pendiente
  </span>
</td>

  <td className="p-3">
    <span className="estado pendiente">
      Pendiente
    </span>
  </td>

  <td className="p-3">
    <Link href="/vendedor/panel/1">
  <button className="btn-ver">
    Ver
  </button>
</Link>
  </td>

</tr>

           <tr className="border-b">

  <td className="p-3">#002</td>

  <td className="p-3">María López</td>

  <td className="p-3">🏪 Retiro en tienda</td>

  <td className="p-3">💵 Efectivo</td>

  <td className="p-3">$42</td>
  <td className="p-3">
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
    Pagado
  </span>
</td>

  <td className="p-3">
    <span className="estado preparando">
      Preparando
    </span>
  </td>

  <td className="p-3">
    <Link href="/vendedor/panel/2">
  <button className="btn-ver">
    Ver
  </button>
</Link>
  </td>

</tr>

          </tbody>

        </table>

      </div>

      <div className="mt-8">

        <Link href="/vendedor/productos">
<button className="btn-volver">
                ← Volver a Productos
          </button>
        </Link>

      </div>

    </div>
  );
}