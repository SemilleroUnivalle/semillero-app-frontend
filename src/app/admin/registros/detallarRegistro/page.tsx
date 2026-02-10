"use client";

import { useEffect, useState } from 'react';
import FormularioUsuario from "@/components/formulario";

export default function PerfilUsuario() {

const [estudiante, setEstudiante] = useState(null);
const [id_estudiante, setIdEstudiante] = useState(0);

  useEffect(() => {
    // Aquí localStorage está disponible (lado del cliente)

  const estudiante = JSON.parse(localStorage.getItem("inscritoSeleccionado") || "{}");
  const id_estudiante = estudiante?.id; // ✅ Usa optional chaining
  setEstudiante(estudiante);
  setIdEstudiante(id_estudiante);
  }, []);



  return (
    <div className="mx-auto my-4 w-11/12 content-center">
      {estudiante && (
        <FormularioUsuario id_estudiante={id_estudiante}></FormularioUsuario>
  
      )}
    </div>
  );
}