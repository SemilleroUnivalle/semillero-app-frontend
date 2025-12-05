"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
} from "@mui/material";
import {
  AccessTime,
  Assignment,
  Category,
  CheckCircle,
  Close,
  ExpandMore,
  School,
  Edit,
  Delete,
} from "@mui/icons-material";
import { API_BASE_URL } from "../../../../../config";

// Interfaces basadas en la estructura del endpoint
interface Area {
  id_area: number;
  nombre_area: string;
  estado_area: boolean;
  imagen_area: string;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
  estado: boolean;
}

interface Modulo {
  id_modulo: number;
  id_categoria: Categoria;
  id_area: Area;
  nombre_modulo: string;
  descripcion_modulo: string;
  intensidad_horaria: number;
  dirigido_a: string;
  incluye: string;
  imagen_modulo: string;
  estado: boolean;
  id_oferta_categoria: number[];
}

interface Respuesta {
  id_respuesta: number;
  texto_respuesta: string;
  es_correcta: boolean;
  fecha_creacion: string;
}

interface Pregunta {
  id_pregunta: number;
  texto_pregunta: string;
  tipo_pregunta: string;
  puntaje: string;
  imagen: string | null;
  explicacion: string;
  estado: boolean;
  fecha_creacion: string;
  respuestas: Respuesta[];
}

interface PruebaDiagnostica {
  id_prueba: number;
  id_modulo: Modulo;
  nombre_prueba: string;
  descripcion: string;
  tiempo_limite: number;
  puntaje_minimo: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  preguntas: Pregunta[];
  total_preguntas: number;
}

