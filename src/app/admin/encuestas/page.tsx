"use client";

import React, { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
  Chip,
  Divider,
  Tooltip,
  Collapse,
  IconButton,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import * as XLSX from "xlsx";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotasGuardadas {
  nota_modulo?: string;
  nota_docente?: string;
  nota_monitor?: string;
  nota_estudiante?: string;
}

interface DetalleExito {
  fila: number;
  documento: string;
  nombre: string;
  id_inscripcion: number;
  id_encuesta: number;
  accion: "creada" | "actualizada";
  notas_guardadas: NotasGuardadas;
}

interface DetalleError {
  fila: number;
  documento?: string;
  error: string;
}

interface BackendResponse {
  mensaje: string;
  total_filas: number;
  creadas: number;
  actualizadas: number;
  errores: number;
  detalle_exito: DetalleExito[];
  detalle_errores: DetalleError[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROJO = "#C20E1A";
const ROJO_DARK = "#970000";

function toN(v: string | undefined): number {
  if (!v) return 0;
  return parseFloat(v) || 0;
}

// ─── SubComponents ────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 130,
        borderRadius: 3,
        borderTop: `4px solid ${color}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        transition: "transform .2s",
        "&:hover": { transform: "translateY(-3px)" },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ color, display: "flex", alignItems: "center", gap: 0.5 }}>
          {icon}
          <Typography variant="caption" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={800} color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EncuestasPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState<BackendResponse | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [showExitos, setShowExitos] = useState(true);
  const [showErrores, setShowErrores] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Token ──
  const getToken = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u).token : "";
    } catch {
      return "";
    }
  };

  // ── Plantilla ──
  const descargarPlantilla = () => {
    const plantilla = [
      {
        documento: "1001234567",
        nota_modulo: 4.5,
        nota_docente: 4.7,
        nota_monitor: 4.3,
        nota_estudiante: 4.8,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(plantilla);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Encuestas");
    XLSX.writeFile(wb, "plantilla_encuesta_satisfaccion.xlsx");
  };

  // ── File handling ──
  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setErrorGeneral("Solo se permiten archivos .xlsx o .xls");
      return;
    }
    setArchivo(file);
    setRespuesta(null);
    setErrorGeneral(null);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFile(e.target.files?.[0]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, []);

  // ── Upload ──
  const subirArchivo = async () => {
    if (!archivo) return;
    const token = getToken();
    if (!token) {
      setErrorGeneral("No hay sesión activa. Inicia sesión primero.");
      return;
    }

    setCargando(true);
    setErrorGeneral(null);
    setRespuesta(null);

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      const res = await axios.post(
        `${API_BASE_URL}/encuesta_satisfaccion/encuesta/cargar-excel/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRespuesta(res.data as BackendResponse);
    } catch (err: any) {
      if (err.response?.data) {
        const d = err.response.data;
        setErrorGeneral(
          typeof d === "string"
            ? d
            : d.detail || d.message || d.error || JSON.stringify(d)
        );
      } else if (err.code === "ERR_NETWORK") {
        setErrorGeneral(`No se pudo conectar al servidor (${API_BASE_URL})`);
      } else {
        setErrorGeneral(err.message || "Error desconocido");
      }
    } finally {
      setCargando(false);
    }
  };

  const resetear = () => {
    setArchivo(null);
    setRespuesta(null);
    setErrorGeneral(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Chart data from response ──
  const chartPromedioGeneral = React.useMemo(() => {
    if (!respuesta || respuesta.detalle_exito.length === 0) return null;
    const items = respuesta.detalle_exito;
    const avg = (field: keyof NotasGuardadas) => {
      const vals = items
        .map((i) => toN(i.notas_guardadas[field]))
        .filter((v) => v > 0);
      return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
    };
    return {
      options: {
        chart: { id: "satisfaccion-general", toolbar: { show: false } },
        xaxis: { categories: ["Módulo", "Docente", "Monitor", "Autoevaluación"] },
        colors: [ROJO],
        plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
        dataLabels: { enabled: true },
        yaxis: { min: 0, max: 5 },
      },
      series: [
        {
          name: "Promedio",
          data: [
            avg("nota_modulo"),
            avg("nota_docente"),
            avg("nota_monitor"),
            avg("nota_estudiante"),
          ],
        },
      ],
    };
  }, [respuesta]);

  // ── Render ──
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>

      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} color={ROJO}>
          Encuestas de Satisfacción
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Carga masiva de resultados de evaluación desde un archivo Excel
        </Typography>
      </Box>

      {/* General error */}
      {errorGeneral && (
        <Alert severity="error" onClose={() => setErrorGeneral(null)} sx={{ borderRadius: 3 }}>
          {errorGeneral}
        </Alert>
      )}

      {/* ── Upload Card ── */}
      <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardHeader
          title="Cargar archivo Excel"
          titleTypographyProps={{ fontWeight: 700, color: ROJO, fontSize: "1.05rem" }}
          sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Drop zone */}
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${dragging ? ROJO : "#d1d5db"}`,
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              backgroundColor: dragging ? "#fef2f2" : "#fafafa",
              cursor: "pointer",
              transition: "all .2s",
              "&:hover": { borderColor: ROJO, backgroundColor: "#fef2f2" },
            }}
          >
            <InsertDriveFileIcon sx={{ fontSize: 40, color: archivo ? ROJO : "#9ca3af", mb: 1 }} />
            {archivo ? (
              <>
                <Typography fontWeight={700} color={ROJO}>{archivo.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(archivo.size / 1024).toFixed(1)} KB · Haz clic para cambiar
                </Typography>
              </>
            ) : (
              <>
                <Typography fontWeight={600} color="text.secondary">
                  Arrastra tu archivo aquí o haz clic para seleccionarlo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Formatos aceptados: .xlsx, .xls
                </Typography>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={onInputChange}
              style={{ display: "none" }}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={descargarPlantilla}
              sx={{
                borderColor: ROJO, color: ROJO, borderRadius: "10px", textTransform: "none", fontWeight: 600,
                "&:hover": { borderColor: ROJO_DARK, backgroundColor: "#fef2f2" },
              }}
            >
              Descargar plantilla
            </Button>

            <Button
              variant="contained"
              startIcon={cargando ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
              onClick={subirArchivo}
              disabled={!archivo || cargando}
              sx={{
                backgroundColor: ROJO, borderRadius: "10px", textTransform: "none", fontWeight: 700,
                "&:hover": { backgroundColor: ROJO_DARK },
                "&:disabled": { backgroundColor: "#e5e7eb", color: "#9ca3af" },
              }}
            >
              {cargando ? "Procesando…" : "Enviar al servidor"}
            </Button>

            {(archivo || respuesta) && (
              <Tooltip title="Reiniciar">
                <IconButton onClick={resetear} sx={{ color: "#6b7280" }}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Hint */}
          <Alert severity="info" sx={{ borderRadius: 3, fontSize: 13 }}>
            El archivo debe contener al menos la columna <strong>documento</strong> y una o más de:{" "}
            <strong>nota_modulo</strong>, <strong>nota_docente</strong>, <strong>nota_monitor</strong>,{" "}
            <strong>nota_estudiante</strong>. Las celdas vacías se ignoran.
          </Alert>
        </CardContent>
      </Card>

      {/* ── Resultado ── */}
      {respuesta && (
        <>
          {/* KPI Cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <KpiCard label="Total filas" value={respuesta.total_filas} color="#3b82f6" icon={<InsertDriveFileIcon fontSize="small" />} />
            <KpiCard label="Creadas" value={respuesta.creadas} color="#22c55e" icon={<CheckCircleOutlineIcon fontSize="small" />} />
            <KpiCard label="Actualizadas" value={respuesta.actualizadas} color="#f59e0b" icon={<CheckCircleOutlineIcon fontSize="small" />} />
            <KpiCard label="Errores" value={respuesta.errores} color="#ef4444" icon={<ErrorOutlineIcon fontSize="small" />} />
          </Box>

          {/* Success alert */}
          <Alert
            severity={respuesta.errores === 0 ? "success" : respuesta.errores === respuesta.total_filas ? "error" : "warning"}
            sx={{ borderRadius: 3 }}
          >
            {respuesta.mensaje}
          </Alert>

          {/* ── Detalle Éxitos ── */}
          {respuesta.detalle_exito.length > 0 && (
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ color: "#22c55e" }} />
                    <Typography fontWeight={700} color="#166534">
                      Registros procesados correctamente ({respuesta.detalle_exito.length})
                    </Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => setShowExitos(!showExitos)}>
                    {showExitos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
                sx={{ borderBottom: showExitos ? "1px solid #f0f0f0" : "none", pb: 1.5 }}
              />
              <Collapse in={showExitos}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f0fdf4" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Fila</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Acción</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Módulo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Docente</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Monitor</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Autoeval.</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>ID Encuesta</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {respuesta.detalle_exito.map((item) => (
                        <TableRow key={item.fila} hover>
                          <TableCell>{item.fila}</TableCell>
                          <TableCell>{item.documento}</TableCell>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.accion}
                              size="small"
                              sx={{
                                backgroundColor: item.accion === "creada" ? "#dcfce7" : "#fef3c7",
                                color: item.accion === "creada" ? "#166534" : "#92400e",
                                fontWeight: 700,
                                fontSize: 11,
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.notas_guardadas.nota_modulo ?? "–"}</TableCell>
                          <TableCell>{item.notas_guardadas.nota_docente ?? "–"}</TableCell>
                          <TableCell>{item.notas_guardadas.nota_monitor ?? "–"}</TableCell>
                          <TableCell>{item.notas_guardadas.nota_estudiante ?? "–"}</TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              #{item.id_encuesta}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </Card>
          )}

          {/* ── Detalle Errores ── */}
          {respuesta.detalle_errores.length > 0 && (
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ErrorOutlineIcon sx={{ color: "#ef4444" }} />
                    <Typography fontWeight={700} color="#991b1b">
                      Filas con error ({respuesta.detalle_errores.length})
                    </Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => setShowErrores(!showErrores)}>
                    {showErrores ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
                sx={{ borderBottom: showErrores ? "1px solid #f0f0f0" : "none", pb: 1.5 }}
              />
              <Collapse in={showErrores}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#fef2f2" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Fila</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Motivo del error</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {respuesta.detalle_errores.map((item, idx) => (
                        <TableRow key={idx} sx={{ backgroundColor: "#fff5f5" }}>
                          <TableCell>{item.fila}</TableCell>
                          <TableCell>{item.documento || "–"}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="error.main">
                              {item.error}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </Card>
          )}

          {/* ── Gráficas ── */}
          {chartPromedioGeneral && (
            <>
              <Divider />
              <Typography variant="h6" fontWeight={700} color={ROJO}>
                Analítica del archivo cargado
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                {/* Promedios generales */}
                <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
                  <CardHeader
                    title="Promedio por componente"
                    titleTypographyProps={{ fontWeight: 700, color: ROJO, fontSize: "1rem" }}
                    sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
                  />
                  <CardContent>
                    <Chart
                      options={chartPromedioGeneral.options}
                      series={chartPromedioGeneral.series}
                      type="bar"
                      height={300}
                    />
                  </CardContent>
                </Card>

                {/* Distribución creadas vs actualizadas */}
                <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
                  <CardHeader
                    title="Resultado de la carga"
                    titleTypographyProps={{ fontWeight: 700, color: ROJO, fontSize: "1rem" }}
                    sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
                  />
                  <CardContent>
                    <Chart
                      options={{
                        chart: { id: "resultado-carga", toolbar: { show: false } },
                        labels: ["Creadas", "Actualizadas", "Errores"],
                        colors: ["#22c55e", "#f59e0b", "#ef4444"],
                        legend: { position: "bottom" },
                        plotOptions: { pie: { donut: { size: "60%" } } },
                        dataLabels: {
                          formatter: (val: number, opts: any) =>
                            `${opts.w.config.series[opts.seriesIndex]}`,
                        },
                      }}
                      series={[respuesta.creadas, respuesta.actualizadas, respuesta.errores]}
                      type="donut"
                      height={300}
                    />
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}