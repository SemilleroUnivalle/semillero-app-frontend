"use client";

import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";

// Datos simulados (Mocks)
const mockEstudiantes = [
    { id: 1, nombre: "Ana García", puntaje: 95, estado: "Aprobado", cuartil: 1, tiempo: "45 min" },
    { id: 2, nombre: "Carlos López", puntaje: 82, estado: "Aprobado", cuartil: 2, tiempo: "50 min" },
    { id: 3, nombre: "María Rodríguez", puntaje: 58, estado: "Reprobado", cuartil: 4, tiempo: "60 min" },
    { id: 4, nombre: "Juan Pérez", puntaje: 74, estado: "Aprobado", cuartil: 3, tiempo: "55 min" },
    { id: 5, nombre: "Laura Martínez", puntaje: 88, estado: "Aprobado", cuartil: 2, tiempo: "40 min" },
    { id: 6, nombre: "Pedro Sánchez", puntaje: 45, estado: "Reprobado", cuartil: 4, tiempo: "30 min" },
    { id: 7, nombre: "Sofía Torres", puntaje: 92, estado: "Aprobado", cuartil: 1, tiempo: "48 min" },
    { id: 8, nombre: "Diego Ruiz", puntaje: 65, estado: "Aprobado", cuartil: 3, tiempo: "58 min" },
];

const mockPreguntasErrores = [
    { id: 1, enunciado: "¿Cuál es la derivada de x^2?", errores: 15, total: 40, porcentaje: 37.5, tema: "Cálculo Diferencial" },
    { id: 2, enunciado: "Resuelva la integral definida de 0 a 1...", errores: 12, total: 40, porcentaje: 30, tema: "Cálculo Integral" },
    { id: 3, enunciado: "Definición de límite...", errores: 8, total: 40, porcentaje: 20, tema: "Límites" },
];

