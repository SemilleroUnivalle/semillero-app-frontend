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
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Tooltip from "@mui/material/Tooltip";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";
import { Matricula, Asistencia} from "@/interfaces/interfaces";


interface AsistenciaRow {
  id: number;
  grupo_nombre: string;
  apellido: string;
  nombre: string;
  sesion: string;
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
    { field: "sesion", headerName: "Sesión", flex: 0.8 },
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
    {
          field: "editar",
          headerName: "Acciones",
          sortable: false,
          filterable: false,
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => (
            <div className="flex h-full w-full flex-row items-center justify-around">
              <Tooltip title="Ver detalles" placement="top">
                <VisibilityOutlinedIcon
                  className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    const rowData = params.row;
    
                    localStorage.setItem(
                      "matriculaSeleccionada",
                      JSON.stringify(rowData),
                    ); // 👉 Guarda la fila completa como JSON
                    router.push("/admin/matriculas/detallarMatricula");
                  }}
                />
              </Tooltip>
              <Tooltip title="Eliminar matricula" placement="top">
                <TrashIcon
                  className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
                  // onClick={() => handleDelete(params.row.id)}
                />
              </Tooltip>
            </div>
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
  const [selectedSesiones, setSelectedSesiones] = useState<string[]>([]);
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
        (asistencia: Asistencia) => asistencia.fecha_asistencia === fecha
      );

      const asistenciasFormateadas: AsistenciaRow[] = asistenciasFiltradas.map(
        (asistencia: Asistencia) => ({
          id: asistencia.id_asistencia,
          estado_asistencia: asistencia.estado_asistencia,
          comentarios: asistencia.comentarios || "",
          fecha_asistencia: asistencia.fecha_asistencia,
          sesion: asistencia.sesion,
          grupo_nombre: asistencia.id_inscripcion.grupo,
          apellido: asistencia.id_inscripcion.id_estudiante.apellido,
          nombre: asistencia.id_inscripcion.id_estudiante.nombre,
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

  const handleChangeSesiones = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedSesiones(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstados = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedEstados(typeof value === "string" ? value.split(",") : value);
  };



  // Filtrar filas
  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;
    
    return rows.filter((row) => {
      const grupoMatch =
        selectedGrupos.length === 0 || selectedGrupos.includes(row.grupo_nombre);
      
      const sesionMatch =
        selectedSesiones.length === 0 || selectedSesiones.includes(row.sesion);
      
      const estadoMatch =
        selectedEstados.length === 0 || selectedEstados.includes(row.estado_asistencia);

      return grupoMatch && sesionMatch && estadoMatch;
    });
  }, [rows, selectedGrupos, selectedSesiones, selectedEstados]);

  // Calcular estadísticas
  const totalEstudiantes = filteredRows.length;
  const estudiantesPresentes = filteredRows.filter(row => row.estado_asistencia === "Presente").length;
  const estudiantesAusentes = filteredRows.filter(row => row.estado_asistencia === "Ausente").length;
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
          <InputLabel id="filtro-sesion">Sesión</InputLabel>
          <Select
            labelId="filtro-sesion"
            multiple
            value={selectedSesiones}
            onChange={handleChangeSesiones}
            renderValue={(selected) => selected.join(", ")}
            label="Sesión"
          >
            {[...new Set(rows.map((row) => row.sesion))].map((sesion) => (
              <MenuItem key={sesion} value={sesion}>
                <Checkbox checked={selectedSesiones.indexOf(sesion) > -1} />
                <ListItemText primary={sesion} />
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

{/* Tabla de asistencia */}
      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-4 text-center shadow-md">
        {/* Cards de estudiantes */}
        <div className="mx-auto mt-4 w-11/12">
          

          <Grid className="container" spacing={2}>
            {filteredRows.map((estudiante) => (
              <Grid key={estudiante.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor:
                      estudiante.estado_asistencia === "Presente"
                        ? "#4caf50"
                        : estudiante.estado_asistencia === "Ausente"
                          ? "#f44336"
                          : "white",
                    borderWidth: estudiante.estado_asistencia !== null ? 2 : 1,
                    backgroundColor:
                      estudiante.estado_asistencia === "Presente"
                        ? "#e8f5e8"
                        : estudiante.estado_asistencia === "Ausente"
                          ? "#ffeaea"
                          : "white",
                    height: "100%",
                  }}
                >
                  <CardContent className="flex flex-col justify-between p-3 sm:flex-row">
                    {/* Header del estudiante */}
                    <Box className="mb-3 flex flex-row gap-2">
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                          bgcolor: getAvatarColor(estudiante.estado_asistencia),
                          fontSize: "1rem",
                          fontWeight: "bold",
                        }}
                      >
                        {estudiante.nombre.charAt(0)}
                        {estudiante.apellido.charAt(0)}
                      </Avatar>
                      <Box className="">
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          className="line-clamp-2"
                          sx={{ fontSize: "0.9rem" }}
                        >
                          {estudiante.nombre} {estudiante.apellido}
                        </Typography>
                        <Box className="flex items-center gap-1">
                          <BadgeIcon
                            sx={{ fontSize: 14, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {estudiante.numero_documento}
                          </Typography>
                        </Box>
                        {/* Información del grupo */}
                        <Box className="flex items-center gap-1">
                          <GroupIcon
                            sx={{ fontSize: 14, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {estudiante.grupo_nombre}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Botones de asistencia - FUERA del header */}
                    <Box className="flex flex-col">
                      <Box className="mb-3 flex gap-1">
                        <Button
                          size="small"
                          variant={
                            estudiante.estado_asistencia === "Presente"
                              ? "contained"
                              : "outlined"
                          }
                          color="success"
                          onClick={() =>
                            handleAsistenciaChange(estudiante.id, true)
                          }
                          startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          className="flex-1 rounded-xl"
                          sx={{ fontSize: "0.7rem", py: 0.5 }}
                        >
                          Presente
                        </Button>
                        <Button
                          size="small"
                          variant={
                            estudiante.estado_asistencia === "Ausente"
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          onClick={() =>
                            handleAsistenciaChange(estudiante.id, false)
                          }
                          startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                          className="flex-1 rounded-xl"
                          sx={{ fontSize: "0.7rem", py: 0.5 }}
                        >
                          Ausente
                        </Button>
                      </Box>

                      {/* Campo de observaciones */}
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Observaciones..."
                        value={estudiante.observaciones || ""}
                        onChange={(e) =>
                          handleObservacionesChange(
                            estudiante.id,
                            e.target.value,
                          )
                        }
                        multiline
                        maxRows={2}
                        fullWidth
                        className="inputs-textfield"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
                <Divider></Divider>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

    </div>
  );
}