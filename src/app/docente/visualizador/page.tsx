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
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Divider,
  Avatar,
  Alert,
  Grid,
  Snackbar,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Tooltip from "@mui/material/Tooltip";

import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { AsistenciaResponse } from "@/interfaces/interfaces";

export default function VisualizadorAsistencia() {
  // Estados
  const [rows, setRows] = useState<AsistenciaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados para filtros
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0],
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

  // Cargar asistencias
  useEffect(() => {
    const fetchMisGrupos = async () => {
      try {
        const token = getToken();

        const response = await axios.get(`${API_BASE_URL}/asistencia/asis/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // Formatear todos los estudiantes en una sola tabla
          const todosLasAsistencias: AsistenciaResponse[] = response.data;
          console.log("Asistencias obtenidas:", todosLasAsistencias);
          setRows(todosLasAsistencias);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchMisGrupos();
  }, []);

  const handleDelete = (id: number) => {
    const fetchMisGrupos = async () => {
      try {
        const token = getToken();

        const response = await axios.delete(`${API_BASE_URL}/asistencia/asis/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          setSuccess(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al eliminar la asistencia:", error);
        setError("Error al eliminar la asistencia");
        setLoading(false);
      }
    };

    fetchMisGrupos();
  }

  // Handlers para filtros
  const handleChangeGrupos = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedGrupos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeSesiones = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSesiones(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstados = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedEstados(typeof value === "string" ? value.split(",") : value);
  };

  // Filtrar filas
  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;

    return rows.filter((row) => {
      const grupoMatch =
        selectedGrupos.length === 0 ||
        selectedGrupos.includes(row.id_inscripcion.grupo_view.nombre);

      const sesionMatch =
        selectedSesiones.length === 0 || selectedSesiones.includes(row.sesion);

      const estadoMatch =
        selectedEstados.length === 0 ||
        selectedEstados.includes(row.estado_asistencia);

      const fechaMatch =
        fechaSeleccionada === "" || row.fecha_asistencia === fechaSeleccionada;

      return grupoMatch && sesionMatch && estadoMatch && fechaMatch;
    });
  }, [
    rows,
    selectedGrupos,
    selectedSesiones,
    selectedEstados,
    fechaSeleccionada,
  ]);

  // Calcular estadísticas
  const totalEstudiantes = filteredRows.length;
  const estudiantesPresentes = filteredRows.filter(
    (row) => row.estado_asistencia === "Presente",
  ).length;
  const estudiantesAusentes = filteredRows.filter(
    (row) => row.estado_asistencia === "Ausente",
  ).length;
  const gruposUnicos = [
    ...new Set(filteredRows.map((row) => row.id_inscripcion.grupo_view.nombre)),
  ].length;

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
                Asistencia eliminada exitosamente.
              </Alert>
            </Snackbar>

      
      {/* Header con selector de fecha */}
      <Box className="mx-auto mt-4 rounded-2xl bg-white p-4 shadow-md">
        <Typography
          variant="h5"
          className="mb-4 text-center font-bold text-primary"
        >
          Visualizador de Asistencias
        </Typography>

        {/* Filtros */}
        <Box className="mb-4 flex flex-wrap justify-around gap-4">
          <TextField
            className="inputs-textfield w-full sm:w-1/5"
            label="Seleccionar Fecha"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Grupos */}
          <FormControl className="inputs-textfield w-full sm:w-1/5">
            <InputLabel id="filtro-grupos">Grupos</InputLabel>
            <Select
              labelId="filtro-grupos"
              multiple
              value={selectedGrupos}
              onChange={handleChangeGrupos}
              renderValue={(selected) => selected.join(", ")}
              label="Grupos"
            >
              {[
                ...new Set(
                  rows.map((row) => row.id_inscripcion.grupo_view.nombre),
                ),
              ].map((grupo) => (
                <MenuItem key={grupo} value={grupo}>
                  <Checkbox checked={selectedGrupos.indexOf(grupo) > -1} />
                  <ListItemText primary={grupo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sesión */}
          <FormControl className="inputs-textfield w-full sm:w-1/5">
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

          {/* Estado Asistencia */}
          <FormControl className="inputs-textfield w-full sm:w-1/5">
            <InputLabel id="filtro-estados">Estado Asistencia</InputLabel>
            <Select
              labelId="filtro-estados"
              multiple
              value={selectedEstados}
              onChange={handleChangeEstados}
              renderValue={(selected) => selected.join(", ")}
              label="Estado Asistencia"
            >
              {["Presente", "Ausente"].map((estado) => (
                <MenuItem key={estado} value={estado}>
                  <Checkbox checked={selectedEstados.indexOf(estado) > -1} />
                  <ListItemText primary={estado} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Indicadores */}
      <Box className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Card Total Registros */}
        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <PersonIcon className="mb-2 text-purple-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-purple-600">
              {totalEstudiantes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Registros
            </Typography>
          </CardContent>
        </Card>

        {/* Card Presentes */}
        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <CheckCircleIcon className="mb-2 text-green-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-green-600">
              {estudiantesPresentes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Presentes
            </Typography>
          </CardContent>
        </Card>

        {/* Card Ausentes */}
        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
            <CancelIcon className="mb-2 text-red-500" fontSize="large" />
            <Typography variant="h4" className="font-bold text-red-600">
              {estudiantesAusentes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ausentes
            </Typography>
          </CardContent>
        </Card>

        {/* Card Grupos */}
        <Card className="rounded-2xl">
          <CardContent className="flex w-full flex-row items-center justify-around sm:flex-col sm:text-center">
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

      {/* Tabla de asistencia */}
      <div className="mx-auto mt-4 rounded-2xl bg-white p-4 text-center shadow-md">
        {/* Cards de estudiantes */}
        <div className="mx-auto mt-4 w-11/12">
          <Typography variant="body2" className="text-gray-600">
            Mostrando {filteredRows.length} de {totalEstudiantes} registros para{" "}
            {fechaSeleccionada}
          </Typography>

          {/* Visualizador Vertical */}
          <Grid container spacing={2} className="mt-4 lg:hidden">
            {filteredRows.map((asistencia) => (
              <Grid key={asistencia.id_asistencia}>
                <Card variant="outlined">
                  <CardContent className="flex flex-col justify-between p-3">
                    {/* Header del estudiante */}
                    <Box className="mb-3 flex flex-row gap-2">
                      {/* <Avatar
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
                      </Avatar> */}
                      <Box className="flex-1">
                        <Typography fontWeight="bold" className="line-clamp-2">
                          {asistencia.id_inscripcion.id_estudiante.nombre}{" "}
                          {asistencia.id_inscripcion.id_estudiante.apellido}
                        </Typography>
                        <Box className="flex items-center gap-1">
                          <BadgeIcon
                            sx={{ fontSize: 14, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {
                              asistencia.id_inscripcion.id_estudiante
                                .numero_documento
                            }
                          </Typography>
                        </Box>
                        {/* Información del grupo */}
                        <Box className="flex items-center gap-1">
                          <GroupIcon
                            sx={{ fontSize: 14, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {asistencia.id_inscripcion.grupo_view.nombre}
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
                            asistencia.estado_asistencia === "Presente"
                              ? "contained"
                              : "outlined"
                          }
                          color="success"
                          // onClick={() =>
                          //   handleAsistenciaChange(estudiante.id, true)
                          // }
                          startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          className="flex-1 rounded-xl"
                          sx={{ fontSize: "0.7rem", py: 0.5 }}
                        >
                          Presente
                        </Button>
                        <Button
                          size="small"
                          variant={
                            asistencia.estado_asistencia === "Ausente"
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          // onClick={() =>
                          //   handleAsistenciaChange(estudiante.id, false)
                          // }
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
                        value={asistencia.comentarios || ""}
                        // onChange={(e) =>
                        //   handleObservacionesChange(
                        //     asistencia.id_asistencia,
                        //     e.target.value,
                        //   )
                        // }
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

          {/* Visualizador Horizontal*/}
          <div className="hidden flex-col gap-4 lg:flex">
            {filteredRows.map((asistencia) => (
              <Card key={asistencia.id_asistencia} className="shadow-none">
                <CardContent className="flex flex-row items-center justify-between">
                  {/* Sección izquierda: Avatar + Info */}
                  <Box className="flex w-full items-center justify-around gap-3">
                    {/* <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: getAvatarColor(asistencia.estado_asistencia),
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {asistencia.nombre.charAt(0)}
                      {asistencia.apellido.charAt(0)}
                    </Avatar> */}

                    <Typography variant="body1" fontWeight="600">
                      {asistencia.id_inscripcion.id_estudiante.nombre}{" "}
                      {asistencia.id_inscripcion.id_estudiante.apellido}
                    </Typography>

                    <Box className="flex items-center gap-1">
                      <BadgeIcon sx={{ fontSize: 16, color: "#666" }} />
                      <Typography color="text.secondary">
                        {
                          asistencia.id_inscripcion.id_estudiante
                            .numero_documento
                        }
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-1">
                      <GroupIcon sx={{ fontSize: 16, color: "#666" }} />
                      <Typography color="text.secondary">
                        {asistencia.id_inscripcion.grupo_view.nombre}
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-1">
                      <Typography color="text.secondary">
                        {asistencia.fecha_asistencia}
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-1">
                      <Typography color="text.secondary">
                        Sesión {asistencia.sesion}
                      </Typography>
                    </Box>

                    {/* Sección derecha: Botones de acción */}
                    <Box className="flex flex-col gap-2 sm:min-w-[280px]">
                      <Box className="flex gap-2">
                        <Button
                          size="medium"
                          variant={
                            asistencia.estado_asistencia === "Presente"
                              ? "contained"
                              : "outlined"
                          }
                          color="success"
                          startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          // onClick={() =>
                          //   handleAsistenciaChange(estudiante.id, true)
                          // }
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
                            asistencia.estado_asistencia === "Ausente"
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                          // onClick={() =>
                          //   handleAsistenciaChange(estudiante.id, false)
                          // }
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
                      {asistencia.comentarios !== "" && (
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Observaciones..."
                          value={asistencia.comentarios || ""}
                          // onChange={(e) =>
                          //   handleObservacionesChange(
                          //     estudiante.id,
                          //     e.target.value,
                          //   )
                          // }
                          className="inputs-textfield rounded-xl"
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

                    <Box className="flex gap-2">
                      <VisibilityOutlinedIcon className="text-secondary hover:text-primary" />
                      <TrashIcon className="h-6 w-6 text-secondary hover:text-primary"
                      onClick={() => handleDelete(asistencia.id_asistencia)} />
                    </Box>
                  </Box>
                </CardContent>
                <Divider></Divider>
              </Card>
            ))}
          </div>
        </div>

        {/* Botón para guardar asistencia */}
        {/* <Box className="mt-4">
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
        </Box> */}
      </div>
    </div>
  );
}
