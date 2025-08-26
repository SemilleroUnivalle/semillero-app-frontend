"use client";

import { API_BASE_URL } from "../../../../config";
import { useState } from "react";


export default function CambiarContrasena() {
  interface LoginFormData {
  numero_documento: string;
}
    const [formData, setFormData] = useState<LoginFormData>({
    numero_documento: "",
    });

    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // Evitar recarga de la página
  
      try {
        const response = await fetch(`${API_BASE_URL}/recuperacion_contrasena/password_reset/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
        alert("Si el documento existe, recibirás instrucciones para recuperar tu contraseña.");
      } else if (response.status === 401) {
        alert("Credenciales incorrectas. Por favor, verifica tus datos.");
      } else {
        alert("Hubo un problema en el servidor. Intenta nuevamente más tarde.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-11 px-0 text-center shadow-md md:max-w-xl">
      <h2>Recuperar contraseña</h2>
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
    <button
          type="submit"
          className="mt-6 w-3/4 rounded-2xl bg-primary px-4 py-2 text-white font-semibold hover:bg-red-800"
        >
          Recuperar contraseña
        </button>
      </form>
    </div>
  );
}
