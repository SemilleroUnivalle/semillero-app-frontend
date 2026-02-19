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
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useRouter } from "next/navigation";
import {
  Estudiante,
  Acudiente,
  Ciudad,
  Departamento,
  DepartamentoApi,
  CiudadApi,
  grados,
  generos,
  epss,
} from "@/interfaces/interfaces";

export default function FormularioDatos({
  id_estudiante,
}: {
  id_estudiante: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);

  // Estados para departamentos y ciudades
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState<string>("");
  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(false);

  // Estado para el formulario
  const [formData, setFormData] = useState<Estudiante>({
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
    estado: "",
  });

  const [formDataAcudiente, setFormDataAcudiente] = useState<Acudiente>({
    id_acudiente: 0,
    nombre_acudiente: formData.acudiente.nombre_acudiente || "",
    apellido_acudiente: formData.acudiente.apellido_acudiente || "",
    tipo_documento_acudiente: formData.acudiente.tipo_documento_acudiente || "",
    numero_documento_acudiente:
      formData.acudiente.numero_documento_acudiente || "",
    email_acudiente: formData.acudiente.email_acudiente || "",
    celular_acudiente: formData.acudiente.celular_acudiente || "",
  });

  const [success, setSuccess] = useState(false);

  // Estados para manejo de archivos
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(
    null,
  );
  const [image] = useState<string | null>(null);
  // const [documento, setDocumento] = useState<string | null>(null);

  // Manejo de campo para otro género

  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  const [esDocente, setEsDocente] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

    if (id_estudiante) {
      const userString = localStorage.getItem("user");
      let token = "";
      if (userString) {
        const user = JSON.parse(userString);
        token = user.token;
      }
      axios
        .get(`${API_BASE_URL}/estudiante/est/${id_estudiante}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          setDepartamentoSeleccionado(res.data.departamento_residencia || "");
          setLoading(false); // <-- termina la carga
          // En tu useEffect después de obtener el estudiante
          setFormData({
            ...formData,
            ...res.data,
          });
        })
        .catch(() => setLoading(false)); // <-- termina la carga en error
    } else {
      setLoading(false); // <-- termina la carga si no hay datos
    }
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (formData.acudiente) {
      setFormDataAcudiente({
        id_acudiente: formData.acudiente.id_acudiente || 0,
        nombre_acudiente: formData.acudiente.nombre_acudiente || "",
        apellido_acudiente: formData.acudiente.apellido_acudiente || "",
        tipo_documento_acudiente:
          formData.acudiente.tipo_documento_acudiente || "",
        numero_documento_acudiente:
          formData.acudiente.numero_documento_acudiente || "",
        celular_acudiente: formData.acudiente.celular_acudiente || "",
        email_acudiente: formData.acudiente.email_acudiente || "",
      });
    }
  }, [formData.acudiente]);

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

  // Función para guardar los cambios
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Lista de campos que NO se deben enviar automáticamente
      const camposExcluidos = [
        "contrasena",
        "id_estudiante",
        "is_active",
        "foto",
        "documento_identidad",
        "acudiente", // Excluir acudiente del envío automático
      ];

      // Agrega los campos normales del estudiante
      for (const key in formData) {
        if (camposExcluidos.includes(key)) continue;

        const typedKey = key as keyof typeof formData;
        let value = formData[typedKey];

        if (typeof value === "boolean") {
          value = value ? "True" : "False";
        }

        // Solo agregar si no es un objeto (como acudiente)
        if (typeof value !== "object") {
          formDataToSend.append(key, value as string);
        }
      }

      // Agregar campos del acudiente con prefijo
      for (const key in formDataAcudiente) {
        const typedKey = key as keyof typeof formDataAcudiente;
        const value = formDataAcudiente[typedKey];

        if (key !== "id_acudiente" && value !== undefined && value !== null) {
          formDataToSend.append(`acudiente.${key}`, value.toString());
        }
      }

      // Solo agrega archivos si el usuario seleccionó uno nuevo
      if (fotoPerfil) {
        console.log("Adjuntando foto de perfil:", fotoPerfil);
        formDataToSend.append("foto", fotoPerfil);
      }

      if (documentoIdentidad) {
        formDataToSend.append("documento_identidad", documentoIdentidad);
      }

      // Token
      const userString = localStorage.getItem("user");
      let token = "";
      if (userString) {
        const user = JSON.parse(userString);
        token = user.token;
      }

      // Debug - mostrar qué se está enviando
      console.log("=== Datos que se envían ===");
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/estudiante/est/${formData.id_estudiante}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data", // Asegurar el content-type correcto
          },
        },
      );

      if (response.status === 200) {
        alert("Actualización exitosa");
        setEditable(false);

        // Actualizar el estado local con la respuesta del servidor
        setFormData((prevData) => ({
          ...prevData,
          ...response.data,
          // Mantener archivos existentes si no se enviaron nuevos
          foto: fotoPerfil ? response.data.foto : prevData.foto,
          documento_identidad: documentoIdentidad
            ? response.data.documento_identidad
            : prevData.documento_identidad,
        }));

        // Limpiar archivos seleccionados
        setFotoPerfil(null);
        setDocumentoIdentidad(null);
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al actualizar el estudiante.");
    }
  };

  const [estadoInformacion, setEstadoInformacion] = useState<boolean | null>(
    formData.verificacion_informacion,
  );
  const [estadoFotoPerfil, setEstadoFotoPerfil] = useState<boolean | null>(
    formData.verificacion_foto,
  );
  const [estadoDocumentoIdentidad, setEstadoDocumentoIdentidad] = useState<
    boolean | null
  >(formData.verificacion_documento_identidad);

  useEffect(() => {
    setEstadoInformacion(formData.verificacion_informacion);
    setEstadoFotoPerfil(formData.verificacion_foto);
    setEstadoDocumentoIdentidad(formData.verificacion_documento_identidad);
  }, [formData]);

  // Handler para el cambio
  const handleEstadoInformacion = async (
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formData.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formData.id_estudiante}/`,
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
    if (newEstado !== null && formData.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formData.id_estudiante}/`,
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
    if (newEstado !== null && formData.id_estudiante) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        await axios.patch(
          `${API_BASE_URL}/estudiante/est/${formData.id_estudiante}/`,
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

  if (!formData) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <Typography>No se encontró información del estudiante.</Typography>
      </Box>
    );
  }

  return (
    <div className="rounded-2xlp-3 mx-auto w-full content-center text-center">
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

      <div className="flex w-full flex-col rounded-2xl bg-white py-5 shadow-sm">
        <h2 className="mb-4 text-center font-semibold text-primary">
          INFORMACIÓN DEL ESTUDIANTE
        </h2>

        <div className="flex w-full flex-row rounded-2xl bg-white">
          {/*Contenedor de Fotografía */}
          <div className="flex w-1/3 flex-col items-center justify-around">
            <Avatar
              src={image ?? formData.foto ?? undefined}
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

          {/* Contenedor de información personal */}
          <div className="flex w-2/3 flex-col items-center justify-center">
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
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
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
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
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
                  value={formData.tipo_documento}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFormData({ ...formData, tipo_documento: e.target.value })
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
                value={formData.numero_documento}
                InputProps={{ readOnly: !editable }}
                onChange={(e) =>
                  setFormData({ ...formData, numero_documento: e.target.value })
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
                value={formData.genero}
                disabled={!editable}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, genero: newValue || "" })
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
              type="date"
                className={
                  editable
                    ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                    : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                }
                label="Fecha de nacimiento"
                value={formData.fecha_nacimiento || ""}
                InputProps={{ readOnly: !editable }}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
                
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Información de Contacto y Ubicación */}
      <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información de Contacto y Ubicación
        </h2>
        <div className="flex flex-wrap justify-between gap-2 text-gray-600">
          <TextField
            className={
              editable
                ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
            }
            label="Correo Electrónico"
            InputProps={{ readOnly: !editable }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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
            value={formData.celular}
            onChange={(e) =>
              setFormData({ ...formData, celular: e.target.value })
            }
          />
          <TextField
            className={
              editable
                ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
            }
            label="Teléfono fijo"
            value={formData.telefono_fijo}
            onChange={(e) =>
              setFormData({ ...formData, telefono_fijo: e.target.value })
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
                  value={formData.departamento_residencia}
                  onChange={(e: SelectChangeEvent<string>) => {
                    setFormData({
                      ...formData,
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
                  value={formData.ciudad_residencia}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFormData({
                      ...formData,
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
                value={formData.departamento_residencia || ""}
                InputProps={{ readOnly: true }}
              />

              <TextField
                className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                label="Ciudad"
                value={formData.ciudad_residencia || ""}
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
            value={formData.comuna_residencia}
            onChange={(e) =>
              setFormData({
                ...formData,
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
            value={formData.direccion_residencia || ""}
            InputProps={{ readOnly: !editable }}
          />
        </div>
      </div>

      {/* Contenedor de Información de Salud */}
      <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información de Salud
        </h2>
        <div className="flex flex-wrap justify-between gap-2 text-gray-600">
          {/* Campo eps */}
          <Autocomplete
            className={
              editable
                ? "inputs-textfield w-full sm:w-1/4"
                : "inputs-textfield-readonly w-full sm:w-1/4"
            }
            freeSolo
            options={epss}
            value={formData.eps}
            onChange={(_, newValue) =>
              setFormData({ ...formData, eps: newValue || "" })
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
              value={formData.discapacidad.toString()}
              onChange={
                editable
                  ? (e) => {
                      const value = e.target.value === "true";
                      setFormData({
                        ...formData,
                        discapacidad: value,
                        tipo_discapacidad: value
                          ? formData.tipo_discapacidad
                          : "",
                        descripcion_discapacidad: value
                          ? formData.descripcion_discapacidad
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
                  value={formData.tipo_discapacidad}
                  onChange={
                    editable
                      ? (e) =>
                          setFormData({
                            ...formData,
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
                value={formData.descripcion_discapacidad}
                onChange={
                  editable
                    ? (e) =>
                        setFormData({
                          ...formData,
                          descripcion_discapacidad: e.target.value,
                        })
                    : undefined
                }
                InputProps={{ readOnly: !editable }}
              />
            </>
          )}
        </div>
      </div>

      {/* Contenedor Información Académica */}
      <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información Académica
        </h2>
        <div className="flex flex-wrap justify-between gap-2 text-gray-600">
          {/* Campo Colegio */}
          <TextField
            className={
              editable
                ? "inputs-textfield w-full sm:w-1/4"
                : "inputs-textfield-readonly w-full sm:w-1/4"
            }
            label="Colegio"
            hidden={esDocente}
            value={formData.colegio}
            onChange={(e) =>
              setFormData({ ...formData, colegio: e.target.value })
            }
            InputProps={{ readOnly: !editable }}
          />

          {!esDocente ? (
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
                value={formData.estamento}
                onChange={(e) =>
                  setFormData({ ...formData, estamento: e.target.value })
                }
              >
                <MenuItem value={"PÚBLICO"}>PÚBLICO</MenuItem>
                <MenuItem value={"PRIVADO"}>PRIVADO</MenuItem>
                <MenuItem value={"COBERTURA"}>COBERTURA</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
              {/* Grado de escolaridad */}
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
                  value={formData.grado_escolaridad || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grado_escolaridad: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Técnico">Técnico</MenuItem>
                  <MenuItem value="Tecnólogo">Tecnólogo</MenuItem>
                  <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                  <MenuItem value="Especialización">Especialización</MenuItem>
                  <MenuItem value="Maestría">Maestría</MenuItem>
                  <MenuItem value="Doctorado">Doctorado</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>

              {/* Área de enseñanza */}
              <FormControl className="inputs-textfield w-full sm:w-1/4">
                <InputLabel id="area_ensenanza">Área de enseñanza</InputLabel>
                <Select
                  labelId="area_ensenanza"
                  id="area_ensenanza"
                  name="area_ensenanza"
                  label="Área de enseñanza"
                  required
                  value={formData.area_desempeño || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  <MenuItem value="Educación Física">Educación Física</MenuItem>
                  <MenuItem value="Artes">Artes</MenuItem>
                  <MenuItem value="Tecnología">Tecnología</MenuItem>
                  <MenuItem value="Otra">Otra</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {/* Campo Grado */}
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
              inputProps={{ readOnly: !editable }}
              value={formData.grado || ""}
              onChange={
                editable
                  ? (e) => {
                      setFormData({ ...formData, grado: e.target.value });
                      setEsDocente(e.target.value === "Docente");
                    }
                  : undefined
              }
            >
              {grados.map((grado) => (
                <MenuItem key={grado} value={grado}>
                  {grado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Contenedor Información del Acudiente */}
      {!esDocente ? (
        <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
          {/* Contenedor Informacion de Acudiente */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información del Acudiente o Responsable del Estudiante
          </h2>
          <div className="flex flex-wrap justify-between gap-4 text-gray-600">
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
        </div>
      ) : null}

      {/* Contenedor de Documentación */}
      <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Documentación
        </h2>
        <div className="my-4 flex flex-col items-center gap-3">
          {formData.documento_identidad && (
            <div className="flex flex-col items-center">
              <Button
                variant="outlined"
                href={formData.documento_identidad}
                target="_blank"
                rel="noopener noreferrer"
                className="buttons-secondary mt-2"
                startIcon={<PictureAsPdfIcon />}
              >
                Ver documento de identidad
              </Button>
            </div>
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
      </div>

      {/* Contenedor de Verificaciones */}
      <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
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
              disabled={user.tipo_usuario !== "administrador"}
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
            <div hidden={user.tipo_usuario !== "administrador"}>
              <p className="text-xs">
                <span className="font-bold">Usuario: </span>
                {formData.audit_informacion?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formData.audit_informacion?.timestamp
                  ? new Date(
                      formData.audit_informacion.timestamp,
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
              disabled={user.tipo_usuario !== "administrador"}
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
            <div hidden={user.tipo_usuario !== "administrador"}>
              <p className="text-xs">
                <span className="font-bold">Usuario:</span>{" "}
                {formData.audit_documento_identidad?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formData.audit_documento_identidad?.timestamp
                  ? new Date(
                      formData.audit_documento_identidad.timestamp,
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
              disabled={user.tipo_usuario !== "administrador"}
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
            <div hidden={user.tipo_usuario !== "administrador"}>
              <p className="text-xs">
                <span className="font-bold">Usuario:</span>{" "}
                {formData.audit_foto?.usuario}
                <br />
                <span className="font-bold">Fecha: </span>
                {formData.audit_foto?.timestamp
                  ? new Date(formData.audit_foto.timestamp).toLocaleString(
                      "es-CO",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-wrap justify-around gap-4">
          <Button
            variant="outlined"
            className="buttons-primary mt-2 w-1/3"
            startIcon={<EditOutlinedIcon />}
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
    </div>
  );
}
