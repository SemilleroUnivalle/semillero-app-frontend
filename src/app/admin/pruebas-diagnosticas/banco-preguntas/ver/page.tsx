"use client";

import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../config";

interface PreguntaBanco {
    id_pregunta: number;
    texto_pregunta: string;
    tipo_pregunta: "multiple" | "verdadero_falso";
    puntaje: string;
    id_modulo?: {
        id_modulo: number;
        nombre_modulo: string;
    } | null;
}

interface RespuestaDetalle {
    id_respuesta: number;
    texto_respuesta: string;
    es_correcta: boolean;
}

interface PreguntaDetalle extends PreguntaBanco {
    explicacion: string;
    imagen: string | null;
    respuestas: RespuestaDetalle[];
}

export default function VerBancoPreguntas() {
    const [preguntas, setPreguntas] = useState<PreguntaBanco[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Estados para el modal de detalle
    const [modalOpen, setModalOpen] = useState(false);
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState<PreguntaDetalle | null>(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    useEffect(() => {
        const cargarPreguntas = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/prueba_diagnostica/preguntas/banco/`,
                    {
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setPreguntas(response.data);
            } catch (err) {
                console.error("Error al cargar el banco de preguntas:", err);
                setError("No se pudieron cargar las preguntas. Intente nuevamente.");
            } finally {
                setCargando(false);
            }
        };

        cargarPreguntas();
    }, []);

    const handleVerDetalle = async (id: number) => {
        setModalOpen(true);
        setCargandoDetalle(true);
        setPreguntaSeleccionada(null);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/prueba_diagnostica/preguntas/${id}/`,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                }
            );
            setPreguntaSeleccionada(response.data);
        } catch (err) {
            console.error("Error al cargar detalle de la pregunta:", err);
        } finally {
            setCargandoDetalle(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setPreguntaSeleccionada(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/prueba_diagnostica/preguntas/${id}/`,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                }
            );
            // Actualizar la lista localmente
            setPreguntas(preguntas.filter(p => p.id_pregunta !== id));
        } catch (err) {
            console.error("Error al eliminar la pregunta:", err);
            alert("Error al eliminar la pregunta");
        }
    };

    if (cargando) {
        return (
            <Box className="flex min-h-[400px] items-center justify-center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="mx-auto w-11/12 p-4">
            <Box className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Typography variant="h5" className="font-bold text-primary">
                    Banco de Preguntas
                </Typography>
                <Link href="/admin/pruebas-diagnosticas/banco-preguntas/crear">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        className="buttons-principal rounded-xl"
                    >
                        Nueva Pregunta
                    </Button>
                </Link>
            </Box>

            {error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <TableContainer component={Paper} className="rounded-xl shadow-md">
                    <Table>
                        <TableHead className="bg-gray-50">
                            <TableRow>
                                <TableCell className="font-bold text-secondary">ID</TableCell>
                                <TableCell className="font-bold text-secondary">Enunciado</TableCell>
                                <TableCell className="font-bold text-secondary">Tipo</TableCell>
                                <TableCell className="font-bold text-secondary">Módulo</TableCell>
                                <TableCell className="font-bold text-secondary">Puntaje</TableCell>
                                <TableCell align="center" className="font-bold text-secondary">
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {preguntas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" className="py-8">
                                        <Typography color="textSecondary">
                                            No hay preguntas en el banco. ¡Crea la primera!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                preguntas.map((pregunta) => (
                                    <TableRow
                                        key={pregunta.id_pregunta}
                                        hover
                                        className="cursor-pointer transition-colors hover:bg-gray-50"
                                        onClick={() => handleVerDetalle(pregunta.id_pregunta)}
                                    >
                                        <TableCell>{pregunta.id_pregunta}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={pregunta.texto_pregunta}>
                                            {pregunta.texto_pregunta}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={pregunta.tipo_pregunta === "multiple" ? "Múltiple" : "V/F"}
                                                size="small"
                                                color={pregunta.tipo_pregunta === "multiple" ? "primary" : "secondary"}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {pregunta.id_modulo?.nombre_modulo || "-"}
                                        </TableCell>
                                        <TableCell>{pregunta.puntaje}</TableCell>
                                        <TableCell align="center">
                                            <Box className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Tooltip title="Ver Detalle">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleVerDetalle(pregunta.id_pregunta)}
                                                    >
                                                        <VisibilityOutlinedIcon className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        className="text-red-500 hover:bg-red-50"
                                                        onClick={() => handleDelete(pregunta.id_pregunta)}
                                                    >
                                                        <DeleteIcon className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Modal de Detalle de Pregunta */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "rounded-2xl"
                }}
            >
                <DialogTitle className="bg-gray-50 text-center font-bold text-primary">
                    Detalle de la Pregunta
                </DialogTitle>
                <DialogContent className="mt-4">
                    {cargandoDetalle ? (
                        <Box className="flex min-h-[200px] items-center justify-center">
                            <CircularProgress />
                        </Box>
                    ) : preguntaSeleccionada ? (
                        <Box className="flex flex-col gap-4 py-2">
                            {/* Enunciado */}
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" className="font-bold">
                                    Enunciado:
                                </Typography>
                                <Typography variant="body1" className="mt-1 text-lg">
                                    {preguntaSeleccionada.texto_pregunta}
                                </Typography>
                            </Box>

                            {/* Imagen si existe */}
                            {preguntaSeleccionada.imagen && (
                                <Box className="flex justify-center rounded-lg border p-2">
                                    <img
                                        src={preguntaSeleccionada.imagen}
                                        alt="Imagen de la pregunta"
                                        className="max-h-64 object-contain"
                                    />
                                </Box>
                            )}

                            <Box className="flex gap-8">
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary" className="font-bold">
                                        Tipo:
                                    </Typography>
                                    <Chip
                                        label={preguntaSeleccionada.tipo_pregunta === "multiple" ? "Opción Múltiple" : "Verdadero/Falso"}
                                        size="small"
                                        className="mt-1"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary" className="font-bold">
                                        Puntaje:
                                    </Typography>
                                    <Typography variant="body1">
                                        {preguntaSeleccionada.puntaje}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Respuestas */}
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" className="font-bold mb-2">
                                    Opciones de Respuesta:
                                </Typography>
                                <List dense className="rounded-lg border bg-gray-50">
                                    {preguntaSeleccionada.respuestas?.map((respuesta) => (
                                        <ListItem
                                            key={respuesta.id_respuesta}
                                            className={respuesta.es_correcta ? "bg-green-50" : ""}
                                        >
                                            <ListItemIcon>
                                                {respuesta.es_correcta ? (
                                                    <CheckCircleIcon className="text-green-500" />
                                                ) : (
                                                    <RadioButtonUncheckedIcon color="disabled" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={respuesta.texto_respuesta}
                                                primaryTypographyProps={{
                                                    className: respuesta.es_correcta ? "font-bold text-green-800" : ""
                                                }}
                                            />
                                            {respuesta.es_correcta && (
                                                <Chip label="Correcta" size="small" color="success" variant="outlined" />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            {/* Explicación */}
                            {preguntaSeleccionada.explicacion && (
                                <Box className="mt-2 rounded-lg bg-blue-50 p-3">
                                    <Typography variant="subtitle2" className="font-bold text-blue-800">
                                        Explicación / Retroalimentación:
                                    </Typography>
                                    <Typography variant="body2" className="text-blue-900">
                                        {preguntaSeleccionada.explicacion}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography align="center" color="error">
                            No se pudo cargar la información de la pregunta.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleCloseModal} variant="outlined" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
