'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export default function Inicio() {
  const router = useRouter(); // Inicializa el hook useRouter

  const handleLogout = async () => {
    try {
      // Obtén el token (puede ser desde localStorage, cookies, o algún estado global)
      const token = localStorage.getItem("token"); // Ejemplo: desde localStorage
      console.log("Token en inicio:", token); // Verifica si el token se obtiene correctamente

      if (!token) {
        console.error("No se encontró el token");
        return;
      }

      // Realiza la solicitud de logout con el token en los encabezados
      const response = await axios.post(
        `${API_BASE_URL}/logout/`,
        {}, // Cuerpo vacío si no se requiere
        {
          headers: {
            Authorization: `Token ${token}`, // Incluye el token en el encabezado
          },
        }
      );

      console.log("Sesión cerrada exitosamente:", response.data);
      // Limpia el token de localStorage
      localStorage.removeItem("token");

      // Redirige al usuario a la página de inicio de sesión
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="pt-4">
      <div className="mx-auto w-3/4 rounded-lg bg-white p-5 text-center content-center">
        <h2 className="font-semibold text-primary text-lg"> Bienvenido/a estudiante</h2>

        <div className="w-full">
          <Image
            className="mt-3 mx-auto"
            src="/oferta_2025A.jpg"
            alt="Logo Semillero"
            width={516}
            height={516}
            priority
          />
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}