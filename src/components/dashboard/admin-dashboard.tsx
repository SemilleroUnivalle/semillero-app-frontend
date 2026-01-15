"use client"

import React from "react"
import { useState, useEffect } from "react"
import { CircularProgress } from "@mui/material"
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { StatsCard } from "./stats-card"
import { EnrollmentChart } from "./enrollment-chart"
import { ModuleGenderChart } from "./module-gender-chart"
import { ModuleDistribution } from "./module-distribution"
import { EstamentoSegmentation } from "./estamento-segmentation"
import { DemographicsOverview } from "./demographics-overview"
import { EstratoSocioeconomicoDistributionInterno } from './estrato_socioeconomico';
import { VinculacionDistributionInterno } from './tipodevinculacion';
import { MunicipioDistributionInterno } from './DistribucionMunicipios';
import { fetchDashboardData, type DashboardData } from "@/lib/api/dashboard"
import Link from 'next/link'
import dynamic from 'next/dynamic';

const COLOMBIA_GEOJSON_URL = '/colombia.json';

const ColombiaMapWithNoSSR = dynamic(
  () => import('./ColombiaMap'),
  { 
    ssr: false
  } 
);

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props
  return (
    <div role="tabpanel" hidden={value !== index} className={value === index ? "py-3" : ""}>
      {value === index && <div className="py-3">{children}</div>}
    </div>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)
        const dashboardData = await fetchDashboardData()
        setData(dashboardData)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setError("Error al cargar los datos del dashboard. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress sx={{ color: "#c20e1a", mb: 2 }} />
          <p className="text-gray-600 mt-4">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error || "No se pudieron cargar los datos del dashboard"}
          </div>
        </div>
      </div>
    )
  }

  const mostPopularModule = data.enrollmentsByModule?.[0] ?? { name: "—", enrollments: 0 }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto py-3 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon sx={{ fontSize: 16, color: "#999" }} />
              <p className="text-sm text-gray-600">
                Actualizado: {new Date().toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-1 px-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 mb-4">
          {/* Primer Card - Total Inscritos */}
          <div className="col-span-1">
            <Link href="/admin/registros/verRegistros" legacyBehavior>
              <a className="block no-underline">
                <StatsCard
                  title="Total Inscritos"
                  value={data.totalRegister.toLocaleString()}
                  icon={PeopleIcon}
                  trend={data.inscritosNoMatriculados.toLocaleString()}
                  trendLabel="% no matriculados"
                />
              </a>
            </Link>
          </div>

          {/* Segundo Card - Total Matriculados */}
          <div className="col-span-1">
            <Link href="/admin/matriculas/verMatriculas" legacyBehavior>
              <a className="block no-underline">
                <StatsCard
                  title="Total Matriculados"
                  value={data.totalEnrollments.toLocaleString()}
                  icon={PeopleIcon}
                  trend={data.inscritosMatriculados.toLocaleString()}
                  trendLabel="% de los inscritos se ha matriculado"
                />
              </a>
            </Link>
          </div>

          {/* Tercer Card - Módulos Activos */}
          <div className="col-span-1">
            <Link href="/admin/cursos/verCursos" legacyBehavior>
              <a className="block no-underline">
                <StatsCard
                  title="Módulos Activos"
                  value={data.activeModules.toString()}
                  icon={MenuBookIcon}
                  description="En diferentes áreas"
                />
              </a>
            </Link>
          </div>

          {/* Profesores */}
          <div className="col-span-1">
            <StatsCard
              title="Profesores"
              value={data.totalProfessors.toString()}
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Monitores Académicos */}
          <div className="col-span-1">
            <StatsCard
              title="Monitores Académicos"
              value={data.totalMonitors.toString()}
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Grupos Activos */}
          <div className="col-span-1">
            <StatsCard
              title="Grupos Activos"
              value="9"
              icon={PeopleIcon}
              description="En diferentes modulos"
              compact
            />
          </div>

          {/* Módulo Más Popular */}
          <div className="col-span-2 lg:col-span-1">
            <StatsCard
              title="Módulo Más Popular"
              value={mostPopularModule.name}
              icon={TrendingUpIcon}
              description={`${mostPopularModule.enrollments} estudiantes`}
              compact
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 flex">
            {["Información de Matriculados", "Información de Inscritos no Matriculados", "Información geográfica estudiantes", "Módulos"].map((label, index) => (
              <button
                key={index}
                onClick={() => handleTabChange({} as React.SyntheticEvent, index)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  tabValue === index
                    ? "text-red-700 border-b-2 border-red-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded mb-6">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Matriculas totales por Módulo y Género
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Distribución de estudiantes matriculados en cada módulo, segmentado por género.
                    </p>
                    <ModuleGenderChart data={data?.enrollmentsByModuleAndGender ?? []} />
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Matriculados por Módulo
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Número de estudiantes por módulo
                    </p>
                    <EnrollmentChart data={data.enrollmentsByModule ?? []} />
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Segmentación por Estamento
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Estudiantes matriculados por estamento del colegio
                    </p>
                    <EstamentoSegmentation data={data.enrollmentsByEstamento ?? []} />
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Distribución por Grado
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Estudiantes matriculados por nivel educativo
                    </p>
                    <ModuleDistribution data={data.enrollmentsByGrade ?? []} />
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Distribución por Estrato Socioeconómico
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Estudiantes matriculados por estrato Socioeconómico.
                    </p>
                    <EstratoSocioeconomicoDistributionInterno /> 
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Distribución por Tipo de Vinculación
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Base: 170 estudiantes. Datos simulados.
                    </p>
                    <VinculacionDistributionInterno /> 
                  </div>
                </div>

                <div>
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Procedencia por Municipio
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Base: 170 estudiantes (Mayoría Valle del Cauca).
                    </p>
                    <MunicipioDistributionInterno />
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Non-Enrolled Students Tab */}
            <TabPanel value={tabValue} index={1}>
              <p className="text-gray-900">
                Información de estudiantes inscritos no matriculados
              </p>
            </TabPanel>

            {/* Geographic Tab */}
            <TabPanel value={tabValue} index={2}>
              <div className="grid grid-cols-1 gap-4 justify-center mb-4">
                <div className="col-span-1">
                  <ColombiaMapWithNoSSR geojsonDataUrl={COLOMBIA_GEOJSON_URL} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="col-span-1">
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Demografía de Estudiantes
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Distribución por género (estudiantes)
                    </p>
                    <DemographicsOverview genderData={data.genderDistribution ?? []} />
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2">
                  <div className="bg-white p-6 border border-gray-300 rounded">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      Distribución por Estamento
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Colegios públicos vs. privados
                    </p>
                    <div className="flex flex-col gap-3">
                      {(data.enrollmentsByEstamento ?? []).map((item, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <SchoolIcon sx={{ fontSize: 20, color: "#999" }} />
                              <p className="font-semibold text-gray-900">
                                {item.estamento}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.count} ({item.percentage}%)
                            </p>
                          </div>
                          <div className="h-2 bg-gray-300 rounded overflow-hidden">
                            <div
                              className="h-full bg-red-700 rounded transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Modules Tab */}
            <TabPanel value={tabValue} index={3}>
              <div className="bg-white p-6 border border-gray-300 rounded">
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Análisis de Módulos
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Rendimiento y popularidad de cada módulo
                </p>
                <div className="flex flex-col gap-3">
                  {(data.enrollmentsByModule ?? []).map((module, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 border border-gray-300 rounded flex items-center justify-between transition-colors hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {module.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {module.area}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-700">
                          {module.enrollments}
                        </p>
                        <p className="text-xs text-gray-600">
                          estudiantes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  )
}