"use client";

import FormularioUsuario from "@/components/formulario";

export default function PerfilUsuario() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="mx-auto my-4 w-9/12 content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <FormularioUsuario id_estudiante={user.id}></FormularioUsuario>
    </div>
  );
}
