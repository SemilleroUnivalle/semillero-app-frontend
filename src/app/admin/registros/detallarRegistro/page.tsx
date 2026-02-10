"use client";

import FormularioUsuario from "@/components/formulario";

export default function PerfilUsuario() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const estudiante = JSON.parse(localStorage.getItem("inscritoSeleccionado") || "{}");
  const id_estudiante = estudiante?.id; // ✅ Usa optional chaining

  return (
    <div className="mx-auto my-4 w-11/12 content-center">
      {estudiante && (
        <FormularioUsuario id_estudiante={id_estudiante}></FormularioUsuario>
  
      )}
    </div>
  );
}