"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import {
  Drawer,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

import { API_BASE_URL } from "../../config";

const DRAWER_WIDTH = 280;
const MINI_WIDTH = 72;

type LinkItem = {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: LinkItem[];
};

/* ===== LINKS ===== */

const adminLinks: LinkItem[] = [
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
  { name: "Cursos", href: "/admin/cursos/verCursos", icon: BookOpenIcon },
  {
    name: "Programación Académica",
    icon: LocalLibraryOutlinedIcon,
    children: [
      { name: "Oferta Académica", href: "/admin/oferta/verOfertas", icon: TagIcon },
      { name: "Programación de Cursos", href: "/admin/cursos-programados", icon: BookOpenIcon },
      { name: "Programación de Grupos", href: "/admin/grupos/ver-grupos", icon: UsersIcon },
    ],
  },
  {
    name: "Asistencias",
    href: "/admin/asistencias/ver-asistencias",
    icon: InventoryOutlinedIcon,
  },
  {
    name: "Pruebas Diagnósticas",
    href: "/admin/pruebas-diagnosticas/ver-pruebas",
    icon: PsychologyAltOutlinedIcon,
  },
  { name: "Estadísticas", href: "/admin/estadisticas", icon: AnalyticsOutlinedIcon },
  { name: "Ajustes", href: "/admin/ajustes/ajustes", icon: CogIcon },
];

const profesorLinks: LinkItem[] = [
  { name: "Perfil", href: "/docente/perfil", icon: UsersIcon },
  { name: "Asistencia", href: "/docente/asistencia", icon: InventoryOutlinedIcon },
  { name: "Visualizador", href: "/docente/visualizador", icon: ContentPasteSearchOutlinedIcon },
  { name: "Calificación", href: "/docente/calificacion", icon: TagIcon },
];

/* ===== COMPONENT ===== */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const usuario = JSON.parse(userData);
        setTipoUsuario(usuario.tipo_usuario);
      } catch {
        setTipoUsuario(null);
      }
    }
  }, []);

  const links = tipoUsuario === "administrador" ? adminLinks : profesorLinks;

  
  const handleLogout = async () => {
    await axios.post(
      `${API_BASE_URL}/logout/`,
      {},
      { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
    );
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          transition: "width .2s",
          overflowX: "hidden",
        },
      }}
    >
      {/* LOGO + TOGGLE */}
      <div className="flex items-center justify-between p-3">
        {open && (
          <Image
            src="/logoSemillero.png"
            alt="Logo"
            width={200}
            height={70}
          />
        )}
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* LINKS */}
      <nav className="px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          if (link.children) {
            return (
              <div key={link.name}>
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === link.name ? null : link.name)
                  }
                  className={`my-1 flex cursor-pointer items-center gap-4 rounded-lg p-3
                  ${openDropdown === link.name ? "bg-[#C20E1A] text-white" : "text-gray-700 hover:bg-red-100"}`}
                >
                  <Icon className="w-5" />
                  {open && <span className="flex-1 font-bold">{link.name}</span>}
                  {open && <ExpandMoreIcon />}
                </div>

                <Collapse in={openDropdown === link.name && open}>
                  <div className="ml-8">
                    {link.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.name}
                          href={child.href!}
                          className={`my-1 flex items-center gap-3 rounded p-2
                          ${childActive ? "bg-[#C20E1A] text-white" : "hover:bg-red-100"}`}
                        >
                          <ChildIcon className="w-4" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            );
          }

          return (
            <Tooltip key={link.name} title={open ? "" : link.name} placement="right">
              <Link
                href={link.href!}
                className={`my-1 flex items-center gap-4 rounded-lg p-3
                ${active ? "bg-[#C20E1A] text-white" : "text-gray-700 hover:bg-red-100"}`}
              >
                <Icon className="w-5" />
                {open && <span className="font-bold">{link.name}</span>}
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-4 p-3 text-gray-700 hover:bg-red-100"
      >
        <ArrowRightOnRectangleIcon className="w-5" />
        {open && <span className="font-bold">Cerrar Sesión</span>}
      </button>
    </Drawer>
  );
}
