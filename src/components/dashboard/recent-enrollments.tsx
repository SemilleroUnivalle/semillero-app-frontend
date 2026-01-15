"use client"

import { Box, Paper, Typography, Chip } from "@mui/material"

interface Enrollment {
  id: number
  studentName: string
  module: string
  date: string
  status: string
}

interface RecentEnrollmentsProps {
  data: Enrollment[]
}

export function RecentEnrollments({ data }: RecentEnrollmentsProps) {
  const getStatusColor = (status: string): "success" | "warning" | "default" => {
    switch (status) {
      case "Verificado":
        return "success"
      case "Pendiente":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {data.map((enrollment) => (
        <Paper
          key={enrollment.id}
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
              {enrollment.studentName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {enrollment.module}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {enrollment.date}
            </Typography>
          </Box>
          <Chip label={enrollment.status} color={getStatusColor(enrollment.status)} size="small" />
        </Paper>
      ))}
    </Box>
  )
}
