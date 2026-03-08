"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Mock data
const MOCK_PERIODOS = ["2024", "2025", "2026"];

const MOCK_ESTUDIANTES_COMPLETO = [
  {
    id: 1,
    documento: "1001234567",
    nombre: "Juan Pérez",
    email: "juan@example.com",
    matriculas: [
      { id: 1, periodo: "2024", oferta: "Matemáticas Básico", area: "Matemáticas" },
      { id: 2, periodo: "2025", oferta: "Matemáticas Avanzado", area: "Matemáticas" },
    ],
  },
  {
    id: 2,
    documento: "1002345678",
    nombre: "María García",
    email: "maria@example.com",
    matriculas: [
      { id: 3, periodo: "2024", oferta: "Biología", area: "Biología" },
      { id: 4, periodo: "2025", oferta: "Biología Avanzada", area: "Biología" },
    ],
  },
  {
    id: 3,
    documento: "1003456789",
    nombre: "Carlos López",
    email: "carlos@example.com",
    matriculas: [{ id: 5, periodo: "2025", oferta: "Lenguaje", area: "Lenguaje" }],
  },
  {
    id: 4,
    documento: "1004567890",
    nombre: "Ana Martínez",
    email: "ana@example.com",
    matriculas: [{ id: 6, periodo: "2025", oferta: "Física", area: "Física" }],
  },
  {
    id: 5,
    documento: "1005678901",
    nombre: "Luis Rodríguez",
    email: "luis@example.com",
    matriculas: [{ id: 7, periodo: "2026", oferta: "Teatro", area: "Teatro" }],
  },
  {
    id: 6,
    documento: "1006789012",
    nombre: "Sofia Torres",
    email: "sofia@example.com",
    matriculas: [
      { id: 8, periodo: "2025", oferta: "Música", area: "Música" },
      { id: 9, periodo: "2026", oferta: "Música Avanzada", area: "Música" },
    ],
  },
  {
    id: 7,
    documento: "1007890123",
    nombre: "Diego Sánchez",
    email: "diego@example.com",
    matriculas: [{ id: 10, periodo: "2024", oferta: "Física", area: "Física" }],
  },
];

interface CertificadoCargado {
  id: string;
  estudianteDocumento: string;
  estudianteNombre: string;
  periodo: string;
  oferta: string;
  archivo: string;
  fechaCarga: string;
  estado: "exitoso" | "error";
  mensaje?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function CertificadosPage() {
  const [tabValue, setTabValue] = useState(0);

  // Carga Individual
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("");
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null);
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState<any>(null);
  const [archivoIndividual, setArchivoIndividual] = useState<File | null>(null);

  // Carga Masiva
  const [periodoMasivo, setPeriodoMasivo] = useState<string>("");
  const [archivosLote, setArchivosLote] = useState<File[]>([]);

