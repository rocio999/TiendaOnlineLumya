import Link from "next/link";
export default function Home() {
  return (

    <div className="relative min-h-screen w-full">

      {}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lumia.png')", // pon tu imagen en /public
        }}
      />

      {/* 🌑 Capa oscura para que el texto se vea */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 🧭 Barra superior */}
      <header className="relative z-10 flex justify-between items-center px-8 py-5 text-white">
        
        <h1 className="text-xl font-bold fond- sans">
          Tienda Online Lumya
        </h1>

        <div className="flex flex-col gap-3 items-end"> 
    
    <Link href="/login">
      <span className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer text-center w-full min-w-[140px]">
        Iniciar sesión
      </span>
    </Link>

    <div className="text-sm text-white text-right">
      <p>¿No tienes cuenta aún?</p>
      <Link href="/registro">
        <span className="text-blue-500 underline hover:text-blue-400 cursor-pointer font-bold">
          Regístrate 
        </span>
      </Link>
    </div>

  </div>
      </header>

      {/* 🏠 Contenido central */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 text-white">

        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenido a  Lumya 🛍️
        </h2>

        <p className="text-lg md:text-xl max-w-2xl">
           Una plataforma donde clientes pueden comprar productos fácilmente
          y vendedores pueden publicar y gestionar su catálogo en línea.
        </p>

      </main>

    </div>
  );
}