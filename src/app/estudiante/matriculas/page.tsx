"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { CardMedia } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { Matricula as MatriculaInterface } from "@/interfaces/interfaces";

export default function Matriculas() {
  const router = useRouter();
  const [matriculas, setMatriculas] = useState<MatriculaInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    let idEstudiante: number | null = null;

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        idEstudiante = user.id ?? null;
      } catch {
        idEstudiante = null;
      }
    }

    if (!token || !idEstudiante) {
      setError("No se pudo obtener la sesión del estudiante.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/inscripcion/filtro-estudiante/`, {
        params: { id_estudiante: idEstudiante },
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setMatriculas(res.data);

        console.log("Matrículas obtenidas:", res.data);

        // Guardar información del estudiante (tomando la primera matrícula)
        if (res.data.length > 0) {
          const estudiante = res.data[0].estudiante;
          console.log("Información del estudiante:", estudiante);
          localStorage.setItem("estudiante", JSON.stringify(estudiante));
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las matrículas. Intenta de nuevo.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando matrículas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto my-4 w-3/4 rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="my-4 text-center font-semibold text-primary">
        Tus Matrículas
      </h2>

      <Button
        variant="contained"
        color="primary"
        href="/estudiante/nueva-matricula"
        className="mb-4 rounded-2xl bg-primary"
      >
        Nueva Matrícula
      </Button>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {matriculas.map((matricula) => {
          const yearInicio = new Date(
            matricula.oferta_categoria.id_oferta_academica.fecha_inicio,
          ).getFullYear();

          return (
            <Card
              key={matricula.id_inscripcion}
              className="flex flex-col rounded-xl shadow-lg transition-shadow hover:shadow-2xl"
            >
              <CardMedia
                className="h-48 bg-gradient-to-r from-primary to-blue-600 object-cover"
                component="img"
                image={matricula.modulo.imagen_modulo || "/NAS.png"}
              />

              <div className="flex flex-grow flex-col p-4">
                <h3 className="mb-2 text-lg font-bold text-primary">
                  {matricula.modulo.nombre_modulo}
                </h3>

                <p className="mb-3 text-sm text-gray-600">
                  {matricula.oferta_categoria.id_oferta_academica.nombre}
                </p>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="text-xs font-semibold text-gray-500">AÑO</p>
                    <p className="text-lg font-bold text-primary">
                      {yearInicio}
                    </p>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-gray-500">
                      VINCULACIÓN
                    </p>
                    <p className="text-xs font-bold uppercase text-green-700">
                      {matricula.tipo_vinculacion}
                    </p>
                  </div>
                </div>

                {matricula.estado === "Revisado" ? (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    Revisada
                  </div>
                ) : matricula.estado === "Pendiente" ? (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                    Pendiente
                  </div>
                ) : (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    No revisada
                  </div>
                )}

                <div className="mb-4 text-xs text-gray-500">
                  <p>
                    Inscripción:{" "}
                    {new Date(matricula.fecha_inscripcion).toLocaleDateString(
                      "es-ES",
                    )}
                  </p>
                  <p>Grupo: {matricula.grupo || "No asignado"}</p>
                </div>
              </div>

              <CardActions className="justify-center border-t pt-3">
                <Button
                  variant="contained"
                  onClick={() => {
                    localStorage.setItem(
                      "matriculaSeleccionada",
                      matricula.id_inscripcion.toString(),
                    );
                    console.log(
                      "Matricula seleccionada:",
                      matricula.id_inscripcion,
                    );
                    router.push(`/estudiante/detallar-matricula`);
                  }}
                  className="w-full rounded-lg bg-primary text-white"
                  size="small"
                >
                  Ver detalles
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
