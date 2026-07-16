"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BANCOS = [
  "Banco Pichincha", "Banco Guayaquil", "Banco del Pacífico", "Banco Bolivariano",
  "Banco Produbanco", "Banco Internacional", "Banco General Rumiñahui", "Banco de Loja",
  "Banco Solidario", "Banco ProCredit", "Banco Machala", "Banco Amazonas",
  "Banco Capital", "Banco Diners Club", "Banco D-Miro", "Banco VisionFund Ecuador",
];

const COOPERATIVAS = [
  "Cooperativa JEP", "Cooperativa Jardín Azuayo", "Cooperativa Policía Nacional (COOPAC)",
  "Cooperativa 29 de Octubre", "Cooperativa Andalucía", "Cooperativa Riobamba",
  "Cooperativa Alianza del Valle", "Cooperativa CACPECO", "Cooperativa San Francisco",
  "Cooperativa Mego", "Cooperativa Cámara de Comercio de Ambato",
];

export default function RegistroVendedor() {
  const router = useRouter();
  const [formulario, setFormulario] = useState({
    nombrePropietario: "", nombreNegocio: "", correo: "", telefono: "",
    password: "", confirmarPassword: "", descripcion: "", cedula: "",
    banco: "", numeroCuenta: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formulario.password !== formulario.confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    console.log("Solicitud de vendedor:", formulario, "Logo:", logo);
    setMensaje("¡Solicitud enviada! Un administrador revisará tu cuenta pronto.");
    setTimeout(() => router.push("/vendedor/login"), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-lumya.png" alt="Lumya" width={80} height={80} className="rounded-xl mb-3" />
          <h1 className="text-2xl font-bold text-blue-900 text-center">Regístrate como Vendedor</h1>
          <p className="text-slate-400 text-sm mt-1 text-center">Completa tus datos para solicitar acceso</p>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl mb-5 text-center font-semibold text-sm ${
            mensaje.includes("no coinciden")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-emerald-100 text-emerald-700 border border-emerald-300"
          }`}>
            {mensaje.includes("no coinciden") ? "⚠️" : "✅"} {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-1">Datos personales</p>

          <input type="text" name="nombrePropietario" placeholder="Nombre del propietario"
            value={formulario.nombrePropietario} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <input type="text" name="cedula" placeholder="Cédula (10 dígitos)" maxLength={10}
            value={formulario.cedula} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <input type="email" name="correo" placeholder="Correo electrónico"
            value={formulario.correo} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <input type="tel" name="telefono" placeholder="Teléfono"
            value={formulario.telefono} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <input type="password" name="password" placeholder="Contraseña"
            value={formulario.password} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <input type="password" name="confirmarPassword" placeholder="Confirmar contraseña"
            value={formulario.confirmarPassword} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Tu negocio</p>

          <input type="text" name="nombreNegocio" placeholder="Nombre del negocio"
            value={formulario.nombreNegocio} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <textarea name="descripcion" placeholder="Describe tu negocio" rows={3}
            value={formulario.descripcion} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <div>
            <label className="text-blue-800 font-semibold text-xs block mb-1">Foto o logo de tu negocio</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-800 file:text-white file:font-semibold hover:file:bg-blue-900 transition cursor-pointer" />
          </div>

          <p className="text-blue-800 font-semibold text-xs uppercase tracking-wide mt-2">Información de pago</p>

          <select name="banco" value={formulario.banco} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required>
            <option value="">Selecciona banco o cooperativa</option>
            <optgroup label="Bancos">
              {BANCOS.map((b) => <option key={b} value={b}>{b}</option>)}
            </optgroup>
            <optgroup label="Cooperativas">
              {COOPERATIVAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>

          <input type="text" name="numeroCuenta" placeholder="Número de cuenta"
            value={formulario.numeroCuenta} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <button type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition mt-2">
            Solicitar Registro
          </button>

          <p className="text-center text-slate-500 text-sm mt-1">
            ¿Ya tienes cuenta?{" "}
            <Link href="/vendedor/login" className="text-blue-700 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}