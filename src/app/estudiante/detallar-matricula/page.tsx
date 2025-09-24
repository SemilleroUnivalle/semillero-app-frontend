"use client";

import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Avatar,
  Button,
  Typography,
  Box,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";

// Interfaces para Departamentos y Municipios
interface Departamento {
  id: number;
  nombre: string;
}
interface DepartamentoApi {
  id: number;
  name: string;
}
interface Ciudad {
  id: number;
  nombre: string;
}
interface CiudadApi {
  id: number;
  name: string;
}

export interface Acudiente {
  id_acudiente: number;
  nombre_acudiente: string;
  apellido_acudiente: string;
  tipo_documento_acudiente: string;
  numero_documento_acudiente: string;
  celular_acudiente: string;
  email_acudiente: string;
}

export interface Estudiante {
  id_estudiante: number;
  acudiente: Acudiente;
  nombre: string;
  apellido: string;
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
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  estado: boolean;
}

export interface Modulo {
  id_modulo: number;
  id_categoria: Categoria;
  nombre_modulo: string;
  descripcion_modulo: string;
  intensidad_horaria: number;
  dirigido_a: string | null;
  incluye: string | null;
  imagen_modulo: string | null;
  estado: boolean;
  id_area: number;
  id_oferta_categoria: number[];
}

export interface OfertaAcademica {
  id_oferta_academica: number;
  nombre: string;
  fecha_inicio: string;
  estado: boolean;
}

export interface OfertaCategoria {
  id_oferta_categoria: number;
  id_oferta_academica: OfertaAcademica;
  precio_publico: string;
  precio_privado: string;
  precio_univalle: string;
  precio_univalle_egresados: string | null;
  fecha_finalizacion: string;
  estado: boolean;
  id_categoria: number;
}

export interface MatriculaResponse {
  id_inscripcion: number;
  modulo: Modulo;
  estudiante: Estudiante;
  oferta_categoria: OfertaCategoria;
  estado: string;
  grupo: string;
  fecha_inscripcion: string;
  tipo_vinculacion: string;
  terminos: boolean;
  observaciones: string | null;
  recibo_pago: string;
  constancia: string | null;
  certificado: string;
}

const grados: string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "Egresado colegios",
  "Docente",
];

