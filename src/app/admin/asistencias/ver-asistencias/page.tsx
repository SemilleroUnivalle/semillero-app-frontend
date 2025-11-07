"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import {
  Analytics as AnalyticsIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  FileDownload as FileDownloadIcon,
  CheckCircleOutline as CheckCircleIcon,
  CancelOutlined as CancelIcon,
  Cancel,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import type ApexCharts from "apexcharts";
import { Matricula } from "@/interfaces/interfaces";

// Carga dinámica de ApexCharts para evitar problemas de SSR
const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Interfaces
interface Asistencia {
  id_asistencia: number;
  fecha_asistencia: string;
  estado_asistencia: string;
  comentarios: string;
  id_inscripcion: Matricula;
  // Datos expandidos que vendrán del backend
  estudiante_nombre?: string;
  estudiante_apellido?: string;
  modulo_nombre?: string;
  grupo_nombre?: string;
  periodo_nombre?: string;
}

interface AsistenciaRow {
  id: number;
  fecha_asistencia: string;
  estado_asistencia: string;
  comentarios: string;
  estudiante_nombre: string;
  estudiante_apellido: string;
  modulo_nombre: string;
  grupo_nombre: string;
  periodo_nombre: string;
}

interface PeriodoAcademico {
  id: number;
  nombre: string;
  fecha_inicio: string;
  estado: boolean;
}

interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  estado: boolean;
}

