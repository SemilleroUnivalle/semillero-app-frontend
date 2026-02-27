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
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <h1>Gestión de Certificados</h1>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Carga certificados de estudiantes por período académico
        </p>
      </Box>

      {mensaje && (
        <Alert
          severity={mensaje.tipo}
          sx={{ mb: 3 }}
          onClose={() => setMensaje(null)}
        >
          {mensaje.texto}
        </Alert>
      )}

      <Box className="inputs-textfield" sx={{ display: "grid", gridTemplateColumns: { lg: "2fr 1fr" }, gap: 3 }}>
        {/* Formulario */}
        <Card className="rounded-2xl">
          <CardHeader title="Cargar Certificados" />
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Carga Individual" />
                <Tab label="Carga por Lote" />
              </Tabs>
            </Box>

            {/* CARGA INDIVIDUAL */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                  sx={{
                    border: "2px dashed #c20e1a",
                    borderRadius: "8px",
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: archivoIndividual ? "#f0f0f0" : "transparent",
                    "&:hover": { backgroundColor: "#fafafa" },
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleArchivoIndividualChange}
                    style={{ display: "none" }}
                    id="file-input-individual"
                    disabled={cargando}
                  />
                  <label
                    htmlFor="file-input-individual"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#c20e1a" }} />
                    <span>
                      {archivoIndividual ? archivoIndividual.name : "Selecciona PDF"}
                    </span>
                    <small style={{ color: "#999" }}>Máximo 2MB</small>
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
                  sx={{
                    backgroundColor: "#c20e1a",
                    "&:hover": { backgroundColor: "#a00815" },
                  }}
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Alert severity="info">
                  <Box sx={{ mb: 1, fontWeight: "600" }}>⚠️ Requisitos para la carga por lote:</Box>
                  <List dense sx={{ pl: 2 }}>
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
                  sx={{
                    border: "2px dashed #c20e1a",
                    borderRadius: "8px",
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: archivosLote.length > 0 ? "#f0f0f0" : "transparent",
                    "&:hover": { backgroundColor: "#fafafa" },
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleArchivosMasivoChange}
                    style={{ display: "none" }}
                    id="folder-input"
                    disabled={cargando || !periodoMasivo}
                  />
                  <label
                    htmlFor="folder-input"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 50, color: "#c20e1a" }} />
                    <span style={{ fontWeight: "600", fontSize: "16px" }}>
                      {archivosLote.length > 0
                        ? `${archivosLote.length} archivos seleccionados`
                        : "Selecciona una carpeta"}
                    </span>
                    <small style={{ color: "#999" }}>
                      PDF con nombres: documento.pdf (ej: 1001234567.pdf)
                    </small>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCargarMasivo}
                  disabled={!periodoMasivo || archivosLote.length === 0 || cargando}
                  sx={{
                    backgroundColor: "#c20e1a",
                    "&:hover": { backgroundColor: "#a00815" },
                  }}
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
        <Card sx={{ height: "fit-content" }}>
          <CardHeader title="Información" />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tabValue === 0 ? (
                <>
                  {periodoSeleccionado ? (
                    <>
                      <Box>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                          Período:
                        </p>
                        <Chip label={periodoSeleccionado} color="primary" variant="outlined" />
                      </Box>

                      {estudianteSeleccionado && (
                        <Box>
                          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                            Estudiante:
                          </p>
                          <p style={{ margin: "0 0 4px 0" }}>
                            {estudianteSeleccionado.nombre}
                          </p>
                          <small style={{ color: "#999" }}>
                            {estudianteSeleccionado.documento}
                          </small>
                        </Box>
                      )}

                      {matriculaSeleccionada && (
                        <Box>
                          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                            Matrícula:
                          </p>
                          <p style={{ margin: "0 0 4px 0" }}>
                            {matriculaSeleccionada.oferta}
                          </p>
                          <small style={{ color: "#999" }}>
                            Área: {matriculaSeleccionada.area}
                          </small>
                        </Box>
                      )}
                    </>
                  ) : (
                    <p style={{ color: "#999", textAlign: "center" }}>
                      Selecciona un período
                    </p>
                  )}
                </>
              ) : (
                <>
                  {periodoMasivo ? (
                    <>
                      <Box>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                          Período:
                        </p>
                        <Chip label={periodoMasivo} color="primary" variant="outlined" />
                      </Box>
                      <Box>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                          Archivos:
                        </p>
                        <p style={{ fontSize: "28px", fontWeight: "bold", color: "#c20e1a" }}>
                          {archivosLote.length}
                        </p>
                      </Box>
                    </>
                  ) : (
                    <p style={{ color: "#999", textAlign: "center" }}>
                      Selecciona un período
                    </p>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla de resultados */}
      {certificadosCargados.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardHeader
            title="Historial de Cargas"
            action={
              <Button
                startIcon={<DownloadIcon />}
                onClick={exportarExcel}
                sx={{ color: "#c20e1a" }}
              >
                Exportar Excel
              </Button>
            }
          />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Documento</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Período</TableCell>
                  <TableCell>Oferta</TableCell>
                  <TableCell>Archivo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificadosCargados.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell sx={{ fontWeight: "600" }}>
                      {cert.estudianteDocumento}
                    </TableCell>
                    <TableCell>{cert.estudianteNombre}</TableCell>
                    <TableCell>{cert.periodo}</TableCell>
                    <TableCell>{cert.oferta}</TableCell>
                    <TableCell>{cert.archivo}</TableCell>
                    <TableCell>{cert.fechaCarga}</TableCell>
                    <TableCell align="center">
                      {cert.estado === "exitoso" ? (
                        <CheckCircleIcon sx={{ color: "#4caf50" }} />
                      ) : (
                        <ErrorIcon sx={{ color: "#f44336" }} />
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
