"use client"

import { Box, Typography } from "@mui/material"
import { CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon, Cancel as CancelIcon } from "@mui/icons-material"

interface VerificationData {
  verified: number
  pending: number
  rejected: number
}

interface VerificationStatusProps {
  data: VerificationData
}

export function VerificationStatus({ data }: VerificationStatusProps) {
  const total = data.verified + data.pending + data.rejected

  const items = [
    {
      label: "Verificados",
      count: data.verified,
      percentage: ((data.verified / total) * 100).toFixed(1),
      icon: CheckCircleIcon,
      color: "#4caf50",
      bgColor: "#e8f5e9",
    },
    {
      label: "Pendientes",
      count: data.pending,
      percentage: ((data.pending / total) * 100).toFixed(1),
      icon: ScheduleIcon,
      color: "#ff9800",
      bgColor: "#fff3e0",
    },
    {
      label: "Rechazados",
      count: data.rejected,
      percentage: ((data.rejected / total) * 100).toFixed(1),
      icon: CancelIcon,
      color: "#f44336",
      bgColor: "#ffebee",
    },
  ]

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Box key={index}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: item.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ fontSize: 24, color: item.color }} />
                </Box>
                <Typography variant="body1" fontWeight="500">
                  {item.label}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5" fontWeight="bold">
                  {item.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.percentage}%
                </Typography>
              </Box>
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
                  bgcolor: item.bgColor,
                  borderRadius: 1,
                  transition: "width 0.3s",
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
