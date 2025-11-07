"use client";
import "../globals.css";
import { StyledEngineProvider } from "@mui/material/styles";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";

import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../config";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // Hook para redirigir

  const handleLogout = async () => {
    try {
      // Realiza la solicitud de logout
      await axios.post(
        `${API_BASE_URL}/logout/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      // Limpia el token del localStorage
      localStorage.removeItem("token");

      // Redirige al usuario a la página de login
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Inténtalo de nuevo.");
    }
  };
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-row">
        <Sidebar />
        <div id="container" className="w-4/5 p-5">
          {children}
        </div>
      </div>
      <Footer />
    </StyledEngineProvider>
  );
}
