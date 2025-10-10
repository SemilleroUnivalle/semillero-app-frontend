"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type ApexCharts from "apexcharts" // Declaring ApexCharts variable

interface GradeData {
  grade: string
  count: number
}

interface ModuleDistributionProps {
  data: GradeData[]
}

export function ModuleDistribution({ data }: ModuleDistributionProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#c20e1a"],
    xaxis: {
      categories: data.map((item) => item.grade),
      title: {
        text: "Grado",
        style: {
          fontSize: "12px",
          color: "#6b7280",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
    },
    yaxis: {
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
