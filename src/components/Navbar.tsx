"use client";

import {
  UserIcon,
  FolderIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Inicio", href: "/estudiante/inicio", icon: HomeIcon },
  {
    name: "Perfil",
    href: "/estudiante/perfil",
    icon: UserIcon,
  },
  {
    name: "Matrícula",
    href: "/estudiante/matricula",
    icon: ClipboardDocumentCheckIcon,
  },
  { name: "Portafolio", href: "/estudiante/portafolio", icon: FolderIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex grow items-center justify-center gap-2 rounded-lg p-3 text-md font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${pathname === link.href ? "bg-[#C20E1A] text-gray-50" : ""} `}
          >
            <LinkIcon className="w-5" />
            <p className="hidden font-bold md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}


