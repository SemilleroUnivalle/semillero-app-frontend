"use client";

import FormularioUsuario from "@/components/formulario";

export default function PerfilUsuario() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="mx-auto my-4 w-10/12 content-center">
      <FormularioUsuario id_estudiante={user.id}></FormularioUsuario>
    </div>
  );
}
