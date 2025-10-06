"use client";

import {
  Estudiante,
  Acudiente,
  Ciudad,
  Matricula,
  Departamento,
  DepartamentoApi,
  CiudadApi,
} from "@/interfaces/interfaces";

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
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import { useRouter } from "next/navigation";

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

const generos = ["Masculino", "Femenino"];
const epss = [
  "Emssanar",
  "Sura",
  "Sanitas",
  "Nueva EPS",
  "Compensar",
  "Coomeva",
  "Salud Total",
  "Famisanar",
  "Cafesalud",
  "Medimás",
  "SOS",
  "Cruz Blanca",
  "Aliansalud",
  "Colsubsidio",
  "Ecoopsos",
  "Comfenalco Valle",
  "Comfandi",
  "Mutual Ser",
  "Caprecom",
  "EPS Convida",
  "EPS Savia Salud",
  "EPS Comfachocó",
  "EPS Comfaoriente",
];

export default function DetallarMatricula() {
  const router = useRouter();

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);

  // Estados para departamentos y ciudades
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState<string>("");
  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(false);

  // Estados para el formulario de estudiante, acudiente y matrícula
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
    area_desempeño: "",
    grado_escolaridad: "",
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
    foto: "",
    documento_identidad: "",
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

  const [formDataMatricula, setFormDataMatricula] = useState<Matricula>({
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
      modulo
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
        nombre:"",
        estado:false,
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
    verificacion_recibo_pago: null,
    verificacion_certificado: null,
    audit_documento_recibo_pago: null,
    audit_certificado: null,
  });

  const [success, setSuccess] = useState(false);

  // Estados para manejo de archivos
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(
    null,
  );
  // const [reciboPago, setReciboPago] = useState<File | null>(null);
  // const [reciboCertificado, setReciboCertificado] = useState<File | null>(null);

  // const [image, setImage] = useState<string | null>(null);

  // Manejo de campo para otro género

  // const [mostrarOtroGenero, setMostrarOtroGenero] = useState(false);
  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  const [esDocente, setEsDocente] = useState(false);

  // Obtener datos del estudiante y departamentos
  useEffect(() => {
    setLoading(true); // <-- inicia la carga
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get<DepartamentoApi[]>(
          "https://api-colombia.com/api/v1/Department",
        );
        const departamentosFormateados: Departamento[] = response.data.map(
          (dep) => ({
            id: dep.id,
            nombre: dep.name,
          }),
        );
        setDepartamentos(departamentosFormateados);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };

    const storedData = localStorage.getItem("matriculaSeleccionada");
    if (storedData) {
      const seleccionado = JSON.parse(storedData);
      const id = seleccionado.id || seleccionado.id_inscripcion;
      if (id) {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        axios
          .get(`${API_BASE_URL}/matricula/mat/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((res) => {
            setEstudiante(res.data.estudiante);
            setDepartamentoSeleccionado(
              res.data.estudiante.departamento_residencia || "",
            );
            setFormDataMatricula({
              ...formDataMatricula,
              ...res.data,
            });

            console.log(res.data);

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
    } else {
      setLoading(false); // <-- termina la carga si no hay datos
    }
    fetchDepartamentos();
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

  // Obtener ciudades cuando cambia el departamento seleccionado en modo edición
  useEffect(() => {
    const fetchCiudades = async () => {
      if (!departamentoSeleccionado) return;
      setCargandoCiudades(true);
      try {
        const departamentoObj = departamentos.find(
          (d) => d.nombre === departamentoSeleccionado,
        );
        if (!departamentoObj) return;
        const response = await axios.get<CiudadApi[]>(
          `https://api-colombia.com/api/v1/Department/${departamentoObj.id}/cities`,
        );
        const ciudadesFormateadas: Ciudad[] = response.data
          .map((ciudad) => ({
            id: ciudad.id,
            nombre: ciudad.name,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setCiudades(ciudadesFormateadas);
      } catch (error) {
        console.error("Error al obtener ciudades:", error);
      } finally {
        setCargandoCiudades(false);
      }
    };
    if (editable && departamentoSeleccionado) {
      fetchCiudades();
    }
  }, [editable, departamentoSeleccionado, departamentos]);

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

  const handleSave = async () => {
    const token = getToken();

    //Peticion para actualizar estudiante

    try {
      const formDataToSend = new FormData();

      // Lista de campos que NO se deben enviar
      const camposExcluidos = [
        "contrasena",
        "id_estudiante",
        "foto",
        "documento_identidad",

        "is_active",
      ];

      for (const key in formDataEstudiante) {
        if (camposExcluidos.includes(key)) continue; // Salta los campos excluidos

        let value = formDataEstudiante[key as keyof Estudiante];
        if (typeof value === "boolean") {
          value = value ? "True" : "False";
        }
        formDataToSend.append(key, value as string | Blob);
      }

      if (fotoPerfil) {
        formDataToSend.append("foto", fotoPerfil);
      }
      if (documentoIdentidad) {
        formDataToSend.append("documento_identidad", documentoIdentidad);
      }

      // Obtener token del localStorage

      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await axios.patch(
        `${API_BASE_URL}/estudiante/est/${formDataEstudiante.id_estudiante}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.status === 200) {
        alert("Actualización exitosa");
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al actualizar el estudiante.");
    }

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

  // Función para eliminar un inscrito
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este inscrito?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/estudiante/est/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(true);
      router.push("/admin/inscripciones/verInscripciones");
    } catch (error) {
      console.error("Error al eliminar el inscrito:", error);
      alert(
        "Hubo un error al eliminar el inscrito. Por favor, inténtalo de nuevo.",
      );
    }
  };

  // Estados para las verificaciones
  const [estadoInformacion, setEstadoInformacion] = useState<boolean | null>(
    formDataEstudiante.verificacion_informacion,
  );
  const [estadoFotoPerfil, setEstadoFotoPerfil] = useState<boolean | null>(
    formDataEstudiante.verificacion_foto,
  );
  const [estadoDocumentoIdentidad, setEstadoDocumentoIdentidad] = useState<
    boolean | null
  >(formDataEstudiante.verificacion_documento_identidad);

  const [estadoReciboPago, setEstadoReciboPago] = useState<boolean | null>(
    formDataMatricula.verificacion_recibo_pago,
  );
  const [estadoCertificado, setEstadoCertificado] = useState<boolean | null>(
    formDataMatricula.verificacion_certificado,
  );

  useEffect(() => {
    setEstadoInformacion(formDataEstudiante.verificacion_informacion);
    setEstadoFotoPerfil(formDataEstudiante.verificacion_foto);
    setEstadoDocumentoIdentidad(
      formDataEstudiante.verificacion_documento_identidad,
    );
    setEstadoReciboPago(formDataMatricula.verificacion_recibo_pago);
    setEstadoCertificado(formDataMatricula.verificacion_certificado);
  }, [formDataEstudiante]);

  // Manejadores para los cambios en los estados de verificación

  const handleEstadoInformacion = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formDataEstudiante.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formDataEstudiante.id_estudiante}/`,
          { verificacion_informacion: newEstado },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setEstadoInformacion(newEstado); // Actualiza el estado local si lo usas
        console.log("Verificación de información actualizada a:", newEstado);
      } catch (error) {
        console.error(
          "Error al actualizar verificación de información:",
          error,
        );
      }
    }
  };

  const handleEstadoFotoPerfil = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formDataEstudiante.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formDataEstudiante.id_estudiante}/`,
          { verificacion_foto: newEstado },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setEstadoFotoPerfil(newEstado);
      } catch (error) {
        console.error("Error al actualizar verificación de foto:", error);
      }
    }
  };

  const handleEstadoDocumentoIdentidad = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formDataEstudiante.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formDataEstudiante.id_estudiante}/`,
          { verificacion_documento_identidad: newEstado },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setEstadoDocumentoIdentidad(newEstado);
      } catch (error) {
        console.error("Error al actualizar verificación de documento:", error);
      }
    }
  };

  const handleEstadoReciboPago = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formDataMatricula.id_inscripcion) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/matricula/mat/${formDataMatricula.id_inscripcion}/`,
          { verificacion_recibo_pago: newEstado },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setEstadoReciboPago(newEstado);
      } catch (error) {
        console.error(
          "Error al actualizar verificación de recibo de pago:",
          error,
        );
      }
    }
  };

  const handleEstadoCertificado = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formDataMatricula.id_inscripcion) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/matricula/mat/${formDataMatricula.id_inscripcion}/`,
          { verificacion_certificado: newEstado },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setEstadoCertificado(newEstado);
      } catch (error) {
        console.error(
          "Error al actualizar verificación de certificado:",
          error,
        );
      }
    }
  };

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
    <div className="mx-auto my-4 w-11/12 content-center rounded-2xl bg-white p-5 text-center shadow-md">
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
      <h2 className="mb-4 text-center font-semibold text-primary">
        Detalle de Inscripción
      </h2>

      <div className="flex flex-col justify-around">
        {/* Fotografía */}
        <div className="my-4 flex flex-col items-center justify-around">
          <Avatar
            src={estudiante.foto || ""}
            sx={{ width: 150, height: 150 }}
            alt="Foto del estudiante"
          />

          {editable && (
            <Button
              variant="contained"
              component="label"
              className="my-4 w-1/3 rounded-2xl bg-primary"
            >
              {fotoPerfil ? "Cambiar Imagen" : "Elegir Imagen"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFotoPerfil(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      // setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
          )}
        </div>

        {fotoPerfil && (
          <Typography variant="caption" color="textSecondary">
            {fotoPerfil.name}
          </Typography>
        )}

        {/* Información personal */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información Personal
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Nombres"
              value={formDataEstudiante.nombre}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  nombre: e.target.value,
                })
              }
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Apellidos"
              value={formDataEstudiante.apellido}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  apellido: e.target.value,
                })
              }
              InputProps={{ readOnly: !editable }}
            />
            {/* Campo Tipo de Documento */}
            <FormControl
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
            >
              <InputLabel id="tipo_documento">Tipo de documento</InputLabel>
              <Select
                labelId="tipo_documento"
                id="tipo_documento"
                label="tipo_documento"
                required
                inputProps={{ readOnly: !editable }}
                value={formDataEstudiante.tipo_documento}
                onChange={(e: SelectChangeEvent<string>) =>
                  setFormDataEstudiante({
                    ...formDataEstudiante,
                    tipo_documento: e.target.value,
                  })
                }
              >
                <MenuItem value={"TI"}>Tarjeta de identidad</MenuItem>
                <MenuItem value={"CC"}>Cédula de ciudadanía</MenuItem>
                <MenuItem value={"CE"}>Cédula de extranjería</MenuItem>
                <MenuItem value={"PPT"}>
                  Permiso de protección temporal
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Número de identificación"
              value={formDataEstudiante.numero_documento}
              InputProps={{ readOnly: !editable }}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  numero_documento: e.target.value,
                })
              }
            />
            {/* Campo Genero */}
            <Autocomplete
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
              freeSolo
              options={generos}
              value={formDataEstudiante.genero}
              disabled={!editable}
              onChange={(_, newValue) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  genero: newValue || "",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Género"
                  required
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Fecha de nacimiento"
              value={formDataEstudiante.fecha_nacimiento || ""}
              InputProps={{ readOnly: !editable }}
            />
          </div>

          {/* Información de Contacto y Ubicación */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información de Contacto y Ubicación
          </h2>

          <div className="flex flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Correo Electrónico"
              InputProps={{ readOnly: !editable }}
              value={formDataEstudiante.email}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  email: e.target.value,
                })
              }
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Celular"
              InputProps={{ readOnly: !editable }}
              value={formDataEstudiante.celular}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  celular: e.target.value,
                })
              }
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Teléfono fijo"
              value={formDataEstudiante.telefono_fijo}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  telefono_fijo: e.target.value,
                })
              }
              InputProps={{ readOnly: !editable }}
            />
            {editable ? (
              <>
                <FormControl className="inputs-textfield w-full sm:w-1/4">
                  <InputLabel id="departamento_residencia">
                    Departamento
                  </InputLabel>
                  <Select
                    labelId="departamento_residencia"
                    id="departamento_residencia"
                    label="Departamento"
                    value={formDataEstudiante.departamento_residencia}
                    onChange={(e: SelectChangeEvent<string>) => {
                      setFormDataEstudiante({
                        ...formDataEstudiante,
                        departamento_residencia: e.target.value,
                        ciudad_residencia: "",
                      });
                      setDepartamentoSeleccionado(e.target.value);
                    }}
                  >
                    {departamentos.map((dept) => (
                      <MenuItem key={dept.id} value={dept.nombre}>
                        {dept.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  className="inputs-textfield w-full sm:w-1/4"
                  disabled={cargandoCiudades}
                >
                  <InputLabel id="ciudad">Ciudad</InputLabel>
                  <Select
                    labelId="ciudad"
                    value={formDataEstudiante.ciudad_residencia}
                    onChange={(e: SelectChangeEvent<string>) =>
                      setFormDataEstudiante({
                        ...formDataEstudiante,
                        ciudad_residencia: e.target.value,
                      })
                    }
                    disabled={!editable}
                  >
                    {cargandoCiudades ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} />
                      </MenuItem>
                    ) : (
                      ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.nombre}>
                          {ciudad.nombre}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>{" "}
              </>
            ) : (
              <>
                <TextField
                  className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  label="Departamento"
                  value={formDataEstudiante.departamento_residencia || ""}
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  label="Ciudad"
                  value={formDataEstudiante.ciudad_residencia || ""}
                  InputProps={{ readOnly: true }}
                />
              </>
            )}
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Comuna"
              value={formDataEstudiante.comuna_residencia}
              onChange={(e) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  comuna_residencia: e.target.value,
                })
              }
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Dirección"
              value={formDataEstudiante.direccion_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
          </div>

          {/* Información de Salud */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información de Salud
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            {/* Campo eps */}
            <Autocomplete
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
              freeSolo
              options={epss}
              value={formDataEstudiante.eps}
              onChange={(_, newValue) =>
                setFormDataEstudiante({
                  ...formDataEstudiante,
                  eps: newValue || "",
                })
              }
              disabled={!editable}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="EPS"
                  required
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            {/* Campo Select Discapacidad */}

            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="discapacidad">Discapacidad</InputLabel>
              <Select
                labelId="discapacidad"
                id="discapacidad"
                name="discapacidad"
                label="¿Tiene alguna discapacidad?"
                value={formDataEstudiante.discapacidad.toString()}
                onChange={
                  editable
                    ? (e) => {
                        const value = e.target.value === "true";
                        setFormDataEstudiante({
                          ...formDataEstudiante,
                          discapacidad: value,
                          tipo_discapacidad: value
                            ? formDataEstudiante.tipo_discapacidad
                            : "",
                          descripcion_discapacidad: value
                            ? formDataEstudiante.descripcion_discapacidad
                            : "",
                        });
                        setTipoDiscapacidad(value);
                      }
                    : undefined
                }
                required
                disabled={!editable}
              >
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
            {mostrarTipoDiscapacidad && (
              <>
                <FormControl
                  className={
                    editable
                      ? "inputs-textfield w-full sm:w-1/4"
                      : "inputs-textfield-readonly w-full sm:w-1/4"
                  }
                >
                  <InputLabel id="tipo_discapacidad">
                    Tipo de discapacidad
                  </InputLabel>
                  <Select
                    labelId="tipo_discapacidad"
                    id="tipo_discapacidad"
                    label="Tipo de discapacidad"
                    required
                    value={formDataEstudiante.tipo_discapacidad}
                    onChange={
                      editable
                        ? (e) =>
                            setFormDataEstudiante({
                              ...formDataEstudiante,
                              tipo_discapacidad: e.target.value,
                            })
                        : undefined
                    }
                    disabled={!editable}
                  >
                    <MenuItem value={"Auditiva"}>Auditiva</MenuItem>
                    <MenuItem value={"Fisica"}>Física</MenuItem>
                    <MenuItem value={"Intelectual"}>Intelectual</MenuItem>
                    <MenuItem value={"Visual"}>Visual</MenuItem>
                    <MenuItem value={"Sordoceguera"}>Sordoceguera</MenuItem>
                    <MenuItem value={"Psicosocial"}>Psicosocial</MenuItem>
                    <MenuItem value={"Multiple"}>Múltiple</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Descripción de discapacidad"
                  name="descripcion_discapacidad"
                  variant="outlined"
                  type="text"
                  fullWidth
                  required
                  value={formDataEstudiante.descripcion_discapacidad}
                  onChange={
                    editable
                      ? (e) =>
                          setFormDataEstudiante({
                            ...formDataEstudiante,
                            descripcion_discapacidad: e.target.value,
                          })
                      : undefined
                  }
                  InputProps={{ readOnly: !editable }}
                />
              </>
            )}
          </div>

          {/* Informacion Académica */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información Académica
          </h2>
          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            {/* Campo de grado escolar */}
            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="grado">Grado</InputLabel>
              <Select
                labelId="grado"
                id="grado"
                label="Grado"
                required
                value={formDataEstudiante.grado || ""}
                onChange={
                  editable
                    ? (e) => {
                        setFormDataEstudiante({
                          ...formDataEstudiante,
                          grado: e.target.value,
                        });
                        setEsDocente(e.target.value === "Docente");
                      }
                    : undefined
                }
                disabled={!editable}
              >
                {grados.map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mostrar campos adicionales para docentes */}
            {!esDocente ? (
              <>
                <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
                  {/* Campo Colegio */}
                  <TextField
                    className={
                      editable
                        ? "inputs-textfield w-full sm:w-1/4"
                        : "inputs-textfield-readonly w-full sm:w-1/4"
                    }
                    label="Colegio"
                    value={formDataEstudiante.colegio}
                    onChange={(e) =>
                      setFormDataEstudiante({
                        ...formDataEstudiante,
                        colegio: e.target.value,
                      })
                    }
                    InputProps={{ readOnly: !editable }}
                  />

                  {/* Campo Estamento Colegio */}
                  <FormControl
                    className={
                      editable
                        ? "inputs-textfield w-full sm:w-1/4"
                        : "inputs-textfield-readonly w-full sm:w-1/4"
                    }
                  >
                    <InputLabel id="estamento">Estamento</InputLabel>
                    <Select
                      labelId="estamento"
                      name="estamento"
                      id="estamento"
                      label="Estamento"
                      required
                      inputProps={{ readOnly: !editable }}
                      value={formDataEstudiante.estamento}
                      onChange={(e) =>
                        setFormDataEstudiante({
                          ...formDataEstudiante,
                          estamento: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={"Público"}>Público</MenuItem>
                      <MenuItem value={"Privado"}>Privado</MenuItem>
                      <MenuItem value={"Cobertura"}>Cobertura</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
                  <FormControl className="inputs-textfield w-full sm:w-1/4">
                    <InputLabel id="grado_escolaridad">
                      Grado de escolaridad
                    </InputLabel>
                    <Select
                      labelId="grado_escolaridad"
                      id="grado_escolaridad"
                      name="grado_escolaridad"
                      label="Grado de escolaridad"
                      required
                      value={formDataEstudiante.grado_escolaridad || ""}
                      onChange={(e) =>
                        setFormDataEstudiante({
                          ...formDataEstudiante,
                          grado_escolaridad: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="Técnico">Técnico</MenuItem>
                      <MenuItem value="Tecnólogo">Tecnólogo</MenuItem>
                      <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                      <MenuItem value="Especialización">
                        Especialización
                      </MenuItem>
                      <MenuItem value="Maestría">Maestría</MenuItem>
                      <MenuItem value="Doctorado">Doctorado</MenuItem>
                      <MenuItem value="Otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className="inputs-textfield w-full sm:w-1/4">
                    <InputLabel id="area_ensenanza">
                      Área de enseñanza
                    </InputLabel>
                    <Select
                      labelId="area_ensenanza"
                      id="area_ensenanza"
                      name="area_ensenanza"
                      label="Área de enseñanza"
                      required
                      value={formDataEstudiante.area_desempeño || ""}
                      onChange={(e) =>
                        setFormDataEstudiante({
                          ...formDataEstudiante,
                          area_desempeño: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                      <MenuItem value="Ciencias Naturales">
                        Ciencias Naturales
                      </MenuItem>
                      <MenuItem value="Ciencias Sociales">
                        Ciencias Sociales
                      </MenuItem>
                      <MenuItem value="Lengua Castellana">
                        Lengua Castellana
                      </MenuItem>
                      <MenuItem value="Inglés">Inglés</MenuItem>
                      <MenuItem value="Educación Física">
                        Educación Física
                      </MenuItem>
                      <MenuItem value="Artes">Artes</MenuItem>
                      <MenuItem value="Tecnología">Tecnología</MenuItem>
                      <MenuItem value="Otra">Otra</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </>
            )}
          </div>

          {!esDocente ? (
            <>
              {/* Contenedor Informacion de Acudiente */}
              <h2 className="text-md my-4 text-center font-semibold text-primary">
                Información de Acudiente
              </h2>
              <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
                {/* Campo Nombres del Acudiente */}
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Nombres del acudiente"
                  name="nombre_acudiente"
                  variant="outlined"
                  fullWidth
                  type="text"
                  required
                  InputProps={{ readOnly: !editable }}
                  value={formDataAcudiente.nombre_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      nombre_acudiente: e.target.value,
                    })
                  }
                />
                {/* Campo Apellidos del acudiente  */}
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Apellidos del acudiente"
                  name="apellido_acudiente"
                  variant="outlined"
                  fullWidth
                  type="text"
                  required
                  InputProps={{ readOnly: !editable }}
                  value={formDataAcudiente.apellido_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      apellido_acudiente: e.target.value,
                    })
                  }
                />
                {/* Campo Tipo de Documento */}
                <FormControl
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                >
                  <InputLabel id="tipo_documento_acudiente">
                    Tipo de documento
                  </InputLabel>
                  <Select
                    labelId="tipo_documento_acudiente"
                    id="tipo_documento_acudiente"
                    label="tipo_documento_acudiente"
                    required
                    disabled={!editable}
                    value={formDataAcudiente.tipo_documento_acudiente}
                    onChange={(e) =>
                      setFormDataAcudiente({
                        ...formDataAcudiente,
                        tipo_documento_acudiente: e.target.value,
                      })
                    }
                  >
                    <MenuItem value={"TI"}>Tarjeta de identidad</MenuItem>
                    <MenuItem value={"CC"}>Cédula de ciudadanía</MenuItem>
                    <MenuItem value={"CE"}>Cédula de extranjería</MenuItem>
                    <MenuItem value={"PPT"}>
                      Permiso de protección temporal
                    </MenuItem>
                  </Select>
                </FormControl>
                {/* Campo Numero de Documento */}
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Número de identificación"
                  name="numero_identificacion"
                  variant="outlined"
                  type="number"
                  fullWidth
                  required
                  InputProps={{ readOnly: !editable }}
                  value={formDataAcudiente.numero_documento_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      numero_documento_acudiente: e.target.value,
                    })
                  }
                />
                {/* Campo Correo Electronico del Acudiente */}
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Correo Electrónico"
                  name="email"
                  variant="outlined"
                  type="email"
                  fullWidth
                  required
                  InputProps={{ readOnly: !editable }}
                  value={formDataAcudiente.email_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      email_acudiente: e.target.value,
                    })
                  }
                />
                {/* Campo Celular del Acudiente */}
                <TextField
                  className={
                    editable
                      ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                      : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  }
                  label="Celular"
                  name="celular"
                  variant="outlined"
                  type="number"
                  fullWidth
                  required
                  InputProps={{ readOnly: !editable }}
                  value={formDataAcudiente.celular_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      celular_acudiente: e.target.value,
                    })
                  }
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Documento de identidad */}
        <div className="mt-4 flex flex-col items-center">
          {estudiante.documento_identidad && (
            <Button
              variant="outlined"
              href={estudiante.documento_identidad}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-2xl border-primary text-primary"
              startIcon={<PictureAsPdfIcon />}
            >
              Ver documento de identidad
            </Button>
          )}
          {editable && (
            <div className="my-4 flex flex-col items-center gap-3">
              <InputLabel id="documento_identidad">
                Documento de identidad
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                {documentoIdentidad ? "Cambiar Documento" : "Elegir Documento"}
                <input
                  name="documento_identidad"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocumentoIdentidad(file);
                    }
                  }}
                />
              </Button>
              {documentoIdentidad && (
                <Typography variant="caption" color="textSecondary">
                  {documentoIdentidad.name}
                </Typography>
              )}
            </div>
          )}
        </div>

        {/* Verificaciones de informacion personal */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Verificaciones
        </h2>
        <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
          <div>
            <Typography variant="body1" color="textSecondary">
              Información verificada
            </Typography>
            <ToggleButtonGroup
              className="border-rounded rounded-xl"
              value={estadoInformacion}
              exclusive
              onChange={handleEstadoInformacion}
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
            <div>
              <p className="text-xs">
                <span className="font-bold">Usuario: </span>
                {formDataEstudiante.audit_informacion?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formDataEstudiante.audit_informacion?.timestamp
                  ? new Date(
                      formDataEstudiante.audit_informacion.timestamp,
                    ).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          </div>

          <div>
            <Typography variant="body1" color="textSecondary">
              Documento de identidad verificado
            </Typography>
            <ToggleButtonGroup
              value={estadoDocumentoIdentidad}
              exclusive
              onChange={handleEstadoDocumentoIdentidad}
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
            <div>
              <p className="text-xs">
                <span className="font-bold">Usuario:</span>{" "}
                {formDataEstudiante.audit_documento_identidad?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formDataEstudiante.audit_documento_identidad?.timestamp
                  ? new Date(
                      formDataEstudiante.audit_documento_identidad.timestamp,
                    ).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          </div>
          <div>
            <Typography variant="body1" color="textSecondary">
              Fotografía verificada
            </Typography>
            <ToggleButtonGroup
              value={estadoFotoPerfil}
              exclusive
              onChange={handleEstadoFotoPerfil}
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
            <div>
              <p className="text-xs">
                <span className="font-bold">Usuario:</span>{" "}
                {formDataEstudiante.audit_foto?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formDataEstudiante.audit_foto?.timestamp
                  ? new Date(
                      formDataEstudiante.audit_foto.timestamp,
                    ).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Información de Matricula
      </h2>
      {/* Información de Matricula */}
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
        {formDataMatricula.recibo_pago && (
          <Button
            variant="outlined"
            color="primary"
            href={formDataMatricula.recibo_pago}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-2xl border-primary text-primary"
            startIcon={<PictureAsPdfIcon />}
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
              {documentoIdentidad
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
                    setDocumentoIdentidad(file);
                  }
                }}
              />
            </Button>
            {documentoIdentidad && (
              <Typography variant="caption" color="textSecondary">
                {documentoIdentidad.name}
              </Typography>
            )}
          </div>
        )}

        {formDataMatricula.certificado && (
          <Button
            variant="outlined"
            color="primary"
            href={formDataMatricula.certificado}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-2xl border-primary text-primary"
            startIcon={<PictureAsPdfIcon />}
          >
            Ver certificado
          </Button>
        )}
      </div>

      {/* Verificaciones de matricula */}
      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Verificaciones de Matrícula
      </h2>

      <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
        <div>
          <Typography variant="body1" color="textSecondary">
            Recibo de pago verificado
          </Typography>
          <ToggleButtonGroup
            value={estadoReciboPago}
            exclusive
            onChange={handleEstadoReciboPago}
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
          <div>
            <p className="text-xs">
              <span className="font-bold">Usuario: </span>
              {formDataMatricula.audit_documento_recibo_pago?.usuario}
              <br />
              <span className="font-bold">Fecha: </span>
              {formDataMatricula.audit_documento_recibo_pago?.timestamp
                ? new Date(
                    formDataMatricula.audit_documento_recibo_pago.timestamp,
                  ).toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div>
          <Typography variant="body1" color="textSecondary">
            Certificado verificado
          </Typography>
          <ToggleButtonGroup
            value={estadoCertificado}
            exclusive
            onChange={handleEstadoCertificado}
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
          <div>
            <p className="text-xs">
              <span className="font-bold">Usuario: </span>
              {formDataMatricula.audit_certificado?.usuario}
              <br />
              <span className="font-bold">Fecha: </span>
              {formDataMatricula.audit_certificado?.timestamp
                ? new Date(
                    formDataMatricula.audit_certificado.timestamp,
                  ).toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-md my-4 text-center font-semibold text-primary">
        Observaciones
      </h2>
      <TextField
        className={
          editable
            ? "inputs-textfield w-full"
            : "inputs-textfield-readonly w-full"
        }
        value={formDataMatricula.observaciones || ""}
        onChange={(e) =>
          setFormDataMatricula({
            ...formDataMatricula,
            observaciones: e.target.value,
          })
        }
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

        <Button
          variant="contained"
          className="text-md mt-4 w-1/3 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
          onClick={() => {
            handleDelete(formDataEstudiante.id_estudiante);
          }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
