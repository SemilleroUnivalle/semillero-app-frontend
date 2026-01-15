"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Snackbar,
  Box,
  Alert,
  Typography,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";
import { API_BASE_URL } from "../../../../config";

interface Estudiante {
  id_inscripcion: number;
  id_estudiante: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  email: string;
  colegio: string;
  tipo_vinculacion: string;
}

interface Grupo {
  id: number;
  estudiantes: Estudiante[];
  total_estudiantes: number;
  nombre: string;
  profesor: number;
  monitor_academico: number;
}

interface CalificacionRow {
  id: number;
  grupo_id: number;
  grupo_nombre: string;
  id_estudiante: number;
  apellido: string;
  nombre: string;
  numero_documento: string;
  email: string;
  colegio: string;
  tipo_vinculacion: string;
  seguimiento1: number | null;
  seguimiento2: number | null;
  nota_conceptual_docente: number | null;
  nota_conceptual_estudiante: number | null;
}

interface CalificacionDialogProps {
  open: boolean;
  estudiante: CalificacionRow | null;
  onClose: () => void;
  onSave: (calificaciones: Partial<CalificacionRow>) => void;
  loading: boolean;
}

const CalificacionDialog: React.FC<CalificacionDialogProps> = ({
  open,
  estudiante,
  onClose,
  onSave,
  loading,
}) => {
  const [seguimiento1, setSeguimiento1] = useState<number | null>(null);
  const [seguimiento2, setSeguimiento2] = useState<number | null>(null);
  const [notaConceptualDocente, setNotaConceptualDocente] = useState<
    number | null
  >(null);
  const [notaConceptualEstudiante, setNotaConceptualEstudiante] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (estudiante) {
      setSeguimiento1(estudiante.seguimiento1);
      setSeguimiento2(estudiante.seguimiento2);
      setNotaConceptualDocente(estudiante.nota_conceptual_docente);
      setNotaConceptualEstudiante(estudiante.nota_conceptual_estudiante);
    }
  }, [estudiante]);

  const handleSave = () => {
    onSave({
      seguimiento1,
      seguimiento2,
      nota_conceptual_docente: notaConceptualDocente,
      nota_conceptual_estudiante: notaConceptualEstudiante,
    });
  };

  const isValidGrade = (value: number | null): boolean => {
    return value === null || (value >= 0 && value <= 5);
  };

  const areAllValid =
    isValidGrade(seguimiento1) &&
    isValidGrade(seguimiento2) &&
    isValidGrade(notaConceptualDocente) &&
    isValidGrade(notaConceptualEstudiante);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Calificar Estudiante</DialogTitle>
      <DialogContent className="pt-2">
        {estudiante && (
          <div>
            <Typography variant="body2" className="mb-2">
              <strong>Estudiante:</strong> {estudiante.nombre}{" "}
              {estudiante.apellido}
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Documento:</strong> {estudiante.numero_documento}
            </Typography>

            <TextField
              fullWidth
              label="Seguimiento 1"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={seguimiento1 ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setSeguimiento1(val);
              }}
              className="mb-2"
              helperText="Escala de 0 a 5"
              error={!isValidGrade(seguimiento1)}
            />

            <TextField
              fullWidth
              label="Seguimiento 2"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={seguimiento2 ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setSeguimiento2(val);
              }}
              className="mb-2"
              helperText="Escala de 0 a 5"
              error={!isValidGrade(seguimiento2)}
            />

            <TextField
              fullWidth
              label="Nota Conceptual Docente"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={notaConceptualDocente ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setNotaConceptualDocente(val);
              }}
              className="mb-2"
              helperText="Escala de 0 a 5"
              error={!isValidGrade(notaConceptualDocente)}
            />

            <TextField
              fullWidth
              label="Nota Conceptual Estudiante"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={notaConceptualEstudiante ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setNotaConceptualEstudiante(val);
              }}
              helperText="Escala de 0 a 5"
              error={!isValidGrade(notaConceptualEstudiante)}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading || !areAllValid}
          startIcon={<SaveIcon />}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function CalificacionDocente() {

  // Estados
  const [rows, setRows] = useState<CalificacionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estados para filtros
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);

  // Estados para el diálogo de calificación
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] =
    useState<CalificacionRow | null>(null);

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

  // Cargar datos de los grupos del profesor
  useEffect(() => {
    const fetchMisGrupos = async () => {
      try {
        const token = getToken();

        const response = await axios.get(
          `${API_BASE_URL}/profesor/prof/mi-grupo/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.status === 200) {
          // Formatear todos los estudiantes en una sola tabla
          const todosLosEstudiantes: CalificacionRow[] = [];

          response.data.forEach((grupo: Grupo) => {
            grupo.estudiantes.forEach((estudiante: Estudiante) => {
              todosLosEstudiantes.push({
                id: estudiante.id_inscripcion,
                grupo_id: grupo.id,
                grupo_nombre: grupo.nombre,
                id_estudiante: estudiante.id_estudiante,
                apellido: estudiante.apellido,
                nombre: estudiante.nombre,
                numero_documento: estudiante.numero_documento,
                email: estudiante.email,
                colegio: estudiante.colegio,
                tipo_vinculacion: estudiante.tipo_vinculacion,
                seguimiento1: null,
                seguimiento2: null,
                nota_conceptual_docente: null,
                nota_conceptual_estudiante: null,
              });
            });
          });

          setRows(todosLosEstudiantes);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los grupos del profesor:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchMisGrupos();
  }, []);

  // Handlers para filtros
  const handleChangeGrupos = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedGrupos(typeof value === "string" ? value.split(",") : value);
  };

  // Abrir diálogo de calificación
  const handleOpenCalificacionDialog = (estudiante: CalificacionRow) => {
    setSelectedEstudiante(estudiante);
    setDialogOpen(true);
  };

  // Cerrar diálogo de calificación
  const handleCloseCalificacionDialog = () => {
    setDialogOpen(false);
    setSelectedEstudiante(null);
  };

  // Guardar calificaciones
  const handleSaveCalificaciones = async (
    calificaciones: Partial<CalificacionRow>,
  ) => {
    if (!selectedEstudiante) return;

    setSaving(true);
    try {
      // Actualizar la fila localmente
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedEstudiante.id
            ? { ...row, ...calificaciones }
            : row,
        ),
      );

      // Aquí iría la llamada a la API para guardar en el backend
      // Por ahora solo guardamos localmente
      // TODO: Implementar endpoint en el backend para guardar calificaciones

      setSuccess(true);
      handleCloseCalificacionDialog();

      // Simular un pequeño delay para mejor UX
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error al guardar calificaciones:", err);
      setError("Error al guardar las calificaciones");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  // Obtener grupos únicos
  const uniqueGrupos = Array.from(new Set(rows.map((row) => row.grupo_nombre)));

  // Filtrar filas
  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;

    return rows.filter((row) => {
      const grupoMatch =
        selectedGrupos.length === 0 ||
        selectedGrupos.includes(row.grupo_nombre);
      return grupoMatch;
    });
  }, [rows, selectedGrupos]);

  // Calcular estadísticas
  const totalEstudiantes = filteredRows.length;
  const estudiantesConCalificaciones = filteredRows.filter(
    (row) =>
      row.seguimiento1 !== null ||
      row.seguimiento2 !== null ||
      row.nota_conceptual_docente !== null ||
      row.nota_conceptual_estudiante !== null,
  );

  if (loading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <div className="inputs-textfield p-4">
      <Box className="mx-auto mt-4 rounded-2xl bg-white p-4 shadow-md">
        <Typography
          variant="h5"
          className="mb-4 text-center font-bold text-primary"
        >
          Calificador de Estudiantes
        </Typography>

        <Box className="mb-2 flex flex-col justify-around gap-3 sm:flex-row">
          {/* Inputs para fecha, sesión y grupos */}
          <FormControl fullWidth>
            <InputLabel>Filtrar por Grupo</InputLabel>
            <Select
              multiple
              value={selectedGrupos}
              onChange={handleChangeGrupos}
              label="Filtrar por Grupo"
              renderValue={(selected) => selected.join(", ")}
            >
              {uniqueGrupos.map((grupo) => (
                <MenuItem key={grupo} value={grupo}>
                  {grupo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Snackbars */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Calificación guardada exitosamente
        </Alert>
      </Snackbar>

      <Snackbar
        open={error !== null}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Estadísticas */}

      <Box className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">

        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
              <div className="flex items-center gap-2">
                <GroupIcon className="text-5xl text-blue-500" />
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Estudiantes
                  </Typography>
                  <Typography variant="h5">{totalEstudiantes}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
              <div className="flex items-center gap-2">
                <EditIcon className="text-5xl text-green-500" />
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Calificados
                  </Typography>
                  <Typography variant="h5">
                    {estudiantesConCalificaciones.length}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
      </Box>


      {/* Tabla de Calificaciones */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-bold">Grupo</TableCell>
                <TableCell className="font-bold">Nombre</TableCell>
                <TableCell className="font-bold">Documento</TableCell>
                <TableCell className="text-center font-bold">
                  Seguimiento 1
                </TableCell>
                <TableCell className="text-center font-bold">
                  Seguimiento 2
                </TableCell>
                <TableCell className="text-center font-bold">
                  Nota Conceptual Docente
                </TableCell>
                <TableCell className="text-center font-bold">
                  Nota Conceptual Estudiante
                </TableCell>
                <TableCell className="text-center font-bold">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" className="py-3">
                    <Typography color="textSecondary">
                      No hay estudiantes para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.grupo_nombre}</TableCell>
                    <TableCell>
                      {row.nombre} {row.apellido}
                    </TableCell>
                    <TableCell>{row.numero_documento}</TableCell>
                    <TableCell align="center">
                      {row.seguimiento1 !== null ? (
                        <div
                          className={`rounded px-2 py-1 font-bold ${
                            row.seguimiento1 >= 3
                              ? "bg-green-200"
                              : "bg-orange-200"
                          }`}
                        >
                          {row.seguimiento1.toFixed(1)}
                        </div>
                      ) : (
                        <Typography color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.seguimiento2 !== null ? (
                        <div
                          className={`rounded px-2 py-1 font-bold ${
                            row.seguimiento2 >= 3
                              ? "bg-green-200"
                              : "bg-orange-200"
                          }`}
                        >
                          {row.seguimiento2.toFixed(1)}
                        </div>
                      ) : (
                        <Typography color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.nota_conceptual_docente !== null ? (
                        <div
                          className={`rounded px-2 py-1 font-bold ${
                            row.nota_conceptual_docente >= 3
                              ? "bg-green-200"
                              : "bg-orange-200"
                          }`}
                        >
                          {row.nota_conceptual_docente.toFixed(1)}
                        </div>
                      ) : (
                        <Typography color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.nota_conceptual_estudiante !== null ? (
                        <div
                          className={`rounded px-2 py-1 font-bold ${
                            row.nota_conceptual_estudiante >= 3
                              ? "bg-green-200"
                              : "bg-orange-200"
                          }`}
                        >
                          {row.nota_conceptual_estudiante.toFixed(1)}
                        </div>
                      ) : (
                        <Typography color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                      color="error"
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenCalificacionDialog(row)}
                      >
                        Calificar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Diálogo de Calificación */}
      <CalificacionDialog
        open={dialogOpen}
        estudiante={selectedEstudiante}
        onClose={handleCloseCalificacionDialog}
        onSave={handleSaveCalificaciones}
        loading={saving}
      />
    </div>
  );
}
