"use client";

import {
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../config";
import PreguntaCard, { Pregunta } from "../../../../../components/pruebas/PreguntaCard";

interface Modulo {
    id_modulo: number;
    nombre_modulo: string;
}

export default function CrearPreguntasBanco() {
    const router = useRouter();
    const [modulo, setModulo] = useState("");
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [cargandoModulos, setCargandoModulos] = useState(false);
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
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
                const response = await fetch(`${API_BASE_URL}/modulo/mod/por-categoria-id-nombre/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                });

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

    const actualizarPregunta = (id: number, campo: string, valor: string | number) => {
        setPreguntas(
            preguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
        );
    };

    const actualizarOpcion = (
        preguntaId: number,
        opcionId: string,
        valor: string,
    ) => {
        setPreguntas(
            preguntas.map((p) =>
                p.id === preguntaId
                    ? {
                        ...p,
                        opciones: p.opciones.map((op) =>
                            op.id === opcionId ? { ...op, texto: valor } : op,
                        ),
                    }
                    : p,
            ),
        );
    };

    const handleTipoPreguntaSelect = (
        preguntaId: number,
        tipo: "multiple" | "verdadero-falso",
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
            }),
        );
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
            }),
        );
    };

    const eliminarOpcion = (preguntaId: number, opcionId: string) => {
        setPreguntas(
            preguntas.map((p) => {
                if (p.id === preguntaId && p.tipo === "multiple" && p.opciones.length > 2) {
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
            }),
        );
    };

    const guardarPreguntas = async () => {
        // Validaciones
        if (preguntas.length === 0) {
            setMensaje({
                tipo: "error",
                texto: "Debes agregar al menos una pregunta",
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
                    (op) => !op.texto.trim(),
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
            let preguntasGuardadas = 0;

            for (const pregunta of preguntas) {
                // Datos de la pregunta
                // NOTA: Aquí asumimos que el backend acepta id_prueba como null o opcional
                // Si se requiere un módulo, tal vez haya un campo id_modulo en la pregunta
                const datosPregunta = {
                    id_prueba: null, // Opcional según requerimiento
                    id_modulo: modulo ? parseInt(modulo) : null, // Posible campo para vincular a módulo sin prueba
                    texto_pregunta: pregunta.enunciado,
                    tipo_pregunta: pregunta.tipo === "multiple" ? "multiple" : "verdadero_falso",
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
                    },
                );

                const idPregunta = responsePregunta.data.id_pregunta;

                if (!idPregunta) {
                    console.error("No se recibió ID para la pregunta", pregunta);
                    continue;
                }

                // Crear Respuestas
                for (const opcion of pregunta.opciones) {
                    const datosRespuesta = {
                        id_pregunta: idPregunta,
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
                        },
                    );
                }
                preguntasGuardadas++;
            }

            setMensaje({
                tipo: "success",
                texto: `${preguntasGuardadas} preguntas guardadas exitosamente en el banco`,
            });

            // Limpiar formulario
            setPreguntas([]);
            setModulo("");

            // Redirigir a la vista de lista después de 2 segundos
            setTimeout(() => {
                router.push("/admin/pruebas-diagnosticas/banco-preguntas/ver");
            }, 2000);

        } catch (error) {
            console.error("Error al guardar preguntas:", error);
            let mensajeError = "Hubo un error al guardar las preguntas.";
            if (axios.isAxiosError(error) && error.response) {
                mensajeError = error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data) || mensajeError;
            }
            setMensaje({
                tipo: "error",
                texto: mensajeError,
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Box className="inputs-textfield mx-auto flex w-11/12 flex-col rounded-2xl bg-white p-4">
            <Typography variant="h6" className="text-center font-bold text-primary">
                Banco de Preguntas - Crear Preguntas
            </Typography>

            <Box className="mt-4">
                <Typography variant="body1" className="text-secondary mb-4">
                    Agrega preguntas independientes al banco de preguntas. Puedes asociarlas a un módulo opcionalmente.
                </Typography>

                <TextField
                    select
                    label="Módulo (Opcional)"
                    fullWidth
                    margin="normal"
                    value={modulo}
                    onChange={(e) => setModulo(e.target.value)}
                    disabled={cargandoModulos}
                    helperText={cargandoModulos ? "Cargando módulos..." : "Asociar estas preguntas a un módulo específico"}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="">Sin módulo específico</option>
                    {modulos.map((mod) => (
                        <option key={mod.id_modulo} value={mod.id_modulo}>
                            {mod.nombre_modulo}
                        </option>
                    ))}
                </TextField>
            </Box>

            {/* Lista de preguntas */}
            <Box className="mt-4 flex flex-col gap-4">
                {preguntas.map((pregunta, index) => (
                    <PreguntaCard
                        key={pregunta.id}
                        pregunta={pregunta}
                        index={index}
                        onUpdate={actualizarPregunta}
                        onDelete={eliminarPregunta}
                        onTypeChange={handleTipoPreguntaSelect}
                        onAddOption={agregarOpcion}
                        onDeleteOption={eliminarOpcion}
                        onUpdateOption={actualizarOpcion}
                    />
                ))}
            </Box>

            <Button
                variant="outlined"
                className="buttons-primary mx-auto mt-4 w-full sm:w-1/4"
                onClick={agregarPregunta}
            >
                Agregar pregunta
            </Button>

            {/* Botón guardar */}
            {preguntas.length > 0 && (
                <Box className="mt-6 flex justify-end">
                    <Button
                        variant="contained"
                        className="buttons-principal"
                        onClick={guardarPreguntas}
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar en Banco de Preguntas"}
                    </Button>
                </Box>
            )}

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
