"use client";

import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos simulados - Múltiples Pruebas
const mockPruebas = [
  {
    id: "prueba_1",
    nombre: "Prueba Diagnóstica - Matemáticas Básicas",
    curso: "Cálculo Diferencial",
    fecha: "2024-06-10",
    activa: true,
  },
  {
    id: "prueba_2",
    nombre: "Prueba Diagnóstica - Álgebra Lineal",
    curso: "Álgebra Lineal",
    fecha: "2024-06-11",
    activa: true,
  },
  {
    id: "prueba_3",
    nombre: "Prueba Diagnóstica - Geometría",
    curso: "Geometría Analítica",
    fecha: "2024-06-12",
    activa: false,
  },
];

// Datos simulados por prueba
const mockDatosPorPrueba: {
  [key: string]: {
    estudiantes: Array<{
      id: number;
      nombre: string;
      puntaje: number;
      clasificacion: string;
      presentada: boolean;
    }>;
    preguntasAciertos: Array<{ pregunta: string; aciertos: number }>;
  };
} = {
  prueba_1: {
    estudiantes: [
      {
        id: 1,
        nombre: "Ana García",
        puntaje: 95,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 2,
        nombre: "Carlos López",
        puntaje: 82,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 3,
        nombre: "María Rodríguez",
        puntaje: 45,
        clasificacion: "No Apto",
        presentada: true,
      },
      {
        id: 4,
        nombre: "Juan Pérez",
        puntaje: 74,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 5,
        nombre: "Laura Martínez",
        puntaje: 88,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 6,
        nombre: "Pedro Sánchez",
        puntaje: 35,
        clasificacion: "No Apto",
        presentada: true,
      },
      {
        id: 7,
        nombre: "Sofía Torres",
        puntaje: 92,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 8,
        nombre: "Diego Ruiz",
        puntaje: 65,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 9,
        nombre: "Emma Vargas",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
      {
        id: 10,
        nombre: "Felipe Mora",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
    ],
    preguntasAciertos: [
      { pregunta: "P1: Derivadas básicas", aciertos: 85 },
      { pregunta: "P2: Integrales indefinidas", aciertos: 72 },
      { pregunta: "P3: Límites", aciertos: 68 },
      { pregunta: "P4: Continuidad", aciertos: 78 },
      { pregunta: "P5: Optimización", aciertos: 55 },
      { pregunta: "P6: Series", aciertos: 62 },
    ],
  },
  prueba_2: {
    estudiantes: [
      {
        id: 1,
        nombre: "Ana García",
        puntaje: 88,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 2,
        nombre: "Carlos López",
        puntaje: 72,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 3,
        nombre: "María Rodríguez",
        puntaje: 52,
        clasificacion: "No Apto",
        presentada: true,
      },
      {
        id: 4,
        nombre: "Juan Pérez",
        puntaje: 68,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 5,
        nombre: "Laura Martínez",
        puntaje: 91,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 6,
        nombre: "Pedro Sánchez",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
      {
        id: 7,
        nombre: "Sofía Torres",
        puntaje: 85,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 8,
        nombre: "Diego Ruiz",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
      {
        id: 9,
        nombre: "Emma Vargas",
        puntaje: 75,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 10,
        nombre: "Felipe Mora",
        puntaje: 58,
        clasificacion: "No Apto",
        presentada: true,
      },
    ],
    preguntasAciertos: [
      { pregunta: "P1: Matrices", aciertos: 78 },
      { pregunta: "P2: Determinantes", aciertos: 65 },
      { pregunta: "P3: Sistemas lineales", aciertos: 82 },
      { pregunta: "P4: Vectores", aciertos: 70 },
      { pregunta: "P5: Espacios vectoriales", aciertos: 48 },
      { pregunta: "P6: Eigenvalores", aciertos: 55 },
    ],
  },
  prueba_3: {
    estudiantes: [
      {
        id: 1,
        nombre: "Ana García",
        puntaje: 98,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 2,
        nombre: "Carlos López",
        puntaje: 76,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 3,
        nombre: "María Rodríguez",
        puntaje: 48,
        clasificacion: "No Apto",
        presentada: true,
      },
      {
        id: 4,
        nombre: "Juan Pérez",
        puntaje: 70,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 5,
        nombre: "Laura Martínez",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
      {
        id: 6,
        nombre: "Pedro Sánchez",
        puntaje: 42,
        clasificacion: "No Apto",
        presentada: true,
      },
      {
        id: 7,
        nombre: "Sofía Torres",
        puntaje: 89,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
      {
        id: 8,
        nombre: "Diego Ruiz",
        puntaje: 77,
        clasificacion: "Apto-Curso Base",
        presentada: true,
      },
      {
        id: 9,
        nombre: "Emma Vargas",
        puntaje: 0,
        clasificacion: "Sin presentar",
        presentada: false,
      },
      {
        id: 10,
        nombre: "Felipe Mora",
        puntaje: 94,
        clasificacion: "Apto-Avanzado",
        presentada: true,
      },
    ],
    preguntasAciertos: [
      { pregunta: "P1: Coordenadas", aciertos: 88 },
      { pregunta: "P2: Rectas", aciertos: 80 },
      { pregunta: "P3: Cónicas", aciertos: 72 },
      { pregunta: "P4: Distancias", aciertos: 75 },
      { pregunta: "P5: Ángulos", aciertos: 68 },
      { pregunta: "P6: Transformaciones", aciertos: 70 },
    ],
  },
};

export default function EstadisticasPruebasDiagnosticas() {
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState("prueba_1");

  const prueba = mockPruebas.find((p) => p.id === pruebaSeleccionada);
  const datosPrueba = mockDatosPorPrueba[pruebaSeleccionada];

  const mockEstudiantes = datosPrueba?.estudiantes || [];
  const mockPreguntasAciertos = datosPrueba?.preguntasAciertos || [];

  // Cálculos basados en mocks
  const pruebaspresentadas = mockEstudiantes.filter((e) => e.presentada).length;
  const pruebaspendientes = mockEstudiantes.filter((e) => !e.presentada).length;

  const clasificacionDistribucion = [
    {
      name: "Apto-Avanzado",
      value: mockEstudiantes.filter((e) => e.clasificacion === "Apto-Avanzado")
        .length,
      color: "#22c55e",
    },
    {
      name: "Apto-Curso Base",
      value: mockEstudiantes.filter(
        (e) => e.clasificacion === "Apto-Curso Base",
      ).length,
      color: "#3b82f6",
    },
    {
      name: "No Apto",
      value: mockEstudiantes.filter((e) => e.clasificacion === "No Apto")
        .length,
      color: "#ef4444",
    },
    {
      name: "Sin presentar",
      value: mockEstudiantes.filter((e) => e.clasificacion === "Sin presentar")
        .length,
      color: "#94a3b8",
    },
  ].filter((d) => d.value > 0);

  const getClasificacionColor = (clasificacion: string) => {
    switch (clasificacion) {
      case "Apto-Avanzado":
        return "success";
      case "Apto-Curso Base":
        return "primary";
      case "No Apto":
        return "error";
      case "Sin presentar":
        return "default";
      default:
        return "default";
    }
  };

  const getClasificacionBgColor = (clasificacion: string) => {
    switch (clasificacion) {
      case "Apto-Avanzado":
        return "#dcfce7";
      case "Apto-Curso Base":
        return "#dbeafe";
      case "No Apto":
        return "#fee2e2";
      case "Sin presentar":
        return "#f1f5f9";
      default:
        return "#f5f5f5";
    }
  };

  return (
    <Box className="mx-auto w-11/12 pb-8">
      {/* Encabezado */}
      <Paper className="mb-6 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
          <div>
            <Typography variant="h5" className="font-bold text-primary">
              {prueba?.nombre || "Estadísticas - Prueba Diagnóstica"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {prueba?.curso} • Análisis del desempeño en la prueba diagnóstica
            </Typography>
          </div>
          <div>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar Prueba</InputLabel>
              <Select
                value={pruebaSeleccionada}
                label="Seleccionar Prueba"
                onChange={(e) => setPruebaSeleccionada(e.target.value)}
              >
                {mockPruebas.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </Paper>

      {/* KPIs / Tarjetas de Resumen */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2", mb: 2 }}>
              <CheckCircleIcon />
            </Avatar>
            <Typography variant="h4" className="font-bold text-gray-800">
              {pruebaspresentadas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pruebas Presentadas
            </Typography>
          </CardContent>
        </Card>
        <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Avatar sx={{ bgcolor: "#fff3e0", color: "#ef6c00", mb: 2 }}>
              <AssignmentIcon />
            </Avatar>
            <Typography variant="h4" className="font-bold text-gray-800">
              {pruebaspendientes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pruebas Activas / Pendientes
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", mb: 2 }}>
              <Typography variant="h5" className="font-bold">
                %
              </Typography>
            </Avatar>
            <Typography variant="h4" className="font-bold text-gray-800">
              {pruebaspresentadas > 0
                ? ((pruebaspresentadas / mockEstudiantes.length) * 100).toFixed(
                    0,
                  )
                : 0}
              %
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasa de Presentación
            </Typography>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Sección Izquierda: Tabla y Gráficos */}
        <div className="space-y-6 md:col-span-2">
          {/* Tabla de Estudiantes */}
          <Paper className="rounded-xl p-6 shadow-sm">
            <Typography variant="h6" className="mb-4 font-bold text-secondary">
              Detalle de Estudiantes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell className="font-bold">Estudiante</TableCell>
                    <TableCell className="font-bold" align="center">
                      Puntaje
                    </TableCell>
                    <TableCell className="font-bold" align="center">
                      Clasificación
                    </TableCell>
                    <TableCell className="font-bold" align="center">
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockEstudiantes.map((est) => (
                    <TableRow key={est.id} hover>
                      <TableCell>{est.nombre}</TableCell>
                      <TableCell align="center">
                        <Typography
                          className={`font-bold ${est.puntaje >= 60 ? "text-green-600" : est.puntaje > 0 ? "text-orange-600" : "text-gray-500"}`}
                        >
                          {est.puntaje > 0 ? est.puntaje : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={est.clasificacion}
                          size="small"
                          color={getClasificacionColor(est.clasificacion)}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={est.presentada ? "Presentada" : "Pendiente"}
                          size="small"
                          color={est.presentada ? "success" : "warning"}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* % Aciertos por Pregunta */}
          <Paper className="rounded-xl p-6 shadow-sm">
            <Typography variant="h6" className="mb-4 font-bold text-secondary">
              % Aciertos por Pregunta
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockPreguntasAciertos}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="pregunta"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: "%", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="aciertos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </div>

        {/* Sección Derecha: Distribución y Resumen */}
        <div className="space-y-6">
          {/* Distribución de Clasificación */}
          <Paper className="rounded-xl p-6 shadow-sm">
            <Typography variant="h6" className="mb-4 font-bold text-secondary">
              Distribución de Clasificación
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={clasificacionDistribucion}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${percent != null ? (percent * 100).toFixed(0) : 0}%`
                  }
                >
                  {clasificacionDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} estudiantes`]} />
              </PieChart>
            </ResponsiveContainer>
            <Box className="mt-4 flex flex-col gap-2">
              {clasificacionDistribucion.map((item) => (
                <Box
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <Box className="flex items-center gap-2">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "2px",
                        backgroundColor: item.color,
                      }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" className="font-bold">
                    {item.value} (
                    {((item.value / mockEstudiantes.length) * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Resumen por Clasificación */}
          <Paper className="rounded-xl p-6 shadow-sm">
            <Typography variant="h6" className="mb-4 font-bold text-secondary">
              Resumen
            </Typography>
            <Box className="flex flex-col gap-3">
              {clasificacionDistribucion.map((item) => (
                <Box key={item.name}>
                  <Box className="mb-1 flex justify-between">
                    <Typography variant="body2" className="font-semibold">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" className="font-bold">
                      {((item.value / mockEstudiantes.length) * 100).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / mockEstudiantes.length) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </div>
      </div>
    </Box>
  );
}
