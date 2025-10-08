"use client";
import "../globals.css";
import { StyledEngineProvider } from "@mui/material/styles";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

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
        <div className="sticky top-0 h-screen w-1/5 bg-white p-4">

          <Image
            className="m-4"
            src="/logoGrisSemillero.png"
            alt="Logo Semillero"
            width={250}
            height={85}
            priority
          />
          <div className="mx-auto mt-2 flex w-full flex-col justify-around">
            <Sidebar></Sidebar>
          </div>

          <button
            onClick={handleLogout} // Llama a la función mejorada
            className="text-md my-1 flex w-full grow items-center justify-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
          >
            {/* <span className="material-symbols-outlined">logout</span> */}
            <ArrowRightOnRectangleIcon className="w-5" />
            <p className="hidden font-bold md:block">Cerrar Sesión</p>
          </button>
        </div>
        <div id="container" className="w-4/5 p-5">
          {children}
        </div>
      </div>
      <Footer />
    </StyledEngineProvider>
  );
}
