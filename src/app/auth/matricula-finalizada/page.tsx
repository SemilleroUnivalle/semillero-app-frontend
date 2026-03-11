"use client";

import { Matricula } from "@/interfaces/interfaces";
import { CheckCircle, AccessTime, ErrorOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function MatriculaFinalizadaPage() {
  const [datos_matricula, setDatos_matricula] = useState<Matricula | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Acceder a localStorage solo en el cliente
    const datos = JSON.parse(localStorage.getItem("datos_matricula") || "null");
    setDatos_matricula(datos);
    setLoading(false);
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl">
        {/* Ícono de éxito */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Título */}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          ¡Matrícula Finalizada!
        </h1>

        {/* Línea divisora */}
        <div className="my-4 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Mensaje principal */}
        <p className="text-md mb-6 font-medium text-gray-600">
          Puedes imprimir esta vista como constancia de tu inscripción haciendo
          clic derecho y seleccionando “Imprimir”, o presionando Ctrl + P.
        </p>

        <p className="text-md mb-6 font-bold text-gray-600">
          Resumen de la matrícula:
        </p>
        <div className="mb-4 rounded-lg bg-gray-100 p-4 text-left">
          <p className="text-sm font-medium text-gray-800">
            <strong>Nombre completo:</strong>{" "}
            {datos_matricula?.estudiante.nombre}{" "}
            {datos_matricula?.estudiante.apellido || "No disponible"}
          </p>
          <p className="text-sm font-medium text-gray-800">
            <strong>Módulo:</strong>{" "}
            {datos_matricula?.modulo.nombre_modulo || "No disponible"}
          </p>
          <p className="text-sm font-medium text-gray-800">
            <strong>Tipo de vinculación:</strong>{" "}
            {datos_matricula?.tipo_vinculacion || "No disponible"}
          </p>
        </div>

        {/* Información de la constancia */}
        <div className="mb-6 border-l-4 border-blue-500 bg-blue-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <AccessTime className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="mb-1 text-sm font-semibold text-blue-900">
                Constancia de Inscripción
              </p>
              <p className="text-sm text-blue-700">
                Se estará enviando la constancia de inscripción una vez se
                revise toda la documentación.
              </p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mb-8 border-l-4 border-amber-500 bg-amber-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <ErrorOutline className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="mb-1 text-sm font-semibold text-amber-900">
                Importante
              </p>
              <p className="text-sm text-amber-700">
                Verifica que tu correo electrónico esté correcto. La constancia
                será enviada a la dirección de email registrada.
              </p>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <p className="text-md mt-6 text-gray-500">
          Si tienes preguntas, contacta al Semillero <br /> - (+57) 312 681 0276{" "}
          <br /> - 602 3212100 ext. 3098
        </p>
      </div>
    </div>
  );
}
