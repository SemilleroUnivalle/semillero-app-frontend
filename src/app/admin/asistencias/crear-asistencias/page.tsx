"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  Divider,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import { API_BASE_URL } from "../../../../../config";

interface Inscripcion {
  id_inscripcion: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  modulo: string | null;
  grupo: string | null;
}

export default function CrearAsistencias() {
  const router = useRouter();

  // Paso 1: búsqueda por documento
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [inscripciones, setInscripciones] = useState<Inscripcion[] | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  // Paso 2: selección e inscripción
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<Inscripcion | null>(null);

  // Paso 3: formulario de asistencia
  const [formData, setFormData] = useState({
    fecha_asistencia: new Date().toISOString().split("T")[0],
    estado_asistencia: "Presente",
    comentarios: "",
    sesion: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  // --- PASO 1: Buscar estudiante por número de documento ---
  const handleBuscar = async () => {
    if (!numeroDocumento.trim()) return;
    setBuscando(true);
    setErrorBusqueda(null);
    setInscripciones(null);
    setInscripcionSeleccionada(null);
    setError(null);
    setSuccess(false);

    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/inscripcion/buscar-por-documento/`,
        {
          params: { numero_documento: numeroDocumento.trim() },
          headers: { Authorization: `Token ${token}` },
        }
      );
      setInscripciones(response.data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ detail?: string; codigo?: string }>;
      if (axiosError.response?.status === 404) {
        const detail = axiosError.response.data?.detail;
        setErrorBusqueda(detail ?? "No se encontraron resultados para ese número de documento.");
      } else {
        setErrorBusqueda("Error al buscar el estudiante. Verifica el número de documento.");
      }
    } finally {
      setBuscando(false);
    }
  };

  // --- PASO 3: Enviar asistencia ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inscripcionSeleccionada) return;

    setEnviando(true);
    setError(null);

    try {
      const token = getToken();
      const payload = {
        id_inscripcion_id: inscripcionSeleccionada.id_inscripcion,
        fecha_asistencia: formData.fecha_asistencia,
        estado_asistencia: formData.estado_asistencia,
        comentarios: formData.comentarios,
        sesion: formData.sesion,
      };

      const response = await axios.post(
        `${API_BASE_URL}/asistencia/asis/`,
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/asistencias/ver-asistencias");
        }, 2000);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<Record<string, string[]>>;
      console.error("Error al crear asistencia:", axiosError.response?.data);
      setError("Error al registrar la asistencia. Verifica los datos e intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Registrar Asistencia
        </Typography>

        {/* ── PASO 1: Buscar por documento ── */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Paso 1 · Buscar estudiante por número de documento
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Número de documento"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleBuscar}
            disabled={buscando || !numeroDocumento.trim()}
            startIcon={buscando ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Buscar
          </Button>
        </Box>

        {errorBusqueda && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {errorBusqueda}
          </Alert>
        )}

        {/* ── PASO 2: Seleccionar inscripción ── */}
        {inscripciones && inscripciones.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Paso 2 · Seleccionar inscripción del estudiante
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              <strong>{inscripciones[0].nombre} {inscripciones[0].apellido}</strong>
              {" · "}{inscripciones[0].numero_documento}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {inscripciones.map((ins) => (
                <Card
                  key={ins.id_inscripcion}
                  variant="outlined"
                  onClick={() => setInscripcionSeleccionada(ins)}
                  sx={{
                    cursor: "pointer",
                    borderColor:
                      inscripcionSeleccionada?.id_inscripcion === ins.id_inscripcion
                        ? "primary.main"
                        : "divider",
                    bgcolor:
                      inscripcionSeleccionada?.id_inscripcion === ins.id_inscripcion
                        ? "primary.50"
                        : "background.paper",
                    transition: "border-color 0.2s",
                  }}
                >
                  <CardContent sx={{ py: "10px !important", px: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SchoolIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {ins.modulo ?? "Módulo no asignado"}
                      </Typography>
                      {ins.grupo && (
                        <Chip label={`Grupo: ${ins.grupo}`} size="small" />
                      )}
                      <Chip
                        label={`ID Insc. ${ins.id_inscripcion}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* ── PASO 3: Formulario de asistencia ── */}
        {inscripcionSeleccionada && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Paso 3 · Datos de la asistencia
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ¡Asistencia registrada exitosamente! Redirigiendo...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha_asistencia"
                type="date"
                value={formData.fecha_asistencia}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                select
                label="Estado de asistencia"
                name="estado_asistencia"
                value={formData.estado_asistencia}
                onChange={handleInputChange}
                margin="normal"
                required
              >
                {["Presente", "Ausente", "Tardanza", "Justificado"].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Sesión"
                name="sesion"
                value={formData.sesion}
                onChange={handleInputChange}
                margin="normal"
                placeholder="Ej: Sesión 1, Clase magistral..."
              />

              <TextField
                fullWidth
                label="Comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                multiline
                rows={3}
                margin="normal"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={enviando || success}
              >
                {enviando ? <CircularProgress size={20} color="inherit" /> : "Registrar Asistencia"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}