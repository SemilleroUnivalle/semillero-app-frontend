"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    email: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de la página

    try {
      const response = await fetch("http://127.0.0.1:8000/register/initial/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Registro exitoso");
        alert("Usuario registrado con éxito");
      } else {
        console.error("Error en el registro");
        alert("Hubo un problema en el registro");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">
      <h1>Crear cuenta</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Campos Nombres y Apellidos */}
        <input
          placeholder="Nombres"
          type="text"
          name="nombre"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="text-md mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        <input
          placeholder="Apellidos"
          type="text"
          name="apellidos"
          id="apellidos"
          value={formData.apellidos}
          required
          className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Campo Documento */}

        <input
          placeholder="Documento de identidad"
          type="text"
          name="documento"
          id="documento"
          value={formData.documento}
          onChange={handleChange}
          required
          className="mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Campo Correo electrónico */}

        <input
          placeholder="Correo electrónico"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
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
