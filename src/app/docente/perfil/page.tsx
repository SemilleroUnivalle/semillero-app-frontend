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
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import {ProfesorInterface, Departamento, Ciudad, DepartamentoApi, CiudadApi} from "@/interfaces/interfaces";

export default function DetallarRegistro() {
  const [profesor, setProfesor] = useState<ProfesorInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);

  // Estados para departamentos y ciudades
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string>("");
  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(false);

  const [formData, setFormData] = useState<ProfesorInterface>({
    id: null,
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
    area_desempeño: "",
    eps: "",
    is_active: true,
    grado_escolaridad: "",
    foto: null,
    documento_identidad_pdf: null,
    rut_pdf: null,
    certificado_laboral_pdf: null,
    certificado_bancario_pdf: null,
    hoja_vida_pdf: null,
    certificado_academico_pdf: null,
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
    imagen_modulo: null,
    estado: false,
    id_area: 0,
    id_oferta_categoria: [],
  },
    colegio: "",
    estamento: "",
  });
         
  const [success, setSuccess] = useState(false);

  // Estados para manejo de archivos
  const [foto, setFoto] = useState<File | null>(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState<File | null>(null);
  const [rut, setRut] = useState<File | null>(null);
  const [certificadoLaboral, setCertificadoLaboral] = useState<File | null>(null);
  const [certificadoBancario, setCertificadoBancario] = useState<File | null>(null);
  const [hojaVida, setHojaVida] = useState<File | null>(null);
  const [certificadoAcademico, setCertificadoAcademico] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);

  // Manejo de campos condicionales (ejemplo: otro género, discapacidad, docente)


  // Extrae la función fetchDepartamentos para poder reutilizarla
  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get<DepartamentoApi[]>(
        "https://api-colombia.com/api/v1/Department"
      );
      const departamentosFormateados: Departamento[] = response.data.map(
        (dep) => ({
          id: dep.id,
          nombre: dep.name,
        })
      );
      setDepartamentos(departamentosFormateados);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  // FUNCION REUTILIZABLE PARA CARGAR DATOS DEL PROFESOR
  const fetchProfesor = async () => {
    setLoading(true);
    const userString = localStorage.getItem("user");
    let token = "";
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/profesor/prof/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setProfesor(res.data);
      setDepartamentoSeleccionado(res.data.departamento_residencia || "");
      setFormData(mapBackendToFormDataProfesor(res.data));
      localStorage.setItem("profesor", JSON.stringify(res.data));
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchProfesor();
    fetchDepartamentos();
  }, []);

  // Obtener ciudades cuando cambia el departamento seleccionado en modo edición
  useEffect(() => {
    const fetchCiudades = async () => {
      if (!departamentoSeleccionado) return;
      setCargandoCiudades(true);
      try {
        const departamentoObj = departamentos.find(
          (d) => d.nombre === departamentoSeleccionado
        );
        if (!departamentoObj) return;
        const response = await axios.get<CiudadApi[]>(
          `https://api-colombia.com/api/v1/Department/${departamentoObj.id}/cities`
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

  // Mapea la respuesta del backend a tu estructura interna de Profesor
  function mapBackendToFormDataProfesor(data: ProfesorInterface): ProfesorInterface {
    return {
      id: data.id ?? null,
      nombre: data.nombre ?? "",
      apellido: data.apellido ?? "",
      numero_documento: data.numero_documento ?? "",
      tipo_documento: data.tipo_documento ?? "",
      fecha_nacimiento: data.fecha_nacimiento ?? "",
      genero: data.genero ?? "",
      email: data.email ?? "",
      celular: data.celular ?? "",
      telefono_fijo: data.telefono_fijo ?? "",
      departamento_residencia: data.departamento_residencia ?? "",
      ciudad_residencia: data.ciudad_residencia ?? "",
      comuna_residencia: data.comuna_residencia ?? "",
      direccion_residencia: data.direccion_residencia ?? "",
      area_desempeño: data.area_desempeño ?? "",
      eps: data.eps ?? "",
      is_active: true, // o data.is_active si el backend lo entrega
      grado_escolaridad: data.grado_escolaridad ?? "",
      foto: data.foto ?? null,
      documento_identidad_pdf: data.documento_identidad_pdf ?? null,
      rut_pdf: data.rut_pdf ?? null,
      certificado_laboral_pdf: data.certificado_laboral_pdf ?? null,
      certificado_bancario_pdf: data.certificado_bancario_pdf ?? null,
      hoja_vida_pdf: data.hoja_vida_pdf ?? null,
      certificado_academico_pdf: data.certificado_academico_pdf ?? null,
      modulo: data.modulo ?? null,
      colegio: data.colegio ?? "",
      estamento: data.estamento ?? "",
    };
  }

  // Guardar cambios
  const handleSave = async () => {
  try {
    const formDataToSend = new FormData();

    // Lista de campos que NO se deben enviar
    const camposExcluidos = [
      "contrasena",
      "foto",
      "documento_identidad_pdf",
      "rut_pdf",
      "certificado_laboral_pdf",
      "certificado_bancario_pdf",
      "hoja_vida_pdf",
      "certificado_academico_pdf",
      "is_active",
      "id",
      "modulo",
    ];

    // Campos normales
    for (const key in formData) {
  if (camposExcluidos.includes(key)) continue;
  const typedKey = key as keyof ProfesorInterface;
  let value = formData[typedKey];
  if (typeof value === "boolean") {
    value = value ? "True" : "False";
  }
  formDataToSend.append(key, value as string | Blob);
}

    // Solo envía si el usuario seleccionó un archivo válido
    if (foto && foto.type.startsWith("image/")) {
      formDataToSend.append("foto", foto);
    }
    if (documentoIdentidad && documentoIdentidad.type === "application/pdf") {
      formDataToSend.append("documento_identidad_pdf", documentoIdentidad);
    }

    // Obtener token del localStorage
    const userString = localStorage.getItem("user");
    let token = "";
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token;
    }

    for (const pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await axios.patch(
      `${API_BASE_URL}/profesor/prof/${formData.id}/`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setEditable(false);
      setSuccess(true);
      setImage(null);
      setFoto(null);
      setDocumentoIdentidad(null);
      await fetchProfesor(); // <--- Recarga datos actualizados
    } else {
      alert("Error al actualizar");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Hubo un error al actualizar el profesor.");
  }
};

  if (loading) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <CircularProgress />
        <Typography className="mt-2">
          Cargando datos del profesor...
        </Typography>
      </Box>
    );
  }

  if (!profesor) {
    return (
      <Box className="mt-4 mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <Typography>No se encontró información del profesor.</Typography>
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
          Informacion actualizada exitosamente.
        </Alert>
      </Snackbar>
      <h2 className="mb-4 text-center font-semibold text-primary">
        Detalle de Inscripción
      </h2>

      <div className="flex flex-col justify-around">
        {/* Fotografía */}
        <div className="my-4 flex flex-col items-center justify-around">
          <Avatar
            src={image || profesor.foto || ""}
            sx={{ width: 150, height: 150 }}
            alt="Foto del profesor"
          />

          {editable && (
            <Button
              variant="contained"
              component="label"
              className="my-4 w-1/3 rounded-2xl bg-primary"
            >
              {foto ? "Cambiar Imagen" : "Elegir Imagen"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFoto(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
          )}
        </div>

        {foto && (
          <Typography variant="caption" color="textSecondary">
            {foto.name}
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

            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="genero">Género</InputLabel>
              <Select
                labelId="genero"
                id="genero"
                label="Género"
                required
                value={formData.genero}
                onChange={
                  editable
                    ? (e) => {
                        setFormData({ ...formData, genero: e.target.value });
                        }
                    : undefined
                }
                inputProps={{ readOnly: !editable }}
                disabled={!editable}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>

            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Fecha de nacimiento"
              value={profesor.fecha_nacimiento || ""}
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
                  value={profesor.departamento_residencia || ""}
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  className="inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
                  label="Ciudad"
                  value={profesor.ciudad_residencia || ""}
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
              value={profesor.direccion_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
          </div>

          {/* Información de Salud */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información de Salud
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="EPS"
              value={formData.eps}
              onChange={(e) =>
                setFormData({ ...formData, eps: e.target.value })
              }
              InputProps={{ readOnly: !editable }}
            />
          </div>
          {/* Informacion Académica */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información Académica
          </h2>
          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Area"
              value={formData.area_desempeño}
              onChange={(e) =>
                setFormData({ ...formData, area_desempeño: e.target.value })
              }
              InputProps={{ readOnly: !editable }}
            />
            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="Nivel academico">Nivel academico</InputLabel>
              <Select
                labelId="Nivel academico"
                id="Nivel academico"
                label="Nivel academico"
                required
                value={formData.grado_escolaridad || ""}
                onChange={
                  editable
                    ? (e) => {
                        setFormData({ ...formData, grado_escolaridad: e.target.value });
                      }
                    : undefined
                }
                disabled={!editable}
              >
                <MenuItem value="Profesional">Profesional</MenuItem>
                <MenuItem value="Maestria">Maestria</MenuItem>
                <MenuItem value="Doctorado">Doctorado</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center w-full max-w-xl mx-auto my-6">

  {/* Documento de Identidad */}
  {editable ? (
    <>
      <InputLabel id="documento_identidad" className="justify-self-end">Documento de identidad</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {documentoIdentidad ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="documento_identidad"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setDocumentoIdentidad(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.documento_identidad_pdf && (
          <IconButton
            href={profesor.documento_identidad_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {documentoIdentidad && (
        <Typography variant="caption" color="textSecondary">
          {documentoIdentidad.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.documento_identidad_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.documento_identidad_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver documento de identidad
        </Button>
      </>
    )
  )}

  {/* RUT */}
  {editable ? (
    <>
      <InputLabel id="rut_pdf" className="justify-self-end">RUT</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {rut ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="rut_pdf"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setRut(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.rut_pdf && (
          <IconButton
            href={profesor.rut_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {rut && (
        <Typography variant="caption" color="textSecondary">
          {rut.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.rut_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.rut_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver RUT
        </Button>
      </>
    )
  )}

  {/* Certificado Laboral */}
  {editable ? (
    <>
      <InputLabel id="certificado_laboral_pdf" className="justify-self-end">Certificado laboral</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {certificadoLaboral ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="certificado_laboral_pdf"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setCertificadoLaboral(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.certificado_laboral_pdf && (
          <IconButton
            href={profesor.certificado_laboral_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {certificadoLaboral && (
        <Typography variant="caption" color="textSecondary">
          {certificadoLaboral.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.certificado_laboral_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.certificado_laboral_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver certificado laboral
        </Button>
      </>
    )
  )}

  {/* Certificado Bancario */}
  {editable ? (
    <>
      <InputLabel id="certificado_bancario_pdf" className="justify-self-end">Certificado bancario</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {certificadoBancario ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="certificado_bancario_pdf"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setCertificadoBancario(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.certificado_bancario_pdf && (
          <IconButton
            href={profesor.certificado_bancario_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {certificadoBancario && (
        <Typography variant="caption" color="textSecondary">
          {certificadoBancario.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.certificado_bancario_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.certificado_bancario_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver certificado bancario
        </Button>
      </>
    )
  )}

  {/* Hoja de Vida */}
  {editable ? (
    <>
      <InputLabel id="hoja_vida_pdf" className="justify-self-end">Hoja de vida</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {hojaVida ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="hoja_vida_pdf"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setHojaVida(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.hoja_vida_pdf && (
          <IconButton
            href={profesor.hoja_vida_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {hojaVida && (
        <Typography variant="caption" color="textSecondary">
          {hojaVida.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.hoja_vida_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.hoja_vida_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver hoja de vida
        </Button>
      </>
    )
  )}

  {/* Certificado Académico */}
  {editable ? (
    <>
      <InputLabel id="certificado_academico_pdf" className="justify-self-end">Certificado académico</InputLabel>
      <div className="flex items-center gap-2">
        <Button
          variant="contained"
          component="label"
          className="rounded-2xl bg-primary"
        >
          {certificadoAcademico ? "Cambiar Documento" : "Elegir Documento"}
          <input
            name="certificado_academico_pdf"
            type="file"
            accept=".pdf"
            hidden
            onChange={e => setCertificadoAcademico(e.target.files?.[0] || null)}
          />
        </Button>
        {profesor.certificado_academico_pdf && (
          <IconButton
            href={profesor.certificado_academico_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </div>
      <div></div>
      {certificadoAcademico && (
        <Typography variant="caption" color="textSecondary">
          {certificadoAcademico.name}
        </Typography>
      )}
    </>
  ) : (
    profesor.certificado_academico_pdf && (
      <>
        
        <Button
          variant="outlined"
          color="primary"
          href={profesor.certificado_academico_pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver certificado académico
        </Button>
      </>
    )
  )}

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

          {editable && (
            <Button
              variant="outlined"
              color="secondary"
              className="text-md mt-4 w-1/3 rounded-2xl border-2 border-solid border-secondary py-2 font-semibold capitalize text-secondary shadow-none transition hover:bg-secondary hover:text-white"
              onClick={() => setEditable(false)}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}