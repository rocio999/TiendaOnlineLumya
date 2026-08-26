"use client";

import Link from "next/link";
import { useState } from "react";
import "./Login.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!aceptaTerminos) {
  setMensaje("Debes aceptar los términos y condiciones para ingresar.");
  return;
}
    try {
      const res = await fetch("http://brown-lark-804410.hostingersite.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
      "usuario",
      JSON.stringify(data.usuario)
);


      setMensaje("Login exitoso 🚀");

const redirect = localStorage.getItem("redirectAfterLogin");

if (redirect) {
  localStorage.removeItem("redirectAfterLogin");
  router.push(redirect);
} else {
  router.push("/cliente/catalogo");
}
 } catch {
    setMensaje("Error de conexión con el servidor");
  }
};

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-left">

          <div className="circle circle-one"></div>
          <div className="circle circle-two"></div>

          <div className="welcome-content">
            <h1>Bienvenidos a Lumya</h1>
            <p></p>

            <h3>
              A un solo clic.
            </h3>

            <p></p>
            
            <p>
              ¡Hola! Qué alegría verte por aquí.Gracias por unirte a nuestra comunidad
            </p>
          </div>

        </div>



        <div className="login-right">

          <div className="form-container">

            <h2>Iniciar Sesión</h2>

            <p className="subtitle">
              ¡Hola! Qué alegría verte por aquí.Gracias por unirte a nuestra comunidad
            </p>


            <div className="input-box">
              <span>👤</span>

              <input
                type="email"
                placeholder="Correo Electrónico"
                value={correo}
                onChange={(e)=>setCorreo(e.target.value)}
              />
            </div>



            <div className="input-box">

              <span>🔒</span>

              <input
              type={mostrarPassword ? "text" : "password"}
               placeholder="Contraseña"
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
                />

              <button 
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                 >
                {mostrarPassword ? (
               // Icono Ojo Abierto (Ver contraseña)
                <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                <circle cx="12" cy="12" r="3"/>
                  </svg>
               ) : (
                 // Icono Ojo Cerrado / Tachado (Ocultar contraseña)
                 <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a19.5 19.5 0 0 1 4.14-4.14m3.43-1.43A10.13 10.13 0 0 1 12 5c7 0 10 7 10 7a18.39 18.39 0 0 1-2.12 3.46"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                   <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    </svg>
                     )}
                </button>

            </div>



            <div className="options">


              <div>
            
                <Link href="/recuperar-contrasena">
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link href="/soporte">
                  Contactar soporte
                </Link>
              </div>

            </div>
            <div className="terms-login">
  <label>
    <input
      type="checkbox"
      checked={aceptaTerminos}
      onChange={(e) => setAceptaTerminos(e.target.checked)}
    />

    Acepto los{" "}
    <Link href="/terminos" target="_blank">
      términos y condiciones
    </Link>
    {" "}y la política de privacidad.
  </label>
</div>




            <button 
              className="btn-login"
              onClick={handleLogin}
            >
              Ingresar
            </button>



            <div className="separator">
              <span></span>
              Or
              <span></span>
            </div>


            <p className="register">

              No tienes una cuenta?

              <Link href="/cliente/registro">
                Crea una cuenta
              </Link>

            </p>




            {
              mensaje && (
                <p className="message">
                  {mensaje}
                </p>
              )
            }


          </div>


        </div>


      </div>

    </div>
  );
    }