export default function EstadisticasPage() {
    const [filtroModulo, setFiltroModulo] = useState("todos");
    const [filtroPrueba, setFiltroPrueba] = useState("todas");

    // Cálculos simples basados en mocks
    const promedioGeneral = (mockEstudiantes.reduce((acc, curr) => acc + curr.puntaje, 0) / mockEstudiantes.length).toFixed(1);
    const tasaAprobacion = ((mockEstudiantes.filter(e => e.estado === "Aprobado").length / mockEstudiantes.length) * 100).toFixed(0);

    return (
        <Box className="mx-auto w-11/12 pb-8">
            {/* Encabezado y Filtros */}
            <Paper className="mb-6 rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
                    <div>
                        <Typography variant="h5" className="font-bold text-primary">
                            Tablero de Resultados
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Análisis detallado del rendimiento estudiantil
                        </Typography>
                    </div>
                    <div>
                        <Box className="flex gap-4">
                            <FormControl fullWidth size="small">
                                <InputLabel>Módulo</InputLabel>
                                <Select
                                    value={filtroModulo}
                                    label="Módulo"
                                    onChange={(e) => setFiltroModulo(e.target.value)}
                                >
                                    <MenuItem value="todos">Todos los Módulos</MenuItem>
                                    <MenuItem value="calculo">Cálculo Diferencial</MenuItem>
                                    <MenuItem value="algebra">Álgebra Lineal</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth size="small">
                                <InputLabel>Prueba</InputLabel>
                                <Select
                                    value={filtroPrueba}
                                    label="Prueba"
                                    onChange={(e) => setFiltroPrueba(e.target.value)}
                                >
                                    <MenuItem value="todas">Todas las Pruebas</MenuItem>
                                    <MenuItem value="p1">Parcial 1</MenuItem>
                                    <MenuItem value="p2">Quiz 2</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                </div>
            </Paper>

            {/* KPIs / Tarjetas de Resumen */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mb: 2 }}>
                            <TrendingUpIcon />
                        </Avatar>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            {promedioGeneral}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Promedio General
                        </Typography>
                    </CardContent>
                </Card>
                <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mb: 2 }}>
                            <CheckCircleIcon />
                        </Avatar>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            {tasaAprobacion}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tasa de Aprobación
                        </Typography>
                    </CardContent>
                </Card>
                <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Avatar sx={{ bgcolor: '#fff3e0', color: '#ef6c00', mb: 2 }}>
                            <GroupIcon />
                        </Avatar>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            {mockEstudiantes.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Estudiantes Evaluados
                        </Typography>
                    </CardContent>
                </Card>
                <Card className="h-full rounded-xl shadow-sm transition-transform hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', mb: 2 }}>
                            <AssignmentIcon />
                        </Avatar>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            4
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pruebas Activas
                        </Typography>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Sección Izquierda: Gráficos y Análisis */}
                <div className="md:col-span-2 space-y-6">
                    {/* Distribución de Cuartiles (Simulado visualmente) */}
                    <Paper className="rounded-xl p-6 shadow-sm">
                        <Box className="mb-4 flex items-center justify-between">
                            <Typography variant="h6" className="font-bold text-secondary">
                                Distribución por Cuartiles
                            </Typography>
                            <Tooltip title="Distribución de estudiantes según su rendimiento">
                                <BarChartIcon color="action" />
                            </Tooltip>
                        </Box>
                        <Box className="flex h-64 items-end justify-around gap-4 border-b pb-2">
                            {/* Barras simuladas con CSS */}
                            <Box className="flex w-1/4 flex-col items-center gap-2">
                                <div className="w-full rounded-t-lg bg-red-100 transition-all hover:bg-red-200" style={{ height: '30%' }}></div>
                                <Typography variant="caption" className="font-bold">Q4 (Bajo)</Typography>
                                <Typography variant="caption" color="text.secondary">25%</Typography>
                            </Box>
                            <Box className="flex w-1/4 flex-col items-center gap-2">
                                <div className="w-full rounded-t-lg bg-orange-100 transition-all hover:bg-orange-200" style={{ height: '50%' }}></div>
                                <Typography variant="caption" className="font-bold">Q3 (Medio-Bajo)</Typography>
                                <Typography variant="caption" color="text.secondary">35%</Typography>
                            </Box>
                            <Box className="flex w-1/4 flex-col items-center gap-2">
                                <div className="w-full rounded-t-lg bg-blue-100 transition-all hover:bg-blue-200" style={{ height: '70%' }}></div>
                                <Typography variant="caption" className="font-bold">Q2 (Medio-Alto)</Typography>
                                <Typography variant="caption" color="text.secondary">20%</Typography>
                            </Box>
                            <Box className="flex w-1/4 flex-col items-center gap-2">
                                <div className="w-full rounded-t-lg bg-green-100 transition-all hover:bg-green-200" style={{ height: '40%' }}></div>
                                <Typography variant="caption" className="font-bold">Q1 (Alto)</Typography>
                                <Typography variant="caption" color="text.secondary">20%</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Tabla de Estudiantes */}
                    <Paper className="rounded-xl p-6 shadow-sm">
                        <Typography variant="h6" className="mb-4 font-bold text-secondary">
                            Detalle por Estudiante
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="font-bold">Estudiante</TableCell>
                                        <TableCell className="font-bold" align="center">Puntaje</TableCell>
                                        <TableCell className="font-bold" align="center">Tiempo</TableCell>
                                        <TableCell className="font-bold" align="center">Cuartil</TableCell>
                                        <TableCell className="font-bold" align="center">Estado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockEstudiantes.map((est) => (
                                        <TableRow key={est.id} hover>
                                            <TableCell>{est.nombre}</TableCell>
                                            <TableCell align="center">
                                                <Typography
                                                    className={`font-bold ${est.puntaje >= 60 ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    {est.puntaje}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">{est.tiempo}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`Q${est.cuartil}`}
                                                    size="small"
                                                    color={est.cuartil === 1 ? "success" : est.cuartil === 4 ? "error" : "default"}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={est.estado}
                                                    size="small"
                                                    color={est.estado === "Aprobado" ? "success" : "error"}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>

                {/* Sección Derecha: Alertas y Detalles */}
                <div className="space-y-6">
                    {/* Preguntas con más errores */}
                    <Paper className="rounded-xl p-6 shadow-sm bg-red-50 border border-red-100">
                        <Box className="mb-4 flex items-center gap-2 text-red-700">
                            <WarningIcon />
                            <Typography variant="h6" className="font-bold">
                                Áreas de Mejora
                            </Typography>
                        </Box>
                        <Typography variant="body2" className="mb-4 text-red-600">
                            Preguntas con mayor tasa de error en las últimas pruebas.
                        </Typography>

                        <Box className="flex flex-col gap-4">
                            {mockPreguntasErrores.map((preg) => (
                                <Card key={preg.id} className="shadow-none border border-red-200 bg-white">
                                    <CardContent className="p-3">
                                        <Typography variant="subtitle2" className="font-bold text-gray-800 mb-1">
                                            {preg.tema}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-2 line-clamp-2">
                                            {preg.enunciado}
                                        </Typography>
                                        <Box className="flex items-center gap-2">
                                            <LinearProgress
                                                variant="determinate"
                                                value={preg.porcentaje}
                                                color="error"
                                                className="flex-1 rounded-full h-2"
                                            />
                                            <Typography variant="caption" className="font-bold text-red-600">
                                                {preg.porcentaje}% Error
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Paper>

                    {/* Resumen por Módulo */}
                    <Paper className="rounded-xl p-6 shadow-sm">
                        <Typography variant="h6" className="mb-4 font-bold text-secondary">
                            Rendimiento por Módulo
                        </Typography>
                        <Box className="flex flex-col gap-4">
                            <Box>
                                <Box className="flex justify-between mb-1">
                                    <Typography variant="body2">Cálculo Diferencial</Typography>
                                    <Typography variant="body2" className="font-bold">78%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={78} className="rounded-full h-2" />
                            </Box>
                            <Box>
                                <Box className="flex justify-between mb-1">
                                    <Typography variant="body2">Álgebra Lineal</Typography>
                                    <Typography variant="body2" className="font-bold">65%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={65} color="warning" className="rounded-full h-2" />
                            </Box>
                            <Box>
                                <Box className="flex justify-between mb-1">
                                    <Typography variant="body2">Lógica Matemática</Typography>
                                    <Typography variant="body2" className="font-bold">82%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={82} color="success" className="rounded-full h-2" />
                            </Box>
                        </Box>
                    </Paper>
                </div>
            </div>
        </Box>
    );
}
