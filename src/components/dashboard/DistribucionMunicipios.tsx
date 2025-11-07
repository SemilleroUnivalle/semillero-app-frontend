"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type ApexCharts from "apexcharts"

// 1. Interfaz de datos
interface MunicipioData {
  municipio: string
  count: number
}

// 2. Datos inventados de Municipios (Total: 170 estudiantes)
// Enfocados en el Valle del Cauca
const DATOS_MUNICIPIOS: MunicipioData[] = [
  { municipio: "Cali", count: 50 },
  { municipio: "Palmira", count: 8 },
  { municipio: "Yumbo", count: 4 },
  { municipio: "Buga", count: 2 },
  { municipio: "Tuluá", count: 10 },
  { municipio: "Jamundí", count: 22 },
  { municipio: "Buenaventura", count: 2 },
  { municipio: "Cartago", count: 2 },
];

export function MunicipioDistributionInterno() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const data = DATOS_MUNICIPIOS;

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
        horizontal: true, // Gráfico de barras horizontal
      },
    },
    dataLabels: {
      enabled: true,
    },
    // Color diferente para esta gráfica
    colors: ["#c20e1a"], 
    xaxis: {
      // Usamos el campo 'municipio' para las categorías del eje X
      categories: data.map((item) => item.municipio),
      title: {
        text: "Cantidad de Estudiantes", // Título del eje X (cantidad)
      },
      labels: {
        // ...
      },
    },
    yaxis: {
      title: {
        text: "Municipio de Procedencia", // Título del eje Y (Municipio)
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

  // Ajustamos la altura si tenemos muchas categorías para que no se vea apretado
  const chartHeight = Math.max(300, data.length * 50);

  const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

  if (!isClient) {
    return <Box height={chartHeight} />
  }

  return (
    <Box>
      <ReactApexCharts options={options} series={series} type="bar" height={chartHeight} />
    </Box>
  )
}