"use client";

import Link from "next/link";
import { useState } from "react";
import { API_BASE_URL } from "../../../../config";


export default function Login() {
  const [formData, setFormData] = useState({
    numero_identificacion: "",
    password: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de la página

    try {
      const response = await fetch(`${API_BASE_URL}/student/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Inicio de sesion exitoso");
        alert("Usuario ingresado con éxito");
      } else {
        console.error("Error en el inicio de sesion", formData);

        alert("Hubo un problema en el inicio de sesion");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">
      <h1>Iniciar sesión</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Campo Documento */}

        <input
          placeholder="Documento de identidad"
          type="text"
          name="numero_identificacion"
          id="numero_identificacion"
          value={formData.numero_identificacion}
          onChange={handleChange}
          required
          className="text-md peer mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Campo Contraseña */}

        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
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
