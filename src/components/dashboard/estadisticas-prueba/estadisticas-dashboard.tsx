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
  Breadcrumbs,
  Typography,
} from "@mui/material";
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { StatsCard } from "./stats-card";
import { EnrollmentChart } from "./enrollment-chart";
import { ModuleGenderChart } from "./module-gender-chart";
import { ModuleDistribution } from "./module-distribution";
import { EstamentoSegmentation } from "./estamento-segmentation";
import { DemographicsOverview } from "./demographics-overview";
import { EstratoSocioeconomicoDistributionInterno } from "./estrato_socioeconomico";
import { VinculacionDistributionInterno } from "./tipodevinculacion";
import { MunicipioDistributionInterno } from "./DistribucionMunicipios";
import {
  getMockDashboardData,
  getPeriods,
  getModules,
  getEstamentos,
  getGenders,
  getGrados,
  type DashboardFilters,
} from "@/lib/api/mock-dashboard-data";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const COLOMBIA_GEOJSON_URL = "/colombia.json";

const ColombiaMapWithNoSSR = dynamic(() => import("./ColombiaMap"), {
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

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Filter states
  const [period, setPeriod] = useState("2025-2");
  const [module, setModule] = useState("todos");
  const [estamento, setEstamento] = useState("todos");
  const [gender, setGender] = useState("todos");

  const [periods, setPeriods] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [estamentos, setEstamentos] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [grados, setGrados] = useState<string[]>([]);

  // Load filter options on mount
  useEffect(() => {
    setPeriods(getPeriods());
    setModules(getModules());
    setEstamentos(getEstamentos());
    setGenders(getGenders());
    setGrados(getGrados());
  }, []);

  // Load dashboard data whenever filters change
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const filters: DashboardFilters = {
          period,
          module,
          estamento,
          gender,
        };

        const dashboardData = getMockDashboardData(filters);
        setData(dashboardData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(
          "Error al cargar los datos del dashboard. Por favor, intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [period, module, estamento, gender]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-center">
          <CircularProgress sx={{ color: "#c20e1a", mb: 2 }} />
          <p className="mt-4 text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error || "No se pudieron cargar los datos del dashboard"}
          </div>
        </div>
      </div>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  // Divide la ruta en segmentos y genera los enlaces
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // Quita el primer segmento "admin"

  const basePath = "/admin/estaditicas";
  const breadcrumbNames: Record<string, string> = {
    verOfertas: "Ver Ofertas Académicas",
    crearOferta: "Crear Oferta Académica",
    // Agrega más traducciones si lo deseas
  };

  const breadcrumbLinks = [
    { href: basePath, label: "Estadísticas" },
    ...pathSegments.slice(1).map((segment, idx) => {
      const href = basePath + "/" + pathSegments.slice(1, idx + 2).join("/");
      const label =
        breadcrumbNames[segment] ||
        segment.charAt(0).toUpperCase() +
          segment.slice(1).replace(/([A-Z])/g, " $1");
      return { href, label };
    }),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="">
        <h1>Estadisticas</h1>
        <Breadcrumbs aria-label="breadcrumb" className="">
          {breadcrumbLinks.map((crumb, idx) =>
            idx < breadcrumbLinks.length - 1 ? (
              <Link
                key={crumb.href}
                href={crumb.href}
                className="text-primary hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.href} color="text.primary">
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
        <div className="mx-auto w-11/12 px-4 py-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CalendarIcon sx={{ fontSize: 16, color: "#999" }} />
              <p className="text-sm text-gray-600">
                Actualizado: {new Date().toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="inputs-textfield grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormControl fullWidth size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={period}
                label="Período"
                onChange={(e) => setPeriod(e.target.value)}
              >
                {periods.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Módulo</InputLabel>
              <Select
                value={module}
                label="Módulo"
                onChange={(e) => setModule(e.target.value)}
              >
                {modules.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m === "todos" ? "Todos los módulos" : m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Estamento</InputLabel>
              <Select
                value={estamento}
                label="Estamento"
                onChange={(e) => setEstamento(e.target.value)}
              >
                {estamentos.map((e) => (
                  <MenuItem key={e} value={e}>
                    {e === "todos" ? "Todos" : e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Género</InputLabel>
              <Select
                value={gender}
                label="Género"
                onChange={(e) => setGender(e.target.value)}
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g === "todos"
                      ? "Todos"
                      : g === "masculino"
                        ? "Masculino"
                        : g === "femenino"
                          ? "Femenino"
                          : "Otro"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="mx-auto w-11/12 px-4 py-1">
        {/* Key Stats */}
        <div className="mb-4 grid auto-rows-fr grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
          {/* Primer Card - Total Inscritos */}
          <div className="col-span-1 h-full rounded-3xl">
            <Link
              className="h-full rounded-3xl"
              href="/admin/registros/verRegistros"
              legacyBehavior
            >
              <a className="block h-full rounded-3xl no-underline">
                <StatsCard
                  title="Total Inscritos"
                  value={data?.totalRegister.toLocaleString() ?? "—"}
                  icon={PeopleIcon}
                  trend={data?.inscritosNoMatriculados.toLocaleString() ?? "—"}
                  trendLabel="% no matriculados"
                />
              </a>
            </Link>
          </div>

          {/* Segundo Card - Total Matriculados */}
          <div className="col-span-1 h-full rounded-3xl">
            <Link
              className="h-full"
              href="/admin/matriculas/verMatriculas"
              legacyBehavior
            >
              <a className="block h-full rounded-3xl no-underline">
                <StatsCard
                  title="Total Matriculados"
                  value={data?.totalEnrollments.toLocaleString() ?? "—"}
                  icon={PeopleIcon}
                  trend={data?.inscritosMatriculados.toLocaleString() ?? "—"}
                  trendLabel="% de los inscritos se ha matriculado"
                />
              </a>
            </Link>
          </div>

          {/* Tercer Card - Módulos Activos */}
          <div className="col-span-1 h-full rounded-3xl">
            <Link
              className="h-full"
              href="/admin/cursos/verCursos"
              legacyBehavior
            >
              <a className="block h-full rounded-3xl no-underline">
                <StatsCard
                  title="Módulos Activos"
                  value={data?.activeModules.toString() ?? "—"}
                  icon={MenuBookIcon}
                  description="En diferentes áreas"
                />
              </a>
            </Link>
          </div>

          {/* Profesores */}
          <div className="col-span-1 h-full rounded-3xl">
            <StatsCard
              title="Profesores"
              value={data?.totalProfessors.toString() ?? "—"}
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Monitores Académicos */}
          <div className="col-span-1 h-full rounded-3xl">
            <StatsCard
              title="Monitores Académicos"
              value={data?.totalMonitors.toString() ?? "—"}
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Grupos Activos */}
          <div className="col-span-1 h-full rounded-3xl">
            <StatsCard
              title="Grupos Activos"
              value={data?.activeModules.toString() ?? "—"}
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Módulo Más Popular */}
          <div className="col-span-2 h-full rounded-3xl lg:col-span-1">
            <StatsCard
              title="Módulo Más Popular"
              value={data?.enrollmentsByModule?.[0]?.name ?? "—"}
              icon={TrendingUpIcon}
              description={`${data?.enrollmentsByModule?.[0]?.enrollments ?? 0} estudiantes`}
              compact
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="e rounded-2xl border">
          <div className="flex rounded-t-2xl bg-white">
            {[
              "Información de Matriculados",
              "Información geográfica estudiantes",
              "Módulos",
            ].map((label, index) => (
              <button
                key={index}
                onClick={() =>
                  handleTabChange({} as React.SyntheticEvent, index)
                }
                className={`text-md px-4 py-3 font-medium transition-colors ${
                  tabValue === index
                    ? "border-b-2 border-red-700 text-red-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-transparent">
            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Matriculas totales por Módulo y Género
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Distribución de estudiantes matriculados en cada módulo,
                      segmentado por género.
                    </p>
                    <ModuleGenderChart
                      data={data?.enrollmentsByModuleAndGender ?? []}
                    />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Matriculados por Módulo
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Número de estudiantes por módulo
                    </p>
                    <EnrollmentChart data={data?.enrollmentsByModule ?? []} />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Segmentación por Estamento
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Estudiantes matriculados por estamento del colegio
                    </p>
                    <EstamentoSegmentation
                      data={data?.enrollmentsByEstamento ?? []}
                    />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Distribución por Grado
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Estudiantes matriculados por nivel educativo
                    </p>
                    <ModuleDistribution data={data?.enrollmentsByGrade ?? []} />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Distribución por Estrato Socioeconómico
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Estudiantes matriculados por estrato Socioeconómico.
                    </p>
                    <EstratoSocioeconomicoDistributionInterno
                      data={data?.estratoDistribution ?? []}
                    />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Distribución por Tipo de Vinculación
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Base: {data?.totalEnrollments ?? 0} estudiantes.
                    </p>
                    <VinculacionDistributionInterno
                      data={data?.vinculacionDistribution ?? []}
                    />
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Procedencia por Municipio
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Base: {data?.totalEnrollments ?? 0} estudiantes (Mayoría
                      Valle del Cauca).
                    </p>
                    <MunicipioDistributionInterno
                      data={data?.municipioDistribution ?? []}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Non-Enrolled Students Tab */}
            <TabPanel value={tabValue} index={5}>
              <p className="text-gray-900">
                Información de estudiantes inscritos no matriculados
              </p>
            </TabPanel>

            {/* Geographic Tab */}
            <TabPanel value={tabValue} index={1}>
              <div className="mb-4 grid grid-cols-1 justify-center gap-4">
                <div className="col-span-1">
                  <ColombiaMapWithNoSSR geojsonDataUrl={COLOMBIA_GEOJSON_URL} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="col-span-1">
                  <div className="rounded border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Demografía de Estudiantes
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Distribución por género (estudiantes)
                    </p>
                    <DemographicsOverview
                      genderData={data?.genderDistribution ?? []}
                    />
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2">
                  <div className="rounded border border-gray-300 bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      Distribución por Estamento
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Colegios públicos vs. privados
                    </p>
                    <div className="flex flex-col gap-3">
                      {(data?.enrollmentsByEstamento ?? []).map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <SchoolIcon
                                  sx={{ fontSize: 20, color: "#999" }}
                                />
                                <p className="font-semibold text-gray-900">
                                  {item.estamento}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.count} ({item.percentage}%)
                              </p>
                            </div>
                            <div className="h-2 overflow-hidden rounded bg-gray-300">
                              <div
                                className="h-full rounded bg-red-700 transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Modules Tab */}
            <TabPanel value={tabValue} index={2}>
              <div className="rounded border border-gray-300 bg-white p-6">
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  Análisis de Módulos
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Rendimiento y popularidad de cada módulo
                </p>
                <div className="flex flex-col gap-3">
                  {(data.enrollmentsByModule ?? []).map(
                    (module: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {module.name}
                          </p>
                          <p className="text-sm text-gray-600">{module.area}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-700">
                            {module.enrollments}
                          </p>
                          <p className="text-xs text-gray-600">estudiantes</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
