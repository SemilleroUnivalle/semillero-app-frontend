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

import axios from "axios";
import Head from "next/head";
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

export default function Perfil() {
  let id_estudiante = "";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    numero_identificacion: "",
    tipo_identificacion: "",
    fecha_nacimiento: "",
    genero: "",
    email: "",
    celular: "",
    telefono: "",
    departamento_residencia: "",
    direccion: "",
    estamento: "",
    discapacidad: "",
    descripcion_discapacidad: "",
    tipo_discapacidad: "",
  });

  const [data, setData] = useState({
    otro_genero: "",
    ciudad_residencia: "",
    colegio: "",
    grado: "",
    eps: "",
  });

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        numero_identificacion: user.numero_identificacion || "",
        email: user.email || "",
        tipo_identificacion: user.tipo_identificacion || "",
        genero: user.genero || "",
        fecha_nacimiento: user.fecha_nacimiento || "",
        telefono: user.telefono || "",
        celular: user.celular || "",
        departamento_residencia: user.departamento_residencia || "",
        direccion: user.direccion || "",
        estamento: user.estamento || "",
        discapacidad: user.discapacidad || "",
        tipo_discapacidad: user.tipo_discapacidad || "",
        descripcion_discapacidad: user.descripcion_discapacidad || "",
      }));
      console.log(user);
      id_estudiante = user.id;
      console.log(id_estudiante);
    }
  }, []);

  // // Manejar cambios en los inputs
  // const handleChange = (event: SelectChangeEvent<string>) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     tipo_documento: event.target.value,
  //   }));
  // };

  // Manejar envío del formulario
  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos enviados:", formData);

    try {
      const response = await fetch(
        `${API_BASE_URL}estudiante/est/${id_estudiante}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        alert("Información editada con éxito");
      } else {
        console.error("Error al actualizar:", formData);
        alert("Hubo un error al actualizar la información");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
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

  // // Habilitar campo para otro genero
  // const handleChangeGenero = (event: SelectChangeEvent<string>) => {
  //   setMostrarOtroGenero(event.target.value === "Otro");
  // };

  // // Habilitar campo para tipo de discapacidad
  // const handleChangeDiscapacidad = (event: SelectChangeEvent<string>) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     discapacidad: event.target.value, // Guarda "sí" o "no"
  //     tipo_discapacidad:
  //       event.target.value === "sí" ? prevData.tipo_discapacidad : "", // Limpia si es "no"
  //   }));
  // };

  return (
    <div className="mx-auto my-4 w-full content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <Head>
        <title>Inicio | Mi Proyecto</title>
      </Head>

      <h2 className="text-center font-semibold text-primary">
        Tu información
      </h2>

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
            name="telefono"
            variant="outlined"
            type="number"
            fullWidth
            required
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
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
              value={data.ciudad_residencia || ""}
              onChange={(e) =>
                setData({ ...data, ciudad_residencia: e.target.value })
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

          {/* Campo Dirección */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Dirección"
            name="direccion"
            variant="outlined"
            type="text"
            fullWidth
            required
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
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
            // value={formData.colegio}
            // onChange={(e) =>
            //   setFormData({ ...formData, colegio: e.target.value })
            // }
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
              value={data.grado || ""}
              onChange={(e) => setData({ ...data, grado: e.target.value })}
              // value={data.grado}
              // onChange={(e) =>
              //   setData({ ...data, grado: e.target.value })
              // }
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
              value={data.eps || ""}
              onChange={(e) => setData({ ...data, eps: e.target.value })}
              // value={data.eps}
              // onChange={(e) =>
              //   setData({ ...data, eps: e.target.value })
              // }
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
              value={formData.discapacidad}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  discapacidad: value,
                  tipo_discapacidad:
                    value === "sí" ? formData.tipo_discapacidad : "",
                  descripcion_discapacidad:
                    value === "sí" ? formData.descripcion_discapacidad : "",
                });
                setTipoDiscapacidad(value === "sí");
              }}
              required
            >
              <MenuItem value="sí">Sí</MenuItem>
              <MenuItem value="no">No</MenuItem>
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
              label="Información discapacidad"
              name="info_discapacidad"
              variant="outlined"
              type="text"
              fullWidth
              required
            />
          )}
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
          Editar
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
