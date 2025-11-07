"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type ApexCharts from "apexcharts"

// 1. Interfaz de datos
interface VinculacionData {
  tipo: string
  count: number
}

// 2. Datos inventados de Tipo de Vinculación (Total: 170 estudiantes)
const DATOS_VINCULACION: VinculacionData[] = [
  { tipo: "Regular", count: 70 },
  { tipo: "Extraescolar", count: 15 },
  { tipo: "Cultural", count: 15 },
];

export function VinculacionDistributionInterno() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const data = DATOS_VINCULACION;

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
      // Usamos el campo 'tipo' para las categorías del eje X
      categories: data.map((item) => item.tipo),
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

  if (!isClient) {
    return <Box height={300} />
  }

  return (
    <Box>
      <ReactApexCharts options={options} series={series} type="bar" height={300} />
    </Box>
  )
}