export default function VerAsistencias() {
  // Estados principales
  const [asistencias, setAsistencias] = useState<AsistenciaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Estados para filtros
  const [periodosAcademicos, setPeriodosAcademicos] = useState<
    PeriodoAcademico[]
  >([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("todos");
  const [selectedModulo, setSelectedModulo] = useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Columnas de la DataGrid
  const columns: GridColDef[] = [
    { field: "fecha_asistencia", headerName: "Fecha", flex: 0.8 },
    { field: "periodo_nombre", headerName: "Período", flex: 1 },
    { field: "modulo_nombre", headerName: "Módulo", flex: 1 },
    { field: "grupo_nombre", headerName: "Grupo", flex: 0.8 },
    { field: "estudiante_apellido", headerName: "Apellidos", flex: 1 },
    { field: "estudiante_nombre", headerName: "Nombres", flex: 1 },
    {
      field: "estado_asistencia",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Asistio" ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      ),
    },
    { field: "comentarios", headerName: "Comentarios", flex: 1.5 },
  ];

  // Función para obtener token
  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchAsistencias(), fetchPeriodos(), fetchModulos()]);
    };
    loadInitialData();
  }, []);

  // Cargar asistencias
  const fetchAsistencias = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(`${API_BASE_URL}/asistencia/asis/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Aquí deberías expandir los datos con información de inscripción
      // Por ahora simulo datos expandidos
      const asistenciasFormateadas: AsistenciaRow[] = response.data.map(
        (asistencia: Asistencia) => ({
          id: asistencia.id_asistencia,
          fecha_asistencia: asistencia.fecha_asistencia,
          estado_asistencia: asistencia.estado_asistencia,
          comentarios: asistencia.comentarios,
          estudiante_nombre:
            asistencia.id_inscripcion.id_estudiante.nombre ||
            `Estudiante ${asistencia.id_inscripcion}`,
          estudiante_apellido: asistencia.id_inscripcion.id_estudiante.apellido || "Apellido",
          modulo_nombre: asistencia.id_inscripcion.modulo|| "Módulo",
          grupo_nombre: asistencia.id_inscripcion.grupo|| "Grupo",
          periodo_nombre: asistencia.id_inscripcion.oferta_categoria || "Período",
        }),
      );

      setAsistencias(asistenciasFormateadas);
      setError(null);
    } catch (err) {
      console.error("Error al cargar asistencias:", err);
      setError("Error al cargar las asistencias");
    } finally {
      setLoading(false);
    }
  };

  // Cargar períodos académicos
  const fetchPeriodos = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/oferta_academica/ofer/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setPeriodosAcademicos(response.data);
    } catch (error) {
      console.error("Error al cargar períodos:", error);
    }
  };

  // Cargar módulos
  const fetchModulos = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/modulo/mod/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setModulos(response.data);
    } catch (error) {
      console.error("Error al cargar módulos:", error);
    }
  };

  // Filtrar datos
  const filteredAsistencias = useMemo(() => {
    return asistencias.filter((asistencia) => {
      const periodoMatch =
        selectedPeriodo === "todos" ||
        asistencia.periodo_nombre === selectedPeriodo;
      const moduloMatch =
        selectedModulo === "todos" ||
        asistencia.modulo_nombre === selectedModulo;
      const estadoMatch =
        selectedEstado === "todos" ||
        asistencia.estado_asistencia === selectedEstado;

      let fechaMatch = true;
      if (fechaInicio && fechaFin) {
        const fechaAsistencia = new Date(asistencia.fecha_asistencia);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fechaMatch = fechaAsistencia >= inicio && fechaAsistencia <= fin;
      } else if (fechaInicio) {
        const fechaAsistencia = new Date(asistencia.fecha_asistencia);
        const inicio = new Date(fechaInicio);
        fechaMatch = fechaAsistencia >= inicio;
      } else if (fechaFin) {
        const fechaAsistencia = new Date(asistencia.fecha_asistencia);
        const fin = new Date(fechaFin);
        fechaMatch = fechaAsistencia <= fin;
      }

      return periodoMatch && moduloMatch && estadoMatch && fechaMatch;
    });
  }, [
    asistencias,
    selectedPeriodo,
    selectedModulo,
    selectedEstado,
    fechaInicio,
    fechaFin,
  ]);

  // Configuraciones de gráficas ApexCharts
  const chartConfigs = useMemo(() => {
    // Datos para gráfica de pastel - Estado de asistencia
    const asistenciasPorEstado = filteredAsistencias.reduce(
      (acc, asistencia) => {
        const estado = asistencia.estado_asistencia;
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const pieChartOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "pie",
      },
      labels: Object.keys(asistenciasPorEstado),
      colors: ["#4caf50", "#C20E1A"], // Verde para "Asistio", Rojo para "No Asistio"
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} registros`,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    const pieChartSeries = Object.values(asistenciasPorEstado);

    // Datos para gráfica de barras - Asistencias por módulo
    const asistenciasPorModulo = filteredAsistencias.reduce(
      (acc, asistencia) => {
        const modulo = asistencia.modulo_nombre;
        acc[modulo] = (acc[modulo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const moduloEntries = Object.entries(asistenciasPorModulo)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const barChartModulosOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: moduloEntries.map(([modulo]) => modulo),
        labels: {
          style: {
            fontSize: "12px",
          },
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: "Número de Asistencias",
        },
      },
      colors: ["#C20E1A"],
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} asistencias`,
        },
      },
      grid: {
        borderColor: "#f0f0f0",
      },
    };

    const barChartModulosSeries = [
      {
        name: "Asistencias",
        data: moduloEntries.map(([, count]) => count),
      },
    ];

    // Datos para gráfica de barras apiladas - Asistencias por fecha
    const asistenciasPorFecha = filteredAsistencias.reduce(
      (acc, asistencia) => {
        const fecha = asistencia.fecha_asistencia;
        if (!acc[fecha]) {
          acc[fecha] = { presente: 0, ausente: 0 };
        }
        if (asistencia.estado_asistencia === "Asistio") {
          acc[fecha].presente += 1;
        } else {
          acc[fecha].ausente += 1;
        }
        return acc;
      },
      {} as Record<string, { presente: number; ausente: number }>,
    );

    const fechaEntries = Object.entries(asistenciasPorFecha)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-15); // Últimas 15 fechas

    const barChartFechaOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: fechaEntries.map(([fecha]) =>
          new Date(fecha).toLocaleDateString("es-ES"),
        ),
        labels: {
          style: {
            fontSize: "11px",
          },
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: "Cantidad de Estudiantes",
        },
      },
      colors: ["#4caf50", "#C20E1A"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} estudiantes`,
        },
      },
      grid: {
        borderColor: "#f0f0f0",
      },
    };

    const barChartFechaSeries = [
      {
        name: "Presentes",
        data: fechaEntries.map(([, counts]) => counts.presente),
      },
      {
        name: "Ausentes",
        data: fechaEntries.map(([, counts]) => counts.ausente),
      },
    ];

    return {
      pieChart: { options: pieChartOptions, series: pieChartSeries },
      barChartModulos: {
        options: barChartModulosOptions,
        series: barChartModulosSeries,
      },
      barChartFecha: {
        options: barChartFechaOptions,
        series: barChartFechaSeries,
      },
    };
  }, [filteredAsistencias]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalAsistencias = filteredAsistencias.length;
    const presentes = filteredAsistencias.filter(
      (a) => a.estado_asistencia === "Asistio",
    ).length;
    const ausentes = totalAsistencias - presentes;
    const porcentajeAsistencia =
      totalAsistencias > 0 ? (presentes / totalAsistencias) * 100 : 0;

    return {
      total: totalAsistencias,
      presentes,
      ausentes,
      porcentajeAsistencia: porcentajeAsistencia.toFixed(1),
    };
  }, [filteredAsistencias]);

  // Manejadores de filtros
  const handlePeriodoChange = (event: SelectChangeEvent<string>) => {
    setSelectedPeriodo(event.target.value);
  };

  const handleModuloChange = (event: SelectChangeEvent<string>) => {
    setSelectedModulo(event.target.value);
  };

  const handleEstadoChange = (event: SelectChangeEvent<string>) => {
    setSelectedEstado(event.target.value);
  };

  const handleLimpiarFiltros = () => {
    setSelectedPeriodo("todos");
    setSelectedModulo("todos");
    setSelectedEstado("todos");
    setFechaInicio("");
    setFechaFin("");
  };

  const handleExportarDatos = async () => {
    try {
      const token = getToken();
      // Aquí implementarías la llamada al endpoint de exportación
      console.log("Exportando datos filtrados...", filteredAsistencias);
      alert("Funcionalidad de exportación por implementar");
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al exportar los datos");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress sx={{ color: "#c20e1a" }} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando asistencias...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="mx-auto w-11/12">
      {/* Filtros */}
      <div className="mt-4 w-full rounded-2xl bg-white p-3 shadow-md">
        <Typography
          variant="h5"
          className="mb-4 text-center font-bold text-primary"
        >
          Análisis de Asistencias
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <FilterListIcon sx={{ color: "#c20e1a" }} />
          <Typography variant="h6" fontWeight="bold">
            Filtros
          </Typography>
        </Box>

        <Box className="flex flex-wrap justify-between gap-2">
          <FormControl className="inputs-textfield w-full sm:w-1/6">
            <InputLabel>Período Académico</InputLabel>
            <Select
              value={selectedPeriodo}
              onChange={handlePeriodoChange}
              label="Período Académico"
            >
              <MenuItem key="todos" value="todos">
                Todos los períodos
              </MenuItem>
              {periodosAcademicos.map((periodo) => (
                <MenuItem key={periodo.id} value={periodo.nombre}>
                  {periodo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="inputs-textfield w-full sm:w-1/6">
            <InputLabel>Módulo</InputLabel>
            <Select
              value={selectedModulo}
              onChange={handleModuloChange}
              label="Módulo"
            >
              <MenuItem value="todos">Todos los módulos</MenuItem>
              {modulos.map((modulo) => (
                <MenuItem key={modulo.id_modulo} value={modulo.nombre_modulo}>
                  {modulo.nombre_modulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="inputs-textfield w-full sm:w-1/6">
            <InputLabel>Estado de Asistencia</InputLabel>
            <Select
              value={selectedEstado}
              onChange={handleEstadoChange}
              label="Estado de Asistencia"
            >
              <MenuItem value="todos">Todos los estados</MenuItem>
              <MenuItem value="Asistio">Presente</MenuItem>
              <MenuItem value="No Asistio">Ausente</MenuItem>
            </Select>
          </FormControl>

          <Button
            className="inputs-textfield"
            variant="outlined"
            onClick={handleLimpiarFiltros}
            sx={{
              borderColor: "#c20e1a",
              color: "#c20e1a",
              "&:hover": {
                borderColor: "#c20e1a",
                backgroundColor: "#c20e1a10",
              },
            }}
          >
            Limpiar
          </Button>

          <TextField
            className="inputs-textfield w-full sm:w-1/6"
            fullWidth
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            className="inputs-textfield w-full sm:w-1/6"
            fullWidth
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Resumen de filtros activos */}
        {(selectedPeriodo !== "todos" ||
          selectedModulo !== "todos" ||
          selectedEstado !== "todos" ||
          fechaInicio ||
          fechaFin) && (
          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Filtros activos:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedPeriodo !== "todos" && (
                <Chip
                  label={`Período: ${selectedPeriodo}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedModulo !== "todos" && (
                <Chip
                  label={`Módulo: ${selectedModulo}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedEstado !== "todos" && (
                <Chip
                  label={`Estado: ${selectedEstado}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {fechaInicio && (
                <Chip
                  label={`Desde: ${fechaInicio}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {fechaFin && (
                <Chip
                  label={`Hasta: ${fechaFin}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </div>

      {/* Estadísticas generales */}
      <Box className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent sx={{ textAlign: "center" }}>
            <AssessmentIcon sx={{ fontSize: 40, color: "#00bcd4", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#00bcd4">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Registros
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent sx={{ textAlign: "center" }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#4caf50">
              {stats.presentes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Presentes
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent sx={{ textAlign: "center" }}>
            <CancelIcon
              className="text-primary"
              sx={{ fontSize: 40, color: "primary", mb: 1 }}
            />
            <Typography className="text-primary" variant="h4" fontWeight="bold">
              {stats.ausentes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ausentes
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent sx={{ textAlign: "center" }}>
            <CalendarIcon sx={{ fontSize: 40, color: "#4caf50", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#4caf50">
              {stats.porcentajeAsistencia}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              % Asistencia
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Gráficas */}
      <Box className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Gráfica de pastel - Estado de asistencia */}
        <Paper
          className="rounded-2xl"
          elevation={0}
          sx={{ p: 3, border: "1px solid #d0d0d0" }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Distribución por Estado
          </Typography>
          {isClient && (
            <ReactApexCharts
              options={chartConfigs.pieChart.options}
              series={chartConfigs.pieChart.series}
              type="pie"
              height={300}
            />
          )}
        </Paper>

        {/* Gráfica de barras - Asistencias por módulo */}
        <Paper
          className="rounded-2xl"
          elevation={0}
          sx={{ p: 3, border: "1px solid #d0d0d0" }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Asistencias por Módulo
          </Typography>
          {isClient && (
            <ReactApexCharts
              options={chartConfigs.barChartModulos.options}
              series={chartConfigs.barChartModulos.series}
              type="bar"
              height={300}
            />
          )}
        </Paper>

        {/* Gráfica de barras apiladas - Asistencias por fecha */}
        <Paper
          className="rounded-2xl"
          elevation={0}
          sx={{ p: 3, border: "1px solid #d0d0d0" }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Asistencias por Fecha
          </Typography>
          {isClient && (
            <ReactApexCharts
              options={chartConfigs.barChartFecha.options}
              series={chartConfigs.barChartFecha.series}
              type="bar"
              height={400}
            />
          )}
        </Paper>
      </Box>

      {/* Tabla de datos */}
      <Paper elevation={0} sx={{ border: "1px solid #d0d0d0" }}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Registro Detallado de Asistencias
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Mostrando {filteredAsistencias.length} de {asistencias.length}{" "}
            registros
          </Typography>
        </Box>

        <DataGrid
          rows={filteredAsistencias}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 25 } },
          }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: "#f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              borderColor: "#f0f0f0",
            },
          }}
        />
      </Paper>
    </div>
  );
}
