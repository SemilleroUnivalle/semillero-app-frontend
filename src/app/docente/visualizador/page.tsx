"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  CircularProgress,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";

interface AsistenciaRegistro {
  id: number;
  id_inscripcion: number;
  fecha_asistencia: string;
  estado_asistencia: string;
  comentarios: string;
  estudiante_nombre: string;
  estudiante_apellido: string;
  estudiante_documento: string;
  estudiante_colegio: string;
  grupo_nombre: string;
  tipo_vinculacion: string;
}

interface AsistenciaRow {
  id: number;
  grupo_nombre: string;
  apellido: string;
  nombre: string;
  numero_documento: string;
  colegio: string;
  tipo_vinculacion: string;
  estado_asistencia: string;
  comentarios: string;
  fecha_asistencia: string;
}

export default function VisualizadorAsistencia() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "fecha_asistencia", headerName: "Fecha", flex: 0.8 },
    { field: "grupo_nombre", headerName: "Grupo", flex: 0.8 },
    { field: "apellido", headerName: "Apellidos", flex: 1 },
    { field: "nombre", headerName: "Nombres", flex: 1 },
    { field: "numero_documento", headerName: "Documento", flex: 0.8 },
    { field: "colegio", headerName: "Colegio", flex: 1 },
    {
      field: "tipo_vinculacion",
      headerName: "Tipo",
      flex: 0.6,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Particular" ? "primary" : "secondary"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "estado_asistencia",
      headerName: "Estado",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Asistio" ? "success" : "error"}
          variant="filled"
          size="small"
          icon={params.value === "Asistio" ? <CheckCircleIcon /> : <CancelIcon />}
        />
      ),
    },
    {
      field: "comentarios",
      headerName: "Comentarios",
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.value || "-"}
        </Typography>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  // Estados
  const [rows, setRows] = useState<AsistenciaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);
  const [selectedColegios, setSelectedColegios] = useState<string[]>([]);
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

  // Función para cargar asistencias por fecha
