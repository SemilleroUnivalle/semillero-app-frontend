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
import { useState, useEffect } from "react";

import axios from "axios";

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
  // Manejo de campo para otro género
  const [mostrarOtroGenero, setMostrarOtroGenero] = useState(false);
  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  // Manejo de estados para seleccion de departamento y municipio
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<
    number | ""
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
    event: SelectChangeEvent<number | "">,
  ) => {
    const departamentoId = event.target.value as number;
    setDepartamentoSeleccionado(departamentoId);
    setCargandoCiudades(true);

    try {
      const response = await axios.get<CiudadApi[]>(
        `https://api-colombia.com/api/v1/Department/${departamentoId}/cities`,
      );
      const ciudadesFormateadas: Ciudad[] = response.data
        .map((ciudad) => ({
          id: ciudad.id,
          nombre: ciudad.name,
        }))
        .sort((a: { nombre: string }, b: { nombre: string }) =>
          a.nombre.localeCompare(b.nombre),
        );

      setCiudades(ciudadesFormateadas);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    } finally {
      setCargandoCiudades(false);
    }
  };

  // Habilitar campo para otro genero
  const handleChangeGenero = (event: SelectChangeEvent<string>) => {
    setMostrarOtroGenero(event.target.value === "Otro");
  };

  // Habilitar campo para tipo de discapacidad
  const handleChangeDiscapacidad = (event: SelectChangeEvent<string>) => {
    setTipoDiscapacidad(event.target.value === "sí");
  };

  return (
    <div className="mx-auto my-4 w-3/4 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="text-center text-lg font-semibold text-primary">
        Tu información
      </h2>

      {/* Campo Seleccionar Fotografia */}
      <div className="my-4 flex flex-col items-center justify-around">
        {/* Avatar que muestra la imagen */}
        <Avatar
          src={image || "/default-avatar.png"}
          sx={{ width: 150, height: 150 }}
        />

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

      <form className="items-center">
        {/* Contenedor Informacion Personal */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información Personal
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Campo Nombres */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Nombres"
            name="nombres"
            variant="outlined"
            fullWidth
            type="text"
            required
            // value={formData.nombre}
            // onChange={handleChange}
          />
          {/* Campo Apellidos */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Apellidos"
            name="apellidos"
            variant="outlined"
            fullWidth
            type="text"
            required
            // value={formData.nombre}
            // onChange={handleChange}
          />
          {/* Campo Tipo de Documento */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="tipo_documento">Tipo de documento</InputLabel>
            <Select
              labelId="tipo_documento"
              id="tipo_documento"
              label="tipo_documento"
              required
              // value={tipoDocumento}
              // onChange={handleChange}
            >
              <MenuItem value={10}>Tarjeta de identidad</MenuItem>
              <MenuItem value={20}>Cédula de ciudadanía</MenuItem>
              <MenuItem value={30}>Cédula de extrangería</MenuItem>
              <MenuItem value={30}>Permiso de protección temporal</MenuItem>
            </Select>
          </FormControl>
          {/* Campo Numero de Documento */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Número de identificación"
            name="documento"
            variant="outlined"
            type="number"
            fullWidth
            required
            // value={formData.nombre}
            // onChange={handleChange}
          />

          {/* Campo Fecha de Nacimiento */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Fecha de nacimiento"
            name="fecha_nacimiento"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required

            // value={formData.nombre}
            // onChange={handleChange}
          />
          {/* Campo Género */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="genero">Género</InputLabel>
            <Select
              labelId="genero"
              id="genero"
              label="genero"
              required
              // value={tipoDocumento}
              onChange={handleChangeGenero}
            >
              <MenuItem value={10}>Masculino</MenuItem>
              <MenuItem value={20}>Femenino</MenuItem>
              <MenuItem value={"Otro"}>Otro</MenuItem>
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
              // value={formData.nombre}
              // onChange={handleChange}
            />
          )}
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
            // value={formData.nombre}
            // onChange={handleChange}
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
            // value={formData.nombre}
            // onChange={handleChange}
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
            // value={formData.nombre}
            // onChange={handleChange}
          />
          {/* Campo Selector Departamento */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="departamento">Departamento</InputLabel>
            <Select
              labelId="departamento"
              id="departamento"
              label="Departamento"
              required
              value={departamentoSeleccionado}
              onChange={handleChangeDepartamento}
            >
              {departamentos.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
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
            <Select labelId="ciudad" id="ciudad" label="ciudad" required>
              {cargandoCiudades ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.id} value={ciudad.id}>
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

            // value={formData.nombre}
            // onChange={handleChange}
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

            // value={formData.nombre}
            // onChange={handleChange}
          />
          {/* Campo Estamento Colegio */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="estamento">Estamento</InputLabel>
            <Select
              labelId="estamento"
              id="estamento"
              label="estamento"
              required
            >
              <MenuItem value={"Público"}>Público</MenuItem>
              <MenuItem value={"Privado"}>Privado</MenuItem>
              <MenuItem value={"Cobertura"}>Cobertura</MenuItem>
            </Select>
          </FormControl>
          {/* Campo Select Grado Estudiantil */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="grado">Grado</InputLabel>
            <Select labelId="grado" id="grado" label="grado" required>
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
            <Select labelId="eps" id="eps" label="EPS" required>
              <MenuItem value={"Emssanar"}>Emssanar</MenuItem>
            </Select>
          </FormControl>

          {/* Campo Select Discapacidad */}
          <FormControl className="inputs-textfield w-full sm:w-1/4">
            <InputLabel id="discapacidad">Discapacidad</InputLabel>
            <Select
              onChange={handleChangeDiscapacidad}
              labelId="discapacidad"
              id="discapacidad"
              label="discapacidad"
              required
            >
              <MenuItem key={"No"} value={"no"}>
                No
              </MenuItem>
              <MenuItem key={"Sí"} value={"sí"}>
                Sí
              </MenuItem>
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
                label="tipo_discapacidad"
                required
              >
                <MenuItem key={"No"} value={"no"}>
                  Auditiva
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Fisica
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Intelectual
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Visual
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Sordoceguera
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Psicosocial
                </MenuItem>
                <MenuItem key={"Sí"} value={"sí"}>
                  Multiple
                </MenuItem>
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

        <Button
          type="submit"
          variant="contained"
          className="flex mx-auto rounded-2xl bg-primary my-5"
        >
          Editar
        </Button>
      </form>

      {/* Campo Seleccionar Documento de Identidad */}
      <div className="my-4 flex justify-center">
        <input
          name="documento_identidad"
          type="file"
          className="block w-full text-sm text-gray-500"
        />
      </div>
    </div>
  );
}
