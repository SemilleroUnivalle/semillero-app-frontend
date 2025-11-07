"use client";

import {
  UsersIcon,
  TagIcon,
  HomeIcon,
  BookOpenIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../config";

type LinkItem = {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: LinkItem[]; // <-- Permite submenús
};

// Links para administrador
const adminLinks = [
  { name: "Inicio", href: "/admin/inicio", icon: HomeIcon },
  { name: "Registros", href: "/admin/registros/verRegistros", icon: UsersIcon },
  {
    name: "Matrículas",
    href: "/admin/matriculas/verMatriculas",
    icon: AssignmentIndOutlinedIcon,
  },
  {
    name: "Funcionarios",
    href: "/admin/funcionarios/visualizar-funcionarios",
    icon: GroupWorkOutlinedIcon,
  },
  {
    name: "Programación Académica",
    icon: LocalLibraryOutlinedIcon,
    children: [
      { name: "Cursos", href: "/admin/cursos/verCursos", icon: BookOpenIcon },
      {
        name: "Oferta Académica",
        href: "/admin/oferta/verOfertas",
        icon: TagIcon,
      },
      { name: "Grupos", href: "/admin/grupos/ver-grupos", icon: UsersIcon },
    ],
  },
  {
    name: "Asistencias",
    href: "/admin/asistencias/ver-asistencias",
    icon: InventoryOutlinedIcon,
  },

  {
    name: "Estadisticas",
    href: "/admin/estadisticas",
    icon: AnalyticsOutlinedIcon,
  },

  { name: "Ajustes", href: "/admin/ajustes/ajustes", icon: CogIcon },
];

// Links para profesor
const profesorLinks = [
  { name: "Perfil", href: "/docente/perfil", icon: UsersIcon },
  {
    name: "Asistencia",
    href: "/docente/asistencia",
    icon: InventoryOutlinedIcon,
  },
  {
    name: "Visualizador",
    href: "/docente/visualizador",
    icon: ContentPasteSearchOutlinedIcon,
  },
  { name: "Calificación", href: "/docente/calificacion", icon: TagIcon },
];

export default function NavLinks() {
  const router = useRouter(); // Hook para redirigir

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [tipoUsuario, setTipoUsuario] = useState(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const usuario = JSON.parse(userData);
          setTipoUsuario(usuario.tipo_usuario);
        } catch {
          setTipoUsuario(null);
        }
      }
    }
  }, []);

  let links: LinkItem[] = [];
  if (tipoUsuario === "administrador") {
    links = adminLinks;
  } else if (tipoUsuario === "profesor") {
    links = profesorLinks;
  }

  return (
    <div className="sticky top-0 h-screen w-1/5 bg-white p-4">
      <Image
        className="m-4"
        src="/logoSemillero.png"
        alt="Logo Semillero"
        width={250}
        height={85}
        priority
      />

      <nav>
        {links.map((link) => {
          const LinkIcon = link.icon;
          const hasChildren = !!link.children;

          return (
            <div key={link.name}>
              {hasChildren ? (
                <div
                  className={`text-md my-1 flex grow cursor-pointer items-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${
                    openDropdown === link.name
                      ? "bg-[#C20E1A] text-gray-50"
                      : ""
                  }`}
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.name ? null : link.name,
                    )
                  }
                >
                  <LinkIcon className="w-5" />
                  <p className="hidden font-bold md:block">{link.name}</p>
                  <span className="ml-auto">
                    {openDropdown === link.name ? "▲" : "▼"}
                  </span>
                </div>
              ) : (
                <Link
                  href={link.href!}
                  className={`text-md my-1 flex grow items-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${
                    pathname === link.href ? "bg-[#C20E1A] text-gray-50" : ""
                  }`}
                >
                  <LinkIcon className="w-5" />
                  <p className="hidden font-bold md:block">{link.name}</p>
                </Link>
              )}
              {hasChildren && openDropdown === link.name && (
                <div className="ml-8 flex flex-col">
                  {link.children!.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href!}
                      className={`text-md my-1 flex items-center gap-2 rounded px-2 py-1 text-[#575757] hover:bg-[#C20E1A] hover:text-white ${
                        pathname === child.href
                          ? "bg-[#C20E1A] text-gray-50"
                          : ""
                      }`}
                    >
                      <child.icon className="w-4" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={handleLogout} // Llama a la función mejorada
        className="text-md my-1 flex w-full grow items-center justify-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
      >
        {/* <span className="material-symbols-outlined">logout</span> */}
        <ArrowRightOnRectangleIcon className="w-5" />
        <p className="hidden font-bold md:block">Cerrar Sesión</p>
      </button>
    </div>
  );
}
