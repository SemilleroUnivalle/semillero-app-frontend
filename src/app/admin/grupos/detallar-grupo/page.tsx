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

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
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
          <Tooltip title="Eliminar inscripcion" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
            //   onClick={() => handleDelete(params.row.id)}
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

  const [rows, setRows] = useState<EstudianteRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
         

        const response = await axios.get(`${API_BASE_URL}/estudiante/est/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // Formatea los datos para la tabla
          const formateado = response.data.map((grupo: Grupo) => ({
            id: grupo.estudiantes.id,
            apellido: grupo.estudiantes.apellido || "",
            nombre: grupo.estudiantes.nombre || "",
            email: grupo.estudiantes.email || "",
            tipo_vinculacion: grupo.estudiantes.tipo_vinculacion || "",
            colegio: grupo.estudiantes.colegio || "",
          }));

          setRows(formateado);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [checked, setChecked] = useState<readonly number[]>([]);
  const [left, setLeft] = useState<readonly number[]>([]);
  const [right, setRight] = useState<readonly number[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<
    readonly number[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para docentes y monitores
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [loadingMonitores, setLoadingMonitores] = useState(false);

  const leftChecked = intersection(checked, filteredEstudiantes);
  const rightChecked = intersection(checked, right);

  // Estado para el nombre del grupo
  const [nombreGrupo, setNombreGrupo] = useState("");

  // Estado para la creación del grupo
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

  // Fetch matriculas data
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/matricula/mat/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Matricula[] = await response.json();

        setMatriculas(data);
        // Inicialmente todos los matriculas están disponibles (izquierda)
        const allIds = data.map((est) => est.id_inscripcion);
        setLeft(allIds);
        setFilteredEstudiantes(allIds);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    fetchEstudiantes();
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

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const getEstudianteById = (id: number): Matricula | undefined => {
    return matriculas.find((est) => est.id_inscripcion === id);
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

  // Función para actualizar matriculas con el ID del grupo
  const updateStudentsGroup = async (
    studentIds: readonly number[],
    groupId: number,
  ) => {
    const token = getToken();
    const updatePromises = studentIds.map(async (studentId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/matricula/mat/${studentId}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grupo: groupId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `Error updating student ${studentId}: ${response.status}`,
          );
        }

        const updatedStudent = await response.json();
        console.log(`Estudiante ${studentId} actualizado:`, updatedStudent);
        return updatedStudent;
      } catch (error) {
        console.error(`Error updating student ${studentId}:`, error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(updatePromises);
      console.log("Todos los matriculas actualizados exitosamente:", results);
      return results;
    } catch (error) {
      console.error("Error updating some students:", error);
      throw error;
    }
  };

  return (
    <Box className="mx-auto mt-4 flex w-11/12 flex-col justify-between gap-4 rounded-2xl bg-white p-2 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Crear Grupos Manualmente
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
          Seleccionados: {checked.length} | Disponibles:{" "}
          {filteredEstudiantes.length} | En el grupo: {right.length}
        </Typography>

        <Button
          className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800 sm:w-1/3"
          variant="contained"
          color="primary"
          size="large"
          //   onClick={handleCreateGroup}
          disabled={right.length === 0}
        >
          Crear Grupo ({right.length} matriculas)
        </Button>
      </Box>
    </Box>
  );
}
