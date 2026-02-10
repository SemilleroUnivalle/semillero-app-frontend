"use client";

import { use, useEffect, useState } from "react";
import FormularioUsuario from "@/components/formulario";

export default function PerfilUsuario() {
  interface User {
    id: number;
    token: string;
    tipo_usuario: string;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Aquí localStorage está disponible (lado del cliente)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="mx-auto my-4 w-10/12 content-center">
      <FormularioUsuario id_estudiante={user.id}></FormularioUsuario>
    </div>
  );
}
