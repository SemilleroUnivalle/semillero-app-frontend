// src/lib/api/ubicacion.ts
import client from "./client"; 
import { MOCK_UBICACIONES } from "./mock-ubicaciones"; // <-- NUEVA IMPORTACIÓN

// Define la estructura de datos (esto no cambia)
export interface UbicacionData {
  id: number;
  nombre_completo: string;
  direccion_texto: string;
  latitud: number | null; 
  longitud: number | null; 
  encontrado: boolean;
}

// ** MODIFICACIÓN CLAVE **
const USE_MOCK_DATA = true; // <-- Usa esta bandera para activar/desactivar el mock

/**
 * Obtiene las coordenadas geográficas de todos los estudiantes para el mapa.
 */
export async function fetchUbicacionesGeocodificadas(): Promise<UbicacionData[]> {
  if (USE_MOCK_DATA) {
    // 1. Simula la latencia de la red (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 2. Retorna los datos estáticos
    console.log("Usando datos mock de ubicación.");
    return MOCK_UBICACIONES; 
  }

  // CÓDIGO ORIGINAL (sin mock)
  const res = await client.get("/matricula/mat/inscripciones/geocodificacion/"); 
  return res.data as UbicacionData[];
}

export default fetchUbicacionesGeocodificadas;

