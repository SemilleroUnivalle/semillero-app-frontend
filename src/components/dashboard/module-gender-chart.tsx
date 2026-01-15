"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box, Typography, Grid } from "@mui/material"
import type { ApexOptions } from "apexcharts"
// Asegúrate de que esta ruta sea correcta para tus interfaces
import { ModuleGenderEnrollment } from "@/lib/api/dashboard" 

interface ModuleGenderChartProps {
  data: ModuleGenderEnrollment[]
}

const GENDER_COLORS: { [key: string]: string } = {
  Femenino: "#c20e1a", // Rojo oscuro para Femenino
  Masculino: "#1a5bc2", // Azul para Masculino
}

/**
 * Función que transforma la data del backend para un solo género.
 * Devuelve las categorías (nombres de módulo) y los datos de conteo.
 */
function prepareSingleGenderData(data: ModuleGenderEnrollment[], targetGender: string): { series: { name: string; data: number[] }[]; categories: string[]; totalCount: number } {
  if (!data.length) {
    return { series: [], categories: [], totalCount: 0 }
  }

  // 1. Obtener categorías (Nombres de Módulos)
  const categories = data.map((item) => item.moduleName).reverse() // Invertir para que el orden se vea bien en barras horizontales

  // 2. Crear los datos de conteo para el género objetivo
  const genderData: number[] = data.map((item) => {
    // Devuelve el conteo para el género objetivo, o 0 si no existe
    return item.genderBreakdown[targetGender] || 0
  }).reverse() // Invertir también la data

  const totalCount = genderData.reduce((sum, count) => sum + count, 0);

  const series = [{
    name: targetGender,
    data: genderData,
  }]

  return { series, categories, totalCount }
}

// Componente reutilizable para un solo gráfico de género
interface SingleChartProps {
    title: string;
    series: ApexAxisChartSeries | undefined;
    categories: string[];
    color: string;
    totalCount: number;
}

const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

function SingleGenderBarChart({ title, series, categories, color, totalCount }: SingleChartProps) {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true, // CLAVE: Gráfico de barras horizontal
                borderRadius: 4,
                barHeight: "60%",
            },
        },
        dataLabels: {
            enabled: true, 
            formatter: (val) => val.toString(),
            style: {
                colors: ['white']
            }
        },
        colors: [color],
        xaxis: {
            categories: categories,
            title: {
                text: 'Matriculados',
            },
            labels: {
                style: {
                    fontSize: "12px",
                    colors: "#6b7280",
                },
            },
        },
        yaxis: {
            title: {
                text: 'Módulos',
            },
            labels: {
                style: {
                    fontSize: "12px",
                    colors: "#6b7280",
                },
            },
        },
        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 3,
        },
        tooltip: {
            theme: "light",
            y: {
                formatter: (value) => `${value} inscripciones`,
            },
        },
        title: {
            text: `${title} (Total: ${totalCount})`,
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        }
    }

    // El control de isClient debe estar en el componente padre o se repite aquí
    return (
        <Box>
            <ReactApexCharts options={options} series={series} type="bar" height={400} />
        </Box>
    )
}


export function ModuleGenderChart({ data }: ModuleGenderChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return <Box height={450} />
  }

  // Prepara la data para cada género
  const femeninoData = prepareSingleGenderData(data, "Femenino");
  const masculinoData = prepareSingleGenderData(data, "Masculino");
  
  const hasData = femeninoData.totalCount > 0 || masculinoData.totalCount > 0;
  
  if (!hasData) {
      return <Typography variant="body1" color="text.secondary">No hay datos de inscripción por género disponibles.</Typography>
  }

   return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gráfico para Mujeres */}
      <div>
          <SingleGenderBarChart
              title="Femenino"
              series={femeninoData.series}
              categories={femeninoData.categories}
              color={GENDER_COLORS.Femenino}
              totalCount={femeninoData.totalCount}
          />
      </div>
      
      {/* Gráfico para Hombres */}
      <div>
          <SingleGenderBarChart
              title="Masculino"
              series={masculinoData.series}
              categories={masculinoData.categories}
              color={GENDER_COLORS.Masculino}
              totalCount={masculinoData.totalCount}
          />
      </div>
    </div>
  )
}