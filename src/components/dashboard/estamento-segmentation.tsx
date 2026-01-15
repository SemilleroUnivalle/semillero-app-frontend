"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import type ApexCharts from "apexcharts"

interface EstamentoData {
  estamento: string
  count: number
  percentage: number
}

interface EstamentoSegmentationProps {
  data: EstamentoData[]
}

export function EstamentoSegmentation({ data }: EstamentoSegmentationProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: data.map((item) => item.estamento),
    colors: ["#c20e1a", "#757575"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} estudiantes`,
      },
    },
  }

  const series = data.map((item) => item.count)

  if (!isClient) {
    return <Box height={300} />
  }

  return (
    <Box>
      <ReactApexCharts options={options} series={series} type="pie" height={300} />
    </Box>
  )
}
