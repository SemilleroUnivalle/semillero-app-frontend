"use client";

import "../globals.css";

import { StyledEngineProvider } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

import Navbar from "../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
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
        },
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
    <StyledEngineProvider injectFirst>
      <div className="">
        <div className="bg-white p-4">
          <div className="flex justify-between">
            <h1 className="">Semillero Univalle</h1>
            <LogoutIcon
              onClick={handleLogout}
              className="size-9 cursor-pointer p-1 text-primary hover:rounded-full hover:bg-primary hover:text-white"
            />
          </div>

          <div className="mx-auto flex w-3/4 items-center justify-around rounded-2xl bg-[#e8e8e8] p-2">
            <Navbar></Navbar>
          </div>
        </div>
        <div id="container" className="w-full">
          {children}
        </div>
      </div>
    </StyledEngineProvider>
  );
}
