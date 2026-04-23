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
import BarChartIcon from "@mui/icons-material/BarChart";
import Link from "next/link";

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
  id_inscripcion: number;
  grupo_nombre: string;
  id_estudiante: number;
  apellido: string;
  nombre: string;
  numero_documento: string;
  email: string;
  colegio: string;
  tipo_vinculacion: string;
  seguimiento_1: number | null;
  seguimiento_2: number | null;
  nota_conceptual_docente: number | null;
  nota_conceptual_estudiante: number | null;
  nota_final: number | null;
  observaciones: string;
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
  const [seguimiento_1, setSeguimiento1] = useState<number | null>(null);
  const [seguimiento_2, setSeguimiento2] = useState<number | null>(null);
  const [nota_conceptual_docente, setNotaConceptualDocente] = useState<
    number | null
  >(null);
  const [nota_conceptual_estudiante, setNotaConceptualEstudiante] = useState<
    number | null
  >(null);
  const [observaciones, setObservaciones] = useState<string>("");

  useEffect(() => {
    if (estudiante) {
      setSeguimiento1(estudiante.seguimiento_1);
      setSeguimiento2(estudiante.seguimiento_2);
      setNotaConceptualDocente(estudiante.nota_conceptual_docente);
      setNotaConceptualEstudiante(estudiante.nota_conceptual_estudiante);
      setObservaciones(estudiante.observaciones || "");
    }
  }, [estudiante]);

  const handleSave = () => {
    onSave({
      seguimiento_1,
      seguimiento_2,
      nota_conceptual_docente,
      nota_conceptual_estudiante,
      observaciones,
    });
  };

  const isValidGrade = (value: number | null): boolean => {
    return value === null || (value >= 0 && value <= 5);
  };

  const areAllValid =
    isValidGrade(seguimiento_1) &&
    isValidGrade(seguimiento_2) &&
    isValidGrade(nota_conceptual_docente) &&
    isValidGrade(nota_conceptual_estudiante);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Calificar Estudiante</DialogTitle>
      <DialogContent className="pt-2">
        {estudiante && (
          <div className="flex flex-col gap-4 py-2">
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {estudiante.nombre} {estudiante.apellido}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Documento: {estudiante.numero_documento}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Seguimiento 1"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={seguimiento_1 ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setSeguimiento1(val);
              }}
              helperText="Escala de 0 a 5"
              error={!isValidGrade(seguimiento_1)}
            />

            <TextField
              fullWidth
              label="Seguimiento 2"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={seguimiento_2 ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setSeguimiento2(val);
              }}
              helperText="Escala de 0 a 5"
              error={!isValidGrade(seguimiento_2)}
            />

            <TextField
              fullWidth
              label="Nota Conceptual Docente"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={nota_conceptual_docente ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setNotaConceptualDocente(val);
              }}
              helperText="Escala de 0 a 5"
              error={!isValidGrade(nota_conceptual_docente)}
            />

            <TextField
              fullWidth
              label="Nota Conceptual Estudiante"
              type="number"
              inputProps={{ min: "0", max: "5", step: "0.1" }}
              value={nota_conceptual_estudiante ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                setNotaConceptualEstudiante(val);
              }}
              helperText="Escala de 0 a 5"
              error={!isValidGrade(nota_conceptual_estudiante)}
            />

            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: El estudiante demuestra gran interés en el módulo."
            />
          </div>
        )}
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading || !areAllValid}
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: "#c40e1a",
            "&:hover": {
              backgroundColor: "#a00e1a",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
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
  const [showOnlyGraded, setShowOnlyGraded] = useState(false);

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

  // Cargar datos de los grupos y sus seguimientos
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();

        if (!token) {
          setError("No se encontró una sesión activa. Por favor, inicia sesión.");
          setLoading(false);
          return;
        }

        // 1. Intentar el nuevo endpoint de seguimiento
        try {
          const response = await axios.get(
            `${API_BASE_URL}/seguimiento_academico/seg/estudiantes-seguimiento/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (response.status === 200) {
            console.log("[DEBUG] Datos recibidos del backend:", JSON.stringify(response.data, null, 2));
            // El backend puede enviar: array directo, { results: [] } (paginado), o un objeto con otra clave
            let rawData: any[];
            if (Array.isArray(response.data)) {
              rawData = response.data;
            } else if (Array.isArray(response.data.results)) {
              rawData = response.data.results;
            } else {
              // Intentar encontrar el primer valor que sea array
              const firstArray = Object.values(response.data).find(v => Array.isArray(v));
              rawData = (firstArray as any[]) || [];
            }

            console.log(`[DEBUG] Total registros recibidos: ${rawData.length}`);
            if (rawData.length > 0) {
              console.log("[DEBUG] Estructura del primer item:", JSON.stringify(rawData[0], null, 2));
            }

            const formatedData: CalificacionRow[] = rawData.map((item: any) => {
              // El backend puede devolver las notas planas o en un objeto 'notas'
              const n = item.notas || {};
              // Soporte para diferentes nombres de campo de grupo
              const grupoNombre =
                item.grupo_nombre ||
                item.grupo ||
                item.nombre_grupo ||
                "Sin grupo";
              // Soporte para nombre plano o anidado en objeto 'estudiante'
              const nombre =
                item.nombre ||
                item.estudiante_nombre ||
                item.estudiante?.nombre ||
                "";
              const apellido =
                item.apellido ||
                item.estudiante_apellido ||
                item.estudiante?.apellido ||
                "";
              const numero_documento =
                item.numero_documento ||
                item.estudiante?.numero_documento ||
                "";
              return {
                id_inscripcion: item.id_inscripcion,
                grupo_nombre: grupoNombre,
                id_estudiante: item.id_estudiante || item.estudiante?.id_estudiante || 0,
                apellido,
                nombre,
                numero_documento,
                email: item.email || item.estudiante?.email || "",
                colegio: item.colegio || item.estudiante?.colegio || "",
                tipo_vinculacion: item.tipo_vinculacion || item.estudiante?.tipo_vinculacion || "",
                seguimiento_1: item.seguimiento_1 ?? n.seguimiento_1 ?? null,
                seguimiento_2: item.seguimiento_2 ?? n.seguimiento_2 ?? null,
                nota_conceptual_docente: item.nota_conceptual_docente ?? n.nota_conceptual_docente ?? null,
                nota_conceptual_estudiante: item.nota_conceptual_estudiante ?? n.nota_conceptual_estudiante ?? null,
                nota_final: item.nota_final ?? n.nota_final ?? null,
                observaciones: item.observaciones ?? n.observaciones ?? "",
              };
            });

            setRows(formatedData);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          // Solo si es 404 intentamos el fallback, si es otro error (como conexión) lo lanzamos
          if (err.response?.status !== 404) {
            throw err;
          }
          console.warn("Endpoint de seguimiento no encontrado, usando mi-grupo como alternativa.");
        }

        // 2. Fallback: Usar el endpoint original de grupos
        const responseGrupos = await axios.get(
          `${API_BASE_URL}/profesor/prof/mi-grupo/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (responseGrupos.status === 200) {
          const todosLosEstudiantes: CalificacionRow[] = [];
          responseGrupos.data.forEach((grupo: any) => {
            grupo.estudiantes.forEach((estudiante: any) => {
              todosLosEstudiantes.push({
                id_inscripcion: estudiante.id_inscripcion,
                grupo_nombre: grupo.nombre,
                id_estudiante: estudiante.id_estudiante,
                apellido: estudiante.apellido,
                nombre: estudiante.nombre,
                numero_documento: estudiante.numero_documento,
                email: estudiante.email,
                colegio: estudiante.colegio,
                tipo_vinculacion: estudiante.tipo_vinculacion,
                seguimiento_1: null,
                seguimiento_2: null,
                nota_conceptual_docente: null,
                nota_conceptual_estudiante: null,
                nota_final: null,
                observaciones: "",
              });
            });
          });
          setRows(todosLosEstudiantes);
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error DETALLADO al obtener estudiantes:", err);
        let msg = "Error al cargar los datos";

        if (err.code === "ERR_NETWORK") {
          msg = `No se pudo conectar con el servidor en ${API_BASE_URL}. ¿El puerto es correcto?`;
        } else if (err.response) {
          msg = err.response.data?.message || err.response.data?.detail || `Error del servidor (${err.response.status})`;
        }

        setError(msg);
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

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
    calificaciones: Partial<CalificacionRow>
  ) => {
    if (!selectedEstudiante) return;

    setSaving(true);
    try {
      const token = getToken();

      const response = await axios.post(
        `${API_BASE_URL}/seguimiento_academico/seg/`,
        {
          id_inscripcion: selectedEstudiante.id_inscripcion,
          seguimiento_1: calificaciones.seguimiento_1,
          seguimiento_2: calificaciones.seguimiento_2,
          nota_conceptual_docente: calificaciones.nota_conceptual_docente,
          nota_conceptual_estudiante: calificaciones.nota_conceptual_estudiante,
          observaciones: calificaciones.observaciones || "",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Actualizar la fila localmente. Usamos un mapeo robusto por si la respuesta trae 'notas' anidado
        const updatedData = response.data;
        const n = updatedData.notas || {};

        // Helper para garantizar que las notas sean siempre number | null
        const toNum = (v: any): number | null => {
          if (v === null || v === undefined || v === "") return null;
          const parsed = parseFloat(v);
          return isNaN(parsed) ? null : parsed;
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id_inscripcion === selectedEstudiante.id_inscripcion
              ? {
                ...row,
                ...updatedData,
                // Asegurar que los campos clave sean números y no strings
                seguimiento_1: toNum(updatedData.seguimiento_1 ?? n.seguimiento_1 ?? row.seguimiento_1),
                seguimiento_2: toNum(updatedData.seguimiento_2 ?? n.seguimiento_2 ?? row.seguimiento_2),
                nota_conceptual_docente: toNum(updatedData.nota_conceptual_docente ?? n.nota_conceptual_docente ?? row.nota_conceptual_docente),
                nota_conceptual_estudiante: toNum(updatedData.nota_conceptual_estudiante ?? n.nota_conceptual_estudiante ?? row.nota_conceptual_estudiante),
                nota_final: toNum(updatedData.nota_final ?? n.nota_final ?? row.nota_final)
              }
              : row
          )
        );
        setSuccess(true);
        handleCloseCalificacionDialog();
      }
    } catch (err: any) {
      console.error("Error al guardar calificaciones:", err);
      let msg = "Error al guardar las calificaciones";

      if (err.response?.data) {
        // Extraer mensaje detallado del backend si existe
        const data = err.response.data;
        if (typeof data === 'string') {
          msg = data;
        } else if (data.message || data.detail || data.error) {
          msg = data.message || data.detail || data.error;
        } else if (typeof data === 'object') {
          // Si es un objeto de errores (ej: {seguimiento_1: ["Error..."]})
          msg = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
        }
      }

      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Obtener grupos únicos para el filtro
  const uniqueGrupos = Array.from(new Set(rows.map((row) => row.grupo_nombre)));

  // Filtrar filas
  const filteredRows = React.useMemo(() => {
    let result = rows;

    if (showOnlyGraded) {
      result = result.filter(row =>
        row.seguimiento_1 !== null ||
        row.seguimiento_2 !== null ||
        row.nota_conceptual_docente !== null ||
        row.nota_conceptual_estudiante !== null ||
        (row.observaciones && row.observaciones.trim() !== "")
      );
    }

    if (selectedGrupos.length === 0) return result;
    return result.filter((row) => selectedGrupos.includes(row.grupo_nombre));
  }, [rows, selectedGrupos, showOnlyGraded]);

  // Estadísticas
  const totalInGroup = rows.length;
  const calificados = rows.filter(
    (r) =>
      r.seguimiento_1 !== null ||
      r.seguimiento_2 !== null ||
      r.nota_conceptual_docente !== null
  ).length;

  if (loading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando estudiantes...</Typography>
      </Box>
    );
  }

  // Si hay error Y no hay filas, mostrar pantalla de error completa
  if (error && rows.length === 0) {
    return (
      <Box className="flex h-screen flex-col items-center justify-center gap-4 p-8">
        <Alert severity="error" sx={{ maxWidth: 600, width: "100%" }}>
          <Typography variant="h6" gutterBottom>Error al cargar estudiantes</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Typography variant="caption" color="textSecondary">
          Endpoint: {API_BASE_URL}/seguimiento_academico/seg/estudiantes-seguimiento/
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header y Filtros */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col gap-4">
          <Box className="flex items-center justify-between flex-wrap gap-2">
            <Typography variant="h5" className="font-bold text-primary">
              Calificador de Estudiantes
            </Typography>
            <Button
              component={Link}
              href="/docente/calificacion/estadisticas"
              startIcon={<BarChartIcon />}
              variant="outlined"
              sx={{
                borderRadius: "12px",
                borderColor: "#c40e1a",
                color: "#c40e1a",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#fef2f2", borderColor: "#a00e1a" },
              }}
            >
              Ver Estadísticas
            </Button>
          </Box>

          <Box className="flex flex-wrap items-center gap-4">
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Filtrar por Grupo</InputLabel>
              <Select
                multiple
                value={selectedGrupos}
                onChange={(e) =>
                  setSelectedGrupos(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                label="Filtrar por Grupo"
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                {uniqueGrupos.map((grupo) => (
                  <MenuItem key={grupo} value={grupo}>
                    {grupo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className="flex items-center gap-2">
              <Typography variant="body2" color="textSecondary">Vista:</Typography>
              <Box
                component="span"
                onClick={() => setShowOnlyGraded(!showOnlyGraded)}
                sx={{
                  width: 40,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: showOnlyGraded ? "#c40e1a" : "#ccc",
                  position: "relative",
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "inline-block"
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: 2,
                    left: showOnlyGraded ? 22 : 2,
                    transition: "0.3s"
                  }}
                />
              </Box>
              <Typography variant="body2" fontWeight={showOnlyGraded ? "bold" : "normal"}>Con notas</Typography>
            </Box>

            <Box className="flex gap-6 ml-auto">
              <Box className="text-center">
                <Typography variant="h6" className="font-bold">
                  {totalInGroup}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  En Grupo
                </Typography>
              </Box>
              <Box className="text-center">
                <Typography variant="h6" className="font-bold text-green-600">
                  {calificados}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Con Notas
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="rounded-2xl shadow-md overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold">Grupo</TableCell>
                <TableCell className="font-bold">Estudiante</TableCell>
                <TableCell className="text-center font-bold">Seg. 1</TableCell>
                <TableCell className="text-center font-bold">Seg. 2</TableCell>
                <TableCell className="text-center font-bold">Conc. Docente</TableCell>
                <TableCell className="text-center font-bold">Conc. Est.</TableCell>
                <TableCell className="text-center font-bold">Nota Final</TableCell>
                <TableCell className="text-center font-bold">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" className="py-10 text-gray-400">
                    No se encontraron estudiantes para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow key={row.id_inscripcion} hover>
                    <TableCell>{row.grupo_nombre}</TableCell>
                    <TableCell>
                      <Typography fontWeight="500">
                        {row.nombre} {row.apellido}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {row.numero_documento}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip value={row.seguimiento_1} />
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip value={row.seguimiento_2} />
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip value={row.nota_conceptual_docente} />
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip value={row.nota_conceptual_estudiante} />
                    </TableCell>
                    <TableCell align="center">
                      {row.nota_final !== null ? (
                        <div
                          className={`inline-block rounded px-3 py-1 font-bold text-white ${row.nota_final >= 3 ? "bg-green-600" : "bg-red-600"
                            }`}
                        >
                          {typeof row.nota_final === "number"
                            ? row.nota_final.toFixed(1)
                            : row.nota_final}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenCalificacionDialog(row)}
                        sx={{
                          borderRadius: "10px",
                          borderColor: "#c40e1a",
                          color: "#c40e1a",
                          "&:hover": {
                            borderColor: "#a00e1a",
                            backgroundColor: "#fee",
                          },
                        }}
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

      {/* Snackbar Notificaciones */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Calificaciones actualizadas correctamente.
        </Alert>
      </Snackbar>

      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Diálogo */}
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

// Subcomponente para las notas en la tabla
function GradeChip({ value }: { value: number | null }) {
  if (value === null || value === undefined) return <Typography color="textSecondary">-</Typography>;
  // El backend puede devolver strings; parseFloat garantiza que toFixed funcione
  const numValue = typeof value === "number" ? value : parseFloat(value as unknown as string);
  if (isNaN(numValue)) return <Typography color="textSecondary">-</Typography>;
  const isPassing = numValue >= 3;
  return (
    <div
      className={`inline-block rounded px-2 py-0.5 text-sm font-semibold ${isPassing ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
        }`}
    >
      {numValue.toFixed(1)}
    </div>
  );
}
