"use client";

import {
  TextField,
  InputLabel,
  CircularProgress,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Estudiante, Matricula} from "@/interfaces/interfaces";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";



export default function DetallarMatricula() {

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [matricula, setMatricula] = useState<Matricula>();
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
    verificacion_informacion: null,
    verificacion_foto: null,
    verificacion_documento_identidad: null,
    audit_foto: null,
    audit_documento_identidad: null,
    audit_informacion: null,
    foto: null,
    documento_identidad: null,
    estado: "",
    area_desempeño: "",
    grado_escolaridad: "",
  });


  const [formDataMatricula, setFormDataMatricula] = useState<Matricula>(
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
         id_area: {
        id_area: "",
        nombre_area:"",
      },
        id_oferta_categoria: [],
        imagen_modulo: null,
        estado: false,
      },
      estudiante: formDataEstudiante,
      oferta_categoria: {
        modulo: [],
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
        id_categoria: {
          id_categoria: 0,
          nombre: "",
          estado: false,
        },
      },
      estado: "",
      grupo: "",
      fecha_inscripcion: "",
      tipo_vinculacion: "",
      terminos: false,
      observaciones: null,
      recibo_pago: "",
      certificado: "",
      recibo_servicio: "",
      verificacion_certificado: null,
      verificacion_recibo_pago: null,
      audit_documento_recibo_pago: null,
      audit_certificado: null,
    },
  );

  const [success, setSuccess] = useState(false);

  // Estados para manejo de archivos

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

        })
        .catch(() => setLoading(false)); // <-- termina la carga en error
    } else {
      setLoading(false); // <-- termina la carga si no hay id
    }

  }, []);


  

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

  const [estadoReciboPago] = useState<true | false | null>(
    null,
  );
  const [estadoCertificado] = useState<
    true | false | null
  >(null);
  const [estadoInformacionMatricula] = useState<
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
          {matricula?.recibo_pago && (
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
          {matricula?.certificado && (
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
