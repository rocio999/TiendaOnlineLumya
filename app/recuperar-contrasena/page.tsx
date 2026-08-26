"use client";

import { useState } from "react";
import "./recuperar.css";

export default function RecuperarContrasena() {

  const [correo, setCorreo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cambiarPassword = async () => {

    if (!correo || !nuevaPassword || !confirmarPassword) {
      setMensaje("Complete todos los campos");
      return;
    }


    if (nuevaPassword !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }


    try {

      const res = await fetch(
        "http://brown-lark-804410.hostingersite.com/recuperar-contrasena",
        {
          method: "POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            correo,
            nuevaPassword
          })
        }
      );


      const data = await res.json();


      if(!res.ok){
        setMensaje(data.message);
        return;
      }


      setMensaje("✅ Contraseña actualizada correctamente");


    } catch {

      setMensaje("Error de conexión con el servidor");

    }

  };


return (

<div className="recuperar-container">

<div className="recuperar-card">

<h1>
🔐 Recuperar contraseña
</h1>


<input
type="email"
placeholder="Correo registrado"
value={correo}
onChange={(e)=>setCorreo(e.target.value)}
/>


<input
type="password"
placeholder="Nueva contraseña"
value={nuevaPassword}
onChange={(e)=>setNuevaPassword(e.target.value)}
/>


<input
type="password"
placeholder="Confirmar contraseña"
value={confirmarPassword}
onChange={(e)=>setConfirmarPassword(e.target.value)}
/>


<button onClick={cambiarPassword}>
Cambiar contraseña
</button>


<p>{mensaje}</p>


</div>

</div>

);

}