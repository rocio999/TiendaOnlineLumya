"use client";

import Link from "next/link";
import "./soporte.css";

export default function Soporte(){

return(

<div className="soporte-container">

<div className="soporte-card">

<h1>🛠 Soporte Lumya</h1>

<p>
¿Necesitas ayuda con tu cuenta?
Estamos para ayudarte.
</p>


<div className="soporte-item">
📧 Correo:
<strong>
 soporte.lumya2026@gmail.com
</strong>
</div>


<div className="soporte-item">
📱 WhatsApp:
<strong>
 +593 999 999 999 (En Mantenimiento)
</strong>
</div>


<p className="mensaje">
Indícanos tu nombre, correo registrado
y el problema que presentas.
</p>


<Link href="/cliente/login">
<button>
Volver al inicio
</button>
</Link>


</div>

</div>

)

}