  // Estados globales
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error" | "info";
    texto: string;
  } | null>(null);
  const [certificadosCargados, setCertificadosCargados] = useState<
    CertificadoCargado[]
  >([]);

  // Filtrar estudiantes por período y búsqueda
  const estudiantesFiltrados = MOCK_ESTUDIANTES_COMPLETO.filter((est) => {
    const tieneMatriculaEnPeriodo = est.matriculas.some(
      (mat) => mat.periodo === periodoSeleccionado
    );
    const coincideBusqueda =
      est.nombre.toLowerCase().includes(busquedaEstudiante.toLowerCase()) ||
      est.documento.includes(busquedaEstudiante);
    return tieneMatriculaEnPeriodo && coincideBusqueda;
  });

  const matriculasEstudiante =
    estudianteSeleccionado?.matriculas.filter(
      (mat: any) => mat.periodo === periodoSeleccionado
    ) || [];

  // Carga Individual
  const handleArchivoIndividualChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const archivo = event.target.files[0];
      if (archivo.type === "application/pdf") {
        if (archivo.size > 2 * 1024 * 1024) {
          setMensaje({
            tipo: "error",
            texto: "El archivo no puede exceder 2MB",
          });
          setArchivoIndividual(null);
        } else {
          setArchivoIndividual(archivo);
          setMensaje(null);
        }
      } else {
        setMensaje({
          tipo: "error",
          texto: "Por favor, selecciona un archivo PDF válido.",
        });
        setArchivoIndividual(null);
      }
    }
  };

  const handleCargarIndividual = async () => {
    if (!periodoSeleccionado || !estudianteSeleccionado || !matriculaSeleccionada || !archivoIndividual) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, completa todos los campos.",
      });
      return;
    }

    setCargando(true);

    setTimeout(() => {
      const nuevoCertificado: CertificadoCargado = {
        id: `cert-${Date.now()}`,
        estudianteDocumento: estudianteSeleccionado.documento,
        estudianteNombre: estudianteSeleccionado.nombre,
        periodo: periodoSeleccionado,
        oferta: matriculaSeleccionada.oferta,
        archivo: archivoIndividual.name,
        fechaCarga: new Date().toLocaleDateString("es-ES"),
        estado: "exitoso",
      };

      setCertificadosCargados([nuevoCertificado, ...certificadosCargados]);
      setMensaje({
        tipo: "success",
        texto: `Certificado cargado exitosamente para ${estudianteSeleccionado.nombre}`,
      });

      // Reset
      setPeriodoSeleccionado("");
      setBusquedaEstudiante("");
      setEstudianteSeleccionado(null);
      setMatriculaSeleccionada(null);
      setArchivoIndividual(null);
      setCargando(false);
    }, 1500);
  };

  // Carga Masiva
  const handleArchivosMasivoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const archivos = Array.from(event.target.files);
      const archivosValidos = archivos.filter((f) => {
        if (f.type !== "application/pdf") {
          setMensaje({
            tipo: "error",
            texto: `${f.name} no es un PDF válido`,
          });
          return false;
        }
        if (f.size > 2 * 1024 * 1024) {
          setMensaje({
            tipo: "error",
            texto: `${f.name} excede el límite de 2MB`,
          });
          return false;
        }
        return true;
      });

      if (archivosValidos.length > 0) {
        setArchivosLote(archivosValidos);
        setMensaje(null);
      }
    }
  };

  const handleCargarMasivo = async () => {
    if (!periodoMasivo || archivosLote.length === 0) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un período y archivos.",
      });
      return;
    }

    setCargando(true);
    const resultados: CertificadoCargado[] = [];

    setTimeout(() => {
      archivosLote.forEach((archivo) => {
        // Extraer documento del nombre del archivo (sin extensión)
        const nombreSinExtension = archivo.name.replace(".pdf", "");
        const estudiante = MOCK_ESTUDIANTES_COMPLETO.find(
          (est) => est.documento === nombreSinExtension
        );

        if (estudiante) {
          const matricula = estudiante.matriculas.find(
            (mat) => mat.periodo === periodoMasivo
          );

          if (matricula) {
            resultados.push({
              id: `cert-${Date.now()}-${estudiante.documento}`,
              estudianteDocumento: estudiante.documento,
              estudianteNombre: estudiante.nombre,
              periodo: periodoMasivo,
              oferta: matricula.oferta,
              archivo: archivo.name,
              fechaCarga: new Date().toLocaleDateString("es-ES"),
              estado: "exitoso",
            });
          } else {
            resultados.push({
              id: `cert-${Date.now()}-${estudiante.documento}`,
              estudianteDocumento: estudiante.documento,
              estudianteNombre: estudiante.nombre,
              periodo: periodoMasivo,
              oferta: "N/A",
              archivo: archivo.name,
              fechaCarga: new Date().toLocaleDateString("es-ES"),
              estado: "error",
              mensaje: `No tiene matrícula en el período ${periodoMasivo}`,
            });
          }
        } else {
          resultados.push({
            id: `cert-${Date.now()}-${nombreSinExtension}`,
            estudianteDocumento: nombreSinExtension,
            estudianteNombre: "Estudiante no encontrado",
            periodo: periodoMasivo,
            oferta: "N/A",
            archivo: archivo.name,
            fechaCarga: new Date().toLocaleDateString("es-ES"),
            estado: "error",
            mensaje: "Estudiante no existe en el sistema",
          });
        }
      });

      const exitosos = resultados.filter((r) => r.estado === "exitoso").length;
      const errores = resultados.filter((r) => r.estado === "error").length;

      setCertificadosCargados([...resultados, ...certificadosCargados]);
      setMensaje({
        tipo: exitosos > 0 ? "success" : "error",
        texto: `Carga completada: ${exitosos} exitosos, ${errores} con errores`,
      });

      setPeriodoMasivo("");
      setArchivosLote([]);
      setCargando(false);
    }, 2500);
  };

  const exportarExcel = () => {
    const filas = [["Documento", "Nombre", "Período", "Oferta", "Archivo", "Estado", "Fecha"]];

    certificadosCargados.forEach((cert) => {
      filas.push([
        cert.estudianteDocumento,
        cert.estudianteNombre,
        cert.periodo,
        cert.oferta,
        cert.archivo,
        cert.estado === "exitoso" ? "Exitoso" : "Error",
        cert.fechaCarga,
      ]);
    });

    const csv = filas.map((fila) => fila.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `certificados-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <Box className="p-3">
      <Box className="mb-4">
        <h1>Gestión de Certificados</h1>
        <p className="text-[#575757] mt-2 text-sm">
          Carga certificados de estudiantes por período académico
        </p>
      </Box>

      {mensaje && (
        <Alert
          severity={mensaje.tipo}
          className="mb-3 rounded-[1rem]"
          onClose={() => setMensaje(null)}
          sx={{
            backgroundColor: mensaje.tipo === "success" ? "#f0f8f0" : mensaje.tipo === "error" ? "#fff0f0" : "#FFF9E6",
            color: mensaje.tipo === "success" ? "#2e7d32" : mensaje.tipo === "error" ? "#c62828" : "#f57f17",
            "& .MuiAlert-icon": {
              color: mensaje.tipo === "success" ? "#2e7d32" : mensaje.tipo === "error" ? "#c62828" : "#f57f17"
            }
          }}
        >
          {mensaje.texto}
        </Alert>
      )}

      <Box className="inputs-textfield grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        {/* Formulario */}
        <Card className="rounded-[1rem] shadow-sm border border-gray-200">
          <CardHeader 
            title="Cargar Certificados"
            titleTypographyProps={{
              sx: { 
                color: "#C20E1A",
                fontWeight: 600,
                fontSize: "1.1rem"
              }
            }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />
          <CardContent>
            <Box className="border-b border-gray-200 mb-2">
              <Tabs className="text-primary" value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab className="text-primary" label="Carga Individual"/>
                <Tab className="text-primary" label="Carga por Lote" />
              </Tabs>
            </Box>

            {/* CARGA INDIVIDUAL */}
            <TabPanel value={tabValue} index={0}>
              <Box className="flex flex-col gap-2.5">
                {/* Período */}
                <FormControl fullWidth>
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={periodoSeleccionado}
                    label="Período"
                    onChange={(e) => {
                      setPeriodoSeleccionado(e.target.value);
                      setBusquedaEstudiante("");
                      setEstudianteSeleccionado(null);
                      setMatriculaSeleccionada(null);
                    }}
                  >
                    {MOCK_PERIODOS.map((periodo) => (
                      <MenuItem key={periodo} value={periodo}>
                        {periodo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Búsqueda Estudiante */}
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre o documento..."
                  value={busquedaEstudiante}
                  onChange={(e) => setBusquedaEstudiante(e.target.value)}
                  disabled={!periodoSeleccionado}
                  className="inputs-textfield"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "#999" }} />,
                  }}
                />

                {/* Seleccionar Estudiante */}
                <FormControl fullWidth disabled={!periodoSeleccionado || estudiantesFiltrados.length === 0}>
                  <InputLabel>Estudiante</InputLabel>
                  <Select
                    value={estudianteSeleccionado?.id || ""}
                    label="Estudiante"
                    onChange={(e) => {
                      const estudiante = MOCK_ESTUDIANTES_COMPLETO.find(
                        (est) => est.id === e.target.value
                      );
                      setEstudianteSeleccionado(estudiante);
                      setMatriculaSeleccionada(null);
                    }}
                  >
                    {estudiantesFiltrados.length > 0 ? (
                      estudiantesFiltrados.map((estudiante) => (
                        <MenuItem key={estudiante.id} value={estudiante.id}>
                          {estudiante.nombre} ({estudiante.documento})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        No hay estudiantes para este período
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                {/* Seleccionar Matrícula */}
                <FormControl fullWidth disabled={!estudianteSeleccionado || matriculasEstudiante.length === 0}>
                  <InputLabel>Matrícula</InputLabel>
                  <Select
                    value={matriculaSeleccionada?.id || ""}
                    label="Matrícula"
                    onChange={(e) => {
                      const matricula = matriculasEstudiante.find(
                        (mat: any) => mat.id === e.target.value
                      );
                      setMatriculaSeleccionada(matricula);
                    }}
                  >
                    {matriculasEstudiante.length > 0 ? (
                      matriculasEstudiante.map((matricula: any) => (
                        <MenuItem key={matricula.id} value={matricula.id}>
                          {matricula.oferta} ({matricula.area})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        No hay matrículas disponibles
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                {/* Upload PDF */}
                <Box
                  className={`border-2 border-dashed border-[#C20E1A] rounded-lg p-2 text-center cursor-pointer transition-colors ${
                    archivoIndividual ? "bg-gray-100" : "bg-transparent"
                  } hover:bg-gray-50`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleArchivoIndividualChange}
                    className="hidden"
                    id="file-input-individual"
                    disabled={cargando}
                  />
                  <label
                    htmlFor="file-input-individual"
                    className="flex flex-col items-center cursor-pointer gap-2"
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#C20E1A" }} />
                    <span className="text-gray-700">
                      {archivoIndividual ? archivoIndividual.name : "Selecciona PDF"}
                    </span>
                    <small className="text-gray-400">Máximo 2MB</small>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCargarIndividual}
                  disabled={
                    !periodoSeleccionado ||
                    !estudianteSeleccionado ||
                    !matriculaSeleccionada ||
                    !archivoIndividual ||
                    cargando
                  }
                  className="bg-[#C20E1A] hover:bg-[#970000] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg py-3"
                >
                  {cargando ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                      Cargando...
                    </>
                  ) : (
                    "Cargar Certificado"
                  )}
                </Button>
              </Box>
            </TabPanel>

            {/* CARGA POR LOTE */}
            <TabPanel value={tabValue} index={1}>
              <Box className="flex flex-col gap-2.5">
                <Alert severity="info" className="rounded-lg">
                  <Box className="mb-1 font-semibold">⚠️ Requisitos para la carga por lote:</Box>
                  <List dense className="pl-2">
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="Máximo 2MB por archivo PDF" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="El nombre del archivo debe ser el documento del estudiante (ej: 1001234567.pdf)" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="El estudiante debe tener matrícula en el período seleccionado" />
                    </ListItem>
                  </List>
                </Alert>

                <FormControl fullWidth>
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={periodoMasivo}
                    label="Período"
                    onChange={(e) => {
                      setPeriodoMasivo(e.target.value);
                      setArchivosLote([]);
                    }}
                  >
                    {MOCK_PERIODOS.map((periodo) => (
                      <MenuItem key={periodo} value={periodo}>
                        {periodo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  className={`border-2 border-dashed border-[#C20E1A] rounded-lg p-3 text-center cursor-pointer transition-colors ${
                    archivosLote.length > 0 ? "bg-gray-100" : "bg-transparent"
                  } hover:bg-gray-50`}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleArchivosMasivoChange}
                    className="hidden"
                    id="folder-input"
                    disabled={cargando || !periodoMasivo}
                  />
                  <label
                    htmlFor="folder-input"
                    className="flex flex-col items-center cursor-pointer gap-2"
                  >
                    <CloudUploadIcon sx={{ fontSize: 50, color: "#C20E1A" }} />
                    <span className="font-semibold text-base text-gray-700">
                      {archivosLote.length > 0
                        ? `${archivosLote.length} archivos seleccionados`
                        : "Selecciona una carpeta"}
                    </span>
                    <small className="text-gray-400">
                      PDF con nombres: documento.pdf (ej: 1001234567.pdf)
                    </small>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCargarMasivo}
                  disabled={!periodoMasivo || archivosLote.length === 0 || cargando}
                  className="bg-[#C20E1A] hover:bg-[#970000] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg py-3"
                >
                  {cargando ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                      Procesando ({archivosLote.length} archivos)...
                    </>
                  ) : (
                    <>Cargar {archivosLote.length} Certificados</>
                  )}
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Panel Lateral */}
        <Card className="rounded-[1rem] shadow-sm border border-gray-200 h-fit">
          <CardHeader 
            title="Información"
            titleTypographyProps={{
              sx: { 
                color: "#C20E1A",
                fontWeight: 600,
                fontSize: "1.1rem"
              }
            }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />
          <CardContent>
            <Box className="flex flex-col gap-2">
              {tabValue === 0 ? (
                <>
                  {periodoSeleccionado ? (
                    <>
                      <Box>
                        <p className="font-semibold mb-2">Período:</p>
                        <Chip label={periodoSeleccionado} color="primary" variant="outlined" />
                      </Box>

                      {estudianteSeleccionado && (
                        <Box>
                          <p className="font-semibold mb-2">Estudiante:</p>
                          <p className="mb-1 text-gray-700">
                            {estudianteSeleccionado.nombre}
                          </p>
                          <small className="text-gray-400">
                            {estudianteSeleccionado.documento}
                          </small>
                        </Box>
                      )}

                      {matriculaSeleccionada && (
                        <Box>
                          <p className="font-semibold mb-2">Matrícula:</p>
                          <p className="mb-1 text-gray-700">
                            {matriculaSeleccionada.oferta}
                          </p>
                          <small className="text-gray-400">
                            Área: {matriculaSeleccionada.area}
                          </small>
                        </Box>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-center">Selecciona un período</p>
                  )}
                </>
              ) : (
                <>
                  {periodoMasivo ? (
                    <>
                      <Box>
                        <p className="font-semibold mb-2">Período:</p>
                        <Chip label={periodoMasivo} color="primary" variant="outlined" />
                      </Box>
                      <Box>
                        <p className="font-semibold mb-2">Archivos:</p>
                        <p className="text-3xl font-bold text-[#C20E1A]">
                          {archivosLote.length}
                        </p>
                      </Box>
                    </>
                  ) : (
                    <p className="text-gray-400 text-center">Selecciona un período</p>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla de resultados */}
      {certificadosCargados.length > 0 && (
        <Card className="mt-4 rounded-[1rem] shadow-sm border border-gray-200">
          <CardHeader
            title="Historial de Cargas"
            titleTypographyProps={{
              sx: { 
                color: "#C20E1A",
                fontWeight: 600,
                fontSize: "1.1rem"
              }
            }}
            action={
              <Button
                startIcon={<DownloadIcon />}
                onClick={exportarExcel}
                className="text-[#C20E1A] hover:bg-red-50"
              >
                Exportar Excel
              </Button>
            }
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />
          <TableContainer component={Paper} className="border-0 shadow-none">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="font-semibold text-gray-700">Documento</TableCell>
                  <TableCell className="font-semibold text-gray-700">Estudiante</TableCell>
                  <TableCell className="font-semibold text-gray-700">Período</TableCell>
                  <TableCell className="font-semibold text-gray-700">Oferta</TableCell>
                  <TableCell className="font-semibold text-gray-700">Archivo</TableCell>
                  <TableCell className="font-semibold text-gray-700">Fecha</TableCell>
                  <TableCell align="center" className="font-semibold text-gray-700">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificadosCargados.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <TableCell className="font-semibold text-gray-700">
                      {cert.estudianteDocumento}
                    </TableCell>
                    <TableCell className="text-gray-700">{cert.estudianteNombre}</TableCell>
                    <TableCell className="text-gray-700">{cert.periodo}</TableCell>
                    <TableCell className="text-gray-700">{cert.oferta}</TableCell>
                    <TableCell className="text-gray-700">{cert.archivo}</TableCell>
                    <TableCell className="text-gray-700">{cert.fechaCarga}</TableCell>
                    <TableCell align="center">
                      {cert.estado === "exitoso" ? (
                        <CheckCircleIcon className="text-green-500" />
                      ) : (
                        <ErrorIcon className="text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
