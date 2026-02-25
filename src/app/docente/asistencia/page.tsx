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
  Checkbox,
  ListItemText,
  Snackbar,
  Avatar,
  Grid,
  Divider,
  Alert,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import axios from "axios";
import { API_BASE_URL } from "../../../../config";

import { AsistenciaSent } from "@/interfaces/interfaces";

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

interface EstudianteRow {
  id: number;
  grupo_id: number;
  grupo_nombre: string;
  apellido: string;
  nombre: string;
  numero_documento: string;
  email: string;
  colegio: string;
  tipo_vinculacion: string;
  asistio: boolean | null; // null = no marcado, true = asistió, false = no asistió
  observaciones: string;
}

export default function AsistenciaDocente() {
  const getAvatarColor = (asistio: boolean | null) => {
    if (asistio === true) return "#4caf50"; // Verde
    if (asistio === false) return "#f44336"; // Rojo
    return "#9e9e9e"; // Gris
  };

  // Estados
  const [rows, setRows] = useState<EstudianteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estados para filtros
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);

  // Estados para asistencia
  const [fechaAsistencia, setFechaAsistencia] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [sesionSeleccionada, setSesionSeleccionada] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
          const todosLosEstudiantes: EstudianteRow[] = [];

          response.data.forEach((grupo: Grupo) => {
            grupo.estudiantes.forEach((estudiante: Estudiante) => {
              todosLosEstudiantes.push({
                id: estudiante.id_inscripcion,
                grupo_id: grupo.id,
                grupo_nombre: grupo.nombre,
                apellido: estudiante.apellido,
                nombre: estudiante.nombre,
                numero_documento: estudiante.numero_documento,
                email: estudiante.email,
                colegio: estudiante.colegio,
                tipo_vinculacion: estudiante.tipo_vinculacion,
                asistio: null, // Inicialmente sin marcar
                observaciones: "",
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

  // Handler para cambio de asistencia
  const handleAsistenciaChange = (estudianteId: number, asistio: boolean) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === estudianteId ? { ...row, asistio } : row,
      ),
    );
  };

  // Handler para cambio de observaciones
  const handleObservacionesChange = (
    estudianteId: number,
    observaciones: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === estudianteId ? { ...row, observaciones } : row,
      ),
    );
  };

  // Función para marcar todos como presentes
  const handleMarcarTodosPresentes = () => {
    setRows((prevRows) => prevRows.map((row) => ({ ...row, asistio: true })));
  };

  // Función para marcar todos como ausentes
  const handleMarcarTodosAusentes = () => {
    setRows((prevRows) => prevRows.map((row) => ({ ...row, asistio: false })));
  };

  // Función para limpiar asistencia
  const handleLimpiarAsistencia = () => {
    setRows((prevRows) =>
      prevRows.map((row) => ({ ...row, asistio: null, observaciones: "" })),
    );
  };

  // Función para guardar asistencia
  const handleGuardarAsistencia = async () => {
    const estudiantesConAsistencia = filteredRows.filter(
      (row) => row.asistio !== null,
    );

    if (estudiantesConAsistencia.length === 0) {
      alert("Debe marcar la asistencia de al menos un estudiante");
      return;
    }

    if (!fechaAsistencia) {
      alert("Debe seleccionar una fecha de asistencia");
      return;
    }

    if (!sesionSeleccionada) {
      alert("Debe seleccionar una sesión");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();

      // Formatear los datos según el nuevo formato del endpoint
      const asistenciaData: AsistenciaSent[] = estudiantesConAsistencia.map(
        (row) => ({
          id_inscripcion_id: row.id,
          fecha_asistencia: fechaAsistencia,
          estado_asistencia: row.asistio ? "Presente" : "Ausente",
          comentarios: row.observaciones || "",
          sesion: sesionSeleccionada,
        }),
      );

      console.log("Datos a enviar:", asistenciaData); // Para debugging

      const response = await axios.post(
        `${API_BASE_URL}/asistencia/asis/`,
        asistenciaData, // Enviar directamente el array
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        // Limpiar formulario después de guardar
        handleLimpiarAsistencia();
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error al guardar asistencia:", error);

      // Mostrar error más específico
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al guardar la asistencia";
        alert(errorMessage);
      } else {
        alert("Error al guardar la asistencia");
      }
    } finally {
      setSaving(false);
    }
  };

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

  // Calcular estadísticas de asistencia
  const estudiantesConAsistencia = filteredRows.filter(
    (row) => row.asistio !== null,
  );
  const estudiantesPresentes = filteredRows.filter(
    (row) => row.asistio === true,
  );
  const estudiantesAusentes = filteredRows.filter(
    (row) => row.asistio === false,
  );
  const totalEstudiantes = filteredRows.length;

  if (loading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="mx-auto w-11/12">
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Asistencia guardada exitosamente.
        </Alert>
      </Snackbar>

      {/* Header con control de fecha y sesión */}
      <Box className="mx-auto mt-4 rounded-2xl bg-white p-4 shadow-md">
        <Typography
          variant="h5"
          className="mb-4 text-center font-bold text-primary"
        >
          Control de Asistencias
        </Typography>

        <Box className="mb-2 flex flex-col justify-around gap-3 sm:flex-row">
          {/* Inputs para fecha, sesión y grupos */}
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Fecha de Asistencia"
            type="date"
            value={fechaAsistencia}
            onChange={(e) => setFechaAsistencia(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
            <InputLabel id="sesion-label">Sesión</InputLabel>
            <Select
              labelId="sesion-label"
              value={sesionSeleccionada}
              onChange={(e) => setSesionSeleccionada(e.target.value)}
              label="Sesión"
            >
              <MenuItem value="1">Uno</MenuItem>
              <MenuItem value="2">Dos</MenuItem>
            </Select>
          </FormControl>

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
              {[...new Set(rows.map((row) => row.grupo_nombre))].map(
                (grupo) => (
                  <MenuItem key={grupo} value={grupo}>
                    <Checkbox checked={selectedGrupos.indexOf(grupo) > -1} />
                    <ListItemText primary={grupo} />
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Indicadores generales */}
      <Box className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <PersonIcon className="text-blue-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-blue-600">
              {totalEstudiantes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Estudiantes
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <CheckCircleIcon className="text-green-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-green-600">
              {estudiantesPresentes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Presentes
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <CancelIcon className="text-red-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-red-600">
              {estudiantesAusentes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ausentes
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <CalendarTodayIcon className="text-orange-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-orange-600">
              {estudiantesConAsistencia.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Marcados
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla de asistencia */}
      <div className="mx-auto mt-4 rounded-2xl bg-white p-4 text-center shadow-md">
        {/* Cards de estudiantes */}
        <div className="mx-auto mt-4 w-11/12">
          <Typography
            variant="body2"
            className="mb-4 text-center text-gray-600"
          >
            Mostrando {filteredRows.length} estudiantes | Marcados:{" "}
            {estudiantesConAsistencia.length} | Presentes:{" "}
            {estudiantesPresentes.length} | Ausentes:{" "}
            {estudiantesAusentes.length}
          </Typography>

          {/* Botones de acción rápida */}
          <Box className="mb-4 flex flex-wrap justify-center gap-2">
            <Button
              variant="outlined"
              className="rounded-xl"
              color="success"
              onClick={handleMarcarTodosPresentes}
              size="small"
            >
              Marcar Todos Presentes
            </Button>
            <Button
              variant="outlined"
              className="rounded-xl"
              color="error"
              onClick={handleMarcarTodosAusentes}
              size="small"
            >
              Marcar Todos Ausentes
            </Button>
            <Button
              variant="outlined"
              className="rounded-xl"
              onClick={handleLimpiarAsistencia}
              size="small"
            >
              Limpiar Todo
            </Button>
          </Box>

          <Grid container spacing={2} className="mt-4 lg:hidden">
            {filteredRows.map((estudiante) => (
              <Grid key={estudiante.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor:
                      estudiante.asistio === true
                        ? "#4caf50"
                        : estudiante.asistio === false
                          ? "#f44336"
                          : "white",
                    borderWidth: estudiante.asistio !== null ? 2 : 1,
                    backgroundColor:
                      estudiante.asistio === true
                        ? "#e8f5e8"
                        : estudiante.asistio === false
                          ? "#ffeaea"
                          : "white",
                    height: "100%",
                  }}
                >
                  <CardContent className="flex flex-col justify-between p-3">
                    {/* Header del estudiante */}
                    <Box className="mb-3 flex flex-row gap-2">
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                          bgcolor: getAvatarColor(estudiante.asistio),
                          fontSize: "1rem",
                          fontWeight: "bold",
                        }}
                      >
                        {estudiante.nombre.charAt(0)}
                        {estudiante.apellido.charAt(0)}
                      </Avatar>
                      <Box className="flex-1">
                        <Typography fontWeight="bold" className="line-clamp-2">
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

                    {/* Botones de asistencia */}
                    <Box className="flex flex-col gap-2">
                      <Box className="flex gap-1">
                        <Button
                          size="small"
                          variant={
                            estudiante.asistio === true
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
                            estudiante.asistio === false
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
              </Grid>
            ))}
          </Grid>

          {/* Lista vertical de estudiantes - diseño horizontal */}
          <div className="hidden flex-col gap-4 lg:flex">
            {filteredRows.map((estudiante) => (
              <Card
                key={estudiante.id}
                variant="outlined"
                sx={{
                  borderColor:
                    estudiante.asistio === true
                      ? "#4caf50"
                      : estudiante.asistio === false
                        ? "#f44336"
                        : "white",
                  borderWidth: estudiante.asistio !== null ? 2 : 1,
                  backgroundColor:
                    estudiante.asistio === true
                      ? "#f1f8f4"
                      : estudiante.asistio === false
                        ? "#fef1f1"
                        : "white",
                }}
              >
                <CardContent className="flex flex-row items-center justify-around">
                  {/* Sección izquierda: Avatar + Info */}
                  <Box className="flex w-full items-center justify-around gap-3">
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: getAvatarColor(estudiante.asistio),
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {estudiante.nombre.charAt(0)}
                      {estudiante.apellido.charAt(0)}
                    </Avatar>

                    <Typography variant="body1" fontWeight="600">
                      {estudiante.nombre} {estudiante.apellido}
                    </Typography>

                    <Box className="flex items-center gap-1">
                      <BadgeIcon sx={{ fontSize: 16, color: "#666" }} />
                      <Typography color="text.secondary">
                        {estudiante.numero_documento}
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-1">
                      <GroupIcon sx={{ fontSize: 16, color: "#666" }} />
                      <Typography color="text.secondary">
                        {estudiante.grupo_nombre}
                      </Typography>
                    </Box>

                    {/* Sección derecha: Botones de acción */}
                    <Box className="flex flex-col gap-2 sm:min-w-[280px]">
                      <Box className="flex gap-2">
                        <Button
                          size="medium"
                          variant={
                            estudiante.asistio === true
                              ? "contained"
                              : "outlined"
                          }
                          color="success"
                          startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          onClick={() =>
                            handleAsistenciaChange(estudiante.id, true)
                          }
                          className="flex-1 rounded-xl"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                          }}
                        >
                          Presente
                        </Button>
                        <Button
                          size="medium"
                          variant={
                            estudiante.asistio === false
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                          onClick={() =>
                            handleAsistenciaChange(estudiante.id, false)
                          }
                          className="flex-1 rounded-xl"
                          sx={{
                            fontSize: "0.875rem",
                            textTransform: "none",
                            fontWeight: 500,
                          }}
                        >
                          Ausente
                        </Button>
                      </Box>

                      {/* Campo de observaciones (opcional, colapsable) */}
                      {estudiante.asistio !== null && (
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Agregar observación..."
                          value={estudiante.observaciones || ""}
                          onChange={(e) =>
                            handleObservacionesChange(
                              estudiante.id,
                              e.target.value,
                            )
                          }
                          className="rounded-xl"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontSize: "0.875rem",
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
                <Divider></Divider>
              </Card>
            ))}
          </div>
        </div>

        {/* Botón para guardar asistencia */}
        <Box className="mt-4">
          <Button
            className="rounded-2xl"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={() => setShowConfirmDialog(true)}
            disabled={estudiantesConAsistencia.length === 0 || saving}
            sx={{
              backgroundColor: "#c40e1a",
              "&:hover": {
                backgroundColor: "#a00e1a",
              },
            }}
          >
            {saving
              ? "Guardando..."
              : `Guardar Asistencia (${estudiantesConAsistencia.length})`}
          </Button>
        </Box>
      </div>

      {/* Dialog de confirmación */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Confirmar Asistencia</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de guardar la asistencia del día{" "}
            <strong>{fechaAsistencia}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            • Estudiantes marcados: {estudiantesConAsistencia.length}
            <br />• Presentes: {estudiantesPresentes.length}
            <br />• Ausentes: {estudiantesAusentes.length}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
          <Button
            className="rounded-xl"
            onClick={handleGuardarAsistencia}
            variant="contained"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
