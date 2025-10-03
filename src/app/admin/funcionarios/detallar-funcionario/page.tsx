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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
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
interface AuditInterface {
  id: number;
  usuario: string;
  timestamp: string;
}
interface FuncionarioInterface {
  id: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  tipo_documento: string;
  fecha_nacimiento: string;
  genero: string;
  email: string;
  celular: string;
  telefono_fijo: string;
  departamento_residencia: string;
  ciudad_residencia: string;
  comuna_residencia: string;
  direccion_residencia: string;
  eps: string;
  discapacidad: boolean;
  descripcion_discapacidad: string;
  tipo_discapacidad: string;
  area_desempeño: string;
  grado_escolaridad: string;
  documento_identidad_pdf: string;
  rut_pdf: string;
  certificado_bancario_pdf: string;
  hoja_vida_pdf: string;
  certificado_laboral_pdf: string;
  certificado_academico_pdf: string;
  d10_pdf: string;
  tabulado_pdf: string;
  estado_mat_financiera_pdf: string;
  foto: string;
  tipo: string;
  verificacion_informacion: boolean | null;
  verificacion_documento_identidad: boolean | null;
  verificacion_foto: boolean | null;
  verificacion_hoja_vida: boolean | null;
  verificacion_certificado_laboral: boolean | null;
  verificacion_certificado_academico: boolean | null;
  verificacion_rut: boolean | null;
  verificacion_certificado_bancario: boolean | null;
  verificacion_d10: boolean | null;
  verificacion_tabulado: boolean | null;
  verificacion_estado_mat_financiera: boolean | null;
  audit_informacion: AuditInterface | null;
  audit_documento_identidad: AuditInterface | null;
  audit_foto: AuditInterface | null;
  audit_hoja_vida: AuditInterface | null;
  audit_certificado_laboral: AuditInterface | null;
  audit_certificado_academico: AuditInterface | null;
  audit_rut: AuditInterface | null;
  audit_certificado_bancario: AuditInterface | null;
  audit_d10: AuditInterface | null;
  audit_tabulado: AuditInterface | null;
  audit_estado_mat_financiera: AuditInterface | null;
}

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

