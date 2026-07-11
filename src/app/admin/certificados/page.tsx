"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Typography,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../../../../config";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Periodo {
  id_oferta_academica: number;
  nombre: string;
  estado: string;
}

interface InscripcionBuscada {
  id_inscripcion: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  modulo: string | null;
  grupo: string | null;
}

interface CertificadoCargado {
  id: string;
  estudianteDocumento: string;
  estudianteNombre: string;
  periodo: string;
  modulo: string;
  archivo: string;
  fechaCarga: string;
  estado: "exitoso" | "error";
  mensaje?: string;
}

// ─── TabPanel ─────────────────────────────────────────────────────────────────
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ─── Utilidades ───────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token") || "";

export default function CertificadosPage() {
  const [tabValue, setTabValue] = useState(0);

  // Datos del backend
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);

  // Carga Individual
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<number | "">("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [buscandoEstudiante, setBuscandoEstudiante] = useState(false);
  const [inscripciones, setInscripciones] = useState<InscripcionBuscada[] | null>(null);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<InscripcionBuscada | null>(null);
  const [archivoIndividual, setArchivoIndividual] = useState<File | null>(null);

  // Carga Masiva
  const [periodoMasivo, setPeriodoMasivo] = useState<number | "">("");
  const [archivosLote, setArchivosLote] = useState<File[]>([]);

  // Refs para file inputs
  const loteInputRef = useRef<HTMLInputElement>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error" | "info" | "warning";
    texto: string;
  } | null>(null);
  const [certificadosCargados, setCertificadosCargados] = useState<CertificadoCargado[]>([]);

  // ── Cargar periodos al montar ──────────────────────────────────────────────
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const { data } = await axios.get<Periodo[]>(`${API_BASE_URL}/oferta_academica/`, {
          headers: { Authorization: `Token ${getToken()}` },
        });
        setPeriodos(data);
      } catch {
        setMensaje({ tipo: "error", texto: "No se pudieron cargar los períodos académicos." });
      } finally {
        setLoadingPeriodos(false);
      }
    };
    fetchPeriodos();
  }, []);

  // ── Buscar estudiante por documento ───────────────────────────────────────
  const handleBuscarEstudiante = async () => {
    if (!numeroDocumento.trim()) return;
    setBuscandoEstudiante(true);
    setInscripciones(null);
    setInscripcionSeleccionada(null);
    setMensaje(null);

    try {
      const { data } = await axios.get<InscripcionBuscada[]>(
        `${API_BASE_URL}/inscripcion/buscar-por-documento/`,
        {
          params: {
            numero_documento: numeroDocumento.trim(),
            ...(periodoSeleccionado ? { oferta_academica_id: periodoSeleccionado } : {}),
          },
          headers: { Authorization: `Token ${getToken()}` },
        }
      );
      setInscripciones(data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      const detail = axiosErr.response?.data?.detail ?? "No se encontró el estudiante.";
      setMensaje({ tipo: "warning", texto: detail });
    } finally {
      setBuscandoEstudiante(false);
    }
  };

  // ── Validar archivo PDF ────────────────────────────────────────────────────
  const validarPDF = (archivo: File): string | null => {
    if (archivo.type !== "application/pdf") return "El archivo debe ser un PDF.";
    if (archivo.size > 2 * 1024 * 1024) return "El archivo no puede exceder 2 MB.";
    return null;
  };

  const handleArchivoIndividualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const error = validarPDF(archivo);
    if (error) {
      setMensaje({ tipo: "error", texto: error });
      setArchivoIndividual(null);
    } else {
      setArchivoIndividual(archivo);
      setMensaje(null);
    }
  };

  // ── Cargar certificado individual ─────────────────────────────────────────
  const handleCargarIndividual = async () => {
    if (!inscripcionSeleccionada || !archivoIndividual) {
      setMensaje({ tipo: "error", texto: "Selecciona una inscripción y un archivo PDF." });
      return;
    }

    setCargando(true);
    setMensaje(null);

    const formData = new FormData();
    formData.append("certificado_academico", archivoIndividual);

    try {
      await axios.patch(
        `${API_BASE_URL}/inscripcion/${inscripcionSeleccionada.id_inscripcion}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const periodoNombre = periodos.find((p) => p.id_oferta_academica === periodoSeleccionado)?.nombre ?? "";

      const nuevoCert: CertificadoCargado = {
        id: `cert-${Date.now()}`,
        estudianteDocumento: inscripcionSeleccionada.numero_documento,
        estudianteNombre: `${inscripcionSeleccionada.nombre} ${inscripcionSeleccionada.apellido}`,
        periodo: periodoNombre,
        modulo: inscripcionSeleccionada.modulo ?? "—",
        archivo: archivoIndividual.name,
        fechaCarga: new Date().toLocaleDateString("es-CO"),
        estado: "exitoso",
      };

      setCertificadosCargados((prev) => [nuevoCert, ...prev]);
      setMensaje({
        tipo: "success",
        texto: `Certificado cargado para ${inscripcionSeleccionada.nombre} ${inscripcionSeleccionada.apellido}`,
      });

      // Reset
      setNumeroDocumento("");
      setInscripciones(null);
      setInscripcionSeleccionada(null);
      setArchivoIndividual(null);
      setPeriodoSeleccionado("");
    } catch (err) {
      const axiosErr = err as AxiosError<Record<string, string[]>>;
      console.error("Error al cargar certificado:", axiosErr.response?.data);
      setMensaje({ tipo: "error", texto: "Error al subir el certificado. Intenta de nuevo." });
    } finally {
      setCargando(false);
    }
  };

  // ── Carga masiva ──────────────────────────────────────────────────────────
  const handleArchivosMasivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const archivos = Array.from(e.target.files);
    const validos: File[] = [];
    for (const f of archivos) {
      const err = validarPDF(f);
      if (err) {
        setMensaje({ tipo: "error", texto: `${f.name}: ${err}` });
        return;
      }
      validos.push(f);
    }
    setArchivosLote(validos);
    setMensaje(null);
  };

  const handleCargarMasivo = async () => {
    if (!periodoMasivo || archivosLote.length === 0) {
      setMensaje({ tipo: "error", texto: "Selecciona un período y al menos un archivo." });
      return;
    }

    setCargando(true);
    setMensaje(null);

    const resultados: CertificadoCargado[] = [];
    const periodoNombre = periodos.find((p) => p.id_oferta_academica === periodoMasivo)?.nombre ?? "";

    for (const archivo of archivosLote) {
      const docNumber = archivo.name.replace(/\.pdf$/i, "");

      try {
        // 1) Buscar inscripcion por numero_documento filtrada por período
        const { data: inscrs } = await axios.get<InscripcionBuscada[]>(
          `${API_BASE_URL}/inscripcion/buscar-por-documento/`,
          {
            params: { numero_documento: docNumber, oferta_academica_id: periodoMasivo },
            headers: { Authorization: `Token ${getToken()}` },
          }
        );

        if (inscrs.length === 0) throw new Error("Sin inscripciones");

        // Tomar la primera inscripción disponible
        const inscripcion = inscrs[0];

        // 2) Subir certificado
        const form = new FormData();
        form.append("certificado_academico", archivo);
        await axios.patch(
          `${API_BASE_URL}/inscripcion/${inscripcion.id_inscripcion}/`,
          form,
          {
            headers: {
              Authorization: `Token ${getToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        resultados.push({
          id: `cert-${Date.now()}-${docNumber}`,
          estudianteDocumento: docNumber,
          estudianteNombre: `${inscripcion.nombre} ${inscripcion.apellido}`,
          periodo: periodoNombre,
          modulo: inscripcion.modulo ?? "—",
          archivo: archivo.name,
          fechaCarga: new Date().toLocaleDateString("es-CO"),
          estado: "exitoso",
        });
      } catch (err) {
        const axiosErr = err as AxiosError<{ detail?: string }>;
        const detail = axiosErr.response?.data?.detail ?? String(err);
        resultados.push({
          id: `cert-${Date.now()}-${docNumber}`,
          estudianteDocumento: docNumber,
          estudianteNombre: "No encontrado",
          periodo: periodoNombre,
          modulo: "—",
          archivo: archivo.name,
          fechaCarga: new Date().toLocaleDateString("es-CO"),
          estado: "error",
          mensaje: detail,
        });
      }
    }

    const exitosos = resultados.filter((r) => r.estado === "exitoso").length;
    const errores = resultados.filter((r) => r.estado === "error").length;

    setCertificadosCargados((prev) => [...resultados, ...prev]);
    setMensaje({
      tipo: exitosos > 0 ? "success" : "error",
      texto: `Carga completada: ${exitosos} exitosos, ${errores} con errores.`,
    });

    setPeriodoMasivo("");
    setArchivosLote([]);
    setCargando(false);
  };

  // ── Exportar CSV ──────────────────────────────────────────────────────────
  const exportarCSV = () => {
    const filas = [["Documento", "Nombre", "Período", "Módulo", "Archivo", "Estado", "Fecha"]];
    certificadosCargados.forEach((c) => {
      filas.push([
        c.estudianteDocumento,
        c.estudianteNombre,
        c.periodo,
        c.modulo,
        c.archivo,
        c.estado === "exitoso" ? "Exitoso" : "Error",
        c.fechaCarga,
      ]);
    });
    const csv = filas.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `certificados-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box className="p-3">
      <Box className="mb-4">
        <h1>Gestión de Certificados</h1>
        <p className="text-[#575757] mt-2 text-sm">
          Carga certificados PDF de estudiantes vinculados a sus inscripciones
        </p>
      </Box>

      {mensaje && (
        <Alert
          severity={mensaje.tipo}
          className="mb-3 rounded-[1rem]"
          onClose={() => setMensaje(null)}
        >
          {mensaje.texto}
        </Alert>
      )}

      <Box className="inputs-textfield grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        {/* ── Formulario ── */}
        <Card className="rounded-[1rem] shadow-sm border border-gray-200">
          <CardHeader
            title="Cargar Certificados"
            titleTypographyProps={{ sx: { color: "#C20E1A", fontWeight: 600, fontSize: "1.1rem" } }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />
          <CardContent>
            <Box className="border-b border-gray-200 mb-2">
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab className="text-primary" label="Carga Individual" />
                <Tab className="text-primary" label="Carga por Lote" />
              </Tabs>
            </Box>

            {/* ── CARGA INDIVIDUAL ── */}
            <TabPanel value={tabValue} index={0}>
              <Box className="flex flex-col gap-3">
                {/* Período */}
                <FormControl fullWidth disabled={loadingPeriodos}>
                  <InputLabel>Período académico</InputLabel>
                  <Select
                    value={periodoSeleccionado}
                    label="Período académico"
                    onChange={(e) => {
                      setPeriodoSeleccionado(e.target.value as number);
                      setInscripciones(null);
                      setInscripcionSeleccionada(null);
                    }}
                  >
                    {loadingPeriodos ? (
                      <MenuItem disabled>Cargando...</MenuItem>
                    ) : (
                      periodos.map((p) => (
                        <MenuItem key={p.id_oferta_academica} value={p.id_oferta_academica}>
                          {p.nombre}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Búsqueda por documento */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Número de documento del estudiante"
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBuscarEstudiante()}
                    disabled={!periodoSeleccionado}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: "#999" }} />,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleBuscarEstudiante}
                    disabled={buscandoEstudiante || !numeroDocumento.trim() || !periodoSeleccionado}
                    sx={{ whiteSpace: "nowrap", minWidth: 110 }}
                  >
                    {buscandoEstudiante ? <CircularProgress size={18} /> : "Buscar"}
                  </Button>
                </Box>

                {/* Seleccionar inscripción encontrada */}
                {inscripciones && inscripciones.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel>Inscripción del estudiante</InputLabel>
                    <Select
                      value={inscripcionSeleccionada?.id_inscripcion ?? ""}
                      label="Inscripción del estudiante"
                      onChange={(e) => {
                        const ins = inscripciones.find(
                          (i) => i.id_inscripcion === e.target.value
                        );
                        setInscripcionSeleccionada(ins ?? null);
                      }}
                    >
                      {inscripciones.map((ins) => (
                        <MenuItem key={ins.id_inscripcion} value={ins.id_inscripcion}>
                          {ins.nombre} {ins.apellido} — {ins.modulo ?? "Sin módulo"}
                          {ins.grupo ? ` (${ins.grupo})` : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Upload PDF */}
                <Box
                  className={`border-2 border-dashed border-[#C20E1A] rounded-lg p-4 text-center cursor-pointer transition-colors ${
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
                  <label htmlFor="file-input-individual" className="flex flex-col items-center cursor-pointer gap-2">
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#C20E1A" }} />
                    <span className="text-gray-700">
                      {archivoIndividual ? archivoIndividual.name : "Selecciona el PDF del certificado"}
                    </span>
                    <small className="text-gray-400">Máximo 2 MB</small>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCargarIndividual}
                  disabled={!inscripcionSeleccionada || !archivoIndividual || cargando}
                  className="bg-[#C20E1A] hover:bg-[#970000] disabled:bg-gray-300 text-white font-medium rounded-lg py-3"
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

            {/* ── CARGA POR LOTE ── */}
            <TabPanel value={tabValue} index={1}>
              <Box className="flex flex-col gap-3">
                <Alert severity="info" className="rounded-lg">
                  <Box className="mb-1 font-semibold">⚠️ Requisitos para la carga por lote:</Box>
                  <List dense className="pl-2">
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="El nombre de cada PDF debe ser el número de documento del estudiante (ej: 1001234567.pdf)" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="Máximo 2 MB por archivo" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary="El estudiante debe tener al menos una inscripción activa" />
                    </ListItem>
                  </List>
                </Alert>

                <FormControl fullWidth disabled={loadingPeriodos}>
                  <InputLabel>Período académico</InputLabel>
                  <Select
                    value={periodoMasivo}
                    label="Período académico"
                    onChange={(e) => {
                      setPeriodoMasivo(e.target.value as number);
                      setArchivosLote([]);
                    }}
                  >
                    {loadingPeriodos ? (
                      <MenuItem disabled>Cargando...</MenuItem>
                    ) : (
                      periodos.map((p) => (
                        <MenuItem key={p.id_oferta_academica} value={p.id_oferta_academica}>
                          {p.nombre}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Zona de clic / selección de archivos */}
                <Box
                  onClick={() => {
                    if (!periodoMasivo || cargando) return;
                    loteInputRef.current?.click();
                  }}
                  sx={{
                    border: "2px dashed #C20E1A",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: periodoMasivo && !cargando ? "pointer" : "not-allowed",
                    bgcolor: archivosLote.length > 0 ? "#f5f5f5" : "transparent",
                    opacity: periodoMasivo ? 1 : 0.5,
                    "&:hover": periodoMasivo && !cargando ? { bgcolor: "#fafafa" } : {},
                    transition: "background-color 0.2s",
                  }}
                >
                  <input
                    ref={loteInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleArchivosMasivoChange}
                    style={{ display: "none" }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 50, color: "#C20E1A" }} />
                  <Typography variant="body1" fontWeight={600} color="text.secondary" mt={1}>
                    {archivosLote.length > 0
                      ? `${archivosLote.length} archivo${archivosLote.length !== 1 ? "s" : ""} seleccionado${archivosLote.length !== 1 ? "s" : ""}`
                      : "Haz clic aquí para seleccionar los PDFs"}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Nombre del archivo = número de documento del estudiante.pdf
                  </Typography>
                </Box>

                {/* Lista de archivos seleccionados */}
                {archivosLote.length > 0 && (
                  <Box
                    sx={{
                      maxHeight: 180,
                      overflowY: "auto",
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {archivosLote.map((f, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 0.4,
                          borderBottom: i < archivosLote.length - 1 ? "1px solid #f0f0f0" : "none",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          📄 {f.name}
                          <span style={{ color: "#bbb", fontSize: "0.75rem" }}>
                            ({(f.size / 1024).toFixed(0)} KB)
                          </span>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setArchivosLote((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          sx={{ color: "#C20E1A", ml: 1, p: 0.5, "&:hover": { bgcolor: "#fff0f0" } }}
                          title="Quitar archivo"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCargarMasivo}
                  disabled={!periodoMasivo || archivosLote.length === 0 || cargando}
                  className="bg-[#C20E1A] hover:bg-[#970000] disabled:bg-gray-300 text-white font-medium rounded-lg py-3"
                >
                  {cargando ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                      Procesando {archivosLote.length} archivos...
                    </>
                  ) : (
                    <>Cargar {archivosLote.length} Certificado{archivosLote.length !== 1 ? "s" : ""}</>
                  )}
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* ── Panel lateral de info ── */}
        <Card className="rounded-[1rem] shadow-sm border border-gray-200 h-fit">
          <CardHeader
            title="Resumen"
            titleTypographyProps={{ sx: { color: "#C20E1A", fontWeight: 600, fontSize: "1.1rem" } }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />
          <CardContent>
            <Box className="flex flex-col gap-3">
              {tabValue === 0 ? (
                <>
                  {periodoSeleccionado ? (
                    <>
                      <Box>
                        <Typography variant="body2" className="font-semibold mb-1">Período:</Typography>
                        <Chip
                          label={periodos.find((p) => p.id_oferta_academica === periodoSeleccionado)?.nombre}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      {inscripcionSeleccionada && (
                        <Box>
                          <Typography variant="body2" className="font-semibold mb-1">Estudiante:</Typography>
                          <Typography variant="body2" className="text-gray-700">
                            {inscripcionSeleccionada.nombre} {inscripcionSeleccionada.apellido}
                          </Typography>
                          <Typography variant="caption" className="text-gray-400">
                            Doc: {inscripcionSeleccionada.numero_documento}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600 mt-1">
                            {inscripcionSeleccionada.modulo ?? "—"}
                          </Typography>
                        </Box>
                      )}
                      {archivoIndividual && (
                        <Box>
                          <Typography variant="body2" className="font-semibold mb-1">Archivo:</Typography>
                          <Typography variant="body2" className="text-gray-700">{archivoIndividual.name}</Typography>
                          <Typography variant="caption" className="text-gray-400">
                            {(archivoIndividual.size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" className="text-gray-400 text-center">
                      Selecciona un período para comenzar
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  {periodoMasivo ? (
                    <>
                      <Box>
                        <Typography variant="body2" className="font-semibold mb-1">Período:</Typography>
                        <Chip
                          label={periodos.find((p) => p.id_oferta_academica === periodoMasivo)?.nombre}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" className="font-semibold mb-1">Archivos:</Typography>
                        <Typography variant="h4" className="font-bold text-[#C20E1A]">
                          {archivosLote.length}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" className="text-gray-400 text-center">
                      Selecciona un período para comenzar
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ── Historial de cargas ── */}
      {certificadosCargados.length > 0 && (
        <Card className="mt-4 rounded-[1rem] shadow-sm border border-gray-200">
          <CardHeader
            title="Historial de Cargas"
            titleTypographyProps={{ sx: { color: "#C20E1A", fontWeight: 600, fontSize: "1.1rem" } }}
            action={
              <Button startIcon={<DownloadIcon />} onClick={exportarCSV} className="text-[#C20E1A] hover:bg-red-50">
                Exportar CSV
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
                  <TableCell className="font-semibold text-gray-700">Módulo</TableCell>
                  <TableCell className="font-semibold text-gray-700">Archivo</TableCell>
                  <TableCell className="font-semibold text-gray-700">Fecha</TableCell>
                  <TableCell align="center" className="font-semibold text-gray-700">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificadosCargados.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <TableCell className="font-semibold text-gray-700">{cert.estudianteDocumento}</TableCell>
                    <TableCell className="text-gray-700">{cert.estudianteNombre}</TableCell>
                    <TableCell className="text-gray-700">{cert.periodo}</TableCell>
                    <TableCell className="text-gray-700">{cert.modulo}</TableCell>
                    <TableCell className="text-gray-700">{cert.archivo}</TableCell>
                    <TableCell className="text-gray-700">{cert.fechaCarga}</TableCell>
                    <TableCell align="center">
                      {cert.estado === "exitoso" ? (
                        <CheckCircleIcon className="text-green-500" titleAccess="Exitoso" />
                      ) : (
                        <ErrorIcon className="text-red-500" titleAccess={cert.mensaje} />
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
