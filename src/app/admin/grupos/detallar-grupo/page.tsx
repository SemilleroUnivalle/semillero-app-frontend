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
  Card,
  CardHeader,
  List,
  ListItemButton,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { TextField, Autocomplete } from "@mui/material";
import { Matricula } from "@/interfaces/interfaces";
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
      field: "tipo_vinculacion",
      headerName: "Tipo de Vinculación",
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
                  "matriculaSeleccionada",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/matriculas/detallarMatricula/");
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

  // interface Grupo {
  //   id: number;
  //   nombre: string;
  //   estudiantes: EstudianteRow[];
  //   profesor?: number;
  //   monitor_academico?: number;
  // }


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
  const [profesorId, setProfesorId] = useState<number | null>(null);
  const [monitorId, setMonitorId] = useState<number | null>(null);

  // Nuevos estados para agregar estudiantes
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<Matricula[]>([]);
  const [checked, setChecked] = useState<readonly number[]>([]);
  // const [selectedStudents, setSelectedStudents] = useState<readonly number[]>(
  //   [],
  // );
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Estados para filtros
  const [selectedPeriodos, setSelectedPeriodos] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedModulos, setSelectedModulos] = useState<string[]>([]);
  const [filteredAvailableStudents, setFilteredAvailableStudents] = useState<
    readonly number[]
  >([]);

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

        const { grupo_id, id } = JSON.parse(grupoSeleccionado);
        const grupoId = grupo_id || id;

        if (!grupoId) {
          setError("ID del grupo no válido");
          setLoading(false);
          return;
        }

        // Fetch datos actualizados del grupo desde el servidor
        const grupoResponse = await axios.get(
          `${API_BASE_URL}/grupo/grupo/${grupoId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (grupoResponse.status === 200) {
          const grupoData = grupoResponse.data;

          // Establecer datos del grupo
          setNombreGrupo(grupoData.nombre || "");
          setProfesorId(grupoData.profesor || null);
          setMonitorId(grupoData.monitor_academico || null);
          setGrupoId(grupoData.id);
        }

        // Fetch matrículas
        const response = await axios.get(`${API_BASE_URL}/matricula/mat/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // Filtrar solo las matrículas que pertenecen a este grupo
          const matriculasDelGrupo = response.data.filter(
            (matricula: Matricula) => matricula.grupo === grupoId,
          );

          // Formatear los datos para la tabla
          const formateado: MatriculaRow[] = matriculasDelGrupo.map(
            (matricula: Matricula) => ({
              id: matricula.id_inscripcion,
              apellido: matricula.estudiante?.apellido || "",
              nombre: matricula.estudiante?.nombre || "",
              email: matricula.estudiante?.email || "",
              estamento: matricula.estudiante?.estamento || "",
              grado: matricula.estudiante?.grado || "",
              estado: matricula.estado || "",
              tipo_vinculacion: matricula.tipo_vinculacion || "",
              colegio: matricula.estudiante?.colegio || "",
            }),
          );

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

  // Función para cargar estudiantes disponibles
  const fetchAvailableStudents = async () => {
    setLoadingStudents(true);
    try {
      const token = getToken();

      const response = await axios.get(`${API_BASE_URL}/matricula/mat/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        // Filtrar solo estudiantes sin grupo asignado
        const estudiantesSinGrupo = response.data.filter(
          (matricula: Matricula) => matricula.grupo === null,
        );

        setAvailableStudents(estudiantesSinGrupo);
        const allIds = estudiantesSinGrupo.map(
          (est: Matricula) => est.id_inscripcion,
        );
        setFilteredAvailableStudents(allIds);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes disponibles:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Función para mostrar/ocultar la sección de agregar estudiantes
  const handleToggleAddStudents = async () => {
    if (!showAddStudents) {
      await fetchAvailableStudents();
    } else {
      // Limpiar estados al cerrar
      setSelectedPeriodos([]);
      setSelectedCategorias([]);
      setSelectedModulos([]);
      setChecked([]);
      // setSelectedStudents([]);
    }
    setShowAddStudents(!showAddStudents);
  };

  // Efecto para aplicar filtros a estudiantes disponibles
  useEffect(() => {
    if (!showAddStudents) return;

    const filtered = availableStudents.filter((matricula) => {
      const matchPeriodo =
        selectedPeriodos.length === 0 ||
        selectedPeriodos.includes(
          matricula.oferta_categoria?.id_oferta_academica?.nombre || "",
        );
      const matchCategoria =
        selectedCategorias.length === 0 ||
        selectedCategorias.includes(
          matricula.modulo?.id_categoria?.nombre || "",
        );
      const matchModulo =
        selectedModulos.length === 0 ||
        selectedModulos.includes(matricula.modulo?.nombre_modulo || "");

      return matchPeriodo && matchCategoria && matchModulo;
    });

    setFilteredAvailableStudents(filtered.map((est) => est.id_inscripcion));
  }, [
    selectedPeriodos,
    selectedCategorias,
    selectedModulos,
    availableStudents,
    showAddStudents,
  ]);

  // Handlers para filtros
  const handleChangePeriodos = (
    event: SelectChangeEvent<typeof selectedPeriodos>,
  ) => {
    const value = event.target.value;
    setSelectedPeriodos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeCategorias = (
    event: SelectChangeEvent<typeof selectedCategorias>,
  ) => {
    const value = event.target.value;
    setSelectedCategorias(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeModulos = (
    event: SelectChangeEvent<typeof selectedModulos>,
  ) => {
    const value = event.target.value;
    setSelectedModulos(typeof value === "string" ? value.split(",") : value);
  };

  // Función para manejar selección de estudiantes
  const handleToggleStudent = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // Función para agregar estudiantes seleccionados al grupo
  const handleAddSelectedStudents = async () => {
    if (checked.length === 0) {
      alert("Debe seleccionar al menos un estudiante");
      return;
    }

    const confirmAdd = window.confirm(
      `¿Estás seguro de que deseas agregar ${checked.length} estudiante(s) al grupo?`,
    );

    if (!confirmAdd) return;

    try {
      const token = getToken();

      // Actualizar cada matrícula seleccionada con el ID del grupo
      const updatePromises = checked.map(async (matriculaId) => {
        const response = await axios.patch(
          `${API_BASE_URL}/matricula/mat/${matriculaId}/`,
          { grupo: grupoId },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        return response.data;
      });

      await Promise.all(updatePromises);

      // Actualizar la tabla principal con los nuevos estudiantes
      const newStudents = availableStudents
        .filter((student) => checked.includes(student.id_inscripcion))
        .map((matricula: Matricula) => ({
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

      setRows((prevRows) => [...prevRows, ...newStudents]);

      // Limpiar y cerrar la sección de agregar estudiantes
      setChecked([]);
      // setSelectedStudents([]);
      setShowAddStudents(false);
      setSelectedPeriodos([]);
      setSelectedCategorias([]);
      setSelectedModulos([]);

      alert(
        `${newStudents.length} estudiante(s) agregado(s) al grupo exitosamente`,
      );
    } catch (error) {
      console.error("Error al agregar estudiantes al grupo:", error);
      alert("Error al agregar estudiantes al grupo");
    }
  };

  const getEstudianteById = (id: number): Matricula | undefined => {
    return availableStudents.find((est) => est.id_inscripcion === id);
  };

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

  // UseEffect para establecer docente seleccionado cuando los datos estén listos
  useEffect(() => {
    if (docentes.length > 0 && profesorId) {
      const docenteEncontrado = docentes.find((d) => d.id === profesorId);
      if (docenteEncontrado) {
        setSelectedDocente(docenteEncontrado);
      }
    }
  }, [docentes, profesorId]);

  // UseEffect para establecer monitor seleccionado cuando los datos estén listos
  useEffect(() => {
    if (monitores.length > 0 && monitorId) {
      const monitorEncontrado = monitores.find((m) => m.id === monitorId);
      if (monitorEncontrado) {
        setSelectedMonitor(monitorEncontrado);
      }
    }
  }, [monitores, monitorId]);

  // Función para eliminar estudiante del grupo
  const handleRemoveFromGroup = async (matriculaId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este estudiante del grupo?",
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
        },
      );

      if (response.status === 200) {
        // Actualizar la tabla removiendo la fila
        setRows((prevRows) => prevRows.filter((row) => row.id !== matriculaId));
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
        },
      );

      if (response.status === 200) {
        alert("Grupo actualizado exitosamente");
        // Actualizar localStorage con los nuevos datos
        const updatedGroup = {
          ...JSON.parse(localStorage.getItem("grupoSeleccionado") || "{}"),
          ...updateData,
        };
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
      <h2 className="my-4 text-center text-2xl font-bold">
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

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
        <Button
          variant="outlined"
          sx={{ color: "#c40e1a", borderColor: "#c40e1a" }}
          onClick={handleUpdateGroup}
          className="rounded-2xl text-primary hover:bg-red-800 hover:text-white"
        >
          Actualizar Información del Grupo
        </Button>

        <Button
          variant="outlined"
          sx={{ color: "#c40e1a", borderColor: "#c40e1a" }}
          onClick={handleToggleAddStudents}
          className="rounded-2xl text-primary hover:bg-red-800 hover:text-white"
        >
          {showAddStudents ? "Cancelar" : "Agregar Estudiante"}
        </Button>
      </Box>

      {/* Sección para agregar estudiantes */}
      {showAddStudents && (
        <Box className="mt-4 rounded-2xl border-2 border-dashed border-gray-300 p-4 text-gray-600">
          <Typography variant="h6" className="mb-4 text-center font-bold">
            Agregar Estudiantes al Grupo
          </Typography>

          {/* Filtros */}
          <Typography variant="subtitle1" className="mb-2 font-semibold">
            Filtros de búsqueda:
          </Typography>

          <Box className="mb-4 flex flex-wrap justify-around gap-4 text-gray-600">
            {/* Filtro por Periodos */}
            <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
              <InputLabel>Periodos</InputLabel>
              <Select
                multiple
                value={selectedPeriodos}
                onChange={handleChangePeriodos}
                renderValue={(selected) => selected.join(", ")}
                label="Periodos"
              >
                {[
                  ...new Set(
                    availableStudents
                      .filter(
                        (est) =>
                          est?.oferta_categoria?.id_oferta_academica?.nombre,
                      )
                      .map(
                        (est) =>
                          est.oferta_categoria.id_oferta_academica.nombre,
                      ),
                  ),
                ]
                  .sort()
                  .map((periodo) => (
                    <MenuItem key={periodo} value={periodo}>
                      <Checkbox
                        checked={selectedPeriodos.indexOf(periodo) > -1}
                      />
                      <ListItemText primary={periodo} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Filtro por Categorías */}
            <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
              <InputLabel>Categorías</InputLabel>
              <Select
                multiple
                value={selectedCategorias}
                onChange={handleChangeCategorias}
                renderValue={(selected) => selected.join(", ")}
                label="Categorías"
              >
                {[
                  ...new Set(
                    availableStudents.map(
                      (est) => est.modulo.id_categoria.nombre,
                    ),
                  ),
                ]
                  .sort()
                  .map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      <Checkbox
                        checked={selectedCategorias.indexOf(categoria) > -1}
                      />
                      <ListItemText primary={categoria} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Filtro por Módulos */}
            <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
              <InputLabel>Módulos</InputLabel>
              <Select
                multiple
                value={selectedModulos}
                onChange={handleChangeModulos}
                renderValue={(selected) => selected.join(", ")}
                label="Módulos"
              >
                {[
                  ...new Set(
                    availableStudents.map((est) => est.modulo.nombre_modulo),
                  ),
                ]
                  .sort()
                  .map((modulo) => (
                    <MenuItem key={modulo} value={modulo}>
                      <Checkbox
                        checked={selectedModulos.indexOf(modulo) > -1}
                      />
                      <ListItemText primary={modulo} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* Lista de estudiantes disponibles */}
          {loadingStudents ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Cargando estudiantes disponibles...
              </Typography>
            </Box>
          ) : (
            <Card sx={{ width: 2 / 3, textAlign: "center", margin: "0 auto" }}>
              <CardHeader
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "#e8e8e8",
                  color: "#575757",
                  fontSize: "0.5rem",
                }}
                title="Estudiantes Disponibles"
                subheader={`${checked.length}/${filteredAvailableStudents.length} seleccionados`}
                titleTypographyProps={{
                  fontSize: "1rem", // Tamaño más pequeño para el título
                  fontWeight: "600",
                }}
              />
              <Divider />
              <List
                sx={{
                  width: "100%",
                  height: 300,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  overflow: "auto",
                }}
                dense
                component="div"
                role="list"
              >
                {filteredAvailableStudents.map((id: number) => {
                  const estudiante = getEstudianteById(id);
                  const labelId = `transfer-list-item-${id}-label`;

                  if (!estudiante) return null;

                  return (
                    <ListItemButton
                      key={id}
                      role="listitem"
                      onClick={handleToggleStudent(id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.includes(id)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={`${estudiante.estudiante.nombre} ${estudiante.estudiante.apellido}`}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Doc: {estudiante.estudiante.numero_documento}
                            </Typography>
                            <br />
                            {`${estudiante.estudiante.grado}° - ${estudiante.estudiante.colegio}`}
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {estudiante.modulo.nombre_modulo} •{" "}
                              {estudiante.estudiante.estamento}
                            </Typography>
                          </React.Fragment>
                        }
                        primaryTypographyProps={{
                          fontSize: "0.95rem",
                          fontWeight: "600",
                        }}
                      />
                    </ListItemButton>
                  );
                })}
                {filteredAvailableStudents.length === 0 && (
                  <ListItemText
                    primary="No hay estudiantes disponibles con los filtros seleccionados"
                    sx={{ textAlign: "center", py: 4 }}
                  />
                )}
              </List>
            </Card>
          )}

          {/* Botones de acción para agregar estudiantes */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Seleccionados: {checked.length} estudiantes
            </Typography>
            <Button
              variant="outlined"
              sx={{ color: "#c40e1a", borderColor: "#c40e1a" }}
              className="rounded-2xl text-primary hover:bg-red-800 hover:text-white"
              onClick={handleAddSelectedStudents}
              disabled={checked.length === 0}
            >
              Agregar Estudiantes Seleccionados ({checked.length})
            </Button>
          </Box>
        </Box>
      )}

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
        <Paper
          className="border-none shadow-none"
          sx={{ height: 500, width: "100%" }}
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
