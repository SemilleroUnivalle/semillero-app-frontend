"use client"

import { Paper, Box, Typography } from "@mui/material"
import type { SvgIconComponent } from "@mui/icons-material"

interface StatsCardProps {
  title: string
  value: string
  icon: SvgIconComponent
  trend?: string
  trendLabel?: string
  description?: string
  variant?: "default" | "warning"
  compact?: boolean
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  variant = "default",
  compact = false,
}: StatsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #d0d0d0",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box flex={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
            {title}
          </Typography>
          <Typography
            variant={compact ? "h5" : "h4"}
            fontWeight="bold"
            color="text.primary"
            sx={{ mb: description || trend ? 1 : 0 }}
          >
            {value}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {trend && (
            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
              <Typography variant="body2" fontWeight="600" color="#c20e1a">
                {trend}
              </Typography>
              {trendLabel && (
                <Typography variant="caption" color="text.secondary">
                  {trendLabel}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: variant === "warning" ? "#fff3e0" : "rgba(194, 14, 26, 0.1)",
          }}
        >
          <Icon
            sx={{
              fontSize: 28,
              color: variant === "warning" ? "#f57c00" : "#c20e1a",
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}
