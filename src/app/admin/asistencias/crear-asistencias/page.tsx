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
} from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CrearAsistencias() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fecha_asistencia: "",
    estado_asistencia: "Presente",
    comentarios: "",
    estudiante_id: "",
    sesion_id: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/asistencia/asis/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          fecha_asistencia: "",
          estado_asistencia: "Presente",
          comentarios: "",
          estudiante_id: "",
          sesion_id: "",
        });
        setTimeout(() => {
          router.push("/admin/asistencias/ver-asistencias");
        }, 2000);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      console.error("Error al crear asistencia:", axiosError);
      setError("Error al crear el registro de asistencia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <h1>Crear Asistencia</h1>

        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">
            Asistencia creada exitosamente. Redirigiendo...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
            label="ID Estudiante"
            name="estudiante_id"
            value={formData.estudiante_id}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="ID Sesión"
            name="sesion_id"
            value={formData.sesion_id}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Comentarios"
            name="comentarios"
            value={formData.comentarios}
            onChange={handleInputChange}
            multiline
            rows={4}
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Asistencia"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}