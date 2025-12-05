"use client";

import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Card,
    CardContent,
    Divider,
    Menu,
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../config";

interface Opcion {
    id: string;
    texto: string;
    id_respuesta?: number; // Para respuestas existentes
}

interface Modulo {
    id_modulo: number;
    nombre_modulo: string;
}

interface Pregunta {
    id: number;
    id_pregunta?: number; // Para preguntas existentes
    tipo: "multiple" | "verdadero-falso";
    enunciado: string;
    imagen: string | null;
    opciones: Opcion[];
    respuestaCorrecta: string;
    puntaje: number;
    explicacion: string;
}

export default function EditarPruebas() {
    const params = useParams();
    const router = useRouter();
    const idPrueba = params.id as string;

    // Estados
    const [cargando, setCargando] = useState(true);
    const [descripcion, setDescripcion] = useState("");
    const [tiempoLimite, setTiempoLimite] = useState("60");
    const [puntajeMinimo, setPuntajeMinimo] = useState("60.00");
    const [modulo, setModulo] = useState("");
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [cargandoModulos, setCargandoModulos] = useState(false);
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{
        tipo: "success" | "error";
        texto: string;
    } | null>(null);

    // Cargar módulos
    useEffect(() => {
        const cargarModulos = async () => {
            setCargandoModulos(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/modulo/mod/por-categoria-id-nombre/`,
                    {
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al cargar los módulos");
                }

                const data = await response.json();
                setModulos(data);
            } catch (error) {
                console.error("Error cargando módulos:", error);
            } finally {
                setCargandoModulos(false);
            }
        };

        cargarModulos();
    }, []);

    // Cargar datos de la prueba
    useEffect(() => {
        const cargarPrueba = async () => {
            setCargando(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/prueba_diagnostica/pruebas/${idPrueba}/`,
                    {
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al cargar la prueba");
                }

                const data = await response.json();

                // Cargar datos básicos
                setDescripcion(data.descripcion || "");
                setTiempoLimite(data.tiempo_limite.toString());
                setPuntajeMinimo(data.puntaje_minimo);
                setModulo(data.id_modulo.id_modulo.toString());

                // Transformar preguntas al formato del formulario
                const preguntasTransformadas = data.preguntas.map(
                    (pregunta: any, index: number) => {
                        const tipo =
                            pregunta.tipo_pregunta === "verdadero_falso"
                                ? "verdadero-falso"
                                : "multiple";

                        // Transformar respuestas a opciones
                        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                        const opciones = pregunta.respuestas.map(
                            (respuesta: any, idx: number) => ({
                                id: letras[idx],
                                texto: respuesta.texto_respuesta,
                                id_respuesta: respuesta.id_respuesta,
                            })
                        );

                        // Encontrar la respuesta correcta
                        const respuestaCorrectaIndex = pregunta.respuestas.findIndex(
                            (r: any) => r.es_correcta
                        );
                        const respuestaCorrecta =
                            respuestaCorrectaIndex >= 0
                                ? letras[respuestaCorrectaIndex]
                                : "A";

                        return {
                            id: Date.now() + index,
                            id_pregunta: pregunta.id_pregunta,
                            tipo,
                            enunciado: pregunta.texto_pregunta,
                            imagen: pregunta.imagen,
                            opciones,
                            respuestaCorrecta,
                            puntaje: parseFloat(pregunta.puntaje),
                            explicacion: pregunta.explicacion || "",
                        };
                    }
                );

                setPreguntas(preguntasTransformadas);
            } catch (error) {
                console.error("Error cargando prueba:", error);
                setMensaje({
                    tipo: "error",
                    texto: "Error al cargar la prueba. Intenta nuevamente.",
                });
            } finally {
                setCargando(false);
            }
        };

        if (idPrueba) {
            cargarPrueba();
        }
    }, [idPrueba]);

    const agregarPregunta = () => {
        const nuevaPregunta: Pregunta = {
            id: Date.now(),
            tipo: "multiple",
            enunciado: "",
            imagen: null,
            opciones: [
                { id: "A", texto: "" },
                { id: "B", texto: "" },
                { id: "C", texto: "" },
                { id: "D", texto: "" },
            ],
            respuestaCorrecta: "A",
            puntaje: 1.0,
            explicacion: "",
        };
        setPreguntas([...preguntas, nuevaPregunta]);
    };

    const eliminarPregunta = (id: number) => {
        setPreguntas(preguntas.filter((p) => p.id !== id));
    };

    const actualizarPregunta = (
        id: number,
        campo: string,
        valor: string | number
    ) => {
        setPreguntas(
            preguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
        );
    };

    const actualizarOpcion = (
        preguntaId: number,
        opcionId: string,
        valor: string
    ) => {
        setPreguntas(
            preguntas.map((p) =>
                p.id === preguntaId
                    ? {
                        ...p,
                        opciones: p.opciones.map((op) =>
                            op.id === opcionId ? { ...op, texto: valor } : op
                        ),
                    }
                    : p
            )
        );
    };

    const handleImagenChange = (
        id: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                actualizarPregunta(id, "imagen", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        preguntaId: number
    ) => {
        setAnchorEl(event.currentTarget);
        setMenuAbierto(preguntaId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuAbierto(null);
    };

    const handleTipoPreguntaSelect = (
        preguntaId: number,
        tipo: "multiple" | "verdadero-falso"
    ) => {
        setPreguntas(
            preguntas.map((p) => {
                if (p.id === preguntaId) {
                    if (tipo === "verdadero-falso") {
                        return {
                            ...p,
                            tipo,
                            opciones: [
                                { id: "A", texto: "Verdadero" },
                                { id: "B", texto: "Falso" },
                            ],
                            respuestaCorrecta: "A",
                        };
                    } else {
                        return {
                            ...p,
                            tipo,
                            opciones: [
                                { id: "A", texto: "" },
                                { id: "B", texto: "" },
                                { id: "C", texto: "" },
                                { id: "D", texto: "" },
                            ],
                            respuestaCorrecta: "A",
                        };
                    }
                }
                return p;
            })
        );
        handleMenuClose();
    };

    const agregarOpcion = (preguntaId: number) => {
        setPreguntas(
            preguntas.map((p) => {
                if (p.id === preguntaId && p.tipo === "multiple") {
                    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const siguienteLetra = letras[p.opciones.length];
                    if (siguienteLetra) {
                        return {
                            ...p,
                            opciones: [...p.opciones, { id: siguienteLetra, texto: "" }],
                        };
                    }
                }
                return p;
            })
        );
    };

    const eliminarOpcion = (preguntaId: number, opcionId: string) => {
        setPreguntas(
            preguntas.map((p) => {
                if (
                    p.id === preguntaId &&
                    p.tipo === "multiple" &&
                    p.opciones.length > 2
                ) {
                    const nuevasOpciones = p.opciones.filter((op) => op.id !== opcionId);
                    return {
                        ...p,
                        opciones: nuevasOpciones,
                        respuestaCorrecta:
                            p.respuestaCorrecta === opcionId
                                ? nuevasOpciones[0].id
                                : p.respuestaCorrecta,
                    };
                }
                return p;
            })
        );
    };

    const actualizarPruebaDiagnostica = async () => {
        // Validaciones
        if (!modulo) {
            setMensaje({
                tipo: "error",
                texto: "Por favor selecciona un módulo",
            });
            return;
        }

        if (preguntas.length === 0) {
            setMensaje({
                tipo: "error",
                texto: "Debes tener al menos una pregunta",
            });
            return;
        }

        const preguntasSinEnunciado = preguntas.filter((p) => !p.enunciado.trim());
        if (preguntasSinEnunciado.length > 0) {
            setMensaje({
                tipo: "error",
                texto: "Todas las preguntas deben tener un enunciado",
            });
            return;
        }

        for (const pregunta of preguntas) {
            if (pregunta.tipo === "multiple") {
                const opcionesSinTexto = pregunta.opciones.filter(
                    (op) => !op.texto.trim()
                );
                if (opcionesSinTexto.length > 0) {
                    setMensaje({
                        tipo: "error",
                        texto: "Todas las opciones de respuesta deben tener texto",
                    });
                    return;
                }
            }
        }

        setGuardando(true);

        try {
            // 1. Actualizar la Prueba Diagnóstica
            const moduloSeleccionado = modulos.find(
                (m) => m.id_modulo === parseInt(modulo)
            );
            const nombrePrueba = moduloSeleccionado
                ? moduloSeleccionado.nombre_modulo
                : "Prueba Diagnóstica";

            const datosPrueba = {
                nombre_prueba: nombrePrueba,
                descripcion: descripcion || null,
                id_modulo: parseInt(modulo),
                tiempo_limite: parseInt(tiempoLimite),
                puntaje_minimo: parseFloat(puntajeMinimo),
                estado: true,
            };

            await axios.put(
                `${API_BASE_URL}/prueba_diagnostica/pruebas/${idPrueba}/`,
                datosPrueba,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // 2. Eliminar preguntas antiguas y crear nuevas
            // (Simplificado: eliminar todas y recrear)
            // En producción, podrías hacer un diff para actualizar solo lo necesario

            for (const pregunta of preguntas) {
                if (pregunta.id_pregunta) {
                    // Eliminar pregunta existente
                    await axios.delete(
                        `${API_BASE_URL}/prueba_diagnostica/preguntas/${pregunta.id_pregunta}/`,
                        {
                            headers: {
                                Authorization: `Token ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                }
            }

            // 3. Crear todas las preguntas nuevamente
            for (const pregunta of preguntas) {
                const datosPregunta = {
                    id_prueba: parseInt(idPrueba),
                    texto_pregunta: pregunta.enunciado,
                    tipo_pregunta:
                        pregunta.tipo === "multiple" ? "multiple" : "verdadero_falso",
                    puntaje: pregunta.puntaje,
                    explicacion: pregunta.explicacion,
                    imagen: pregunta.imagen || null,
                };

                const responsePregunta = await axios.post(
                    `${API_BASE_URL}/prueba_diagnostica/preguntas/`,
                    datosPregunta,
                    {
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const idPreguntaNueva = responsePregunta.data.id_pregunta;

                if (!idPreguntaNueva) {
                    console.error("No se recibió ID para la pregunta", pregunta);
                    continue;
                }

                // Crear las respuestas
                for (const opcion of pregunta.opciones) {
                    const datosRespuesta = {
                        id_pregunta: idPreguntaNueva,
                        texto_respuesta: opcion.texto,
                        es_correcta: opcion.id === pregunta.respuestaCorrecta,
                    };

                    await axios.post(
                        `${API_BASE_URL}/prueba_diagnostica/respuestas/`,
                        datosRespuesta,
                        {
                            headers: {
                                Authorization: `Token ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }
            }

            setMensaje({
                tipo: "success",
                texto: "Prueba diagnóstica actualizada exitosamente",
            });

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push("/admin/pruebas-diagnosticas/ver-pruebas");
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar la prueba:", error);

            let mensajeError =
                "Hubo un error al actualizar la prueba. Por favor, inténtalo de nuevo.";

            if (axios.isAxiosError(error) && error.response) {
                mensajeError =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    JSON.stringify(error.response.data) ||
                    mensajeError;
            }

            setMensaje({
                tipo: "error",
                texto: mensajeError,
            });
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box className="flex min-h-[400px] items-center justify-center">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box className="inputs-textfield mx-auto flex w-11/12 flex-col rounded-2xl bg-white p-4">
            <Typography variant="h6" className="text-center font-bold text-primary">
                Editar Prueba Diagnóstica
            </Typography>

            {/* Información de la Prueba */}
            <Box className="mt-4">
                <Typography variant="h6" className="mb-2 font-bold text-secondary">
                    Información de la Prueba
                </Typography>

                <Box className="flex flex-col gap-6 md:flex-row">
                    {/* Columna 2: Configuración */}
                    <Box className="flex flex-1 flex-col">
                        <TextField
                            select
                            label="Módulo"
                            fullWidth
                            margin="normal"
                            value={modulo}
                            onChange={(e) => setModulo(e.target.value)}
                            disabled={cargandoModulos}
                            helperText={cargandoModulos ? "Cargando módulos..." : ""}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="">Selecciona un módulo</option>
                            {modulos.map((mod) => (
                                <option key={mod.id_modulo} value={mod.id_modulo}>
                                    {mod.nombre_modulo}
                                </option>
                            ))}
                        </TextField>

                        <Box className="flex gap-4">
                            <TextField
                                label="Tiempo Límite (min)"
                                type="number"
                                margin="normal"
                                value={tiempoLimite}
                                onChange={(e) => setTiempoLimite(e.target.value)}
                                inputProps={{ min: 1 }}
                                className="flex-1"
                            />

                            <TextField
                                label="Puntaje Mínimo (%)"
                                type="number"
                                margin="normal"
                                value={puntajeMinimo}
                                onChange={(e) => setPuntajeMinimo(e.target.value)}
                                inputProps={{ min: 0, max: 100, step: 0.01 }}
                                className="flex-1"
                            />
                        </Box>
                    </Box>
                    {/* Columna 1: Descripción */}
                    <Box className="flex-1">
                        <TextField
                            label="Descripción (opcional)"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describe el objetivo y contenido de esta prueba"
                            sx={{
                                height: "100%",
                                "& .MuiInputBase-root": {
                                    height: "100%",
                                    alignItems: "flex-start",
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Typography variant="h6" className="mt-4 font-bold text-secondary">
                Preguntas
            </Typography>
            <Typography variant="body1" className="mt-2 text-secondary">
                Puedes crear preguntas que incluyan fórmulas matemáticas utilizando
                escritura LaTeX.
            </Typography>

            {/* Lista de preguntas */}
            <Box className="mt-4 flex flex-col gap-4">
                {preguntas.map((pregunta, index) => (
                    <Card key={pregunta.id} className="shadow-none">
                        <CardContent>
                            <Box className="flex items-center justify-between">
                                <Typography variant="h6" className="text-primary">
                                    Pregunta {index + 1}
                                </Typography>
                                <Box className="flex items-center gap-2">
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => handleMenuClick(e, pregunta.id)}
                                        endIcon={<ArrowDropDownIcon />}
                                        className="buttons-primary"
                                    >
                                        {pregunta.tipo === "multiple"
                                            ? "Opción múltiple"
                                            : "Verdadero/Falso"}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={menuAbierto === pregunta.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            onClick={() =>
                                                handleTipoPreguntaSelect(pregunta.id, "multiple")
                                            }
                                        >
                                            Opción múltiple
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                handleTipoPreguntaSelect(pregunta.id, "verdadero-falso")
                                            }
                                        >
                                            Verdadero/Falso
                                        </MenuItem>
                                    </Menu>
                                    <IconButton
                                        onClick={() => eliminarPregunta(pregunta.id)}
                                        className="text-secondary hover:text-primary"
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Enunciado */}
                            <TextField
                                label="Enunciado de la pregunta"
                                fullWidth
                                margin="normal"
                                multiline
                                minRows={3}
                                value={pregunta.enunciado}
                                onChange={(e) =>
                                    actualizarPregunta(pregunta.id, "enunciado", e.target.value)
                                }
                                placeholder="Escribe el enunciado. Puedes usar LaTeX: \frac{a}{b}"
                            />

                            <Box className="flex gap-4">
                                <TextField
                                    label="Puntaje"
                                    type="number"
                                    margin="normal"
                                    value={pregunta.puntaje}
                                    onChange={(e) =>
                                        actualizarPregunta(
                                            pregunta.id,
                                            "puntaje",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    inputProps={{ min: 0, step: 0.1 }}
                                    className="w-32"
                                />
                                <TextField
                                    label="Explicación (Opcional)"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    value={pregunta.explicacion}
                                    onChange={(e) =>
                                        actualizarPregunta(
                                            pregunta.id,
                                            "explicacion",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Explicación de la respuesta correcta"
                                />
                            </Box>

                            {/* Imagen */}
                            <Box className="mt-4">
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<AddPhotoAlternateIcon />}
                                    className="buttons-primary"
                                >
                                    Agregar imagen
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleImagenChange(pregunta.id, e)}
                                    />
                                </Button>
                                {pregunta.imagen && (
                                    <Box className="mt-2">
                                        <img
                                            src={pregunta.imagen}
                                            alt="Vista previa"
                                            className="max-h-48 rounded"
                                        />
                                    </Box>
                                )}
                            </Box>

                            {/* Opciones */}
                            <Box className="mt-4">
                                <Box className="flex items-center justify-between">
                                    <Typography
                                        variant="subtitle1"
                                        className="font-bold text-secondary"
                                    >
                                        Opciones de respuesta
                                    </Typography>
                                    {pregunta.tipo === "multiple" && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<AddOutlinedIcon />}
                                            onClick={() => agregarOpcion(pregunta.id)}
                                            className="buttons-primary"
                                            disabled={pregunta.opciones.length >= 26}
                                        >
                                            Agregar opción
                                        </Button>
                                    )}
                                </Box>
                                <Box className="mt-2 flex flex-col gap-2">
                                    {pregunta.opciones.map((opcion, idx) => (
                                        <Box key={opcion.id} className="flex items-center gap-2">
                                            <TextField
                                                label={
                                                    pregunta.tipo === "verdadero-falso"
                                                        ? opcion.id === "A"
                                                            ? "Verdadero"
                                                            : "Falso"
                                                        : `Opción ${opcion.id}`
                                                }
                                                fullWidth
                                                margin="normal"
                                                value={opcion.texto}
                                                onChange={(e) =>
                                                    actualizarOpcion(
                                                        pregunta.id,
                                                        opcion.id,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Puedes usar LaTeX: x^2 + y^2"
                                            />
                                            {pregunta.tipo === "multiple" &&
                                                pregunta.opciones.length > 2 && (
                                                    <IconButton
                                                        onClick={() =>
                                                            eliminarOpcion(pregunta.id, opcion.id)
                                                        }
                                                        className="text-secondary hover:text-red-500"
                                                        size="small"
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Respuesta correcta */}
                            <TextField
                                select
                                label="Respuesta correcta"
                                fullWidth
                                margin="normal"
                                value={pregunta.respuestaCorrecta}
                                onChange={(e) =>
                                    actualizarPregunta(
                                        pregunta.id,
                                        "respuestaCorrecta",
                                        e.target.value
                                    )
                                }
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {pregunta.opciones.map((opcion) => (
                                    <option key={opcion.id} value={opcion.id}>
                                        {pregunta.tipo === "verdadero-falso"
                                            ? opcion.id === "A"
                                                ? "Verdadero"
                                                : "Falso"
                                            : opcion.id}
                                    </option>
                                ))}
                            </TextField>
                        </CardContent>
                        <Divider />
                    </Card>
                ))}
            </Box>

            <Button
                variant="outlined"
                className="buttons-primary mx-auto mt-4 w-fullsm:w-1/4"
                onClick={agregarPregunta}
            >
                Agregar pregunta
            </Button>

            {/* Botón actualizar */}
            {preguntas.length > 0 && (
                <Box className="mt-6 flex justify-end gap-4">
                    <Button
                        variant="outlined"
                        onClick={() => router.push("/admin/pruebas-diagnosticas/ver-pruebas")}
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        className="buttons-principal"
                        onClick={actualizarPruebaDiagnostica}
                        disabled={guardando}
                    >
                        {guardando ? "Actualizando..." : "Actualizar Prueba Diagnóstica"}
                    </Button>
                </Box>
            )}

            {/* Snackbar para mensajes */}
            <Snackbar
                open={mensaje !== null}
                autoHideDuration={6000}
                onClose={() => setMensaje(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setMensaje(null)}
                    severity={mensaje?.tipo || "info"}
                    sx={{ width: "100%" }}
                >
                    {mensaje?.texto}
                </Alert>
            </Snackbar>
        </Box>
    );
}