export default function VerPruebas() {
  const [pruebas, setPruebas] = useState<PruebaDiagnostica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pruebaSeleccionada, setPruebaSeleccionada] =
    useState<PruebaDiagnostica | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  // Cargar pruebas desde el endpoint
  useEffect(() => {
    const cargarPruebas = async () => {
      setCargando(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/prueba_diagnostica/pruebas/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar las pruebas diagnósticas");
        }

        const data = await response.json();
        setPruebas(data);
      } catch (error) {
        console.error("Error cargando pruebas:", error);
        setError(
          "No se pudieron cargar las pruebas. Por favor, intenta nuevamente."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPruebas();
  }, []);

  const abrirDetalles = (prueba: PruebaDiagnostica) => {
    setPruebaSeleccionada(prueba);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPruebaSeleccionada(null);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEliminarPrueba = async () => {
    if (!pruebaSeleccionada) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/prueba_diagnostica/pruebas/${pruebaSeleccionada.id_prueba}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la prueba");
      }

      // Actualizar la lista de pruebas
      setPruebas(pruebas.filter((p) => p.id_prueba !== pruebaSeleccionada.id_prueba));
      setSnackbar({
        open: true,
        message: "Prueba eliminada exitosamente",
        severity: "success",
      });
      cerrarModal();
      setConfirmacionEliminar(false);
    } catch (error) {
      console.error("Error eliminando prueba:", error);
      setSnackbar({
        open: true,
        message: "Error al eliminar la prueba. Intenta nuevamente.",
        severity: "error",
      });
    }
  };

  const handleEditarPrueba = () => {
    if (!pruebaSeleccionada) return;
    window.location.href = `/admin/pruebas-diagnosticas/editar-pruebas/${pruebaSeleccionada.id_prueba}`;
  };

  if (cargando) {
    return (
      <Box className="flex min-h-[400px] items-center justify-center">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="mx-auto w-11/12">
        <Alert severity="error" className="rounded-2xl">
          {error}
        </Alert>
      </Box>
    );
  }

  if (pruebas.length === 0) {
    return (
      <Box className="mx-auto w-11/12">
        <Alert severity="info" className="rounded-2xl">
          No hay pruebas diagnósticas disponibles en este momento.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="mx-auto w-11/12 pb-8">
      <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pruebas.map((prueba) => (
          <Card
            key={prueba.id_prueba}
            className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl"
            onClick={() => abrirDetalles(prueba)}
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #c20e1a 0%, #a00c15 100%)",
              color: "white",
            }}
          >
            <CardContent className="flex h-full flex-col">
              {/* Encabezado con área */}
              <Box className="mb-3 flex items-center gap-2">
                <School fontSize="small" />
                <Typography variant="caption" className="font-semibold">
                  {prueba.id_modulo.id_area.nombre_area}
                </Typography>
              </Box>

              {/* Título de la prueba */}
              <Typography
                variant="h6"
                className="mb-2 font-bold"
                sx={{ minHeight: "64px" }}
              >
                {prueba.nombre_prueba}
              </Typography>

              {/* Módulo */}
              <Typography variant="body2" className="mb-3 opacity-90">
                Módulo: {prueba.id_modulo.nombre_modulo}
              </Typography>

              {/* Información clave */}
              <Box className="mt-auto space-y-2">
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-1">
                    <Assignment fontSize="small" />
                    <Typography variant="body2">
                      {prueba.total_preguntas} preguntas
                    </Typography>
                  </Box>
                  <Chip
                    label={prueba.estado ? "Activa" : "Inactiva"}
                    size="small"
                    sx={{
                      backgroundColor: prueba.estado
                        ? "rgba(76, 175, 80, 0.3)"
                        : "rgba(244, 67, 54, 0.3)",
                      color: "white",
                    }}
                  />
                </Box>

                <Box className="flex items-center gap-1">
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">
                    {prueba.tiempo_limite} minutos
                  </Typography>
                </Box>

                <Box className="flex items-center gap-1">
                  <CheckCircle fontSize="small" />
                  <Typography variant="body2">
                    Puntaje mínimo: {prueba.puntaje_minimo}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Modal de detalles */}
      <Dialog
        open={modalAbierto}
        onClose={cerrarModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        {pruebaSeleccionada && (
          <>
            <DialogTitle sx={{ background: "linear-gradient(to right, #c20e1a, #a00c15)", color: "white" }}>
              <Box className="flex items-start justify-between">
                <Box>
                  <Typography variant="h5" className="font-bold">
                    {pruebaSeleccionada.nombre_prueba}
                  </Typography>
                  <Typography variant="body2" className="mt-1 opacity-90">
                    {pruebaSeleccionada.id_modulo.id_area.nombre_area} -{" "}
                    {pruebaSeleccionada.id_modulo.nombre_modulo}
                  </Typography>
                </Box>
                <IconButton onClick={cerrarModal} sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent className="mt-4">
              {/* Descripción */}
              <Box className="mb-4">
                <Typography variant="h6" className="mb-2 font-semibold">
                  Descripción
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {pruebaSeleccionada.descripcion ||
                    "Sin descripción disponible"}
                </Typography>
              </Box>

              <Divider className="my-4" />

              {/* Información general */}
              <Box className="mb-4 grid grid-cols-2 gap-2">
                <Box sx={{ backgroundColor: "#fce8e9", borderRadius: "8px", padding: "12px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Tiempo límite
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#c20e1a" }}>
                    {pruebaSeleccionada.tiempo_limite} min
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#f9d1d3", borderRadius: "8px", padding: "12px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Puntaje mínimo
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#c20e1a" }}>
                    {pruebaSeleccionada.puntaje_minimo}%
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#f5babe", borderRadius: "8px", padding: "12px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Total preguntas
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#a00c15" }}>
                    {pruebaSeleccionada.total_preguntas}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#f2a3a8", borderRadius: "8px", padding: "12px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Estado
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#a00c15" }}>
                    {pruebaSeleccionada.estado ? "Activa" : "Inactiva"}
                  </Typography>
                </Box>
              </Box>

              <Divider className="my-4" />

              {/* Preguntas */}
              <Box>
                <Typography variant="h6" className="mb-3 font-semibold">
                  Preguntas ({pruebaSeleccionada.preguntas.length})
                </Typography>

                {pruebaSeleccionada.preguntas.map((pregunta, index) => (
                  <Accordion key={pregunta.id_pregunta} className="mb-2">
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box className="flex w-full items-center justify-between pr-4">
                        <Typography className="font-medium">
                          Pregunta {index + 1}
                        </Typography>
                        <Chip
                          label={`${pregunta.puntaje} pts`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography className="mb-3 font-medium">
                          {pregunta.texto_pregunta}
                        </Typography>

                        {pregunta.imagen && (
                          <Box className="mb-3">
                            <img
                              src={pregunta.imagen}
                              alt="Imagen de la pregunta"
                              className="max-h-48 rounded-lg"
                            />
                          </Box>
                        )}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mb-2"
                        >
                          Tipo: {pregunta.tipo_pregunta}
                        </Typography>

                        <Typography
                          variant="subtitle2"
                          className="mb-2 font-semibold"
                        >
                          Respuestas:
                        </Typography>

                        <Box className="space-y-2">
                          {pregunta.respuestas.map((respuesta) => (
                            <Box
                              key={respuesta.id_respuesta}
                              className={`rounded-lg border-2 p-2 ${respuesta.es_correcta
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 bg-gray-50"
                                }`}
                            >
                              <Box className="flex items-center justify-between">
                                <Typography variant="body2">
                                  {respuesta.texto_respuesta}
                                </Typography>
                                {respuesta.es_correcta && (
                                  <CheckCircle
                                    fontSize="small"
                                    className="text-green-600"
                                  />
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        {pregunta.explicacion && (
                          <Box sx={{ marginTop: "12px", borderRadius: "8px", backgroundColor: "#fce8e9", padding: "12px" }}>
                            <Typography
                              variant="caption"
                              className="font-semibold"
                            >
                              Explicación:
                            </Typography>
                            <Typography variant="body2">
                              {pregunta.explicacion}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>

              <Divider className="my-4" />

              {/* Fechas */}
              <Box className="rounded-lg bg-gray-50 p-3">
                <Typography variant="caption" color="text.secondary">
                  Fecha de creación:{" "}
                  {formatearFecha(pruebaSeleccionada.fecha_creacion)}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Última modificación:{" "}
                  {formatearFecha(pruebaSeleccionada.fecha_modificacion)}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions className="p-4">
              <Box className="flex w-full justify-between">
                <Box className="flex gap-2">
                  <Button
                    onClick={handleEditarPrueba}
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#c20e1a",
                      color: "#c20e1a",
                      '&:hover': {
                        borderColor: "#a00c15",
                        backgroundColor: "#fce8e9",
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => setConfirmacionEliminar(true)}
                    variant="outlined"
                    startIcon={<Delete />}
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#c20e1a",
                      color: "#c20e1a",
                      '&:hover': {
                        borderColor: "#a00c15",
                        backgroundColor: "#fce8e9",
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
                <Button
                  onClick={cerrarModal}
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                    background: "linear-gradient(to right, #c20e1a, #a00c15)",
                    '&:hover': {
                      background: "linear-gradient(to right, #a00c15, #800a11)",
                    }
                  }}
                >
                  Cerrar
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={confirmacionEliminar}
        onClose={() => setConfirmacionEliminar(false)}
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle sx={{ background: "linear-gradient(to right, #c20e1a, #a00c15)", color: "white" }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent className="mt-4">
          <Typography>
            ¿Estás seguro de que deseas eliminar la prueba diagnóstica{" "}
            <strong>{pruebaSeleccionada?.nombre_prueba}</strong>?
          </Typography>
          <Typography className="mt-2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setConfirmacionEliminar(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#666",
              color: "#666",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEliminarPrueba}
            variant="contained"
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(to right, #c20e1a, #a00c15)",
              '&:hover': {
                background: "linear-gradient(to right, #a00c15, #800a11)",
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
