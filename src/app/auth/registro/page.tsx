"use client";

import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  SelectChangeEvent,
  Avatar,
  Button,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

// Interfaces para Departamentos y Municipios

interface Departamento {
  id: number;
  nombre: string;
}

// Interfaces para Departamentos y Municipios

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
  "EGRESADO",
  "DOCENTE",
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
const comunasCali = [
  "RURAL",
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
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
];
export default function Registro() {
  const router = useRouter();

  // Estados generales
  const [esDocente, setEsDocente] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(
    null,
  );

  // Estados de carga
  const [cargando, setCargando] = useState(false);

  // Formulario de datos del estudiante

  const [formData, setFormData] = useState({
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
    area_desempeño: "",
    grado_escolaridad: "",
    ciudad_documento: "cali",
  });

  const [formDataAcudiente, setFormDataAcudiente] = useState({
    nombre_acudiente: "",
    apellido_acudiente: "",
    tipo_documento_acudiente: "",
    numero_documento_acudiente: "",
    email_acudiente: "",
    celular_acudiente: "",
  });

  // Manejar envío del formulario
  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    console.log("Datos enviados del acudiente:", formDataAcudiente);

    if (!fotoPerfil) {
      alert("La foto de perfil es obligatoria");
      setCargando(false);
      return;
    }

    if (!documentoIdentidad) {
      alert("El documento de identidad es obligatorio");
      setCargando(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Añadir todos los campos del formData al FormData
      for (const key in formData) {
        const typedKey = key as keyof typeof formData;
        let value = formData[typedKey];
        if (typeof value === "boolean") value = value ? "True" : "False";
        formDataToSend.append(key, value as string | Blob);
      }
      // Crear un acudiente primero para obtener su ID
      const responseAcudiente = await axios.post(
        `${API_BASE_URL}/acudiente/acu/`,
        formDataAcudiente,
        {
          headers: {},
        },
      );

      if (
        responseAcudiente.status === 201 ||
        responseAcudiente.status === 200
      ) {
        let id_acudiente = null; // Inicializar id_acudiente
        if (responseAcudiente.status === 201) {
          id_acudiente = responseAcudiente.data.id_acudiente; // Obtener el ID del acudiente creado
        } else {
          id_acudiente = responseAcudiente.data.data.id_acudiente; // Obtener el ID del acudiente creado
        }
        console.log("ID del acudiente:", id_acudiente);

        formDataToSend.append("acudiente", id_acudiente);
        for (const pair of formDataToSend.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        // Paso 2: añadir archivos (asegúrate de capturarlos)
        if (fotoPerfil) {
          formDataToSend.append("foto", fotoPerfil);
        }

        if (documentoIdentidad) {
          formDataToSend.append("documento_identidad", documentoIdentidad);
        }

        console.log("Acudiente agregado con éxito");

        const responseEstudiante = await axios.post(
          `${API_BASE_URL}/estudiante/est/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        if (responseEstudiante.status === 201) {
          console.log("Estudiante agregado con éxito");
          console.log(
            "ID del estudiante guardado en localStorage:",
            responseEstudiante.data.id,
          );
          // Guardando datos en el local storage
          localStorage.setItem("id_estudiante", responseEstudiante.data.id);
          localStorage.setItem("estamento", formData.estamento);
          localStorage.setItem("grado", formData.grado);

          setCargando(false);
          router.push("/auth/matricula"); // Redirigir a la página de matricula
        } else {
          console.error(
            "Error al agregar el estudiante:",
            responseEstudiante.status,
          );
        }
      } else {
        console.error(
          "Error al agregar el acudiente:",
          responseAcudiente.status,
        );
        setCargando(false);
      }
    } catch (err) {
      setCargando(false);

      let mensaje = "Error desconocido";
      if (axios.isAxiosError(err)) {
        // el backend puede devolver {detail: "..."} / {message: "..."} / etc.
        mensaje =
          (err.response?.data as any)?.detail ||
          (err.response?.data as any)?.message ||
          JSON.stringify(err.response?.data) ||
          err.message;
      } else if (err instanceof Error) {
        mensaje = err.message;
      }

      console.error("Error al crear estudiante:", err);
      alert(`Hubo un error al intentar crear el estudiante:\n${mensaje}`);
    }
  };

  // Manejo de campo para otro género

  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  // Manejo de estados para seleccion de departamento y municipio
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<
    string | ""
  >("");

  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(true);

  // Manejo de subida de fotografia
  const [image, setImage] = useState<string | null>(null);

  // Mastrar imagen seleccionada
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]; // Obtener el archivo seleccionado
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result as string); // Guardar la URL de la imagen en el estado
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFotoPerfil(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  // Obtener departamentos
  useEffect(() => {
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
      } finally {
      }
    };
    fetchDepartamentos();
  }, []);

  // Obtener ciudades cuando cambia el departamento seleccionado

  const handleChangeDepartamento = async (
    event: SelectChangeEvent<string | "">,
  ) => {
    const nombreDepartamento = event.target.value as string;

    setDepartamentoSeleccionado(nombreDepartamento);
    setFormData((prev) => ({
      ...prev,
      departamento_residencia: nombreDepartamento,
      ciudad_residencia: "", // Limpia ciudad seleccionada
    }));
    setCargandoCiudades(true);

    try {
      // Buscar el ID del departamento con base en el nombre
      const departamentoObj = departamentos.find(
        (d) => d.nombre === nombreDepartamento,
      );

      if (!departamentoObj) {
        console.error("Departamento no encontrado");
        return;
      }

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

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|correounivalle\.edu\.co)$/.test(
      email.toLowerCase(),
    );

  return (
    <div className="mx-auto my-4 content-center rounded-2xl p-5 text-center">
      {cargando && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <CircularProgress size={60} />
          <p className="mt-4 text-lg font-semibold text-white">
            Registrando...
          </p>
        </div>
      )}

      <form className="items-center" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col rounded-2xl bg-white py-5 shadow-sm">
          <h1 className="text-center font-semibold text-primary">
            FORMULARIO DE INSCRIPCIÓN
          </h1>
          <div className="flex w-full flex-row rounded-2xl bg-white py-5 shadow-sm">
            {/* Campo Seleccionar Fotografia */}
            <div className="flex w-1/3 flex-col items-center justify-around">
              {/* Avatar que muestra la imagen */}
              <Avatar src={image || ""} sx={{ width: 150, height: 150 }} />

              {/* Botón para seleccionar archivo */}
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                Elegir Imagen
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFotoChange}
                />
              </Button>
              <h2>
                {fotoPerfil ? (
                  <>
                    {fotoPerfil.size / (1024 * 1024) > 2 && (
                      <span style={{ color: "red", marginLeft: "8px" }}>
                        ⚠️ La imagen excede 2 MB
                      </span>
                    )}
                  </>
                ) : (
                  "No se ha seleccionado imagen"
                )}
              </h2>
            </div>

            {/* Contenedor Informacion Personal */}
            <div className="flex w-2/3 flex-col items-center justify-center uppercase">
              <h2 className="text-md my-4 text-center font-semibold text-primary">
                DATOS DEL ESTUDIANTE
              </h2>
              <div className="flex flex-wrap justify-around gap-4 text-gray-600">
                {/* Campo Nombres */}
                <TextField
                  className="inputs-textfield flex w-full flex-col sm:w-1/3"
                  label="Nombres"
                  name="nombre"
                  variant="outlined"
                  fullWidth
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: e.target.value.toUpperCase(),
                    })
                  }
                />
                {/* Campo Apellidos */}
                <TextField
                  className="inputs-textfield flex w-full flex-col sm:w-1/3"
                  label="Apellidos"
                  name="apellido"
                  variant="outlined"
                  fullWidth
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellido: e.target.value.toUpperCase(),
                    })
                  }
                />
                {/* Campo Tipo de Documento */}
                <FormControl className="inputs-textfield w-full sm:w-1/3">
                  <InputLabel id="tipo_documento">Tipo de documento</InputLabel>
                  <Select
                    labelId="tipo_documento"
                    id="tipo_documento"
                    label="tipo_documento"
                    required
                    value={formData.tipo_documento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_documento: e.target.value.toUpperCase(),
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
                  className="inputs-textfield flex w-full flex-col sm:w-1/3"
                  label="Número de identificación"
                  name="numero_identificacion"
                  variant="outlined"
                  type="number"
                  fullWidth
                  required
                  value={formData.numero_documento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numero_documento: e.target.value,
                    })
                  }
                />
                {/* Campo Fecha de Nacimiento */}
                <TextField
                  className="inputs-textfield flex w-full flex-col sm:w-1/3"
                  label="Fecha de nacimiento"
                  name="fecha_nacimiento"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_nacimiento: e.target.value,
                    })
                  }
                />

                {/* Campo Genero */}
                <Autocomplete
                  className="inputs-textfield w-full sm:w-1/3"
                  freeSolo
                  options={generos}
                  value={formData.genero}
                  onChange={(_, newValue) =>
                    setFormData({
                      ...formData,
                      genero: newValue?.toUpperCase() || "",
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
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Informacion de Contacto y Ubicación */}
        <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-md mb-4 text-center font-semibold text-primary">
            INFORMACIÓN DE CONTACTO Y UBICACIÓN
          </h2>
          <div className="flex flex-wrap justify-between gap-2 text-gray-600">
            {/* Campo Correo Electronico */}
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              label="Correo Electrónico"
              name="email"
              variant="outlined"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value.toUpperCase(),
                })
              }
              error={formData.email !== "" && !isValidEmail(formData.email)}
              helperText={
                formData.email !== "" && !isValidEmail(formData.email)
                  ? "Solo se permiten correos @gmail.com o @correounivalle.edu.co"
                  : ""
              }
            />
            {/* Campo Celular */}
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              label="Celular"
              name="celular"
              variant="outlined"
              type="number"
              fullWidth
              required
              value={formData.celular}
              onChange={(e) =>
                setFormData({ ...formData, celular: e.target.value })
              }
            />

            {/* Campo Celular Alternativo */}
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              label="Teléfono fijo o celular alternativo"
              name="telefono_fijo"
              variant="outlined"
              type="number"
              fullWidth
              required
              value={formData.telefono_fijo}
              onChange={(e) =>
                setFormData({ ...formData, telefono_fijo: e.target.value })
              }
            />
            {/* Campo Selector Departamento */}
            <FormControl className="inputs-textfield w-full sm:w-1/4">
              <InputLabel id="departamento_residencia">Departamento</InputLabel>
              <Select
                labelId="departamento_residencia"
                name="departamento_residencia"
                id="departamento_residencia"
                label="Departamento"
                required
                value={formData.departamento_residencia}
                onChange={handleChangeDepartamento}
              >
                {departamentos.map((dept) => (
                  <MenuItem key={dept.id} value={dept.nombre}>
                    {dept.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo Selector Ciudad */}
            <FormControl
              className="inputs-textfield w-full sm:w-1/4"
              disabled={!departamentoSeleccionado || cargandoCiudades}
            >
              <InputLabel id="ciudad">Ciudad</InputLabel>
              <Select
                labelId="ciudad"
                id="ciudad"
                label="Ciudad"
                required
                value={formData.ciudad_residencia || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ciudad_residencia: e.target.value,
                  })
                }
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
            </FormControl>

            {/* Campo Comuna */}
            <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
              <InputLabel id="comuna_residencia">Comuna</InputLabel>
              <Select
                labelId="comuna_residencia"
                id="comuna_residencia"
                label="Comuna"
                required
                value={formData.comuna_residencia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comuna_residencia: e.target.value,
                  })
                }
              >
                {comunasCali.map((comuna) => (
                  <MenuItem key={comuna} value={comuna}>
                    {comuna}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo Dirección */}
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              label="Dirección"
              name="direccion"
              variant="outlined"
              type="text"
              fullWidth
              required
              value={formData.direccion_residencia}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccion_residencia: e.target.value.toUpperCase(),
                })
              }
            />
          </div>
        </div>

        {/* Contenedor Información de Salud */}
        <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-md mb-4 text-center font-semibold text-primary">
            INFORMACIÓN DE SALUD
          </h2>
          <div className="flex flex-wrap justify-between gap-2 text-gray-600">
            {/* Campo eps */}
            <Autocomplete
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              freeSolo
              options={epss}
              value={formData.eps}
              inputValue={formData.eps}
              onInputChange={(_, newInputValue) =>
                setFormData({
                  ...formData,
                  eps: newInputValue.toUpperCase(),
                })
              }
              onChange={(_, newValue) =>
                setFormData({ ...formData, eps: newValue?.toUpperCase() || "" })
              }
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
            <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
              <InputLabel id="discapacidad">Discapacidad</InputLabel>
              <Select
                labelId="discapacidad"
                id="discapacidad"
                name="discapacidad"
                label="¿Tiene alguna discapacidad?"
                value={formData.discapacidad.toString()}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  setFormData({
                    ...formData,
                    discapacidad: value,
                    tipo_discapacidad: value ? formData.tipo_discapacidad : "",
                    descripcion_discapacidad: value
                      ? formData.descripcion_discapacidad
                      : "",
                  });
                  setTipoDiscapacidad(value);
                }}
                required
              >
                <MenuItem value="true">SI</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </Select>
            </FormControl>
            {/* Campo Select Tipo de Discapacidad */}
            {mostrarTipoDiscapacidad && (
              <FormControl className="inputs-textfield w-full sm:w-1/4">
                <InputLabel id="tipo_discapacidad">
                  Tipo de discapacidad
                </InputLabel>
                <Select
                  labelId="tipo_discapacidad"
                  id="tipo_discapacidad"
                  label="Tipo de discapacidad"
                  required
                  value={formData.tipo_discapacidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_discapacidad: e.target.value.toUpperCase(),
                    })
                  }
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
            )}
            {mostrarTipoDiscapacidad && (
              <TextField
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Descripción de discapacidad"
                name="descripcion_discapacidad"
                variant="outlined"
                type="text"
                fullWidth
                required
                value={formData.descripcion_discapacidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcion_discapacidad: e.target.value.toUpperCase(),
                  })
                }
              />
            )}
          </div>
        </div>

        {/* Contenedor Informacion Académica */}
        <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-md mb-4 text-center font-semibold text-primary">
            INFORMACIÓN ACADÉMICA
          </h2>
          <div className="flex flex-wrap justify-between gap-2 text-gray-600">
            {/* Campo Colegio */}
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
              hidden={esDocente}
              label="Colegio"
              name="colegio"
              variant="outlined"
              type="text"
              fullWidth
              required
              value={formData.colegio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  colegio: e.target.value.toUpperCase(),
                })
              }
            />
            {/* Campo Estamento Colegio */}
            {!esDocente && (
              <FormControl
                hiddenLabel={esDocente}
                className="inputs-textfield w-full sm:w-1/4"
              >
                <InputLabel id="estamento">Estamento</InputLabel>
                <Select
                  labelId="estamento"
                  name="estamento"
                  id="estamento"
                  label="Estamento"
                  required
                  value={formData.estamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estamento: e.target.value.toUpperCase(),
                    })
                  }
                >
                  <MenuItem value={"PÚBLICO"}>PÚBLICO</MenuItem>
                  <MenuItem value={"PRIVADO"}>PRIVADO</MenuItem>
                  <MenuItem value={"COBERTURA"}>COBERTURA</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Campo Select Grado Estudiantil */}
            <FormControl className="inputs-textfield w-full sm:w-1/4">
              <InputLabel id="grado">Grado</InputLabel>
              <Select
                labelId="grado"
                id="grado"
                label="Grado"
                required
                value={formData.grado || ""}
                onChange={(e) => {
                  setFormData({ ...formData, grado: e.target.value });
                  setEsDocente(e.target.value === "Docente");
                }}
              >
                {grados.map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo Grado de Escolaridad */}

            {/* <FormControl className="inputs-textfield w-full sm:w-1/4">
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
                    grado_escolaridad: e.target.value.toUpperCase(),
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

             */}

            {/* Campo Área de Enseñanza */}
            {/* <FormControl className="inputs-textfield w-full sm:w-1/4">
              <InputLabel id="area_ensenanza">
                Área de enseñanza
              </InputLabel>
              <Select
                labelId="area_ensenanza"
                id="area_ensenanza"
                name="area_ensenanza"
                label="Área de enseñanza"
                required
                value={formData.area_desempeño || ""}
                onChange={(e) =>
                  setFormData({ ...formData, area_desempeño: e.target.value.toUpperCase() })
                }
              >
                <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                <MenuItem value="Ciencias Naturales">
                  Ciencias Naturales
                </MenuItem>
                <MenuItem value="Ciencias Sociales">Ciencias Sociales</MenuItem>
                <MenuItem value="Lengua Castellana">Lengua Castellana</MenuItem>
                <MenuItem value="Inglés">Inglés</MenuItem>
                <MenuItem value="Educación Física">Educación Física</MenuItem>
                <MenuItem value="Artes">Artes</MenuItem>
                <MenuItem value="Tecnología">Tecnología</MenuItem>
                <MenuItem value="Otra">Otra</MenuItem>
              </Select>
            </FormControl> */}
          </div>
        </div>

        {/* Mostrar campos según si es docente o no */}
        {!esDocente && (
          <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
            {/* Contenedor Informacion de Acudiente */}
            <h2 className="text-md mb-4 text-center font-semibold text-primary">
              INFORMACIÓN DEL ACUDIENTE O RESPONSABLE DEL ESTUDIANTE
            </h2>
            <div className="flex flex-wrap justify-between gap-2 text-gray-600">
              {/* Campo Nombres del Acudiente */}
              <TextField
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Nombres del acudiente"
                name="nombre_acudiente"
                variant="outlined"
                fullWidth
                type="text"
                required
                value={formDataAcudiente.nombre_acudiente}
                onChange={(e) =>
                  setFormDataAcudiente({
                    ...formDataAcudiente,
                    nombre_acudiente: e.target.value.toUpperCase(),
                  })
                }
              />
              {/* Campo Apellidos del acudiente  */}
              <TextField
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Apellidos del acudiente"
                name="apellido_acudiente"
                variant="outlined"
                fullWidth
                type="text"
                required
                value={formDataAcudiente.apellido_acudiente}
                onChange={(e) =>
                  setFormDataAcudiente({
                    ...formDataAcudiente,
                    apellido_acudiente: e.target.value.toUpperCase(),
                  })
                }
              />

              {/* Campo Tipo de Documento */}
              <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
                <InputLabel id="tipo_documento_acudiente">
                  Tipo de documento
                </InputLabel>
                <Select
                  labelId="tipo_documento_acudiente"
                  id="tipo_documento_acudiente"
                  label="tipo_documento_acudiente"
                  required
                  value={formDataAcudiente.tipo_documento_acudiente}
                  onChange={(e) =>
                    setFormDataAcudiente({
                      ...formDataAcudiente,
                      tipo_documento_acudiente: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"CC"}>Cédula de ciudadanía</MenuItem>
                  <MenuItem value={"CE"}>Cédula de extranjería</MenuItem>
                  <MenuItem value={"PPT"}>
                    Permiso de protección temporal
                  </MenuItem>
                </Select>
              </FormControl>
              {/* Campo Numero de Documento */}
              <TextField
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Número de identificación"
                name="numero_identificacion"
                variant="outlined"
                type="number"
                fullWidth
                required
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
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Correo Electrónico"
                name="email"
                variant="outlined"
                type="email"
                fullWidth
                required
                value={formDataAcudiente.email_acudiente}
                onChange={(e) =>
                  setFormDataAcudiente({
                    ...formDataAcudiente,
                    email_acudiente: e.target.value.toUpperCase(),
                  })
                }
                error={
                  formDataAcudiente.email_acudiente !== "" &&
                  !isValidEmail(formDataAcudiente.email_acudiente)
                }
                helperText={
                  formDataAcudiente.email_acudiente !== "" &&
                  !isValidEmail(formDataAcudiente.email_acudiente)
                    ? "Solo se permiten correos @gmail.com o @correounivalle.edu.co"
                    : ""
                }
              />
              {/* Campo Celular del Acudiente */}
              <TextField
                className="inputs-textfield flex w-full flex-col sm:w-1/4"
                label="Celular"
                name="celular"
                variant="outlined"
                type="number"
                fullWidth
                required
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
        )}

        {/* Campo Seleccionar Documento de Identidad */}
        <div className="my-4 justify-center rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-md mb-4 text-center font-semibold text-primary">
            DOCUMENTACIÓN
          </h2>
          <div className="my-4 flex flex-col items-center gap-3">
            <InputLabel id="documento_identidad">
              Documento de identidad
            </InputLabel>
            <Button
              variant="contained"
              component="label"
              className="my-2 rounded-2xl bg-primary"
            >
              Elegir documento (PDF)
              <input
                name="documento_identidad"
                type="file"
                hidden
                accept=".pdf"
                // className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDocumentoIdentidad(file);
                  }
                }}
              />
            </Button>

            <h2>
              {documentoIdentidad ? (
                <>
                  {documentoIdentidad.size / (1024 * 1024) > 2 && (
                    <span style={{ color: "red", marginLeft: "8px" }}>
                      ⚠️ El documento excede 2 MB
                    </span>
                  )}
                  <br />
                  <span>
                    {documentoIdentidad.name} -{" "}
                    {(documentoIdentidad.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </>
              ) : (
                "No se ha seleccionado documento"
              )}
            </h2>
          </div>
          <Alert className="mt-3" severity="info">
            La fotografía y el documento de identidad son obligatorios y deben
            pesar menos de 2 Mb.
          </Alert>

          {/* <Button
            type="submit"
            variant="outlined"
            className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white"
          >
            Continuar
          </Button> */}
        </div>
      </form>

      {/* Botón de iniciar sesión*/}
      {/* <Link href="/auth/login">
        <button className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
          Iniciar sesión
        </button>
      </Link> */}
    </div>
  );
}
