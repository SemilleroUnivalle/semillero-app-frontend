"use client";

import {
  UsersIcon,
  TagIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Inicio", href: "/admin/inicio", icon: HomeIcon },
  {
    name: "Inscripciones",
    href: "/admin/inscripciones",
    icon: UsersIcon,
  },
  {
    name: "Oferta Académica",
    href: "/admin/oferta",
    icon: TagIcon,
  },
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
            className={`flex grow my-1 items-center justify-center gap-4 rounded-lg p-3 text-md font-medium text-[#575757] hover:bg-[#C20E1A] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${pathname === link.href ? "bg-[#C20E1A] text-gray-50" : ""} `}
          >
            <LinkIcon className="w-5" />
            <p className="hidden font-bold md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}