export default function DetallarMatricula() {
  const router = useRouter();

  const [estudiante, setEstudiante] = useState<any>(null);
  const [matricula, setMatricula] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);


  const [formDataEstudiante, setFormDataEstudiante] = useState<Estudiante>({
    id_estudiante: 0,
    nombre: "",
    apellido: "",
    numero_documento: "",
    tipo_documento: "",
    fecha_nacimiento: "",
    genero: "",
    email: "",
    celular: "",
    telefono_fijo: "",
    departamento_residencia: "",
    ciudad_residencia: "",
    comuna_residencia: "",
    direccion_residencia: "",
    colegio: "",
    grado: "",
    estamento: "",
    eps: "",
    discapacidad: false,
    descripcion_discapacidad: "",
    tipo_discapacidad: "",
    is_active: true,
    acudiente: {
      id_acudiente: 0,
      nombre_acudiente: "",
      apellido_acudiente: "",
      email_acudiente: "",
      tipo_documento_acudiente: "",
      numero_documento_acudiente: "",
      celular_acudiente: "",
    },
  });

  const [formDataAcudiente, setFormDataAcudiente] = useState<Acudiente>({
    id_acudiente: 0,
    nombre_acudiente: formDataEstudiante.acudiente.nombre_acudiente || "",
    apellido_acudiente: formDataEstudiante.acudiente.apellido_acudiente || "",
    tipo_documento_acudiente:
      formDataEstudiante.acudiente.tipo_documento_acudiente || "",
    numero_documento_acudiente:
      formDataEstudiante.acudiente.numero_documento_acudiente || "",
    email_acudiente: formDataEstudiante.acudiente.email_acudiente || "",
    celular_acudiente: formDataEstudiante.acudiente.celular_acudiente || "",
  });

  const [formDataMatricula, setFormDataMatricula] = useState<MatriculaResponse>(
    {
      id_inscripcion: 0,
      modulo: {
        id_modulo: 0,
        id_categoria: {
          id_categoria: 0,
          nombre: "",
          estado: false,
        },
        nombre_modulo: "",
        descripcion_modulo: "",
        intensidad_horaria: 0,
        dirigido_a: null,
        incluye: null,
        id_area: 0,
        id_oferta_categoria: [],
        imagen_modulo: null,
        estado: false,
      },
      estudiante: formDataEstudiante,
      oferta_categoria: {
        id_oferta_categoria: 0,
        id_oferta_academica: {
          id_oferta_academica: 0,
          fecha_inicio: "",
          nombre: "",
          estado: false,
        },
        precio_publico: "",
        precio_privado: "",
        precio_univalle: "",
        precio_univalle_egresados: null,
        fecha_finalizacion: "",
        estado: false,
        id_categoria: 0,
      },
      estado: "",
      grupo: "",
      fecha_inscripcion: "",
      tipo_vinculacion: "",
      terminos: false,
      observaciones: null,
      recibo_pago: "",
      constancia: null,
      certificado: "",
    },
  );

  const [success, setSuccess] = useState(false);
  const [matriculaVerificada, setMatriculaVerificada] = useState(
    formDataMatricula.estado === "A",
  ); // Estado para matrícula verificada

  // Estados para manejo de archivos
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(
    null,
  );
  const [reciboPago, setReciboPago] = useState<File | null>(null);
  const [certificado, setCertificado] = useState<File | null>(null);

  // Función para obtener el token del localStorage 
  function getToken() {
    const userString = localStorage.getItem("user");
    if (!userString) return "";
    try {
      const user = JSON.parse(userString);
      return user.token || "";
    } catch {
      return "";
    }
  }

  // Obtener datos del estudiante y departamentos
  useEffect(() => {
    setLoading(true); // <-- inicia la carga

    const id = localStorage.getItem("matriculaSeleccionada");
    if (id) {
      const token = getToken();
      axios
        .get(`${API_BASE_URL}/matricula/mat/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          setEstudiante(res.data.estudiante);
          setMatricula(res.data);
          setFormDataMatricula({
            ...formDataMatricula,
            ...res.data,
          });
          setLoading(false); // <-- termina la carga
          // En tu useEffect después de obtener el estudiante
          setFormDataEstudiante({
            ...formDataEstudiante,
            ...res.data.estudiante,
          });
          setMatriculaVerificada(res.data.estado);
        })
        .catch(() => setLoading(false)); // <-- termina la carga en error
    } else {
      setLoading(false); // <-- termina la carga si no hay id
    }

  }, []);

  useEffect(() => {
    if (formDataEstudiante.acudiente) {
      setFormDataAcudiente({
        id_acudiente: formDataEstudiante.acudiente.id_acudiente || 0,
        nombre_acudiente: formDataEstudiante.acudiente.nombre_acudiente || "",
        apellido_acudiente:
          formDataEstudiante.acudiente.apellido_acudiente || "",
        tipo_documento_acudiente:
          formDataEstudiante.acudiente.tipo_documento_acudiente || "",
        numero_documento_acudiente:
          formDataEstudiante.acudiente.numero_documento_acudiente || "",
        celular_acudiente: formDataEstudiante.acudiente.celular_acudiente || "",
        email_acudiente: formDataEstudiante.acudiente.email_acudiente || "",
      });
    }
  }, [formDataEstudiante.acudiente]);



  

  const handleSave = async () => {
    const token = getToken();

    //Peticion para actualizar la matricula
    try {
      await axios.patch(
        `${API_BASE_URL}/matricula/mat/${formDataMatricula.id_inscripcion}/`,
        { observaciones: formDataMatricula.observaciones },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        },
      );
      alert("Observaciones actualizadas correctamente.");
    } catch (error) {
      console.error("Error al actualizar observaciones:", error);
      alert("No se pudo actualizar las observaciones.");
    }
  };

  // Estados para las verificaciones

  const [estadoReciboPago, setEstadoReciboPago] = useState<true | false | null>(
    null,
  );
  const [estadoCertificado, setEstadoCertificado] = useState<
    true | false | null
  >(null);
  const [estadoInformacionMatricula, setEstadoInformacionMatricula] = useState<
    true | false | null
  >(null);

  if (loading) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <CircularProgress />
        <Typography className="mt-2">
          Cargando datos del estudiante...
        </Typography>
      </Box>
    );
  }

  if (!estudiante) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <Typography>No se encontró información del estudiante.</Typography>
      </Box>
    );
  }

  return (
    <div className="mx-auto my-4 w-9/12 content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Inscrito eliminado exitosamente.
        </Alert>
      </Snackbar>
      {/* Información de Matricula */}
      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Información de Matricula
      </h2>
      <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
        <TextField
          className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
          label="Módulo inscrito"
          value={formDataMatricula.modulo.nombre_modulo || ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
          label="Periodo"
          value={
            formDataMatricula.oferta_categoria.id_oferta_academica.nombre || ""
          }
          InputProps={{ readOnly: true }}
        />

        <TextField
          className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
          label="Tipo de vinculación"
          value={formDataMatricula.tipo_vinculacion || ""}
          InputProps={{ readOnly: true }}
        />
      </div>
      {/* Documentos de Matricula */}
      <div className="mt-3 flex w-full flex-wrap justify-around gap-4 text-gray-600">
        <div>
          {matricula.recibo_pago && (
            <Button
              variant="outlined"
              color="primary"
              href={matricula.recibo_pago}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              Ver recibo de pago
            </Button>
          )}

          {editable && (
            <div className="my-4 flex flex-col items-center gap-3">
              <InputLabel id="recibo_pago">Recibo de pago</InputLabel>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                {reciboPago
                  ? "Cambiar Recibo de Pago"
                  : "Elegir Recibo de Pago"}
                <input
                  name="recibo_pago"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReciboPago(file);
                    }
                  }}
                />
              </Button>
              {reciboPago && (
                <Typography variant="caption" color="textSecondary">
                  {reciboPago.name}
                </Typography>
              )}
            </div>
          )}
        </div>

        <div>
          {matricula.certificado && (
            <Button
              variant="outlined"
              color="primary"
              href={matricula.certificado}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              Ver certificado
            </Button>
          )}

          {editable && (
            <div className="my-4 flex flex-col items-center gap-3">
              <InputLabel id="certificado">Certificado</InputLabel>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                {certificado ? "Cambiar Certificado" : "Elegir Certificado"}
                <input
                  name="certificado"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCertificado(file);
                    }
                  }}
                />
              </Button>
              {certificado && (
                <Typography variant="caption" color="textSecondary">
                  {certificado.name}
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Verificaciones de matricula */}
      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Verificaciones de Matrícula
      </h2>
      <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
        <div>
          <Typography variant="body1" color="textSecondary">
            Información de matrícula verificada
          </Typography>
          <ToggleButtonGroup
            className="border-rounded rounded-xl"
            value={estadoInformacionMatricula}
            exclusive
            aria-label="Estado de verificación"
            sx={{ marginY: 2, borderRadius: 8 }}
          >
            <ToggleButton value={true} aria-label="Aprobado" color="success">
              <CheckCircleIcon></CheckCircleIcon>
            </ToggleButton>
            <ToggleButton value={false} aria-label="Rechazado" color="error">
              <CancelIcon></CancelIcon>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <Typography variant="body1" color="textSecondary">
            Recibo de pago verificado
          </Typography>
          <ToggleButtonGroup
            value={estadoReciboPago}
            exclusive
            aria-label="Estado de verificación"
            sx={{ marginY: 2 }}
          >
            <ToggleButton value={true} aria-label="Aprobado" color="success">
              <CheckCircleIcon></CheckCircleIcon>
            </ToggleButton>
            <ToggleButton value={false} aria-label="Rechazado" color="error">
              <CancelIcon></CancelIcon>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <Typography variant="body1" color="textSecondary">
            Certificado verificado
          </Typography>
          <ToggleButtonGroup
            value={estadoCertificado}
            exclusive
            aria-label="Estado de verificación"
            sx={{ marginY: 2 }}
          >
            <ToggleButton value={true} aria-label="Aprobado" color="success">
              <CheckCircleIcon></CheckCircleIcon>
            </ToggleButton>
            <ToggleButton value={false} aria-label="Rechazado" color="error">
              <CancelIcon></CancelIcon>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Observaciones
      </h2>
      <TextField
        className="inputs-textfield-readonly w-full"
        value={formDataMatricula.observaciones || ""}
        placeholder="Escriba las observaciones acerca de la matricula"
        InputProps={{ readOnly: !editable }}
        multiline
        rows={4}
      />

      <div className="mt-4 flex w-full flex-wrap justify-around gap-4">
        <Button
          variant="contained"
          className="text-md mt-4 w-1/3 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
          onClick={() => {
            if (editable) {
              handleSave();
            } else {
              setEditable(true);
            }
          }}
        >
          {editable ? "Guardar" : "Editar"}
        </Button>
      </div>
    </div>
  );
}
