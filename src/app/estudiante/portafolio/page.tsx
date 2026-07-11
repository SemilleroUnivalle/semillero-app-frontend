"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import {
  SchoolOutlined,
  EmojiEventsOutlined,
  DownloadOutlined,
  VisibilityOutlined as VisibilityOutlinedIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Link from "next/link";

interface Inscripcion {
  id_inscripcion: number;
  modulo: {
    nombre_modulo: string;
  };
  oferta_categoria: {
    id_oferta_academica: {
      nombre: string;
      fecha_inicio: string;
    };
  };
  certificado_academico: string | null;
  grupo: string | null;
  fecha_inscripcion: string;
}

export default function Portafolio() {
  const [certificados, setCertificados] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para la previsualización del PDF
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    let idEstudiante: number | null = null;

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        idEstudiante = user.id ?? null;
      } catch {
        idEstudiante = null;
      }
    }

    if (!token || !idEstudiante) {
      setError("No se pudo obtener la sesión del estudiante.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/inscripcion/filtro-estudiante/`, {
        params: { id_estudiante: idEstudiante },
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        // Filtrar las inscripciones que tengan certificado asignado
        const conCertificado = res.data.filter((ins: any) => ins.certificado_academico);
        setCertificados(conCertificado);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar portafolio:", err);
        setError("Error al cargar tus certificados. Intenta de nuevo.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box className="mx-auto flex mt-20 max-w-md flex-col items-center justify-center rounded-xl p-4">
        <CircularProgress color="primary" />
        <Typography className="mt-4 text-gray-600 font-medium">
          Cargando tus certificados...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 w-11/12 max-w-md rounded-2xl bg-red-50 p-6 text-center text-red-700 border border-red-200">
        <Typography className="font-semibold">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-primary">
            Mi Portafolio
          </h1>
          <p className="text-gray-600">Visualiza y descarga tus certificados académicos logrados</p>
        </div>

        {certificados.length === 0 ? (
          /* Empty State Card */
          <Card className="rounded-2xl border border-gray-100 shadow-md">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16">
              <div className="mb-6">
                <EmojiEventsOutlined
                  sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }}
                />
              </div>

              <Typography
                variant="h5"
                className="mb-3 text-center font-bold text-gray-700"
              >
                Aún no tienes certificados
              </Typography>

              <Typography
                variant="body1"
                className="mb-6 max-w-sm text-center text-gray-600"
              >
                No tienes notas ni certificados disponibles todavía. Cuando finalices un
                curso con éxito y se genere tu certificado, podrás descargarlo aquí.
              </Typography>

              <div className="flex w-full flex-col gap-3 max-w-xs">
                <Link href="/estudiante/matriculas" className="w-full">
                  <Button
                    className="rounded-2xl bg-primary"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#3b82f6",
                      padding: "10px",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Ver mis cursos matriculados
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Certificates List */
          <div className="grid grid-cols-1 gap-4">
            {certificados.map((cert) => (
              <Card key={cert.id_inscripcion} className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-red-50 rounded-xl text-primary">
                      <SchoolOutlined sx={{ fontSize: 40, color: "#C20E1A" }} />
                    </div>
                    <div>
                      <Typography variant="h6" className="font-bold text-gray-800 leading-tight">
                        {cert.modulo?.nombre_modulo}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 mt-1">
                        Periodo Académico: <span className="font-semibold text-gray-700">{cert.oferta_categoria?.id_oferta_academica?.nombre}</span>
                      </Typography>
                      <Typography variant="caption" className="text-gray-400 block mt-0.5">
                        Inscripción: {new Date(cert.fecha_inscripcion).toLocaleDateString('es-ES')}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={() => {
                        if (cert.certificado_academico) {
                          setPreviewUrl(cert.certificado_academico);
                          setPreviewTitle(cert.modulo?.nombre_modulo || "Certificado");
                        }
                      }}
                      className="rounded-xl border-2"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2.5,
                        py: 1,
                      }}
                    >
                      Previsualizar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      href={cert.certificado_academico || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<DownloadOutlined />}
                      className="rounded-xl bg-primary"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2.5,
                        py: 1,
                      }}
                    >
                      Descargar PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">💡 Tip:</span> Los certificados descargados son documentos oficiales del Semillero y cuentan con validación institucional.
          </p>
        </div>
      </div>

      {/* Dialog para previsualizar el PDF */}
      <Dialog
        open={Boolean(previewUrl)}
        onClose={() => setPreviewUrl(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
          <Typography variant="h6" component="div" className="font-bold text-gray-800">
            Certificado: {previewTitle}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setPreviewUrl(null)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: "70vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
          {previewUrl ? (
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Previsualizador de Certificado"
            />
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0", justifyContent: "space-between" }}>
          <Button 
            onClick={() => setPreviewUrl(null)}
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
          >
            Cerrar
          </Button>
          {previewUrl && (
            <Button
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
              startIcon={<DownloadOutlined />}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, backgroundColor: "#3b82f6" }}
            >
              Abrir en pestaña nueva
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
