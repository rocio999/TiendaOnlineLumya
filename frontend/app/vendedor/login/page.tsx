"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginVendedor() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const q = query(
        collection(db, "usuarios"),
        where("correo", "==", correo),
        where("rol", "==", "vendedor")
      );
      const resultado = await getDocs(q);

      if (resultado.empty) {
        setMensaje("Correo o contraseña incorrectos");
        setCargando(false);
        return;
      }

      const vendedorDoc = resultado.docs[0];
      const vendedor = vendedorDoc.data();

      // NOTA: comparación directa de texto plano por ahora.
      // Se debe reemplazar por verificación con hash (bcrypt) desde el backend.
      if (vendedor.password !== password) {
        setMensaje("Correo o contraseña incorrectos");
        setCargando(false);
        return;
      }

      if (vendedor.estado === "pendiente") {
        setMensaje("Tu solicitud aún está pendiente de aprobación por el administrador.");
        setCargando(false);
        return;
      }

      if (vendedor.estado === "suspendido") {
        setMensaje("Tu cuenta está suspendida. Contacta al administrador.");
        setCargando(false);
        return;
      }

      if (vendedor.estado === "rechazado") {
        setMensaje("Tu solicitud fue rechazada. Contacta al administrador si crees que es un error.");
        setCargando(false);
        return;
      }

      if (vendedor.estado !== "activo") {
        setMensaje("Tu cuenta no tiene acceso habilitado. Contacta al administrador.");
        setCargando(false);
        return;
      }

      // Login exitoso — guardamos el id del vendedor para usarlo en el resto del panel
      localStorage.setItem("vendedorId", vendedorDoc.id);
      localStorage.setItem("vendedorNombre", vendedor.nombreNegocio || vendedor.nombre);

      router.push("/vendedor");
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <Image src="/logo-lumya.png" alt="Lumya" width={100} height={100} className="mb-6 rounded-xl" />
          <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-white text-3xl mb-6">
            🏪
          </div>

          {mensaje && (
            <div className="w-full bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-4 text-center text-sm font-semibold">
              ⚠️ {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-full px-5 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
              required
            />
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-full transition disabled:opacity-50"
            >
              {cargando ? "Verificando..." : "Iniciar Sesión"}
            </button>
            <p className="text-center text-slate-500 text-sm mt-1">
              ¿No tienes cuenta?{" "}
              <Link href="/vendedor/registro" className="text-blue-700 font-semibold hover:underline">
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center items-center text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Bienvenido, Vendedor</h1>
          <p className="text-lg text-blue-100">Gestiona tus productos en Lumya</p>
        </div>

      </div>
    </div>
  );
}