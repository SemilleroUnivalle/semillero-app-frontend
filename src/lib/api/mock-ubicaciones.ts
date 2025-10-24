// src/lib/api/mock-ubicaciones.ts
import { UbicacionData } from "./ubicacion"

// Coordenadas aproximadas para Cali:
// - Cali Centro/Oeste: Latitud 3.4474, Longitud -76.5186
// - Cali Sur: Latitud 3.4079, Longitud -76.5372

export const MOCK_UBICACIONES: UbicacionData[] = [
    // Entradas fuera de Cali
    {
        "id": 1,
        "nombre_completo": "Maria Cardenas",
        "direccion_texto": "Calle 21 #31-55, 1, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 2,
        "nombre_completo": "Camila Navarro",
        "direccion_texto": "Calle 10 #1-59, 13, Candelaria, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 3,
        "nombre_completo": "Mateo Muñoz",
        "direccion_texto": "Calle 3 #38-35, 3, Buga, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 4,
        "nombre_completo": "Mateo Ramirez",
        "direccion_texto": "Calle 17 #13-31, 8, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 5,
        "nombre_completo": "Esteban Cardenas",
        "direccion_texto": "Calle 25 #49-56, 10, Jamundi, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 6,
        "nombre_completo": "Laura Torres",
        "direccion_texto": "Calle 11 #18-53, 5, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 7,
        "nombre_completo": "Valeria Perez",
        "direccion_texto": "Calle 15 #18-69, 12, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 8,
        "nombre_completo": "Maria Suarez",
        "direccion_texto": "Calle 12 #9-88, 10, Buga, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 9,
        "nombre_completo": "Sofia Vargas",
        "direccion_texto": "Calle 28 #30-23, 5, Buga, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 10,
        "nombre_completo": "Luisa Rodriguez",
        "direccion_texto": "Calle 8 #13-12, 1, Candelaria, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 11,
        "nombre_completo": "Carlos Ramirez",
        "direccion_texto": "Calle 16 #2-14, 4, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 12,
        "nombre_completo": "Juan Suarez",
        "direccion_texto": "Calle 2 #31-93, 8, Yumbo, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 13,
        "nombre_completo": "Mateo Navarro",
        "direccion_texto": "Calle 12 #16-80, 10, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 14,
        "nombre_completo": "Felipe Vargas",
        "direccion_texto": "Calle 16 #21-2, 8, Palmira, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },
    {
        "id": 15,
        "nombre_completo": "Pedro Jimenez",
        "direccion_texto": "Calle 26 #34-28, 1, Tuluá, Valle del cauca",
        "latitud": null,
        "longitud": null,
        "encontrado": false
    },

    // Entradas en Cali con coordenadas reales/aproximadas (ID ÚNICOS)
    {
        "id": 16,
        "nombre_completo": "Laura Perez",
        "direccion_texto": "Calle 28 #8-11, 4, Cali, Valle del cauca",
        "latitud": 3.4609067,
        "longitud": -76.5192489,
        "encontrado": true
    },
    {
        "id": 17,
        "nombre_completo": "Andrea Torres",
        "direccion_texto": "Calle 2 #37-91, 7, Cali, Valle del cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 18,
        "nombre_completo": "Esteban Rodriguez",
        "direccion_texto": "Calle 4 #6-96, 12, Cali, Valle del cauca",
        "latitud": 3.4025176,
        "longitud": -76.4702283,
        "encontrado": true
    },
    {
        "id": 19,
        "nombre_completo": "Juan Navarro",
        "direccion_texto": "Calle 10 #16-78, 12, Cali, Valle del cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 20,
        "nombre_completo": "Carlos Moreno",
        "direccion_texto": "Calle 5 #42-42, 12, Cali, Valle del cauca",
        "latitud": 3.4388622,
        "longitud": -76.5030164,
        "encontrado": true
    },
    {
        "id": 21,
        "nombre_completo": "Santiago Moreno",
        "direccion_texto": "Avenida 60C # 9 - 68, 17, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 22,
        "nombre_completo": "Maria Gomez",
        "direccion_texto": "Avenida 17C bis # 53 - 88, 21, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 23,
        "nombre_completo": "Mateo Suarez",
        "direccion_texto": "Calle 34A # 47 - 99, 21, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 24,
        "nombre_completo": "Camila Rodriguez",
        "direccion_texto": "Avenida 96C bis # 42 - 25, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 25,
        "nombre_completo": "Juliana Ramirez",
        "direccion_texto": "Carrera 67C # 3 - 3, 20, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 26,
        "nombre_completo": "Pedro Jimenez",
        "direccion_texto": "Avenida 55A sur # 63 - 37, 21, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 27,
        "nombre_completo": "Laura Moreno",
        "direccion_texto": "Diagonal 68C # 54 - 55, 8, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 28,
        "nombre_completo": "Esteban Moreno",
        "direccion_texto": "Carrera 9B oeste # 65 - 74, 12, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 29,
        "nombre_completo": "Ana Vargas",
        "direccion_texto": "Transversal 41C oeste # 70 - 55, 8, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 30,
        "nombre_completo": "Pedro Torres",
        "direccion_texto": "Diagonal 24C # 91 - 18, 4, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 31,
        "nombre_completo": "Santiago Navarro",
        "direccion_texto": "Transversal 89C oeste # 61 - 50, 11, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 32,
        "nombre_completo": "Ana López",
        "direccion_texto": "Diagonal 66C sur # 86 - 13, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 33,
        "nombre_completo": "Ana Jimenez",
        "direccion_texto": "Calle 23A # 86 - 82, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 34,
        "nombre_completo": "Camila Muñoz",
        "direccion_texto": "Avenida 74A # 10 - 92, 21, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 35,
        "nombre_completo": "Ana Gomez",
        "direccion_texto": "Avenida 53A # 73 - 84, 17, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 36,
        "nombre_completo": "Santiago Vargas",
        "direccion_texto": "Transversal 69 # 16 - 22, 3, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 37,
        "nombre_completo": "Valeria Suarez",
        "direccion_texto": "Calle 49B oeste # 48 - 21, 7, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 38,
        "nombre_completo": "Andrea Ramirez",
        "direccion_texto": "Transversal 85C oeste # 62 - 2, 8, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 39,
        "nombre_completo": "Andrea Torres",
        "direccion_texto": "Diagonal 89B oeste # 69 - 16, 8, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 40,
        "nombre_completo": "Juliana Moreno",
        "direccion_texto": "Transversal 62B oeste # 99 - 52, 17, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 41,
        "nombre_completo": "Valeria Torres",
        "direccion_texto": "Diagonal 61A sur # 93 - 47, 20, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 42,
        "nombre_completo": "Valeria Jimenez",
        "direccion_texto": "Diagonal 40C sur # 3 - 33, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 43,
        "nombre_completo": "Mateo Perez",
        "direccion_texto": "Avenida 32B sur # 44 - 90, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 44,
        "nombre_completo": "Maria Moreno",
        "direccion_texto": "Transversal 60C sur # 97 - 11, 1, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 45,
        "nombre_completo": "Andrea Cardenas",
        "direccion_texto": "Transversal 19 oeste # 76 - 50, 1, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 46,
        "nombre_completo": "Mateo Moreno",
        "direccion_texto": "Carrera 77B oeste # 85 - 74, 5, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 47,
        "nombre_completo": "Pedro Perez",
        "direccion_texto": "Diagonal 65C bis # 96 - 15, 16, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 48,
        "nombre_completo": "Laura Ramirez",
        "direccion_texto": "Carrera 42B oeste # 64 - 67, 4, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 49,
        "nombre_completo": "Camila Moreno",
        "direccion_texto": "Carrera 7A sur # 4 - 76, 21, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 50,
        "nombre_completo": "Luisa Rodriguez",
        "direccion_texto": "Calle 95B sur # 76 - 53, 9, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 51,
        "nombre_completo": "Laura Muñoz",
        "direccion_texto": "Transversal 55B # 29 - 68, 4, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 52,
        "nombre_completo": "Carlos Ramirez",
        "direccion_texto": "Carrera 13A # 52 - 67, 4, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 53,
        "nombre_completo": "Luisa Moreno",
        "direccion_texto": "Avenida 11 oeste # 24 - 44, 16, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 54,
        "nombre_completo": "Luisa Torres",
        "direccion_texto": "Calle 88A # 78 - 24, 17, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 55,
        "nombre_completo": "Juan Moreno",
        "direccion_texto": "Calle 6A oeste # 52 - 16, 1, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 56,
        "nombre_completo": "Esteban Navarro",
        "direccion_texto": "Diagonal 64B # 89 - 92, 8, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 57,
        "nombre_completo": "Sofia Gomez",
        "direccion_texto": "Calle 66C # 51 - 38, 20, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 58,
        "nombre_completo": "Santiago Moreno",
        "direccion_texto": "Transversal 74A bis # 34 - 4, 5, Cali, Valle del Cauca",
        "latitud": 3.4474, // MODIFICADO
        "longitud": -76.5186, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 59,
        "nombre_completo": "Esteban Navarro",
        "direccion_texto": "Carrera 36B bis # 99 - 28, 16, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 60,
        "nombre_completo": "Mateo Castaño",
        "direccion_texto": "Transversal 85 sur # 5 - 18, 22, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 61,
        "nombre_completo": "Pedro Jimenez",
        "direccion_texto": "Calle 92B sur # 92 - 71, 19, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 62,
        "nombre_completo": "Santiago Navarro",
        "direccion_texto": "Carrera 68C sur # 81 - 90, 18, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
    {
        "id": 63,
        "nombre_completo": "Laura Ramirez",
        "direccion_texto": "Calle 45 sur # 77 - 57, 21, Cali, Valle del Cauca",
        "latitud": 3.4079, // MODIFICADO
        "longitud": -76.5372, // MODIFICADO
        "encontrado": true
    },
]