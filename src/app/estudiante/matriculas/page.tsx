"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
  estado: boolean;
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
    const token = localStorage.getItem("token"); // o donde tengas el token

    axios
      .get(`${API_BASE_URL}/matricula/mat/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setMatriculas(res.data);
        // setOfertas(res.data);
        setLoading(false);
        console.log("Ofertas academicas", res.data);
      })
      .catch((err) => {
        setError("Error al cargar las matrículas");
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

      <div className="flex flex-wrap justify-around gap-4">
        {matriculas.map((matricula) => (
          <Card
            key={matricula.id_inscripcion}
            className="flex w-full flex-row rounded-2xl bg-[#e8e8e8] shadow sm:w-1/3"
          >
            <CardMedia
              className="w-1/3 p-3"
              component="img"
              image={"/NAS.png"}
            />
            <div className="flex w-2/3 flex-col justify-between">
              <CardHeader
                title={matricula.oferta_categoria.id_oferta_academica.nombre}
                subheader={matricula.modulo.nombre_modulo}
              />
              <CardActions className="justify-center">
                <Button
                  onClick={() => {

                    localStorage.setItem("matriculaSeleccionada", matricula.id_inscripcion.toString());
                    console.log("Matricula seleccionada:", matricula.id_inscripcion);
                    router.push(`/estudiante/detallar-matricula`);
                  }}
                  className="text-primary"
                  size="small"
                >
                  Ver detalles
                </Button>
              </CardActions>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
