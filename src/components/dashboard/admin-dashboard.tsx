"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Box, Container, Typography, Grid, Paper, Tabs, Tab, CircularProgress, Alert } from "@mui/material"
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { StatsCard } from "./stats-card"
import { EnrollmentChart } from "./enrollment-chart"
import { ModuleDistribution } from "./module-distribution"
import { EstamentoSegmentation } from "./estamento-segmentation"
import { RecentEnrollments } from "./recent-enrollments"
import { DemographicsOverview } from "./demographics-overview"
import { fetchDashboardData, type DashboardData } from "@/lib/api/dashboard"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#c20e1a", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Cargando datos del dashboard...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !data) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#e8e8e8", p: 4 }}>
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || "No se pudieron cargar los datos del dashboard"}
          </Alert>
        </Container>
      </Box>
    )
  }

  // Protección: puede que enrollmentsByModule sea [] o undefined
  const mostPopularModule = data.enrollmentsByModule?.[0] ?? { name: "—", enrollments: 0 }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e8e8e8" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid #d0d0d0",
          bgcolor: "white",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Panel de Administración
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Actualizado: {new Date().toLocaleDateString("es-ES")}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Key Stats */}
        <Grid container spacing={4} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={4}>
            <StatsCard
              title="Total Matriculados"
              value={data.totalEnrollments.toLocaleString()}
              icon={PeopleIcon}
              trend="+12.5%"
              trendLabel="vs. mes anterior"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <StatsCard
              title="Módulos Activos"
              value={data.activeModules.toString()}
              icon={MenuBookIcon}
              description="En diferentes áreas"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <StatsCard
              title="Módulo Más Popular"
              value={mostPopularModule.name}
              icon={TrendingUpIcon}
              description={`${mostPopularModule.enrollments} estudiantes`}
              compact
            />
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper elevation={0} sx={{ border: "1px solid #d0d0d0" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: "1px solid #d0d0d0",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
              },
              "& .Mui-selected": {
                color: "#c20e1a",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#c20e1a",
              },
            }}
          >
            <Tab label="Resumen General" />
            <Tab label="Módulos" />
            <Tab label="Estudiantes" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Matriculados por Módulo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Top 6 módulos con mayor inscripción
                    </Typography>
                    <EnrollmentChart data={data.enrollmentsByModule ?? []} />
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Segmentación por Estamento
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Distribución público vs. privado
                    </Typography>
                    <EstamentoSegmentation data={data.enrollmentsByEstamento ?? []} />
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={8}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Distribución por Grado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Estudiantes matriculados por nivel educativo
                    </Typography>
                    <ModuleDistribution data={data.enrollmentsByGrade ?? []} />
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Demografía de Estudiantes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Distribución por género
                    </Typography>
                    <DemographicsOverview genderData={data.genderDistribution ?? []} />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Modules Tab */}
            <TabPanel value={tabValue} index={1}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Análisis de Módulos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Rendimiento y popularidad de cada módulo
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {(data.enrollmentsByModule ?? []).map((module, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: "1px solid #d0d0d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                    >
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {module.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {module.area}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h5" fontWeight="bold" color="#c20e1a">
                          {module.enrollments}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          estudiantes
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </TabPanel>

            {/* Students Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Inscripciones Recientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Últimas matriculaciones registradas
                    </Typography>
                    <RecentEnrollments data={data.recentEnrollments ?? []} />
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 3, border: "1px solid #d0d0d0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Distribución por Estamento
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Colegios públicos vs. privados
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {(data.enrollmentsByEstamento ?? []).map((item, index) => (
                        <Box key={index}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <SchoolIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                              <Typography variant="body1" fontWeight="500">
                                {item.estamento}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="600">
                              {item.count} ({item.percentage}%)
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#e0e0e0",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${item.percentage}%`,
                                bgcolor: "#c20e1a",
                                borderRadius: 1,
                                transition: "width 0.3s",
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
