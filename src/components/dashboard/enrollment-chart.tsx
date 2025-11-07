"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type { ApexOptions } from "apexcharts"

interface EnrollmentData {
  name: string
  enrollments: number
  area: string
}

interface EnrollmentChartProps {
  data: EnrollmentData[]
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        columnWidth: "60%",
        horizontal:true
      },
    },
    dataLabels: {
      enabled: true, 
            formatter: (val) => val.toString(),
            style: {
                colors: ['white']
            }
    },
    colors: ["#c20e1a"],
    xaxis: {
      categories: data.map((item) => item.name),
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
      title: {
                text: 'Matriculados',
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
  }

  const series = [
    {
      name: "Inscripciones",
      data: data.map((item) => item.enrollments),
    },
  ]

  if (!isClient) {
    return <Box height={350} />
  }

  return (
    <Box>
      <ReactApexCharts options={options} series={series} type="bar" height={350} />
    </Box>
  )
}
