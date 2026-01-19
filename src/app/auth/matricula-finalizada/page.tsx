"use client";

import { CheckCircle, AccessTime, ErrorOutline } from "@mui/icons-material";

export default function MatriculaFinalizadaPage() {
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
        <p className="mb-6 text-lg font-medium text-gray-600">
          Tu proceso de matrícula se ha completado exitosamente.
        </p>

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
        <p className="mt-6 text-md text-gray-500">
          Si tienes preguntas, contacta al Semillero <br /> - (+57) 312 681 0276 <br /> - 602
          3212100 ext. 3098
        </p>
      </div>
    </div>
  );
}
