"use client";

import React, { useState, useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PollIcon from "@mui/icons-material/Poll";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ROJO = "#C20E1A";
const ROJO_DARK = "#8B0000";
const ROJO_LIGHT = "#E8454F";
const GRIS_OSCURO = "#4A4A4A";
const GRIS_MEDIO = "#7A7A7A";
const GRIS_CLARO = "#A0A0A0";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SEMESTRES_DATA = [
  { semestre: "2024-I", modulo: 4.30, docente: 4.60, monitor: 4.40, estudiante: 4.20 },
  { semestre: "2024-II", modulo: 4.40, docente: 4.62, monitor: 4.45, estudiante: 4.25 },
  { semestre: "2025-I", modulo: 4.45, docente: 4.65, monitor: 4.52, estudiante: 4.30 },
  { semestre: "2025-II", modulo: 4.50, docente: 4.70, monitor: 4.58, estudiante: 4.32 },
  { semestre: "2026-I", modulo: 4.52, docente: 4.75, monitor: 4.60, estudiante: 4.38 },
];

const AREAS_DATA = [
  { area: "Matemáticas", modulo: 4.62, docente: 4.80, monitor: 4.70, estudiante: 4.50 },
  { area: "Química", modulo: 4.20, docente: 4.50, monitor: 4.40, estudiante: 4.20 },
  { area: "Artes", modulo: 4.50, docente: 4.72, monitor: 4.60, estudiante: 4.40 },
  { area: "Lenguaje", modulo: 4.70, docente: 4.90, monitor: 4.80, estudiante: 4.60 },
  { area: "Música", modulo: 4.42, docente: 4.65, monitor: 4.52, estudiante: 4.30 },
];

const DETALLE_MODULOS = [
  { id: 1, modulo: "Álgebra y Funciones", area: "Matemáticas", docente: "Carlos Ruiz", docenteScore: 4.7, monitorName: "Julián Pérez", monitor: 4.6, modulo_score: 4.5, estudiante: 4.3, respuestas: 180, estado: "Excelente" },
  { id: 2, modulo: "Geometría Analítica", area: "Matemáticas", docente: "Carlos Ruiz", docenteScore: 4.8, monitorName: "Julián Pérez", monitor: 4.7, modulo_score: 4.6, estudiante: 4.5, respuestas: 230, estado: "Excelente" },
  { id: 3, modulo: "Química Orgánica Básica", area: "Química", docente: "Laura Méndez", docenteScore: 4.5, monitorName: "Valeria Rios", monitor: 4.4, modulo_score: 4.2, estudiante: 4.2, respuestas: 120, estado: "Sobresaliente" },
  { id: 4, modulo: "Laboratorio de Reacciones", area: "Química", docente: "Laura Méndez", docenteScore: 4.3, monitorName: "Valeria Rios", monitor: 4.1, modulo_score: 4.0, estudiante: 3.9, respuestas: 85, estado: "Aceptable" },
  { id: 5, modulo: "Pintura y Expresión Visual", area: "Artes", docente: "Sandra Gómez", docenteScore: 4.7, monitorName: "Daniela Cruz", monitor: 4.6, modulo_score: 4.5, estudiante: 4.4, respuestas: 150, estado: "Excelente" },
  { id: 6, modulo: "Comprensión Lectora", area: "Lenguaje", docente: "Miguel Torres", docenteScore: 4.9, monitorName: "Sebastián Mora", monitor: 4.8, modulo_score: 4.7, estudiante: 4.6, respuestas: 95, estado: "Excelente" },
  { id: 7, modulo: "Teoría Musical", area: "Música", docente: "Ana Castillo", docenteScore: 4.6, monitorName: "Luisa Vargas", monitor: 4.5, modulo_score: 4.4, estudiante: 4.3, respuestas: 110, estado: "Sobresaliente" },
  { id: 8, modulo: "Instrumento y Ritmo", area: "Música", docente: "Ana Castillo", docenteScore: 4.5, monitorName: "Luisa Vargas", monitor: 4.4, modulo_score: 4.3, estudiante: 4.2, respuestas: 75, estado: "Sobresaliente" },
];

const DOCENTES_LIST = ["Carlos Ruiz", "Laura Méndez", "Sandra Gómez", "Miguel Torres", "Ana Castillo"];
const MONITORES_LIST = ["Julián Pérez", "Valeria Rios", "Daniela Cruz", "Sebastián Mora", "Luisa Vargas"];
const AREAS_LIST = ["Matemáticas", "Química", "Artes", "Lenguaje", "Música"];

// ─── SubComponents ────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  color,
  icon,
  description,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        borderLeft: `5px solid ${color}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        transition: "all .3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={850} color="#272727" sx={{ my: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              color: color,
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function EstadisticasEncuestasPage() {
  const router = useRouter();

  // Estados de filtros
  const [selectedSemestre, setSelectedSemestre] = useState("Todos");
  const [selectedArea, setSelectedArea] = useState("Todos");
  const [selectedAreaGlobal, setSelectedAreaGlobal] = useState("Todos");
  const [selectedDocente, setSelectedDocente] = useState("Todos");
  const [selectedMonitor, setSelectedMonitor] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Averages calculated dynamically based on semester/area/docente/monitor filters
  const currentKpis = useMemo(() => {
    let moduleList = DETALLE_MODULOS;
    if (selectedAreaGlobal !== "Todos") {
      moduleList = moduleList.filter((d) => d.area === selectedAreaGlobal);
    }
    if (selectedDocente !== "Todos") {
      moduleList = moduleList.filter((d) => d.docente === selectedDocente);
    }
    if (selectedMonitor !== "Todos") {
      moduleList = moduleList.filter((d) => d.monitorName === selectedMonitor);
    }

    const avg = (arr: number[]) =>
      arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";

    return {
      docente: avg(moduleList.map((d) => d.docenteScore)),
      monitor: avg(moduleList.map((d) => d.monitor)),
      modulo: avg(moduleList.map((d) => d.modulo_score)),
      estudiante: avg(moduleList.map((d) => d.estudiante)),
    };
  }, [selectedAreaGlobal, selectedDocente, selectedMonitor]);

  // Chart 1: Evolution over semesters
  const evolutionChart = useMemo(() => {
    return {
      options: {
        chart: {
          id: "evolucion-notas",
          type: "area",
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        colors: [ROJO, ROJO_LIGHT, GRIS_OSCURO, GRIS_MEDIO],
        xaxis: {
          categories: SEMESTRES_DATA.map((d) => d.semestre),
          labels: { style: { colors: "#777", fontWeight: 600 } },
        },
        yaxis: {
          min: 3.5,
          max: 5.0,
          labels: { formatter: (v: number) => v.toFixed(1) },
        },
        tooltip: {
          y: { formatter: (v: number) => `${v.toFixed(2)} / 5.0` },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 100],
          },
        },
        grid: {
          borderColor: "#e7e7e7",
          row: { colors: ["#f3f3f3", "transparent"], opacity: 0.3 },
        },
      },
      series: [
        { name: "Nota Docente", data: SEMESTRES_DATA.map((d) => d.docente) },
        { name: "Nota Monitor", data: SEMESTRES_DATA.map((d) => d.monitor) },
        { name: "Nota Módulo", data: SEMESTRES_DATA.map((d) => d.modulo) },
        { name: "Autoevaluación", data: SEMESTRES_DATA.map((d) => d.estudiante) },
      ],
    };
  }, []);

  // Chart 2: Notes per Academic Area
  const areasChart = useMemo(() => {
    return {
      options: {
        chart: {
          id: "notas-areas",
          type: "bar",
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            borderRadius: 4,
          },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        colors: [ROJO, GRIS_OSCURO, ROJO_LIGHT],
        xaxis: {
          categories: AREAS_DATA.map((d) => d.area),
          labels: { style: { colors: "#777", fontWeight: 600 } },
        },
        yaxis: {
          min: 0,
          max: 5,
        },
        fill: { opacity: 1 },
        tooltip: {
          y: { formatter: (v: number) => `${v.toFixed(2)}` },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
      series: [
        { name: "Nota Docente", data: AREAS_DATA.map((d) => d.docente) },
        { name: "Nota Monitor", data: AREAS_DATA.map((d) => d.monitor) },
        { name: "Nota Módulo", data: AREAS_DATA.map((d) => d.modulo) },
      ],
    };
  }, []);

  // Chart 3: Satisfaction distribution
  const distributionChart = useMemo(() => {
    return {
      options: {
        chart: { id: "distribucion-satisfaccion" },
        labels: ["Excelente (5)", "Bueno (4)", "Aceptable (3)", "Por mejorar (1-2)"],
        colors: [ROJO_DARK, ROJO, GRIS_OSCURO, GRIS_CLARO],
        legend: {
          position: "bottom",
          fontSize: "12px",
          fontWeight: 600,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: { position: "bottom" },
            },
          },
        ],
      },
      series: [62, 28, 8, 2],
    };
  }, []);

  // Chart 4: Radar — rendimiento global por área
  const radarChart = useMemo(() => {
    return {
      options: {
        chart: {
          id: "radar-areas",
          type: "radar",
          toolbar: { show: false },
        },
        xaxis: {
          categories: AREAS_DATA.map((d) => d.area),
        },
        colors: [ROJO, GRIS_OSCURO],
        stroke: { width: 2 },
        fill: { opacity: 0.15 },
        markers: { size: 4 },
        legend: {
          position: "top",
          horizontalAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
        },
        yaxis: { show: false },
        tooltip: {
          y: { formatter: (v: number) => `${v.toFixed(2)} / 5.0` },
        },
      },
      series: [
        { name: "Nota Docente", data: AREAS_DATA.map((d) => d.docente) },
        { name: "Nota Módulo", data: AREAS_DATA.map((d) => d.modulo) },
      ],
    };
  }, []);

  // Filtered detailed list
  const filteredList = useMemo(() => {
    return DETALLE_MODULOS.filter((item) => {
      const matchesSearch =
        item.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = selectedArea === "Todos" || item.area === selectedArea;
      const matchesDocente = selectedDocente === "Todos" || item.docente === selectedDocente;
      const matchesMonitor = selectedMonitor === "Todos" || item.monitorName === selectedMonitor;
      const matchesAreaGlobal = selectedAreaGlobal === "Todos" || item.area === selectedAreaGlobal;
      return matchesSearch && matchesArea && matchesDocente && matchesMonitor && matchesAreaGlobal;
    });
  }, [searchTerm, selectedArea, selectedDocente, selectedMonitor, selectedAreaGlobal]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto", display: "flex", flexDirection: "column", gap: 3.5 }}>

      {/* Header with return button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => router.push("/admin/encuestas")}
            sx={{
              border: "1px solid #ddd",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ArrowBackIcon sx={{ color: "#272727" }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} color={ROJO}>
              Estadísticas Históricas - Encuestas de Satisfacción
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Historial y análisis consolidado de la satisfacción del semillero
            </Typography>
          </Box>
        </Box>

        {/* Global Filters */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ width: 170 }}>
            <InputLabel id="select-semestre-label">Periodo Semestral</InputLabel>
            <Select
              labelId="select-semestre-label"
              id="select-semestre"
              value={selectedSemestre}
              label="Periodo Semestral"
              onChange={(e) => setSelectedSemestre(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todos los Periodos</MenuItem>
              <MenuItem value="2026-I">2026-I (Actual)</MenuItem>
              <MenuItem value="2025-II">2025-II</MenuItem>
              <MenuItem value="2025-I">2025-I</MenuItem>
              <MenuItem value="2024-II">2024-II</MenuItem>
              <MenuItem value="2024-I">2024-I</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: 160 }}>
            <InputLabel id="select-area-global-label">Área Acad\u00e9mica</InputLabel>
            <Select
              labelId="select-area-global-label"
              id="select-area-global"
              value={selectedAreaGlobal}
              label="\u00c1rea Acad\u00e9mica"
              onChange={(e) => setSelectedAreaGlobal(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todas las \u00c1reas</MenuItem>
              {AREAS_LIST.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel id="select-docente-label">Docente</InputLabel>
            <Select
              labelId="select-docente-label"
              id="select-docente"
              value={selectedDocente}
              label="Docente"
              onChange={(e) => setSelectedDocente(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todos los Docentes</MenuItem>
              {DOCENTES_LIST.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel id="select-monitor-label">Monitor Acad\u00e9mico</InputLabel>
            <Select
              labelId="select-monitor-label"
              id="select-monitor"
              value={selectedMonitor}
              label="Monitor Acad\u00e9mico"
              onChange={(e) => setSelectedMonitor(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todos los Monitores</MenuItem>
              {MONITORES_LIST.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPI Section */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "nowrap", width: "100%" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <KpiCard
            label="Promedio Docentes"
            value={`${currentKpis.docente} / 5.0`}
            color={ROJO}
            icon={<SchoolIcon sx={{ fontSize: 28 }} />}
            description="Evaluación general del desempeño docente"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <KpiCard
            label="Promedio Monitores"
            value={`${currentKpis.monitor} / 5.0`}
            color={ROJO_DARK}
            icon={<SupervisorAccountIcon sx={{ fontSize: 28 }} />}
            description="Calificación sobre el apoyo de los monitores"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <KpiCard
            label="Promedio Módulos"
            value={`${currentKpis.modulo} / 5.0`}
            color={GRIS_OSCURO}
            icon={<AutoStoriesIcon sx={{ fontSize: 28 }} />}
            description="Grado de satisfacción sobre los temas del curso"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <KpiCard
            label="Autoevaluación"
            value={`${currentKpis.estudiante} / 5.0`}
            color={GRIS_MEDIO}
            icon={<PollIcon sx={{ fontSize: 28 }} />}
            description="Desempeño percibido por el estudiante"
          />
        </Box>
      </Box>

      {/* Charts section: 2×2 grid */}
      <Grid container spacing={3}>

        {/* Row 1 — Left: Evolution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardHeader
              title="Tendencias del Semillero"
              subheader="Evolución de las calificaciones por semestre"
              titleTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
            />
            <CardContent>
              <Box sx={{ pt: 1 }}>
                <Chart
                  options={evolutionChart.options as ApexOptions}
                  series={evolutionChart.series}
                  type="area"
                  height={380}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 1 — Right: Bars per area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardHeader
              title="Desempeño por Áreas Académicas"
              subheader="Comparativa de notas por categoría de curso"
              titleTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
            />
            <CardContent>
              <Box sx={{ pt: 1 }}>
                <Chart
                  options={areasChart.options as ApexOptions}
                  series={areasChart.series}
                  type="bar"
                  height={380}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 2 — Left: Donut distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardHeader
              title="Distribución de Satisfacción"
              subheader="Proporción del nivel de satisfacción estudiantil"
              titleTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
            />
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ width: "100%", py: 2 }}>
                <Chart
                  options={distributionChart.options as ApexOptions}
                  series={distributionChart.series}
                  type="donut"
                  height={360}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 2 — Right: Radar by area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardHeader
              title="Perfil de Rendimiento por Área"
              subheader="Comparativa radial de notas de docente y módulo"
              titleTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
            />
            <CardContent>
              <Box sx={{ pt: 1 }}>
                <Chart
                  options={radarChart.options as ApexOptions}
                  series={radarChart.series}
                  type="radar"
                  height={380}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Details Table */}
      <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <CardHeader
          title="Desglose por Módulos de Aprendizaje"
          subheader="Resultados de satisfacción individualizados por curso"
          titleTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
          subheaderTypographyProps={{ fontSize: "0.8rem" }}
          sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}
        />
        <CardContent sx={{ p: 0 }}>

          {/* Table Filters */}
          <Box sx={{ display: "flex", gap: 2.5, p: 2.5, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Buscar por Módulo"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: "100%", sm: 280 } }}
            />
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
              <InputLabel>Filtrar por Área</InputLabel>
              <Select
                value={selectedArea}
                label="Filtrar por Área"
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <MenuItem value="Todos">Todas las Áreas</MenuItem>
                <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                <MenuItem value="Química">Química</MenuItem>
                <MenuItem value="Artes">Artes</MenuItem>
                <MenuItem value="Lenguaje">Lenguaje</MenuItem>
                <MenuItem value="Música">Música</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table Component */}
          <TableContainer component={Paper} sx={{ boxShadow: "none", border: "none" }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ backgroundColor: "#e8e8e8" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 750, color: "#575757" }}>Módulo</TableCell>
                  <TableCell sx={{ fontWeight: 750, color: "#575757" }}>Área</TableCell>
                  <TableCell sx={{ fontWeight: 750, color: "#575757" }}>Docente</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 750, color: "#575757" }}>Monitor</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 750, color: "#575757" }}>Módulo</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 750, color: "#575757" }}>Autoeval.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 750, color: "#575757" }}>Respuestas</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 750, color: "#575757" }}>Desempeño</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.modulo}</TableCell>
                    <TableCell>
                      <Chip label={row.area} size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                        <Typography variant="body2" fontWeight={600}>{row.docente}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                          <StarIcon sx={{ color: "#FFD700", fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {row.docenteScore.toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                        <Typography variant="body2" fontWeight={600}>{row.monitorName}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                          <StarIcon sx={{ color: "#FFD700", fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {row.monitor.toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                        <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                        <Typography variant="body2" fontWeight={600}>{row.modulo_score.toFixed(1)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                        <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                        <Typography variant="body2" fontWeight={600}>{row.estudiante.toFixed(1)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{row.respuestas}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.estado}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor:
                            row.estado === "Excelente"
                              ? ROJO
                              : row.estado === "Sobresaliente"
                                ? GRIS_OSCURO
                                : GRIS_MEDIO,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No se encontraron resultados para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
