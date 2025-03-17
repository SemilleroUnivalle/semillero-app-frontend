import Image from "next/image";
import Link from "next/link";
import { TextField } from "@mui/material";

export default function Login() {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">
      <h1>Iniciar sesión</h1>

      <form className="space-y-6" action="#" method="POST">
        {/* Campo Documento */}

        <input
          placeholder="Documento de identidad"
          type="text"
          name="documento"
          id="documento"
          required
          className="text-md peer mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Campo Contraseña */}

        <input
          type="password"
          name="contraseña"
          id="contraseña"
          placeholder="Contraseña"
          required
          className="text-md mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Botón de inicio */}

        <button
          type="submit"
          className="text-md mt-6 w-3/4 rounded-2xl bg-[#C20E1A] py-2 font-semibold text-white transition hover:bg-red-800"
        >
          Ingresar
        </button>
      </form>

      {/* Enlace de recuperación de contraseña */}
      <p className="text-md mt-4 cursor-pointer text-center text-[#C20E1A] hover:underline">
        ¿Olvidaste tu contraseña?
      </p>

      {/* Mensaje de registro */}
      <p className="text-md mt-4 text-center text-gray-600">
        Si es tu primera vez con nosotros deberás registrarte primero
      </p>

      {/* Botón de registro */}
      <Link href="/auth/registro">
        <button className="text-md mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
          Crear cuenta
        </button>
      </Link>
    </div>
  );
}
