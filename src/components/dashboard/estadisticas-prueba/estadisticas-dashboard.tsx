"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

// Import components from parent directory to reuse them
import { StatsCard } from "../stats-card";
import { EnrollmentChart } from "../enrollment-chart";
import { ModuleGenderChart } from "../module-gender-chart";
import { ModuleDistribution } from "../module-distribution";
import { EstamentoSegmentation } from "../estamento-segmentation";
import { DemographicsOverview } from "../demographics-overview";
import { EstratoSocioeconomicoDistributionInterno } from "../estrato_socioeconomico";
import { VinculacionDistributionInterno } from "../tipodevinculacion";
import { MunicipioDistributionInterno } from "../DistribucionMunicipios";

import { fetchDashboardData, fetchPeriods, isPeriodActive, type DashboardData, type Period } from "@/lib/api/dashboard";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const COLOMBIA_GEOJSON_URL = "/colombia.json";

const ColombiaMapWithNoSSR = dynamic(() => import("../ColombiaMap"), {
  ssr: false,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={value === index ? "py-3" : ""}
    >
      {value === index && <div className="py-3">{children}</div>}
    </div>
  );
}

export function EstadisticasDashboard() {
  const pathname = usePathname();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | string>("all");
  const [selectedModulo, setSelectedModulo] = useState<number | string>("all");
  const [selectedArea, setSelectedArea] = useState<number | string>("all");
  const [selectedTipoVinculacion, setSelectedTipoVinculacion] = useState<string>("all");
  const [selectedEstamento, setSelectedEstamento] = useState<string>("all");

  const loadFilteredData = async (
    period: number | string,
    modulo: number | string,
    area: number | string,
    vinculacion: string,
    estamento: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchDashboardData(period, modulo, area, vinculacion, estamento);
      setData(dashboardData);
    } catch (err) {
      console.error("Error loading filtered dashboard data:", err);
      setError("Error al filtrar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initStatistics() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Periods
        const allPeriods = await fetchPeriods();
        const sortedPeriods = [...allPeriods].sort((a, b) => (isPeriodActive(b) ? 1 : 0) - (isPeriodActive(a) ? 1 : 0));
        setPeriods(sortedPeriods);

        // 2. Fetch Data with default "all" filters
        const dashboardData = await fetchDashboardData("all", "all", "all", "all", "all");
        setData(dashboardData);
      } catch (err) {
        console.error("Error initializing statistics:", err);
        setError("Error al cargar los datos históricos.");
      } finally {
        setLoading(false);
      }
    }

    initStatistics();
  }, []);

  const handlePeriodChange = (periodId: number | string) => {
    setSelectedPeriod(periodId);
    loadFilteredData(periodId, selectedModulo, selectedArea, selectedTipoVinculacion, selectedEstamento);
  };

  const handleModuloChange = (moduloId: number | string) => {
    setSelectedModulo(moduloId);
    loadFilteredData(selectedPeriod, moduloId, selectedArea, selectedTipoVinculacion, selectedEstamento);
  };

  const handleAreaChange = (areaId: number | string) => {
    setSelectedArea(areaId);
    setSelectedModulo("all");
    loadFilteredData(selectedPeriod, "all", areaId, selectedTipoVinculacion, selectedEstamento);
  };

  const handleTipoVinculacionChange = (vinculacion: string) => {
    setSelectedTipoVinculacion(vinculacion);
    loadFilteredData(selectedPeriod, selectedModulo, selectedArea, vinculacion, selectedEstamento);
  };

  const handleEstamentoChange = (est: string) => {
    setSelectedEstamento(est);
    loadFilteredData(selectedPeriod, selectedModulo, selectedArea, selectedTipoVinculacion, est);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredModules = React.useMemo(() => {
    const allModules = data?.filterOptions?.modules ?? [];
    if (!selectedArea || selectedArea === "all") {
      return allModules;
    }
    return allModules.filter((m) => m.id_area_id === Number(selectedArea));
  }, [data?.filterOptions?.modules, selectedArea]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-center">
          <CircularProgress sx={{ color: "#c20e1a", mb: 2 }} />
          <p className="mt-4 text-gray-600">Cargando estadísticas históricas...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error || "No se pudieron cargar las estadísticas"}
          </div>
        </div>
      </div>
    );
  }

  // Breadcrumbs logic
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbLinks = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { href, label };
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-11/12 px-4 py-5">
        <Typography variant="h4" className="font-bold text-primary mb-2">
          Estadísticas Históricas
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          {breadcrumbLinks.map((crumb, idx) =>
            idx < breadcrumbLinks.length - 1 ? (
              <Link key={crumb.href} href={crumb.href} className="text-gray-500 hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.href} color="text.primary" className="font-semibold">
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>

        <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
          <Typography variant="subtitle2" className="font-bold text-gray-500 mb-4 uppercase tracking-wider">
            Filtros de Búsqueda
          </Typography>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por Periodo */}
            <FormControl variant="outlined" size="small" fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <InputLabel id="period-select-label">Periodo</InputLabel>
              <Select
                labelId="period-select-label"
                value={selectedPeriod}
                label="Periodo"
                onChange={(e) => handlePeriodChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all"><em>Ver TODO (Histórico)</em></MenuItem>
                {periods.map((p) => (
                  <MenuItem key={p.id_oferta_academica} value={p.id_oferta_academica}>
                    {p.nombre} {isPeriodActive(p) ? "(Actual)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por Área */}
            <FormControl variant="outlined" size="small" fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <InputLabel id="area-select-label">Área</InputLabel>
              <Select
                labelId="area-select-label"
                value={selectedArea}
                label="Área"
                onChange={(e) => handleAreaChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all"><em>Todas las Áreas</em></MenuItem>
                {data?.filterOptions?.areas.map((a) => (
                  <MenuItem key={a.id_area} value={a.id_area}>
                    {a.nombre_area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por Módulo */}
            <FormControl variant="outlined" size="small" fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <InputLabel id="modulo-select-label">Módulo</InputLabel>
              <Select
                labelId="modulo-select-label"
                value={selectedModulo}
                label="Módulo"
                onChange={(e) => handleModuloChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all"><em>Todos los Módulos</em></MenuItem>
                {filteredModules.map((m) => (
                  <MenuItem key={m.id_modulo} value={m.id_modulo}>
                    {m.nombre_modulo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por Tipo de Estudiante */}
            <FormControl variant="outlined" size="small" fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <InputLabel id="vinculacion-select-label">Tipo de estudiante (Vinculación)</InputLabel>
              <Select
                labelId="vinculacion-select-label"
                value={selectedTipoVinculacion}
                label="Tipo de estudiante (Vinculación)"
                onChange={(e) => handleTipoVinculacionChange(e.target.value as string)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all"><em>Todos los Tipos</em></MenuItem>
                {data?.filterOptions?.vinculaciones.map((v, idx) => (
                  <MenuItem key={idx} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Filtro por Estamento */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 250, bgcolor: 'white', borderRadius: 2 }}>
              <InputLabel id="estamento-select-label">Estamento</InputLabel>
              <Select
                labelId="estamento-select-label"
                value={selectedEstamento}
                label="Estamento"
                onChange={(e) => handleEstamentoChange(e.target.value as string)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all"><em>Todos los Estamentos</em></MenuItem>
                {data?.filterOptions?.estamentos.map((e, idx) => (
                  <MenuItem key={idx} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <CalendarIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Última actualización: {new Date().toLocaleDateString("es-ES")}
              </Typography>
            </div>
          </div>
        </div>

        {/* Key Stats Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatsCard
            title="Total Inscripciones"
            value={data.totalRegister.toLocaleString()}
            icon={PeopleIcon}
            trend={data.inscritosNoMatriculados.toLocaleString()}
            trendLabel="pendientes"
          />
          <StatsCard
            title="Total Matriculados"
            value={data.totalEnrollments.toLocaleString()}
            icon={PeopleIcon}
            trend={data.inscritosMatriculados.toLocaleString()}
            trendLabel="completados"
          />
          <StatsCard
            title="Módulos Activos"
            value={data.activeModules.toString()}
            icon={MenuBookIcon}
            description="Oferta académica"
          />
          <StatsCard
            title="Docentes"
            value={data.totalProfessors.toString()}
            icon={PeopleIcon}
            compact
          />
          <StatsCard
            title="Monitores"
            value={data.totalMonitors.toString()}
            icon={PeopleIcon}
            compact
          />
          <StatsCard
            title="Módulo Popular"
            value={data.enrollmentsByModule?.[0]?.name ?? "—"}
            icon={TrendingUpIcon}
            description={`${data.enrollmentsByModule?.[0]?.enrollments ?? 0} inscritos`}
            compact
          />
        </div>

        {/* Tabs for Detailed Analysis */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b overflow-x-auto bg-gray-50/50">
            {[
              "General",
              "Geografía",
              "Módulos",
              "Institucional"
            ].map((label, index) => (
              <button
                key={index}
                onClick={() => setTabValue(index)}
                className={`whitespace-nowrap px-8 py-4 text-sm font-bold transition-all ${tabValue === index
                  ? "border-b-4 border-primary text-primary bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* General Analysis Tab */}
            <TabPanel value={tabValue} index={0}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Módulo y Género</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Distribución de estudiantes matriculados</Typography>
                    <ModuleGenderChart data={data.enrollmentsByModuleAndGender ?? []} />
                  </Box>

                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Estrato Socioeconómico</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Nivel socioeconómico de los matriculados</Typography>
                    <EstratoSocioeconomicoDistributionInterno data={data.estratoDistribution} />
                  </Box>
                </div>

                <div className="space-y-8">
                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Inscritos por Módulo</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Ranking de módulos por demanda</Typography>
                    <EnrollmentChart data={data.enrollmentsByModule ?? []} />
                  </Box>

                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Tipo de Vinculación</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Relación contractual de los estudiantes</Typography>
                    <VinculacionDistributionInterno data={data.vinculacionDistribution} />
                  </Box>
                </div>
              </div>
            </TabPanel>

            {/* Geographic Analysis Tab */}
            <TabPanel value={tabValue} index={1}>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Box className="xl:col-span-2 p-6 rounded-2xl border bg-white flex flex-col items-center">
                  <Typography variant="h6" className="font-bold mb-6 self-start">Mapa de Procedencia</Typography>
                  <ColombiaMapWithNoSSR geojsonDataUrl={COLOMBIA_GEOJSON_URL} data={data.municipioDistribution} />
                </Box>

                <div className="space-y-8">
                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Demografía</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Distribución por género</Typography>
                    <DemographicsOverview genderData={data.genderDistribution ?? []} />
                  </Box>

                  <Box className="p-6 rounded-2xl border bg-white">
                    <Typography variant="h6" className="font-bold mb-1">Municipios</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-6">Principales ciudades de origen</Typography>
                    <MunicipioDistributionInterno data={data.municipioDistribution} />
                  </Box>
                </div>
              </div>
            </TabPanel>

            {/* Modules Analysis Tab */}
            <TabPanel value={tabValue} index={2}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Box className="p-6 rounded-2xl border bg-white">
                  <Typography variant="h6" className="font-bold mb-4">Listado de Módulos</Typography>
                  <div className="divide-y">
                    {(data.enrollmentsByModule ?? []).map((m: any, idx: number) => (
                      <div key={idx} className="py-4 flex justify-between items-center group hover:bg-gray-50 px-2 transition-colors rounded-lg">
                        <div>
                          <Typography className="font-bold text-gray-800">{m.name}</Typography>
                          <Typography variant="caption" className="text-gray-400">{m.area}</Typography>
                        </div>
                        <div className="text-right">
                          <Typography className="font-black text-primary text-xl">{m.enrollments}</Typography>
                          <Typography variant="caption" className="text-gray-400 tabular-nums">participantes</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                <Box className="p-6 rounded-2xl border bg-white">
                  <Typography variant="h6" className="font-bold mb-1">Distribución Académica</Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-6">Inscritos por grado escolar</Typography>
                  <ModuleDistribution data={data.enrollmentsByGrade ?? []} />
                </Box>
              </div>
            </TabPanel>

            {/* Institutional Tab */}
            <TabPanel value={tabValue} index={3}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Box className="p-6 rounded-2xl border bg-white">
                  <Typography variant="h6" className="font-bold mb-1">Segmentación por Estamento</Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-6">Colegio público vs privado</Typography>
                  <EstamentoSegmentation data={data.enrollmentsByEstamento ?? []} />
                </Box>
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
