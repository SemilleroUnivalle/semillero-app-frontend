"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type ApexCharts from "apexcharts" // Declaración de ApexCharts

// 1. Interfaz de datos
interface EstratoData {
  estrato: string
  count: number
}

// 2. Datos inventados del estrato socioeconómico (170 estudiantes)
// Usamos el mismo formato de datos que antes, pero con nombres de interfaz adaptados
const DATOS_ESTRATO: EstratoData[] = [
  { estrato: "1", count: 50 },
  { estrato: "2", count: 25 },
  { estrato: "3", count: 20 },
  { estrato: "4", count: 5 },
];


export function EstratoSocioeconomicoDistributionInterno() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Usamos los datos internos para configurar la gráfica
  const data = DATOS_ESTRATO;

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
      // Usamos el campo 'estrato' para las categorías del eje X
      categories: data.map((item) => item.estrato),
      title: {
        text: "Cantidad de Estudiantes", // Título del eje X (cantidad)
      },
      labels: {
        // ...
      },
    },
    yaxis: {
      title: {
        text: "Estrato Socioeconómico", // Título del eje Y (Estrato)
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