const fetchAsistenciasPorFecha = async (fecha: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_BASE_URL}/asistencia/asis/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Filtrar por fecha y formatear los datos para la tabla
      const asistenciasFiltradas = response.data.filter(
        (asistencia: AsistenciaRegistro) => asistencia.fecha_asistencia === fecha
      );

      const asistenciasFormateadas: AsistenciaRow[] = asistenciasFiltradas.map(
        (asistencia: AsistenciaRegistro) => ({
          id: asistencia.id,
          grupo_nombre: asistencia.grupo_nombre || "Sin grupo",
          apellido: asistencia.estudiante_apellido || "",
          nombre: asistencia.estudiante_nombre || "",
          numero_documento: asistencia.estudiante_documento || "",
          colegio: asistencia.estudiante_colegio || "",
          tipo_vinculacion: asistencia.tipo_vinculacion || "",
          estado_asistencia: asistencia.estado_asistencia,
          comentarios: asistencia.comentarios || "",
          fecha_asistencia: asistencia.fecha_asistencia,
        })
      );

      setRows(asistenciasFormateadas);
    }
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    setError("Error al cargar las asistencias");
    setRows([]);
  } finally {
    setLoading(false);
  }
};

  // Cargar asistencias al cambiar la fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      fetchAsistenciasPorFecha(fechaSeleccionada);
    }
  }, [fechaSeleccionada]);

  // Handlers para filtros
  const handleChangeGrupos = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedGrupos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeColegios = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedColegios(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstados = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedEstados(typeof value === "string" ? value.split(",") : value);
  };

  // Función para exportar a Excel
  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/asistencia/exportar-excel/?fecha=${fechaSeleccionada}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Token ${getToken()}`,
          },
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Asistencia_${fechaSeleccionada}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("No se pudo exportar el archivo.");
      console.error(error);
    }
  };

  // Filtrar filas
  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;
    
    return rows.filter((row) => {
      const grupoMatch =
        selectedGrupos.length === 0 || selectedGrupos.includes(row.grupo_nombre);
      
      const colegioMatch =
        selectedColegios.length === 0 || selectedColegios.includes(row.colegio);
      
      const estadoMatch =
        selectedEstados.length === 0 || selectedEstados.includes(row.estado_asistencia);

      return grupoMatch && colegioMatch && estadoMatch;
    });
  }, [rows, selectedGrupos, selectedColegios, selectedEstados]);

  // Calcular estadísticas
  const totalEstudiantes = filteredRows.length;
  const estudiantesPresentes = filteredRows.filter(row => row.estado_asistencia === "Asistio").length;
  const estudiantesAusentes = filteredRows.filter(row => row.estado_asistencia === "No Asistio").length;
  const gruposUnicos = [...new Set(filteredRows.map(row => row.grupo_nombre))].length;

  return (
    <div>
      {/* Header con selector de fecha */}
      <Box className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-4 shadow-md">
        <Typography variant="h5" className="mb-4 text-center text-primary font-bold">
          Visualizador de Asistencias
        </Typography>
        
        <Box className="mb-4 flex justify-center">
          <TextField
          className="inputs-textfield"
            label="Seleccionar Fecha"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="outlined"
            className="rounded-2xl border-primary text-primary hover:text-white  hover:bg-primary"
            startIcon={<SearchIcon />}
            onClick={() => fetchAsistenciasPorFecha(fechaSeleccionada)}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            Buscar
          </Button>
        </Box>
        
        <Box className="mb-4 flex flex-wrap justify-around gap-4">
       
          
          <Card className="min-w-48">
            <CardContent className="text-center">
              <PersonIcon className="mb-2 text-purple-500" fontSize="large" />
              <Typography variant="h4" className="font-bold text-purple-600">
                {totalEstudiantes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Registros
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="min-w-48">
            <CardContent className="text-center">
              <CheckCircleIcon className="mb-2 text-green-500" fontSize="large" />
              <Typography variant="h4" className="font-bold text-green-600">
                {estudiantesPresentes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Presentes
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="min-w-48">
            <CardContent className="text-center">
              <CancelIcon className="mb-2 text-red-500" fontSize="large" />
              <Typography variant="h4" className="font-bold text-red-600">
                {estudiantesAusentes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ausentes
              </Typography>
            </CardContent>
          </Card>

          <Card className="min-w-48">
            <CardContent className="text-center">
              <GroupIcon className="mb-2 text-orange-500" fontSize="large" />
              <Typography variant="h4" className="font-bold text-orange-600">
                {gruposUnicos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Grupos
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtros */}
      <div className="mx-auto mt-4 flex w-11/12 justify-around rounded-2xl bg-white p-2 shadow-md">
        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="filtro-grupos">Grupos</InputLabel>
          <Select
            labelId="filtro-grupos"
            multiple
            value={selectedGrupos}
            onChange={handleChangeGrupos}
            renderValue={(selected) => selected.join(", ")}
            label="Grupos"
          >
            {[...new Set(rows.map((row) => row.grupo_nombre))].map((grupo) => (
              <MenuItem key={grupo} value={grupo}>
                <Checkbox checked={selectedGrupos.indexOf(grupo) > -1} />
                <ListItemText primary={grupo} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="filtro-colegios">Colegios</InputLabel>
          <Select
            labelId="filtro-colegios"
            multiple
            value={selectedColegios}
            onChange={handleChangeColegios}
            renderValue={(selected) => selected.join(", ")}
            label="Colegios"
          >
            {[...new Set(rows.map((row) => row.colegio))].map((colegio) => (
              <MenuItem key={colegio} value={colegio}>
                <Checkbox checked={selectedColegios.indexOf(colegio) > -1} />
                <ListItemText primary={colegio} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="filtro-estados">Estado Asistencia</InputLabel>
          <Select
            labelId="filtro-estados"
            multiple
            value={selectedEstados}
            onChange={handleChangeEstados}
            renderValue={(selected) => selected.join(", ")}
            label="Estado Asistencia"
          >
            {["Asistio", "No Asistio"].map((estado) => (
              <MenuItem key={estado} value={estado}>
                <Checkbox checked={selectedEstados.indexOf(estado) > -1} />
                <ListItemText primary={estado} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Tabla de asistencias */}
      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-4 text-center shadow-md">
        <Box className="mb-4 flex justify-between items-center">
          <Typography variant="body2" className="text-gray-600">
            Mostrando {filteredRows.length} de {totalEstudiantes} registros para {fechaSeleccionada}
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
            disabled={filteredRows.length === 0}
          >
            Exportar Excel
          </Button>
        </Box>
        
        {loading ? (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando asistencias...</Typography>
          </Box>
        ) : error ? (
          <Box className="flex justify-center items-center py-8">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Paper
            className="border-none shadow-none"
            sx={{ height: 600, width: "100%" }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: { paginationModel },
                sorting: {
                  sortModel: [{ field: "grupo_nombre", sort: "asc" }],
                },
              }}
              pageSizeOptions={[25, 50, 75, 100]}
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  color: "#575757",
                  fontSize: "1rem",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#e8e8e8",
                },
              }}
              localeText={{
                noRowsLabel: `No hay registros de asistencia para ${fechaSeleccionada}`,
                columnMenuSortAsc: "Ordenar ascendente",
                columnMenuSortDesc: "Ordenar descendente",
                columnMenuFilter: "Filtrar",
                columnMenuHideColumn: "Ocultar columna",
                columnMenuShowColumns: "Mostrar columnas",
              }}
            />
          </Paper>
        )}
      </div>
    </div>
  );
}