"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/CloudUpload";

import * as XLSX from "xlsx";


// Importar Chart solo en cliente
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface EncuestaRow {
  documento: string;
  nombre: string;
  modulo: string;
  docente: string;
  monitor: string;
  nota_modulo: number;
  nota_docente: number;
  nota_monitor: number;
  nota_estudiante: number;
}

export default function EncuestasPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultados, setResultados] = useState<EncuestaRow[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [filtroModulo, setFiltroModulo] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");
  const [filtroMonitor, setFiltroMonitor] = useState("");

  // ---------------------------
  // Descargar plantilla Excel
  // ---------------------------

  const descargarPlantillaExcel = () => {
    const plantilla = [
      {
        documento: "1001234567",
        nombre: "Juan Perez",
        modulo: "Matemáticas",
        docente: "Carlos Gómez",
        monitor: "Laura Díaz",
        nota_modulo: 4.5,
        nota_docente: 4.7,
        nota_monitor: 4.3,
        nota_estudiante: 4.8,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(plantilla);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Encuestas");

    XLSX.writeFile(workbook, "plantilla_encuesta_satisfaccion.xlsx");
  };

  // ---------------------------
  // Cargar Excel
  // ---------------------------

  const handleArchivoExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setArchivo(file);
  };

  const procesarExcel = () => {
    if (!archivo) {
      setMensaje("Debe seleccionar un archivo Excel");
      return;
    }

    setCargando(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);

      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);

      setResultados(json as EncuestaRow[]);

      setMensaje(`Se cargaron ${json.length} encuestas`);

      setCargando(false);
    };

    reader.readAsArrayBuffer(archivo);
  };

  // ---------------------------
  // Filtros
  // ---------------------------

  const modulos = [...new Set(resultados.map((r) => r.modulo))];
  const docentes = [...new Set(resultados.map((r) => r.docente))];
  const monitores = [...new Set(resultados.map((r) => r.monitor))];

  const datosFiltrados = resultados.filter((r) => {
    return (
      (filtroModulo === "" || r.modulo === filtroModulo) &&
      (filtroDocente === "" || r.docente === filtroDocente) &&
      (filtroMonitor === "" || r.monitor === filtroMonitor)
    );
  });

  // ---------------------------
  // Promedios
  // ---------------------------

  const promedio = (campo: string) => {
    if (datosFiltrados.length === 0) return 0;

    const suma = datosFiltrados.reduce(
      (acc: number, item: any) => acc + Number(item[campo]),
      0
    );

    return Number((suma / datosFiltrados.length).toFixed(2));
  };

  // ---------------------------
  // Promedio por módulo
  // ---------------------------

  const promedioPorModulo = () => {
    const agrupado: any = {};

    datosFiltrados.forEach((r: any) => {
      if (!agrupado[r.modulo]) {
        agrupado[r.modulo] = [];
      }

      agrupado[r.modulo].push(Number(r.nota_modulo));
    });

    return Object.keys(agrupado).map((mod) => {
      const notas = agrupado[mod];

      const prom =
        notas.reduce((a: number, b: number) => a + b, 0) / notas.length;

      return {
        modulo: mod,
        promedio: Number(prom.toFixed(2)),
      };
    });
  };

  const datosModulo = promedioPorModulo();

  // ---------------------------
  // Gráficas
  // ---------------------------

  const graficaGeneral = {
    options: {
      chart: { id: "satisfaccion", toolbar: { show: false } },
      xaxis: {
        categories: ["Módulo", "Docente", "Monitor", "Autoevaluación"],
      },
      colors: ["#C20E1A"],
    },
    series: [
      {
        name: "Promedio",
        data: [
          promedio("nota_modulo"),
          promedio("nota_docente"),
          promedio("nota_monitor"),
          promedio("nota_estudiante"),
        ],
      },
    ],
  };

  const graficaModulo = {
    options: {
      chart: { id: "modulos", toolbar: { show: false } },
      xaxis: {
        categories: datosModulo.map((d) => d.modulo),
      },
      colors: ["#C20E1A"],
    },
    series: [
      {
        name: "Promedio módulo",
        data: datosModulo.map((d) => d.promedio),
      },
    ],
  };

  return (
    <Box className="p-3 max-w-6xl mx-auto">
      <Box className="mb-4">
        <h1>Encuestas de Satisfacción</h1>
        <p className="text-[#575757] mt-2 text-sm">
          Cargar resultados de evaluación de módulos del semillero
        </p>
      </Box>

      {mensaje && (
        <Alert 
          className="mb-3 rounded-[1rem]"
          severity="info"
          sx={{
            backgroundColor: "#FFF9E6",
            color: "#f57f17",
            "& .MuiAlert-icon": { color: "#f57f17" }
          }}
        >
          {mensaje}
        </Alert>
      )}

      {/* CARGA */}

      <Card className="mb-4 rounded-[1rem] shadow-sm border border-gray-200">
        <CardHeader 
          title="Carga de Encuestas"
          titleTypographyProps={{
            sx: { 
              color: "#C20E1A",
              fontWeight: 600,
              fontSize: "1.1rem"
            }
          }}
          sx={{ borderBottom: "1px solid #f0f0f0" }}
        />

        <CardContent>
          <Box className="flex gap-2 flex-wrap items-center">
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={descargarPlantillaExcel}
              sx={{
                borderColor: "#C20E1A",
                color: "#C20E1A",
                borderRadius: "0.75rem",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#970000",
                  backgroundColor: "rgba(194, 14, 26, 0.04)"
                }
              }}
            >
              Descargar plantilla Excel
            </Button>

            <Box
              component="label"
              className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-[#C20E1A] rounded-lg cursor-pointer text-[#C20E1A] font-medium transition-colors hover:bg-red-50"
            >
              <UploadIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
              {archivo ? archivo.name : "Seleccionar archivo"}
              <input
                type="file"
                accept=".xlsx"
                onChange={handleArchivoExcel}
                className="hidden"
              />
            </Box>

            <Button
              startIcon={<UploadIcon />}
              variant="contained"
              onClick={procesarExcel}
              disabled={cargando || !archivo}
              className="bg-[#C20E1A] hover:bg-[#970000] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg py-3"
            >
              {cargando ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Procesando
                </>
              ) : (
                "Cargar encuestas"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* FILTROS */}

      {resultados.length > 0 && (
        <Card className="mb-4 rounded-[1rem] shadow-sm border border-gray-200">
          <CardHeader 
            title="Filtros"
            titleTypographyProps={{
              sx: { 
                color: "#C20E1A",
                fontWeight: 600,
                fontSize: "1.1rem"
              }
            }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />

          <CardContent>
            <Box className="inputs-textfield flex gap-2 flex-wrap items-end">
              <TextField
                select
                label="Módulo"
                value={filtroModulo}
                onChange={(e) => setFiltroModulo(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="">Todos</option>
                {modulos.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </TextField>

              <TextField
                select
                label="Docente"
                value={filtroDocente}
                onChange={(e) => setFiltroDocente(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="">Todos</option>
                {docentes.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </TextField>

              <TextField
                select
                label="Monitor"
                value={filtroMonitor}
                onChange={(e) => setFiltroMonitor(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="">Todos</option>
                {monitores.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </TextField>

              <Button
                variant="outlined"
                onClick={() => {
                  setFiltroModulo("");
                  setFiltroDocente("");
                  setFiltroMonitor("");
                }}
                sx={{
                  borderColor: "#C20E1A",
                  color: "#C20E1A",
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#970000",
                    backgroundColor: "rgba(194, 14, 26, 0.04)"
                  }
                }}
              >
                Limpiar filtros
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* TABLA */}

      {datosFiltrados.length > 0 && (
        <Card className="mb-4 rounded-[1rem] shadow-sm border border-gray-200 overflow-hidden">
          <CardHeader 
            title="Resultados cargados"
            titleTypographyProps={{
              sx: { 
                color: "#C20E1A",
                fontWeight: 600,
                fontSize: "1.1rem"
              }
            }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          />

          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="font-semibold text-gray-700">Documento</TableCell>
                  <TableCell className="font-semibold text-gray-700">Nombre</TableCell>
                  <TableCell className="font-semibold text-gray-700">Módulo</TableCell>
                  <TableCell className="font-semibold text-gray-700">Docente</TableCell>
                  <TableCell className="font-semibold text-gray-700">Monitor</TableCell>
                  <TableCell className="font-semibold text-gray-700">Nota módulo</TableCell>
                  <TableCell className="font-semibold text-gray-700">Nota docente</TableCell>
                  <TableCell className="font-semibold text-gray-700">Nota monitor</TableCell>
                  <TableCell className="font-semibold text-gray-700">Autoevaluación</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {datosFiltrados.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 border-b border-gray-200">
                    <TableCell className="text-gray-700">{row.documento}</TableCell>
                    <TableCell className="text-gray-700">{row.nombre}</TableCell>
                    <TableCell className="text-gray-700">{row.modulo}</TableCell>
                    <TableCell className="text-gray-700">{row.docente}</TableCell>
                    <TableCell className="text-gray-700">{row.monitor}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{row.nota_modulo}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{row.nota_docente}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{row.nota_monitor}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{row.nota_estudiante}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {/* GRÁFICAS */}

      {datosFiltrados.length > 0 && (
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card className="rounded-[1rem] shadow-sm border border-gray-200">
            <CardHeader 
              title="Promedio de satisfacción"
              titleTypographyProps={{
                sx: { 
                  color: "#C20E1A",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }
              }}
              sx={{ borderBottom: "1px solid #f0f0f0" }}
            />

            <CardContent>
              <Chart
                options={graficaGeneral.options}
                series={graficaGeneral.series}
                type="bar"
                height={350}
              />
            </CardContent>
          </Card>

          <Card className="rounded-[1rem] shadow-sm border border-gray-200">
            <CardHeader 
              title="Promedio por módulo"
              titleTypographyProps={{
                sx: { 
                  color: "#C20E1A",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }
              }}
              sx={{ borderBottom: "1px solid #f0f0f0" }}
            />

            <CardContent>
              <Chart
                options={graficaModulo.options}
                series={graficaModulo.series}
                type="bar"
                height={350}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}