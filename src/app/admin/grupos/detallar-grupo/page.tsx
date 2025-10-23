"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

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
  Tooltip,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { TextField, Autocomplete } from "@mui/material";
import { Estudiante, Matricula } from "@/interfaces/interfaces";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { API_BASE_URL } from "../../../../../config";

// Interfaces para docentes y monitores
interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  numero_documento?: string;
}

interface Monitor {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  numero_documento?: string;
}

// Interface para las filas del DataGrid
interface MatriculaRow {
  id: number;
  apellido: string;
  nombre: string;
  email: string;
  estamento: string;
  grado: string;
  estado: string;
  tipo_vinculacion: string;
  colegio: string;
}

export default function DetallarGrupo() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "apellido", headerName: "Apellidos", flex: 1 },
    { field: "nombre", headerName: "Nombres", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1 },
    {
      field: "estamento",
      headerName: "Estamento",
      flex: 1,
    },
    {
      field: "grado",
      headerName: "Grado",
      flex: 0.5,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value === "Revisado") {
          return (
            <Chip
              label="Revisado"
              color="success"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "No revisado") {
          return (
            <Chip
              label="No revisado"
              color="error"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "Pendiente") {
          return (
            <Chip
              label="Pendiente"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        return null;
      },
    },
    {
      field: "editar",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      flex: 0.5,
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
                  "inscritoSeleccionado",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/registros/detallarRegistro/");
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar del grupo" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => handleRemoveFromGroup(params.row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  interface Grupo {
    id: number;
    nombre: string;
    estudiantes: EstudianteRow[];
    profesor?: number;
    monitor_academico?: number;
  }

  interface EstudianteRow {
    id: number;
    apellido: string;
    nombre: string;
    email: string;
    tipo_vinculacion: string;
    colegio: string;
  }

  // Estados
  const [rows, setRows] = useState<MatriculaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grupoId, setGrupoId] = useState<number | null>(null);

  // Estados para docentes y monitores
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [loadingMonitores, setLoadingMonitores] = useState(false);

  // Estado para el nombre del grupo
  const [nombreGrupo, setNombreGrupo] = useState("");

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

    // Cargar datos del grupo y matrículas
  useEffect(() => {
    const fetchGrupoData = async () => {
      try {
        const token = getToken();
        
        // Obtener datos del grupo seleccionado desde localStorage
        const grupoSeleccionado = localStorage.getItem("grupoSeleccionado");
        if (!grupoSeleccionado) {
          setError("No se encontró información del grupo seleccionado");
          setLoading(false);
          return;
        }

        const grupo = JSON.parse(grupoSeleccionado);
        setNombreGrupo(grupo.nombre || "");
        setGrupoId(grupo.id);

        // Fetch matrículas
        const response = await axios.get(`${API_BASE_URL}/matricula/mat/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // Filtrar solo las matrículas que pertenecen a este grupo
          const matriculasDelGrupo = response.data.filter(
            (matricula: Matricula) => matricula.grupo === grupo.id
          );

          // Formatear los datos para la tabla
          const formateado: MatriculaRow[] = matriculasDelGrupo.map((matricula: Matricula) => ({
            id: matricula.id_inscripcion,
            apellido: matricula.estudiante?.apellido || "",
            nombre: matricula.estudiante?.nombre || "",
            email: matricula.estudiante?.email || "",
            estamento: matricula.estudiante?.estamento || "",
            grado: matricula.estudiante?.grado || "",
            estado: matricula.estado || "",
            tipo_vinculacion: matricula.tipo_vinculacion || "",
            colegio: matricula.estudiante?.colegio || "",
          }));

          setRows(formateado);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del grupo:", error);
        setError("Error al cargar los datos del grupo");
        setLoading(false);
      }
    };

    fetchGrupoData();
  }, []);

  // Fetch docentes
  useEffect(() => {
    const fetchDocentes = async () => {
      setLoadingDocentes(true);
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/profesor/prof`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Docente[] = await response.json();
        setDocentes(data);
      } catch (err) {
        console.error("Error fetching docentes:", err);
      } finally {
        setLoadingDocentes(false);
      }
    };

    fetchDocentes();
  }, []);

  // Fetch monitores
  useEffect(() => {
    const fetchMonitores = async () => {
      setLoadingMonitores(true);
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/monitor_academico/mon`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Monitor[] = await response.json();
        setMonitores(data);
      } catch (err) {
        console.error("Error fetching monitores:", err);
      } finally {
        setLoadingMonitores(false);
      }
    };

    fetchMonitores();
  }, []);



  // Función para eliminar estudiante del grupo
  const handleRemoveFromGroup = async (matriculaId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este estudiante del grupo?"
    );
    
    if (!confirmDelete) return;

    try {
      const token = getToken();
      
      const response = await axios.patch(
        `${API_BASE_URL}/matricula/mat/${matriculaId}/`,
        { grupo: null },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Actualizar la tabla removiendo la fila
        setRows(prevRows => prevRows.filter(row => row.id !== matriculaId));
        alert("Estudiante eliminado del grupo exitosamente");
      }
    } catch (error) {
      console.error("Error al eliminar estudiante del grupo:", error);
      alert("Error al eliminar el estudiante del grupo");
    }
  };

    // Función para actualizar el grupo
  const handleUpdateGroup = async () => {
    if (!grupoId) return;

    try {
      const token = getToken();
      
      const updateData = {
        nombre: nombreGrupo,
        profesor: selectedDocente?.id || null,
        monitor_academico: selectedMonitor?.id || null,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/grupo/grupo/${grupoId}/`,
        updateData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Grupo actualizado exitosamente");
        // Actualizar localStorage con los nuevos datos
        const updatedGroup = { ...JSON.parse(localStorage.getItem("grupoSeleccionado") || "{}"), ...updateData };
        localStorage.setItem("grupoSeleccionado", JSON.stringify(updatedGroup));
      }
    } catch (error) {
      console.error("Error al actualizar el grupo:", error);
      alert("Error al actualizar el grupo");
    }
  };


  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando matriculas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  
  return (
    <Box className="mx-auto mt-4 flex w-11/12 flex-col justify-between gap-4 rounded-2xl bg-white p-2 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Grupo: {nombreGrupo}
      </h2>

      {/* Autocompletes para Docente y Monitor */}
      <Box className="flex flex-wrap justify-around text-gray-600">
        {/* Campo nombre del curso */}
        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Nombre del Grupo"
          variant="outlined"
          fullWidth
          required
          value={nombreGrupo}
          onChange={(e) => setNombreGrupo(e.target.value)}
          placeholder="Ingrese el nombre del grupo"
        />
        {/* Autocomplete para Docente */}
        <Autocomplete
          className="inputs-textfield flex w-full sm:w-1/4"
          options={docentes || []}
          getOptionLabel={(option) =>
            option ? `${option.nombre} ${option.apellido}` : ""
          }
          value={selectedDocente}
          onChange={(event, newValue) => setSelectedDocente(newValue)}
          loading={loadingDocentes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Docente"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingDocentes ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id}>
              <Box>
                <Typography variant="body1">
                  {option.nombre} {option.apellido}
                </Typography>
                {option.email && (
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          noOptionsText="No se encontraron docentes"
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />

        {/* Autocomplete para Monitor */}
        <Autocomplete
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          options={monitores || []}
          getOptionLabel={(option) =>
            option ? `${option.nombre} ${option.apellido}` : ""
          }
          value={selectedMonitor}
          onChange={(event, newValue) => setSelectedMonitor(newValue)}
          loading={loadingMonitores}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Monitor Académico"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingMonitores ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id}>
              <Box>
                <Typography variant="body1">
                  {option.nombre} {option.apellido}
                </Typography>
                {option.email && (
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          noOptionsText="No se encontraron monitores"
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />
      </Box>

      {/* Botón para actualizar grupo */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateGroup}
          className="rounded-2xl bg-primary text-white hover:bg-red-800"
        >
          Actualizar Información del Grupo
        </Button>
      </Box>

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
        <Paper
          className="border-none shadow-none"
          sx={{ height: 800, width: "100%" }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
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
              // 📌 Traducciones básicas en español
              noRowsLabel: "No hay filas",
              columnMenuSortAsc: "Ordenar ascendente",
              columnMenuSortDesc: "Ordenar descendente",
              columnMenuFilter: "Filtrar",
              columnMenuHideColumn: "Ocultar columna",
              columnMenuShowColumns: "Mostrar columnas",
              toolbarDensity: "Densidad",
              toolbarDensityLabel: "Densidad",
              toolbarDensityCompact: "Compacta",
              toolbarDensityStandard: "Estándar",
              toolbarDensityComfortable: "Cómoda",
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
                labelRowsPerPage: "Filas por página:",
              },
            }}
          />
        </Paper>
      </div>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Estudiantes en el grupo: {rows.length}
        </Typography>
      </Box>
    </Box>
  );
}
