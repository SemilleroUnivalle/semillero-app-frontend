"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../config";

// Definición del tipo para los datos del formulario
interface LoginFormData {
  numero_documento: string;
  contrasena: string;
}

// Definición del tipo para la respuesta del backend
interface LoginResponse {
  refresh: string;
  access: string;
  token: string;
  tipo_usuario: string;
}

export default function Login() {
  const router = useRouter();

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    numero_documento: "",
    contrasena: "",
  });

  // Estado para manejar el indicador de carga
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de la página
    setIsLoading(true); // Activar indicador de carga

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();

        // Almacenar tokens en cookies o localStorage (según tu preferencia)
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("token", data.token);
        console.log("Token almacenado:", data.token);

        // Almacenar información adicional del usuario en localStorage (opcional)
        localStorage.setItem("user", JSON.stringify(data));

        // Redirigir según el tipo de usuario o fase de registro
        if (data.tipo_usuario === "administrador") {
          router.push("/admin/inicio"); // Página de admin
        } else {
          router.push("/estudiante/inicio"); // Página principal del estudiante
        }

        console.log("Inicio de sesión exitoso");
      } else if (response.status === 401) {
        alert("Credenciales incorrectas. Por favor, verifica tus datos.");
      } else {
        alert("Hubo un problema en el servidor. Intenta nuevamente más tarde.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor.");
    } finally {
      setIsLoading(false); // Desactivar indicador de carga
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
          name="numero_documento"
          id="numero_documento"
          value={formData.numero_documento}
          onChange={handleChange}
          required
          className="text-md peer mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Campo Contraseña */}
        <input
          type="password"
          name="contrasena"
          id="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="text-md mt-6 w-3/4 rounded-2xl border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#C20E1A]"
        />

        {/* Botón de inicio */}
        <button
          type="submit"
          disabled={isLoading} // Deshabilitar mientras se procesa
          className={`text-md mt-6 w-3/4 rounded-2xl bg-[#C20E1A] py-2 font-semibold text-white transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-800"
          }`}
        >
          {isLoading ? "Cargando..." : "Ingresar"}
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
