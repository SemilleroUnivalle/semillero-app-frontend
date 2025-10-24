// components/mapa-ubicaciones.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// Nota: La importación del archivo de configuración de íconos debe ocurrir 
// en un lugar antes de que MapContainer se monte, por eso se hizo en MapWidget.tsx

interface UbicacionProps {
  data: {
    latitud: number
    longitud: number
    nombre_completo: string
    direccion_texto: string
    id: number
  }[]
}

export default function MapaUbicaciones({ data }: UbicacionProps) {
  if (!data || data.length === 0) return null

  // Usa la primera ubicación como centro inicial
  const firstLocation = data[0]
  const centerPosition: [number, number] = [firstLocation.latitud, firstLocation.longitud]

  return (
    // El contenedor debe tener una altura y ancho definidos
    <MapContainer 
      center={centerPosition} 
      zoom={6} // Zoom inicial a nivel de país/región
      style={{ height: '100%', width: '100%' }} 
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Renderizar marcadores */}
      {data.map((item) => (
        <Marker 
          key={item.id} 
          // Se requiere forzar el tipo a number si el backend lo retorna como null | number
          position={[item.latitud as number, item.longitud as number]}
        >
          <Popup>
            <strong>{item.nombre_completo}</strong>
            <br />
            {item.direccion_texto}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}