"use client";
import "./registro.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!aceptaTerminos) {
      setMensaje("Debes aceptar los términos y condiciones para registrarte.");
      setLoading(false);
      return;
    }

    if (!nombre.trim() || !apellido.trim() || !correo.trim() || !password.trim()) {
      setMensaje("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://brown-lark-804410.hostingersite.com";
      const API_URL = rawApiUrl.replace(/\/+$/, ""); // 👈 Esto quita cualquier barra sobrante al final

      const res = await fetch(`${API_URL}/registro-cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Error al registrar";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = `Error del servidor (${res.status}): Asegúrate de que la ruta /registro-cliente exista en el backend.`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Registro exitoso:", data);

      setMensaje("Usuario creado 🚀. Redirigiendo...");
      setTimeout(() => router.push("/cliente/login"), 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        setMensaje(error.message);
      } else {
        setMensaje("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-container">
      {/* LADO IZQUIERDO: Formulario limpio con fondo blanco */}
      <div className="form-panel">
        <div className="brand-header">
          <img src="/lumia.png" className="img-logo" alt="Lumia" />
        </div>

        <div className="form-content">
          {/* Icono de usuario circular azul de la imagen */}
          <div className="avatar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>

          <h2>CREAR UNA CUENTA</h2>
          <p className="subtitle">Regístrate para continuar</p>

          <form onSubmit={handleRegistro}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="input-group password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? "🔓" : "🔒"}
              </button>
            </div>

            <div className="input-group password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password-btn"
              >
                {showConfirmPassword ? "🔓" : "🔒"}
              </button>
            </div>

            <div className="terms-container">
               <label>
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              Acepto los{" "}y autorizo el tratamiento de mis datos personales.
              <a 
                href="/terminos" 
                target="_blank"
                className="text-blue-600 underline"
              >
                términos y condiciones
              </a>{" "}
            </label>
              </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "CREANDO..." : "Registrarse"}
            </button>
          </form>

          {mensaje && <p className="status-message">{mensaje}</p>}
        </div>
        
        {/* Decoración de tres puntos en la parte inferior */}
        <div className="bottom-dots">•••</div>
      </div>

      {/* LADO DERECHO: Panel visual fluido con el degradado moderno */}
      <div className="visual-panel">
        <div className="visual-content">
          <h1>Welcome Lumya.</h1>
          <p>Crea tu cuenta dentro de nuestra plataforma lo que buscas a un clic de distancia 🛒.</p>
        </div>
      </div>
    </div>
  );
}