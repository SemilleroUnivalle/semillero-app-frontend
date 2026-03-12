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
  const [selectedPeriod, setSelectedPeriod] = useState<number | string>("");

  useEffect(() => {
    async function initStatistics() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Periods
        const allPeriods = await fetchPeriods();
        const sortedPeriods = [...allPeriods].sort((a, b) => (isPeriodActive(b) ? 1 : 0) - (isPeriodActive(a) ? 1 : 0));
        setPeriods(sortedPeriods);

        // 2. Default to "all" (Historic) for Statistics page
        setSelectedPeriod("all");

        // 3. Fetch Data
        const dashboardData = await fetchDashboardData("all");
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

  const handlePeriodChange = async (periodId: number | string) => {
    try {
      setLoading(true);
      setSelectedPeriod(periodId);
      const dashboardData = await fetchDashboardData(periodId);
      setData(dashboardData);
    } catch (err) {
      console.error("Error changing period in statistics:", err);
      setError("Error al cambiar el filtro de periodo.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 250, bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel id="period-select-label">Filtrar por Periodo</InputLabel>
            <Select
              labelId="period-select-label"
              value={selectedPeriod}
              label="Filtrar por Periodo"
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

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border">
            <CalendarIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Última actualización: {new Date().toLocaleDateString("es-ES")}
            </Typography>
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
                    <EstratoSocioeconomicoDistributionInterno />
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
                    <VinculacionDistributionInterno />
                  </Box>
                </div>
              </div>
            </TabPanel>

            {/* Geographic Analysis Tab */}
            <TabPanel value={tabValue} index={1}>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Box className="xl:col-span-2 p-6 rounded-2xl border bg-white flex flex-col items-center">
                  <Typography variant="h6" className="font-bold mb-6 self-start">Mapa de Procedencia</Typography>
                  <ColombiaMapWithNoSSR geojsonDataUrl={COLOMBIA_GEOJSON_URL} />
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
                    <MunicipioDistributionInterno />
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
