"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { CardMedia } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

interface Matricula {
  id_inscripcion: number;
  modulo: {
    id_modulo: number;
    id_categoria: {
      id_categoria: number;
      nombre: string;
      estado: boolean;
    };
    nombre_modulo: string;
    descripcion_modulo: string;
    intensidad_horaria: number;
    dirigido_a: string | null;
    incluye: string | null;
    imagen_modulo: string | null;
    estado: boolean;
    id_area: number;
    id_oferta_categoria: number[];
  };
  estudiante: {
    id_estudiante: number;
    acudiente: {
      id_acudiente: number;
      nombre_acudiente: string;
      apellido_acudiente: string;
      tipo_documento_acudiente: string;
      numero_documento_acudiente: string;
      celular_acudiente: string;
      email_acudiente: string;
    };
    nombre: string;
    apellido: string;
    contrasena: string;
    numero_documento: string;
    email: string;
    is_active: boolean;
    ciudad_residencia: string;
    eps: string;
    grado: string;
    colegio: string;
    tipo_documento: string;
    genero: string;
    fecha_nacimiento: string;
    telefono_fijo: string;
    celular: string;
    departamento_residencia: string;
    comuna_residencia: string;
    direccion_residencia: string;
    estamento: string;
    discapacidad: boolean;
    tipo_discapacidad: string;
    descripcion_discapacidad: string;
    area_desempeño: string;
    grado_escolaridad: string;
    documento_identidad: string;
    foto: string;
    user: number;
  };
  oferta_categoria: {
    id_oferta_categoria: number;
    id_oferta_academica: {
      id_oferta_academica: number;
      nombre: string;
      fecha_inicio: string;
      estado: boolean;
    };
    precio_publico: string;
    precio_privado: string;
    precio_univalle: string;
    precio_univalle_egresados: string | null;
    fecha_finalizacion: string;
    estado: boolean;
    id_categoria: number;
  };
  estado: string;
  grupo: string;
  fecha_inscripcion: string;
  tipo_vinculacion: string;
  terminos: boolean;
  observaciones: string | null;
  recibo_pago: string | null;
  constancia: string | null;
  certificado: string | null;
}

export default function Matriculas() {
  const router = useRouter();
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
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
          const yearInicio = new Date(matricula.oferta_categoria.id_oferta_academica.fecha_inicio).getFullYear();
          
          return (
            <Card
              key={matricula.id_inscripcion}
              className="flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <CardMedia
                className="h-48 object-cover bg-gradient-to-r from-primary to-blue-600"
                component="img"
                image={matricula.modulo.imagen_modulo || "/NAS.png"}
              />
              
              <div className="flex flex-col flex-grow p-4">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {matricula.modulo.nombre_modulo}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {matricula.oferta_categoria.id_oferta_academica.nombre}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <p className="text-gray-500 text-xs font-semibold">AÑO</p>
                    <p className="text-lg font-bold text-primary">{yearInicio}</p>
                  </div>
                  
                  <div className="bg-primary-50 p-2 rounded-lg">
                    <p className="text-gray-500 text-xs font-semibold">VINCULACIÓN</p>
                    <p className="text-xs font-bold text-green-700 uppercase">
                      {matricula.tipo_vinculacion}
                    </p>
                  </div>
                </div>

                {matricula.estado === "Revisado" ? (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Revisada
                  </div>
                ) : matricula.estado === "Pendiente" ? (
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                    Pendiente
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    No revisada
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  <p>Inscripción: {new Date(matricula.fecha_inscripcion).toLocaleDateString('es-ES')}</p>
                  <p>Grupo: {matricula.grupo || 'No asignado'}</p>
                </div>
              </div>

              <CardActions className="justify-center border-t pt-3">
                <Button
                  variant="contained"
                  onClick={() => {
                    localStorage.setItem("matriculaSeleccionada", matricula.id_inscripcion.toString());
                    console.log("Matricula seleccionada:", matricula.id_inscripcion);
                    router.push(`/estudiante/detallar-matricula`);
                  }}
                  className="bg-primary text-white rounded-lg w-full"
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
