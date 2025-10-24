"use client"

import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material"
import { Place as PlaceIcon } from "@mui/icons-material"
import dynamic from 'next/dynamic'

// *** NUEVA IMPORTACIÓN ***
import { 
  fetchUbicacionesGeocodificadas, 
  type UbicacionData 
} from '@/lib/api/ubicacion' // Asegúrate de que la ruta sea correcta

import './leaflet-config' 

const MapaUbicaciones = dynamic(
  () => import('./mapa-ubicaciones'), 
  { 
    ssr: false, 
    // FUNCIÓN DE CARGA CORREGIDA
    loading: () => (
      <Box sx={{ height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ color: "#c20e1a" }} />
        <Typography ml={2}>Cargando mapa...</Typography>
      </Box>
    ),
    // ...
  }
)

export function MapWidget() {
  const [ubicaciones, setUbicaciones] = useState<UbicacionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // *** CAMBIO CLAVE AQUÍ: Usamos la función de fetch dedicada ***
        const data = await fetchUbicacionesGeocodificadas();
        
        // Filtra solo las ubicaciones que sí tienen coordenadas válidas
        const ubicacionesValidas = data.filter((u) => u.encontrado && u.latitud && u.longitud)
        setUbicaciones(ubicacionesValidas)

      } catch (err) {
        console.error("Error al obtener datos de geocodificación:", err)
        setError("Fallo al cargar las coordenadas. Verifique la API y la autenticación.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const totalEstudiantes = ubicaciones.length
  const totalNoEncontrados = ubicaciones.filter(u => !u.encontrado).length

  return (
    <Paper elevation={0} sx={{ p: 1, border: "1px solid #d0d0d0" }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <PlaceIcon sx={{ fontSize: 20, color: "text.secondary" }} />
        <Typography variant="h6" fontWeight="bold">
          Ubicación Geográfica de Estudiantes
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Distribución por residencia ({totalEstudiantes} puntos válidos)
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress size={24} />}
      
      {!loading && !error && (
        <>
          {totalEstudiantes === 0 && (
            <Typography variant="body2" color="text.secondary" p={2}>
              No se encontraron coordenadas válidas para mostrar.
            </Typography>
          )}
          
          {totalEstudiantes > 0 && (
            <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden' }}>
              <MapaUbicaciones data={ubicaciones} />
            </Box>
          )}
          
          {/* Opcional: Mostrar resumen de errores */}
          {/* <Typography variant="caption" color="text.secondary" mt={1}>
            Nota: {totalNoEncontrados} direcciones no pudieron ser geocodificadas.
          </Typography> */}
        </>
      )}
    </Paper>
  )
}