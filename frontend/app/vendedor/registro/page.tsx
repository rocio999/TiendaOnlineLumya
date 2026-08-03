/* eslint-disable @typescript-eslint/no-explicit-any */
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
    banco: "", numeroCuenta: "", whatsapp: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [qrPago, setQrPago] = useState<File | null>(null);
  const [qrDeUna, setQrDeUna] = useState<File | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // <--- Nuevo estado para los términos
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };
  
// Función auxiliar para convertir archivo a Base64
  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formulario.password !== formulario.confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (!aceptaTerminos) {
      setMensaje("Debes leer y aceptar los Términos y Condiciones para continuar.");
      return;
    }

    setCargando(true);
    try {
      // Convertimos el QR a Base64 si el usuario seleccionó uno
      let qrBase64 = "";
      if (qrPago) {
        qrBase64 = await convertirABase64(qrPago);
      }
      let deUnaBase64 = "";
      if (qrDeUna) {
        deUnaBase64 = await convertirABase64(qrDeUna);
      }

      const res = await fetch("http://localhost:3001/registro-vendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombrePropietario,
          cedula: formulario.cedula,
          correo: formulario.correo,
          telefono: formulario.telefono,
          password: formulario.password,
          nombreNegocio: formulario.nombreNegocio,
          descripcion: formulario.descripcion,
          banco: formulario.banco,
          numeroCuenta: formulario.numeroCuenta,
          whatsapp: formulario.whatsapp,
          qrUrl: qrBase64,
          qrDeUnaUrl: deUnaBase64,
          aceptaTerminos: aceptaTerminos,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Ocurrió un error al enviar la solicitud");
        setCargando(false);
        return;
      }

      setMensaje("¡Solicitud enviada! Un administrador revisará tu cuenta pronto.");
      setTimeout(() => router.push("/vendedor/login"), 2500);
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } finally {
      setCargando(false);
    }
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
            mensaje.includes("no coinciden") || mensaje.includes("error") || mensaje.includes("registrado") || mensaje.includes("conectar") || mensaje.includes("aceptar")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-emerald-100 text-emerald-700 border border-emerald-300"
          }`}>
            {mensaje.includes("no coinciden") || mensaje.includes("error") || mensaje.includes("registrado") || mensaje.includes("conectar") || mensaje.includes("aceptar") ? "⚠️" : "✅"} {mensaje}
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

          <input type="tel" name="whatsapp" placeholder="Número de WhatsApp (ej: 593999999999)"
            value={formulario.whatsapp} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />

          <div>
            <label className="text-blue-800 font-semibold text-xs block mb-1">Código QR de pago (Imagen)</label>
            <input type="file" accept="image/*" onChange={(e) => setQrPago(e.target.files?.[0] || null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:text-white file:font-semibold hover:file:bg-emerald-800 transition cursor-pointer" />
          </div>

          <div>
            <label className="text-blue-800 font-semibold text-xs block mb-1">Código QR "De una" (Imagen)</label>
            <input type="file" accept="image/*" onChange={(e) => setQrDeUna(e.target.files?.[0] || null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-purple-700 file:text-white file:font-semibold hover:file:bg-purple-800 transition cursor-pointer" />
          </div>

          {/* SECCIÓN DE TÉRMINOS Y CONDICIONES (SOLO INFORMATIVA) */}
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-blue-900 font-bold text-xs uppercase tracking-wide mb-2">Términos, Condiciones y Privacidad para Vendedores</h3>
            
            <div className="h-36 overflow-y-auto text-xs text-slate-600 bg-white p-3 border border-slate-200 rounded-lg space-y-2">
              <p><strong>TÉRMINOS Y CONDICIONES PARA VENDEDORES - TIENDA ONLINE LUMYA</strong></p>
              
              <p><strong>1. Objeto y Naturaleza de la Relación Comercial</strong><br />
              Los presentes Términos y Condiciones regulan el vínculo contractual entre Tienda Online Lumya y la persona natural que se registra en la plataforma con el rol de Vendedor/Proveedor para ofrecer, comercializar y vender sus productos a los usuarios finales.<br />
              <em>Fundamento legal:</em> Código de Comercio del Ecuador y la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos.</p>

              <p><strong>2. Capacidad Legal y Requisitos de Registro del Vendedor</strong><br />
              Para registrarse como vendedor en Tienda Online Lumya, el usuario declara ser mayor de edad, tener plena capacidad jurídica y encontrarse legalmente autorizado para operar en el territorio ecuatoriano proporcionando información veraz.</p>

              <p><strong>3. Protección y Tratamiento de Datos Personales del Vendedor</strong><br />
              Tienda Online Lumya recopilará información del vendedor con la única finalidad de gestionar su cuenta, validar su identidad y permitir la operatividad del marketplace conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP).</p>

              <p><strong>4. Derechos y Obligaciones sobre la Propiedad Intelectual e Imágenes</strong><br />
              El vendedor otorga a Tienda Online Lumya una licencia gratuita y temporal para utilizar, reproducir y exhibir las marcas, logotipos, fotografías y descripciones de sus productos dentro de la plataforma digital con fines de promoción y venta.</p>

              <p><strong>5. Modelo de Tarifas, Comisiones y Gratuidad</strong><br />
              Actualmente, el registro, uso de la infraestructura digital y publicación de productos en Tienda Online Lumya tienen carácter gratuito para el vendedor. Sin embargo, la plataforma se reserva el derecho de establecer comisiones por transacción o tarifas por servicios en el futuro, lo cual será debidamente notificado a los vendedores con la debida anticipación para su aceptación y aplicación.<br />
              <em>Fundamento legal:</em> Principio de autonomía de la voluntad y libertad contractual consagrado en el Código Civil Ecuatoriano.</p>

              <p><strong>6. Responsabilidad sobre la Calidad, Envíos y Garantías</strong><br />
              El vendedor es el único y exclusivo responsable frente a los compradores por la calidad, idoneidad, seguridad y entrega oportuna de los productos ofertados, cumpliendo con la Ley Orgánica de Defensa del Consumidor (LODC).</p>

              <p><strong>7. Suspensión, Bloqueo o Cierre de Cuenta</strong><br />
              Tienda Online Lumya se reserva el derecho de suspender o dar de baja de forma temporal o definitiva la cuenta de cualquier vendedor que incumpla con los presentes términos o afecte la reputación de la plataforma.</p>

              <p><strong>8. Jurisdicción y Ley Aplicable</strong><br />
              Cualquier controversia derivada de estos Términos y Condiciones se resolverá ante los jueces competentes de la República del Ecuador.</p>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input 
                type="checkbox" 
                id="aceptaTerminos" 
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="w-4 h-4 text-blue-800 border-slate-300 rounded focus:ring-cyan-400 cursor-pointer"
                required
              />
              <label htmlFor="aceptaTerminos" className="text-xs text-slate-700 cursor-pointer">
                He leído y acepto los <strong>Términos y Condiciones para Vendedores</strong> y el tratamiento de datos personales. *
              </label>
            </div>
          </div>

          <button type="submit" disabled={cargando}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition mt-2 disabled:opacity-50">
            {cargando ? "Enviando..." : "Solicitar Registro"}
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