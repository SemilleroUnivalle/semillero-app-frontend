"use client"

import { Box, Typography } from "@mui/material"
import { People as PeopleIcon } from "@mui/icons-material"

interface GenderData {
  gender: string
  count: number
}

interface DemographicsOverviewProps {
  genderData: GenderData[]
}

export function DemographicsOverview({ genderData }: DemographicsOverviewProps) {
  const total = genderData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PeopleIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" fontWeight="500" color="text.secondary">
            Distribución por Género
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          {genderData.map((item, index) => {
            const percentage = ((item.count / total) * 100).toFixed(1)
            return (
              <Box key={index}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight="500">
                    {item.gender}
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {item.count} ({percentage}%)
                  </Typography>
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
                      width: `${percentage}%`,
                      bgcolor: "#c20e1a",
                      borderRadius: 1,
                      transition: "width 0.3s",
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
