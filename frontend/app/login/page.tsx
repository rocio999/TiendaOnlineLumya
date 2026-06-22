import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/loginlumia.png')" }}
    >

      
      <div className="absolute inset-0 bg-black/70" />

      
      <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">

        
        <div>
          <h1 className="text-4xl font-bold mb-8 text-white">
            Accede a tu cuenta
          </h1>
        </div>

        
        <div className="flex flex-col gap-4">

          
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="p-3 bg-gray-100 text-black border-2 border-purple-500"
            />

            <Link href="/recuperar-correo">
              <span className="text-sm underline mt-1 cursor-pointer italic">
                ¿Olvidaste tu correo?
              </span>
            </Link>
          </div>

          
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Contraseña"
              className="p-3 bg-gray-100 text-black"
            />

            <Link href="/recuperar-contrasena">
              <span className="text-sm underline mt-1 cursor-pointer italic">
                ¿Olvidaste tu contraseña?
              </span>
            </Link>
          </div>

          
          <button className="bg-blue-900 text-white py-3 px-8 mt-4 hover:bg-blue-800 transition-colors">
            Ingresar
          </button>

        </div>
      </div>
    </div>
  );
}