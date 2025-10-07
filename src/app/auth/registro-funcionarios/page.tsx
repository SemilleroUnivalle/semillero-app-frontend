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

const generos = ["Masculino", "Femenino"];

export default function Registro() {
  const router = useRouter();

  //Estado para controlar documentos
  const [posicion, setPosicion] = useState("");

  // Estados para documentos
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(
    null,
  );
  const [rut, setRut] = useState<File | null>(null);
  const [certificadoBancario, setCertificadoBancario] = useState<File | null>(
    null,
  );
  const [d10, setD10] = useState<File | null>(null);
  const [tabulado, setTabulado] = useState<File | null>(null);
  const [matriculaFinanciera, setMatriculaFinanciera] = useState<File | null>(
    null,
  );
  const [hojaVida, setHojaVida] = useState<File | null>(null);
  const [certificadoLaboral, setCertificadoLaboral] = useState<File | null>(
    null,
  );
  const [certificadoEstudios, setCertificadoEstudios] = useState<File | null>(
    null,
  );

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
    eps: "",
    discapacidad: false,
    descripcion_discapacidad: "",
    tipo_discapacidad: "",
    is_active: true,
    area_desempeño: "",
    grado_escolaridad: "",
  });

  // Manejar envío del formulario
  // Enviar datos al backend

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        const typedKey = key as keyof typeof formData;
        let value = formData[typedKey];
        if (typeof value === "boolean") value = value ? "True" : "False";
        formDataToSend.append(key, value as string | Blob);
      }

      // Verificar el contenido de formDataToSend
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // Agregar archivos al FormData si existen
      if (fotoPerfil) {
        formDataToSend.append("foto", fotoPerfil);
      }

      if (documentoIdentidad) {
        formDataToSend.append("documento_identidad_pdf", documentoIdentidad);
      }

      if (rut) {
        formDataToSend.append("rut_pdf", rut);
      }
      if (certificadoBancario) {
        formDataToSend.append("certificado_bancario_pdf", certificadoBancario);
      }
      if (d10) {
        formDataToSend.append("d10_pdf", d10);
      }
      if (tabulado) {
        formDataToSend.append("tabulado_pdf", tabulado);
      }
      if (matriculaFinanciera) {
        formDataToSend.append("estado_mat_financiera_pdf", matriculaFinanciera);
      }
      if (hojaVida) {
        formDataToSend.append("hoja_vida_pdf", hojaVida);
      }
      if (certificadoLaboral) {
        formDataToSend.append("certificado_laboral_pdf", certificadoLaboral);
      }
      if (certificadoEstudios) {
        formDataToSend.append("certificado_academico_pdf", certificadoEstudios);
      }

      // Determina el endpoint según la posición
      let endpoint = "";
      if (posicion === "Docente") {
        endpoint = `${API_BASE_URL}/profesor/prof/`;
      } else if (posicion === "Administrativo") {
        endpoint = `${API_BASE_URL}/monitor_administrativo/mon/`;
      } else if (posicion === "Académico") {
        endpoint = `${API_BASE_URL}/monitor_academico/mon/`;
      } else {
        alert("Selecciona una posición válida.");
        return;
      }

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Registro exitoso");
        router.push("/auth/login");
      } else {
        alert("Error al registrar. Intenta de nuevo.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.detail || "Error de conexión");
      } else {
        alert("Error de conexión");
      }
    }
  };

  // Manejo de estado para mostrar campos de discapacidad
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

  return (
    <div className="mx-auto my-4 w-full content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <h1>Registro de Funcionarios</h1>

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
                onChange={handleFotoChange}
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
                  value={formData.tipo_documento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
              />

              <Autocomplete
                className="inputs-textfield w-full sm:w-1/3"
                freeSolo
                options={generos}
                value={formData.genero}
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

        {/* Contenedor Informacion Académica */}
        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Información Académica
        </h2>

        <>
          <div className="flex flex-wrap justify-around gap-4 text-gray-600">
            <FormControl className="inputs-textfield w-full sm:w-1/4">
              <InputLabel id="grado_escolaridad">
                Grado de escolaridad
              </InputLabel>
              <Select
                labelId="grado_escolaridad"
                id="grado_escolaridad"
                name="grado_escolaridad"
                label="Grado de escolaridad"
                // required
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
                  setFormData({ ...formData, area_desempeño: e.target.value })
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
            </FormControl>
          </div>
        </>

        <h2 className="text-md my-4 text-center font-semibold text-primary">
          Seleccione su posición en Semillero
        </h2>
        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="posicion">Cargo o posición</InputLabel>
          <Select
            labelId="posicion"
            id="posicion"
            name="posicion"
            label="Cargo o posición"
            required
            value={posicion || ""}
            onChange={(e) => setPosicion(e.target.value)}
          >
            7<MenuItem value="Docente">Docente</MenuItem>
            <MenuItem value="Académico">Monitor Académico</MenuItem>
            <MenuItem value="Administrativo">Monitor Administrativo</MenuItem>
          </Select>
        </FormControl>

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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setDocumentoIdentidad(file);
              }
            }}
          />
          <InputLabel id="rut">
            Rut actualizado 2025 (Código de actividad 8560){" "}
          </InputLabel>
          <input
            name="rut"
            type="file"
            accept=".pdf"
            className="block w-1/2 text-sm text-gray-500"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setRut(file);
              }
            }}
          />
          <InputLabel id="certificado_bancario">
            Certificado bancario
          </InputLabel>
          <input
            name="certificado_bancario"
            type="file"
            accept=".pdf"
            className="block w-1/2 text-sm text-gray-500"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCertificadoBancario(file);
              }
            }}
          />

          {posicion === "Docente" ? (
            <>
              <InputLabel id="hoja-vida">Hoja de vida</InputLabel>
              <input
                name="hoja-vida"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setHojaVida(file);
                  }
                }}
              />
              <InputLabel id="certificado-laboral">
                Certificado laboral
              </InputLabel>
              <input
                name="certificado-laboral"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCertificadoLaboral(file);
                  }
                }}
              />

              <InputLabel id="certificado-estudios">
                Certificado de estudios
              </InputLabel>
              <input
                name="certificado-estudios"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCertificadoEstudios(file);
                  }
                }}
              />
            </>
          ) : (
            <>
              <InputLabel id="d10">Hoja de vida D10</InputLabel>
              <input
                name="d10"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setD10(file);
                  }
                }}
              />
              <InputLabel id="tabulado">Tabulado</InputLabel>
              <input
                name="tabulado"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setTabulado(file);
                  }
                }}
              />

              <InputLabel id="matricula-financiera">
                Estado de matricula financiera (MATFIN)
              </InputLabel>
              <input
                name="matricula-financiera"
                type="file"
                accept=".pdf"
                className="block w-1/2 text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMatriculaFinanciera(file);
                  }
                }}
              />
            </>
          )}
        </div>
        <Button
          type="submit"
          variant="outlined"
          className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white"
        >
          Continuar
        </Button>
      </form>
    </div>
  );
}