export default function DetallarFuncionarios() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);

  // Estados para departamentos y ciudades
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState<string>("");
  const [cargandoCiudades, setCargandoCiudades] = useState<boolean>(false);

  const [formData, setFormData] = useState<FuncionarioInterface>({
    id: 0,
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
    area_desempeño: "",
    grado_escolaridad: "",
    documento_identidad_pdf: "",
    rut_pdf: "",
    certificado_bancario_pdf: "",
    hoja_vida_pdf: "",
    certificado_laboral_pdf: "",
    certificado_academico_pdf: "",
    d10_pdf: "",
    tabulado_pdf: "",
    estado_mat_financiera_pdf: "",
    tipo: "",
    foto: "",
    verificacion_informacion: null,
    verificacion_documento_identidad: null,
    verificacion_foto: null,
    verificacion_hoja_vida: null,
    verificacion_certificado_laboral: null,
    verificacion_certificado_academico: null,
    verificacion_rut: null,
    verificacion_certificado_bancario: null,
    verificacion_d10: null,
    verificacion_tabulado: null,
    verificacion_estado_mat_financiera: null,
    audit_informacion: null,
    audit_documento_identidad: null,
    audit_foto: null,
    audit_hoja_vida: null,
    audit_certificado_laboral: null,
    audit_certificado_academico: null,
    audit_rut: null,
    audit_certificado_bancario: null,
    audit_d10: null,
    audit_tabulado: null,
    audit_estado_mat_financiera: null,
  });

  const [success, setSuccess] = useState(false);

  // Estados para manejo de archivos
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
  const [certificadoAcademico, setCertificadoAcademico] = useState<File | null>(
    null,
  );

  const [image, setImage] = useState<string | null>(null);

  // Manejo de campo para otro género

  const [mostrarOtroGenero, setMostrarOtroGenero] = useState(false);
  const [mostrarTipoDiscapacidad, setTipoDiscapacidad] = useState(false);

  const [funcionarioId, setFuncionarioId] = useState<number | null>(null);
  const [funcionarioTipo, setFuncionarioTipo] = useState<string | null>(null);

  const [endpoint, setEndpoint] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("funcionarioSeleccionado");
    if (storedData) {
      const seleccionado = JSON.parse(storedData);
      setFuncionarioId(seleccionado.id);
      setFuncionarioTipo(seleccionado.tipo);

      let url = "";
      if (seleccionado.tipo === "Monitor Académico") {
        url = `${API_BASE_URL}/monitor_academico/mon/${seleccionado.id}/`;
      } else if (seleccionado.tipo === "Monitor Administrativo") {
        url = `${API_BASE_URL}/monitor_administrativo/mon/${seleccionado.id}/`;
      } else if (seleccionado.tipo === "Profesor") {
        url = `${API_BASE_URL}/profesor/prof/${seleccionado.id}/`;
      }
      setEndpoint(url);
      console.log("Funcionario seleccionado:", seleccionado);
      console.log("Endpoint establecido:", url);
    } else {
      console.error("No se encontró funcionarioSeleccionado en localStorage");
    }
  }, []);

  // Obtener datos del funcionario y departamentos
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

    const userString = localStorage.getItem("user");
    let token = "";
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token;
    }

    axios
      .get(endpoint, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        // setEstudiante(res.data);
        setDepartamentoSeleccionado(res.data.departamento_residencia || "");
        setLoading(false); // <-- termina la carga
        // En tu useEffect después de obtener el estudiante
        setFormData({
          ...formData,
          ...res.data,
        });
        setFormData((prevData) => ({
          ...prevData,
          tipo: funcionarioTipo ?? "",
        }));
      })
      .catch(() => setLoading(false)); // <-- termina la carga en error

    fetchDepartamentos();
  }, [endpoint, funcionarioId, funcionarioTipo]);

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
  1;

  //Funcion para guardar cambios
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Lista de campos que NO se deben enviar
      const camposExcluidos = [
        "contrasena",
        "id_estudiante",
        "tipo",
        "is_active",
      ];

      for (const key in formData) {
        if (
          camposExcluidos.includes(key) ||
          [
            "foto",
            "documento_identidad_pdf",
            "rut_pdf",
            "certificado_bancario_pdf",
            "hoja_vida_pdf",
            "certificado_laboral_pdf",
            "certificado_academico_pdf",
            "d10_pdf",
            "tabulado_pdf",
            "estado_mat_financiera_pdf",
          ].includes(key)
        )
          continue;

        let value = (formData as any)[key];
        if (typeof value === "boolean") {
          value = value ? "True" : "False";
        }
        formDataToSend.append(key, value);
      }

      // Agregar archivos si existen
      if (fotoPerfil) {
        formDataToSend.append("foto", fotoPerfil);
      }
      if (documentoIdentidad) {
        formDataToSend.append("documento_identidad_pdf", documentoIdentidad);
      } else if (formData.documento_identidad_pdf) {
        formDataToSend.append(
          "documento_identidad_pdf",
          formData.documento_identidad_pdf,
        );
      }
      if (rut) {
        formDataToSend.append("rut_pdf", rut);
      } else if (formData.rut_pdf) {
        formDataToSend.append("rut_pdf", formData.rut_pdf);
      }
      if (certificadoBancario) {
        formDataToSend.append("certificado_bancario_pdf", certificadoBancario);
      } else if (formData.certificado_bancario_pdf) {
        formDataToSend.append(
          "certificado_bancario_pdf",
          formData.certificado_bancario_pdf,
        );
      }
      if (d10) {
        formDataToSend.append("d10_pdf", d10);
      } else if (formData.d10_pdf) {
        formDataToSend.append("d10_pdf", formData.d10_pdf);
      }
      if (tabulado) {
        formDataToSend.append("tabulado_pdf", tabulado);
      } else if (formData.tabulado_pdf) {
        formDataToSend.append("tabulado_pdf", formData.tabulado_pdf);
      }
      if (matriculaFinanciera) {
        formDataToSend.append("estado_mat_financiera_pdf", matriculaFinanciera);
      } else if (formData.estado_mat_financiera_pdf) {
        formDataToSend.append(
          "estado_mat_financiera_pdf",
          formData.estado_mat_financiera_pdf,
        );
      }
      if (hojaVida) {
        formDataToSend.append("hoja_vida_pdf", hojaVida);
      } else if (formData.hoja_vida_pdf) {
        formDataToSend.append("hoja_vida_pdf", formData.hoja_vida_pdf);
      }
      if (certificadoLaboral) {
        formDataToSend.append("certificado_laboral_pdf", certificadoLaboral);
      } else if (formData.certificado_laboral_pdf) {
        formDataToSend.append(
          "certificado_laboral_pdf",
          formData.certificado_laboral_pdf,
        );
      }
      if (certificadoAcademico) {
        formDataToSend.append(
          "certificado_academico_pdf",
          certificadoAcademico,
        );
      } else if (formData.certificado_academico_pdf) {
        formDataToSend.append(
          "certificado_academico_pdf",
          formData.certificado_academico_pdf,
        );
      }

      // Obtener token del localStorage
      const userString = localStorage.getItem("user");
      let token = "";
      if (userString) {
        const user = JSON.parse(userString);
        token = user.token;
      }

      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      console.log("Endpoint:", endpoint);
      const response = await axios.patch(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Actualización exitosa");
        setEditable(false);
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al actualizar el funcionario.");
    }
  };

  // Función para eliminar un funcionario
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este funcionario?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(true);
      router.push("/admin/funcionarios/visualizar-funcionarios/");
    } catch (error) {
      console.error("Error al eliminar el funcionario:", error);
      alert(
        "Hubo un error al eliminar el funcionario. Por favor, inténtalo de nuevo.",
      );
    }
  };

  // Estados para cada verificación
  const [estadoInformacion, setEstadoInformacion] = useState<boolean | null>(
    formData.verificacion_informacion,
  );
  const [estadoDocumentoIdentidad, setEstadoDocumentoIdentidad] = useState<
    boolean | null
  >(formData.verificacion_documento_identidad);
  const [estadoFotoPerfil, setEstadoFotoPerfil] = useState<boolean | null>(
    formData.verificacion_foto,
  );
  const [estadoHojaVida, setEstadoHojaVida] = useState<boolean | null>(
    formData.verificacion_hoja_vida,
  );
  const [estadoCertificadoLaboral, setEstadoCertificadoLaboral] = useState<
    boolean | null
  >(formData.verificacion_certificado_laboral);
  const [estadoCertificadoAcademico, setEstadoCertificadoAcademico] = useState<
    boolean | null
  >(formData.verificacion_certificado_academico);
  const [estadoRut, setEstadoRut] = useState<boolean | null>(
    formData.verificacion_rut,
  );
  const [estadoCertificadoBancario, setEstadoCertificadoBancario] = useState<
    boolean | null
  >(formData.verificacion_certificado_bancario);
  const [estadoD10, setEstadoD10] = useState<boolean | null>(
    formData.verificacion_d10,
  );
  const [estadoTabulado, setEstadoTabulado] = useState<boolean | null>(
    formData.verificacion_tabulado,
  );
  const [estadoMatFinanciera, setEstadoMatFinanciera] = useState<
    boolean | null
  >(formData.verificacion_estado_mat_financiera);

  useEffect(() => {
    setEstadoInformacion(formData.verificacion_informacion);
    setEstadoFotoPerfil(formData.verificacion_foto);
    setEstadoDocumentoIdentidad(formData.verificacion_documento_identidad);
    setEstadoRut(formData.verificacion_rut);
    setEstadoCertificadoBancario(formData.verificacion_certificado_bancario);
    setEstadoHojaVida(formData.verificacion_hoja_vida);
    setEstadoCertificadoLaboral(formData.verificacion_certificado_laboral);
    setEstadoCertificadoAcademico(formData.verificacion_certificado_academico);
    setEstadoD10(formData.verificacion_d10);
    setEstadoTabulado(formData.verificacion_tabulado);
    setEstadoMatFinanciera(formData.verificacion_estado_mat_financiera);
  }, [formData]);

  // Handler genérico para cualquier verificación
  const handleEstadoVerificacion = async (
    campo: keyof FuncionarioInterface,
    setter: React.Dispatch<React.SetStateAction<boolean | null>>,
    event: React.MouseEvent<HTMLElement>,
    newEstado: true | false | null,
  ) => {
    if (newEstado !== null && formData.id) {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        console.log("Endpoint:", endpoint);
        const response = await axios.patch(
          `${endpoint}`,
          { [campo]: newEstado },
          { headers: { Authorization: `Token ${token}` } },
        );
        setter(newEstado);
        if (response.status === 200) {
          console.log(`Verificación de ${campo} actualizada a:`, newEstado);
        }
      } catch (error) {
        console.error(`Error al actualizar verificación de ${campo}:`, error);
      }
    }
  };

  // Array de configuraciones para cada verificación
  const verificaciones: {
    label: string;
    campo: keyof FuncionarioInterface;
    value: boolean | null;
    setter: React.Dispatch<React.SetStateAction<boolean | null>>;
    audit: AuditInterface | null;
  }[] = [
    {
      label: "Información verificada",
      campo: "verificacion_informacion",
      value: estadoInformacion,
      setter: setEstadoInformacion,
      audit: formData.audit_informacion,
    },
    {
      label: "Fotografía verificada",
      campo: "verificacion_foto",
      value: estadoFotoPerfil,
      setter: setEstadoFotoPerfil,
      audit: formData.audit_foto,
    },
    {
      label: "Documento de identidad verificado",
      campo: "verificacion_documento_identidad",
      value: estadoDocumentoIdentidad,
      setter: setEstadoDocumentoIdentidad,
      audit: formData.audit_documento_identidad,
    },
    {
      label: "RUT verificado",
      campo: "verificacion_rut",
      value: estadoRut,
      setter: setEstadoRut,
      audit: formData.audit_rut,
    },
    {
      label: "Certificado bancario verificado",
      campo: "verificacion_certificado_bancario",
      value: estadoCertificadoBancario,
      setter: setEstadoCertificadoBancario,
      audit: formData.audit_certificado_bancario,
    },
    {
      label: "Hoja de vida verificada",
      campo: "verificacion_hoja_vida",
      value: estadoHojaVida,
      setter: setEstadoHojaVida,
      audit: formData.audit_hoja_vida,
    },
    {
      label: "Certificado laboral verificado",
      campo: "verificacion_certificado_laboral",
      value: estadoCertificadoLaboral,
      setter: setEstadoCertificadoLaboral,
      audit: formData.audit_certificado_laboral,
    },
    {
      label: "Certificado académico verificado",
      campo: "verificacion_certificado_academico",
      value: estadoCertificadoAcademico,
      setter: setEstadoCertificadoAcademico,
      audit: formData.audit_certificado_academico,
    },
    {
      label: "D10 verificado",
      campo: "verificacion_d10",
      value: estadoD10,
      setter: setEstadoD10,
      audit: formData.audit_d10,
    },
    {
      label: "Tabulado verificado",
      campo: "verificacion_tabulado",
      value: estadoTabulado,
      setter: setEstadoTabulado,
      audit: formData.audit_tabulado,
    },
    {
      label: "Estado matrícula financiera verificado",
      campo: "verificacion_estado_mat_financiera",
      value: estadoMatFinanciera,
      setter: setEstadoMatFinanciera,
      audit: formData.audit_estado_mat_financiera,
    },
  ];

  const verificacionesFiltradas = verificaciones.filter((ver) => {
    // Campos comunes para todos
    const camposComunes = [
      "verificacion_informacion",
      "verificacion_foto",
      "verificacion_documento_identidad",
      "verificacion_rut",
      "verificacion_certificado_bancario",
    ];

    // Campos solo para profesor
    const camposProfesor = [
      "verificacion_hoja_vida",
      "verificacion_certificado_laboral",
      "verificacion_certificado_academico",
    ];

    // Campos solo para monitor
    const camposMonitor = [
      "verificacion_d10",
      "verificacion_tabulado",
      "verificacion_estado_mat_financiera",
    ];

    if (camposComunes.includes(ver.campo)) return true;
    if (funcionarioTipo === "Profesor" && camposProfesor.includes(ver.campo))
      return true;
    if (
      (funcionarioTipo === "Monitor Académico" ||
        funcionarioTipo === "Monitor Administrativo") &&
      camposMonitor.includes(ver.campo)
    )
      return true;

    return false;
  });

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
            src={image ? image : formData.foto}
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
                      setImage(reader.result as string);
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
                setFormData({
                  ...formData,
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
              value={formData.fecha_nacimiento || ""}
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

          {/* Informacion Académica */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Información Académica
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            {/* Campo cargo o posición */}
            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="posicion">Cargo o posición</InputLabel>
              <Select
                labelId="posicion"
                id="posicion"
                name="posicion"
                label="Cargo o posición"
                required
                disabled={!editable}
                value={formData.tipo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
              >
                <MenuItem value="Profesor">Profesor</MenuItem>
                <MenuItem value="Monitor Académico">Monitor Académico</MenuItem>
                <MenuItem value="Monitor Administrativo">
                  Monitor Administrativo
                </MenuItem>
              </Select>
            </FormControl>

            {/* Campo grado de escolaridad */}
            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="grado_escolaridad">
                Grado de escolaridad
              </InputLabel>
              <Select
                labelId="grado_escolaridad"
                id="grado_escolaridad"
                name="grado_escolaridad"
                label="Grado de escolaridad"
                required
                disabled={!editable}
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

            {/* Campo área de enseñanza */}
            <FormControl
              className={
                editable
                  ? "inputs-textfield w-full sm:w-1/4"
                  : "inputs-textfield-readonly w-full sm:w-1/4"
              }
            >
              <InputLabel id="area_ensenanza">Área de enseñanza</InputLabel>
              <Select
                labelId="area_ensenanza"
                id="area_ensenanza"
                name="area_ensenanza"
                label="Área de enseñanza"
                disabled={!editable}
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

          {/* Documentos */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Documentación
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            {/* Documento de identidad */}
            <div className="flex w-full flex-col sm:w-1/4">
              {formData.documento_identidad_pdf && (
                <Button
                  variant="outlined"
                  color="primary"
                  href={formData.documento_identidad_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 h-full rounded-2xl border-primary text-primary"
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
                    {documentoIdentidad
                      ? "Cambiar Documento"
                      : "Elegir Documento"}
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

            {/* RUT */}
            <div className="flex w-full flex-col sm:w-1/4">
              {formData.rut_pdf && (
                <Button
                  variant="outlined"
                  color="primary"
                  href={formData.rut_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 h-full rounded-2xl border-primary text-primary"
                  startIcon={<PictureAsPdfIcon />}
                >
                  Ver RUT
                </Button>
              )}
              {editable && (
                <div className="my-4 flex flex-col items-center gap-3">
                  <InputLabel id="rut_pdf">RUT</InputLabel>
                  <Button
                    variant="contained"
                    component="label"
                    className="my-2 rounded-2xl bg-primary"
                  >
                    {documentoIdentidad
                      ? "Cambiar Documento"
                      : "Elegir Documento"}
                    <input
                      name="rut_pdf"
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setRut(file);
                        }
                      }}
                    />
                  </Button>
                  {rut && (
                    <Typography variant="caption" color="textSecondary">
                      {rut.name}
                    </Typography>
                  )}
                </div>
              )}
            </div>

            {/* Certificado Bancario */}
            <div className="flex w-full flex-col sm:w-1/4">
              {formData.certificado_bancario_pdf && (
                <Button
                  variant="outlined"
                  color="primary"
                  href={formData.certificado_bancario_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 h-full rounded-2xl border-primary text-primary"
                  startIcon={<PictureAsPdfIcon />}
                >
                  Ver Certificado Bancario
                </Button>
              )}
              {editable && (
                <div className="my-4 flex flex-col items-center gap-3">
                  <InputLabel id="certificado_bancario">
                    Certificado Bancario
                  </InputLabel>
                  <Button
                    variant="contained"
                    component="label"
                    className="my-2 rounded-2xl bg-primary"
                  >
                    {certificadoBancario
                      ? "Cambiar Documento"
                      : "Elegir Documento"}
                    <input
                      name="certificado_bancario"
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCertificadoBancario(file);
                        }
                      }}
                    />
                  </Button>
                  {certificadoBancario && (
                    <Typography variant="caption" color="textSecondary">
                      {certificadoBancario.name}
                    </Typography>
                  )}
                </div>
              )}
            </div>

            {/* Documentos para profesores */}
            {formData.tipo === "Profesor" && (
              <>
                {/* Hoja de Vida */}

                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.hoja_vida_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.hoja_vida_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver Hoja de Vida
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="hoja_vida">Hoja de Vida</InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {hojaVida ? "Cambiar Documento" : "Elegir Documento"}
                        <input
                          name="hoja_vida"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setHojaVida(file);
                            }
                          }}
                        />
                      </Button>
                      {hojaVida && (
                        <Typography variant="caption" color="textSecondary">
                          {hojaVida.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificado Laboral */}
                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.certificado_laboral_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.certificado_laboral_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver Certificado Laboral
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="certificado_laboral">
                        Certificado Laboral
                      </InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {certificadoLaboral
                          ? "Cambiar Documento"
                          : "Elegir Documento"}
                        <input
                          name="certificado_laboral"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCertificadoLaboral(file);
                            }
                          }}
                        />
                      </Button>
                      {certificadoLaboral && (
                        <Typography variant="caption" color="textSecondary">
                          {certificadoLaboral.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificado Académico */}
                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.certificado_academico_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.certificado_academico_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver Certificado Académico
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="certificado_academico">
                        Certificado Académico
                      </InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {certificadoAcademico
                          ? "Cambiar Documento"
                          : "Elegir Documento"}
                        <input
                          name="certificado_academico"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCertificadoAcademico(file);
                            }
                          }}
                        />
                      </Button>
                      {certificadoAcademico && (
                        <Typography variant="caption" color="textSecondary">
                          {certificadoAcademico.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Documentos para monitores académicos y administrativos */}
            {formData.tipo !== "Profesor" && (
              <>
                {/* D10 */}
                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.d10_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.d10_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver D10
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="d10">D10</InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {d10 ? "Cambiar Documento" : "Elegir Documento"}
                        <input
                          name="d10"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setD10(file);
                            }
                          }}
                        />
                      </Button>
                      {d10 && (
                        <Typography variant="caption" color="textSecondary">
                          {d10.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>

                {/* Tabulado */}
                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.tabulado_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.tabulado_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver Tabulado
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="tabulado">Tabulado</InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {tabulado ? "Cambiar Documento" : "Elegir Documento"}
                        <input
                          name="tabulado"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTabulado(file);
                            }
                          }}
                        />
                      </Button>
                      {tabulado && (
                        <Typography variant="caption" color="textSecondary">
                          {tabulado.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>

                {/* Estado Matrícula Financiera */}
                <div className="flex w-full flex-col sm:w-1/4">
                  {formData.estado_mat_financiera_pdf && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={formData.estado_mat_financiera_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 h-full rounded-2xl border-primary text-primary"
                      startIcon={<PictureAsPdfIcon />}
                    >
                      Ver Estado de Matrícula Financiera
                    </Button>
                  )}

                  {editable && (
                    <div className="my-4 flex flex-col items-center gap-3">
                      <InputLabel id="estado_mat_financiera">
                        Estado Matrícula Financiera
                      </InputLabel>
                      <Button
                        variant="contained"
                        component="label"
                        className="my-2 rounded-2xl bg-primary"
                      >
                        {matriculaFinanciera
                          ? "Cambiar Documento"
                          : "Elegir Documento"}
                        <input
                          name="estado_mat_financiera"
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setMatriculaFinanciera(file);
                            }
                          }}
                        />
                      </Button>
                      {matriculaFinanciera && (
                        <Typography variant="caption" color="textSecondary">
                          {matriculaFinanciera.name}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Verificaciones */}
          <h2 className="text-md my-4 text-center font-semibold text-primary">
            Verificaciones
          </h2>

          <div className="flex w-full flex-wrap justify-around gap-4 text-gray-600">
            {verificacionesFiltradas.map((ver) => (
              <div
                key={ver.campo}
                className="flex w-full flex-col items-center sm:w-1/4"
              >
                <Typography variant="body1" color="textSecondary">
                  {ver.label}
                </Typography>
                <ToggleButtonGroup
                  value={ver.value}
                  exclusive
                  onChange={(event, newEstado) =>
                    handleEstadoVerificacion(
                      ver.campo,
                      ver.setter,
                      event,
                      newEstado,
                    )
                  }
                  aria-label="Estado de verificación"
                  sx={{ marginY: 2, borderRadius: 8 }}
                >
                  <ToggleButton
                    value={true}
                    aria-label="Aprobado"
                    color="success"
                  >
                    <CheckCircleIcon />
                  </ToggleButton>
                  <ToggleButton
                    value={false}
                    aria-label="Rechazado"
                    color="error"
                  >
                    <CancelIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                {ver.audit && (
                  <div>
                    <p className="text-xs">
                      <span className="font-bold">Usuario: </span>
                      {ver.audit.usuario}
                      <br />
                      <span className="font-bold">Fecha: </span>
                      {ver.audit.timestamp
                        ? new Date(ver.audit.timestamp).toLocaleString(
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
                )}
              </div>
            ))}
          </div>
        </div>

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
              handleDelete(formData.id);
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
