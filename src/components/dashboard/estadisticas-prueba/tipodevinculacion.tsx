"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box, Typography } from "@mui/material"
import type ApexCharts from "apexcharts"

// 1. Interfaz de datos
interface VinculacionData {
  type: string
  count: number
}

// 2. Datos inventados de Tipo de Vinculación (Total: 170 estudiantes)
const DATOS_VINCULACION: VinculacionData[] = [
  { type: "Tiempo Completo", count: 70 },
  { type: "Tiempo Parcial", count: 15 },
  { type: "Fin de Semana", count: 15 },
];

interface VinculacionDistributionProps {
  data?: VinculacionData[]
}

export function VinculacionDistributionInterno({ data: externalData }: VinculacionDistributionProps = {}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const data = externalData || DATOS_VINCULACION;

  if (!isClient) {
    return <Box height={300} />
  }

  if (!data || data.length === 0) {
    return (
      <Box height={300} display="flex" alignItems="center" justifyContent="center">
        <Typography color="textSecondary">No hay datos disponibles</Typography>
      </Box>
    )
  }

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
        horizontal: true // Gráfico de barras horizontal
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#c20e1a"], 
    xaxis: {
      // Usamos el campo 'type' para las categorías del eje X
      categories: data.map((item) => item.type),
      title: {
        text: "Cantidad de Estudiantes", // Título del eje X (cantidad)
      },
      labels: {
        // ...
      },
    },
    yaxis: {
      title: {
        text: "Tipo de Vinculación", // Título del eje Y (Tipo)
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
        formatter: (value) => `${value} estudiantes`,
      },
    },
  }

  const series = [
    {
      name: "Estudiantes",
      // Usamos el campo 'count' para los datos de la serie
      data: data.map((item) => item.count),
    },
  ]

  const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

  return (
    <Box>
      <ReactApexCharts options={options} series={series} type="bar" height={300} />
    </Box>
  )
}