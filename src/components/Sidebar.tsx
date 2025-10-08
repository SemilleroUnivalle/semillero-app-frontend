"use client";

import {
  UsersIcon,
  TagIcon,
  HomeIcon,
  BookOpenIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type LinkItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// Links para administrador
const adminLinks = [
  { name: "Inicio", href: "/admin/inicio", icon: HomeIcon },
  { name: "Registros", href: "/admin/registros/verRegistros", icon: UsersIcon },
  { name: "Matrículas", href: "/admin/matriculas/verMatriculas", icon: AssignmentIndOutlinedIcon },
  { name: "Funcionarios", href: "/admin/funcionarios/visualizar-funcionarios", icon: GroupWorkOutlinedIcon },
  { name: "Cursos", href: "/admin/cursos/verCursos", icon: BookOpenIcon },
  { name: "Oferta Académica", href: "/admin/oferta/verOfertas", icon: TagIcon },
  { name: "Ajustes", href: "/admin/ajustes/ajustes", icon: CogIcon },
];

// Links para profesor
const profesorLinks = [
  { name: "Perfil", href: "/docente/perfil", icon: UsersIcon },
  { name: "Cursos", href: "/docente/cursos", icon: BookOpenIcon },
  { name: "Calificación", href: "/docente/calificacion", icon: TagIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [tipoUsuario, setTipoUsuario] = useState(null);

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
  } // Si quieres agregar links para otros tipos de usuario, puedes hacerlo aquí.

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`text-md my-1 flex grow items-center justify-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${
              pathname === link.href ? "bg-[#C20E1A] text-gray-50" : ""
            } `}
          >
            <LinkIcon className="w-5" />
            <p className="hidden font-bold md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
