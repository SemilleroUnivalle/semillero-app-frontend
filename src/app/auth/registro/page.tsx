import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">

        <h1>Crear cuenta</h1>
        <form className="space-y-6" action="#" method="POST">
          {/* Campos Nombres y Apellidos */}
          <input
            placeholder="Nombres"
            type="text"
            name="nombre"
            id="nombre"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center text-md focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"

          />

          <input
            placeholder="Apellidos"
            type="text"
            name="apellidos"
            id="apellidos"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
          />

          {/* Campo Documento */}

          <input
            placeholder="Documento de identidad"
            type="text"
            name="documento"
            id="documento"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
          />

          {/* Campo Correo electrónico */}

          <input
            placeholder="Correo electrónico"
            type="email"
            name="email"
            id="email"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
          />

          {/* Botón de inicio */}

          <button
            type="submit"
            className="mt-6 w-3/4 rounded-2xl bg-[#C20E1A] py-2 font-semibold text-white transition hover:bg-red-800"
          >
            Registrarse
          </button>
        </form>

        {/* Botón de registro */}
        <Link href="/auth/login">
          <button className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
            Iniciar sesión
          </button>
        </Link>
      </div>
  );
}
