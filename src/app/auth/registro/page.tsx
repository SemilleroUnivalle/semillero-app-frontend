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
} from "@mui/material";
import Link from "next/link";
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
  "Egresado colegios",
  "Docente",
];

export default function Registro() {

  const router = useRouter();


  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    numero_identificacion: "",
    tipo_identificacion: "",
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
    acudiente: "",
  });

  const [formDataAcudiente, setFormDataAcudiente] = useState({
    nombre_acudiente: "",
    apellido_acudiente: "",
    tipo_identificacion_acudiente: "",
    numero_identificacion_acudiente: "",
    email_acudiente: "",
    celular_acudiente: "",
  });

  // Manejar envío del formulario
  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos enviados del estudiante:", formData);
    console.log("Datos enviados del acudiente:", formDataAcudiente);

    try {
      // Crear un acudiente primero para obtener su ID
      const responseAcudiente = await axios.post(
        `${API_BASE_URL}/acudiente/acu/`,
        formDataAcudiente,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (responseAcudiente.status === 200) {
        const id_acudiente = responseAcudiente.data.id_acudiente; // Obtener el ID del acudiente creado
        console.log("Acudiente agregado con éxito");
        // Actualiza formData con el id_acudiente
        setFormData((prevFormData) => ({
          ...prevFormData,
          id_acudiente,
        }));

        const responseEstudiante = await axios.post(
          `${API_BASE_URL}/estudiante/est/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (responseEstudiante.status === 200) {
          console.log("Estudiante agregado con éxito");
          alert("Registro exitoso");
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
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error de conexión al intentar actualizar la información");
    }
  };

  // Manejo de campo para otro género

  const [mostrarOtroGenero, setMostrarOtroGenero] = useState(false);
  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  // Manejo de estados para seleccion de departamento y municipio
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<
    string | ""
  >("");

  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(false);

  // Manejo de subida de fotografia
  const [image, setImage] = useState<string | null>(null);

  // Mastrar imagen seleccionada
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Obtener el archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Guardar la URL de la imagen en el estado
      };
      reader.readAsDataURL(file);
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

  return (
    <div className="mx-auto my-4 w-full content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="text-center font-semibold text-primary">Tu información</h2>

      <form className="items-center" onSubmit={handleSubmit}>
        <div className="flex w-full flex-row">
          {/* Campo Seleccionar Fotografia */}
          <div className="my-4 flex w-1/3 flex-col items-center justify-around">
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
                onChange={handleFileChange}
              />
            </Button>
          </div>

          <div className="flex w-2/3 flex-col items-center justify-center">
            {/* Contenedor Informacion Personal */}
            <h2 className="text-md my-4 text-center font-semibold text-primary">
              Información Personal
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
                  setFormData({ ...formData, nombre: e.target.value })
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
                  setFormData({ ...formData, apellido: e.target.value })
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
                  value={formData.tipo_identificacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_identificacion: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Tarjeta de identidad"}>
                    Tarjeta de identidad
                  </MenuItem>
                  <MenuItem value={"Cédula de ciudadania"}>
                    Cédula de ciudadanía
                  </MenuItem>
                  <MenuItem value={"Cédula de extrangería"}>
                    Cédula de extrangería
                  </MenuItem>
                  <MenuItem value={"Permiso de protección temporal"}>
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
                value={formData.numero_identificacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_identificacion: e.target.value,
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
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
              />
              {/* Campo Género */}
              <FormControl className="inputs-textfield w-full sm:w-1/3">
                <InputLabel id="genero">Género</InputLabel>
                <Select
                  labelId="genero"
                  id="genero"
                  label="Género"
                  required
                  value={formData.genero} // Conectamos con el estado
                  onChange={(e) => {
                    const selectedGenero = e.target.value;
                    setFormData({ ...formData, genero: selectedGenero });
                    setMostrarOtroGenero(selectedGenero === "Otro");
                  }}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
              {/* Campo Otro Genero */}
              {mostrarOtroGenero && (
                <TextField
                  className="inputs-textfield flex w-full flex-col sm:w-1/4"
                  label="Otro género"
                  name="otro_genero"
                  variant="outlined"
                  type="text"
                  fullWidth
                  required
                  // value={formData.otro_genero}
                  // onChange={handleChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Contenedor Informacion de Contacto y Ubicación */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información de Contacto y Ubicación
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
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
              setFormData({ ...formData, email: e.target.value })
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
                setFormData({ ...formData, ciudad_residencia: e.target.value })
              }
              // value={formData.ciudad_residencia}
              // onChange={(e) =>
              //   setFormData({ ...formData, ciudad_residencia: e.target.value })
              // }
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
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Comuna"
            name="comuna"
            variant="outlined"
            type="number"
            fullWidth
            required
            value={formData.comuna_residencia}
            onChange={(e) =>
              setFormData({ ...formData, comuna_residencia: e.target.value })
            }
          />

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
              setFormData({ ...formData, direccion_residencia: e.target.value })
            }
          />
        </div>

        {/* Contenedor Informacion Académica */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información Académica
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Campo Colegio */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Colegio"
            name="colegio"
            variant="outlined"
            type="text"
            fullWidth
            required
            value={formData.colegio}
            onChange={(e) =>
              setFormData({ ...formData, colegio: e.target.value })
            }
          />
          {/* Campo Estamento Colegio */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="estamento">Estamento</InputLabel>
            <Select
              labelId="estamento"
              name="estamento"
              id="estamento"
              label="Estamento"
              required
              value={formData.estamento}
              onChange={(e) =>
                setFormData({ ...formData, estamento: e.target.value })
              }
            >
              <MenuItem value={"Público"}>Público</MenuItem>
              <MenuItem value={"Privado"}>Privado</MenuItem>
              <MenuItem value={"Cobertura"}>Cobertura</MenuItem>
            </Select>
          </FormControl>

          {/* Campo Select Grado Estudiantil */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="grado">Grado</InputLabel>
            <Select
              labelId="grado"
              id="grado"
              label="Grado"
              required
              value={formData.grado || ""}
              onChange={(e) =>
                setFormData({ ...formData, grado: e.target.value })
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

        {/* Infomacion de Salud */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información de Salud
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Campo Selector EPS*/}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="eps">EPS</InputLabel>
            <Select
              labelId="eps"
              id="eps"
              label="EPS"
              required
              value={formData.eps || ""}
              onChange={(e) =>
                setFormData({ ...formData, eps: e.target.value })
              }
            >
              <MenuItem value={"Emssanar"}>Emssanar</MenuItem>
              {/* Puedes agregar más opciones si es necesario */}
            </Select>
          </FormControl>

          {/* Campo Select Discapacidad */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
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
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
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
                    tipo_discapacidad: e.target.value,
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
                  descripcion_discapacidad: e.target.value,
                })
              }
            />
          )}
        </div>
        {/* Contenedor Informacion de Acudiente */}

        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información de Acudiente
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
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
                nombre_acudiente: e.target.value,
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
                apellido_acudiente: e.target.value,
              })
            }
          />
          {/* Campo Tipo de Documento */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="tipo_documento_acudiente">
              Tipo de documento
            </InputLabel>
            <Select
              labelId="tipo_documento_acudiente"
              id="tipo_documento_acudiente"
              label="tipo_documento_acudiente"
              required
              value={formDataAcudiente.tipo_identificacion_acudiente}
              onChange={(e) =>
                setFormDataAcudiente({
                  ...formDataAcudiente,
                  tipo_identificacion_acudiente: e.target.value,
                })
              }
            >
              <MenuItem value={"Tarjeta de identidad"}>
                Tarjeta de identidad
              </MenuItem>
              <MenuItem value={"Cédula de ciudadania"}>
                Cédula de ciudadanía
              </MenuItem>
              <MenuItem value={"Cédula de extrangería"}>
                Cédula de extrangería
              </MenuItem>
              <MenuItem value={"Permiso de protección temporal"}>
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
            value={formDataAcudiente.numero_identificacion_acudiente}
            onChange={(e) =>
              setFormDataAcudiente({
                ...formDataAcudiente,
                numero_identificacion_acudiente: e.target.value,
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
                email_acudiente: e.target.value,
              })
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

        {/* Campo Seleccionar Documento de Identidad */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Documentación
        </h2>
        <div className="my-4 flex flex-col items-center gap-3">
          <InputLabel id="documento_identidad">
            Documento de identidad
          </InputLabel>
          <input
            name="documento_identidad"
            type="file"
            accept=".pdf"
            className="block w-1/2 text-sm text-gray-500"
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          className="mx-auto my-5 flex rounded-2xl bg-primary"
        >
          Continuar
        </Button>
      </form>
      {/* Botón de matricula*/}
      <Link href="/auth/matricula">
        <button className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
          Continuar
        </button>
      </Link>
      {/* Botón de iniciar sesión*/}
      <Link href="/auth/login">
        <button className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white">
          Iniciar sesión
        </button>
      </Link>
    </div>
  );
}
