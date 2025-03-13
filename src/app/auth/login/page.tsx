import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
<<<<<<< HEAD
    <div className="">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-11 text-center shadow-md md:max-w-2xl">
        <h1>Iniciar Sesión</h1>
=======
   
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">
        <h1>Iniciar sesión</h1>

>>>>>>> e81d02fa03943ebade2d7e9c65e66fe0f1932c5c
        <form className="space-y-6" action="#" method="POST">
          {/* Campo Documento */}

          <input
            placeholder="Documento de identidad"
            type="text"
            name="documento"
            id="documento"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
          />

          {/* Campo Contraseña */}

          <input
            type="password"
            name="contraseña"
            id="contraseña"
            placeholder="Contraseña"
            required
            className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
          />

          {/* Botón de inicio */}

          <button
            type="submit"
            className="mt-6 w-3/4 rounded-2xl bg-[#C20E1A] py-2 text-lg font-semibold text-white transition hover:bg-red-800"
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
<<<<<<< HEAD
          <button className="mt-4 w-3/4 rounded-2xl border-2 text-lg border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
=======
          <button className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 text-lg font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">

>>>>>>> e81d02fa03943ebade2d7e9c65e66fe0f1932c5c
            Crear cuenta
          </button>
        </Link>
      </div>
<<<<<<< HEAD

      <footer className=""></footer>
    </div>
=======
>>>>>>> e81d02fa03943ebade2d7e9c65e66fe0f1932c5c
  );
}
