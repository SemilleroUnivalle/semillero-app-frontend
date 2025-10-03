"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [active, setActive] = useState("Inicio");

  const menuItems = [
    { name: "Inicio", path: "/estudiante/inicio" },
    { name: "Perfil", path: "/estudiante/perfil" },
    { name: "Matrículas", path: "/estudiante/matriculas" },
    { name: "Portafolio", path: "/estudiante/portafolio" },
  ];

  return (
    <div className="bg-red-500 p-2">
      <nav className="flex justify-center space-x-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            onClick={() => setActive(item.name)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              active === item.name
                ? "bg-red-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
