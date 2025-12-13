"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
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
  Checkbox,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import PreguntaCard, { Pregunta } from "../../../../components/pruebas/PreguntaCard";

interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
}

interface PreguntaBanco {
  id_pregunta: number;
  texto_pregunta: string;
  tipo_pregunta: "multiple" | "verdadero_falso";
  puntaje: string;
  id_modulo?: {
    id_modulo: number;
    nombre_modulo: string;
  } | null;
  // Campos adicionales para conversión
  explicacion?: string;
  imagen?: string | null;
  respuestas?: any[]; // Simplificado para la carga inicial
}

export default function CrearPruebas() {
  // Campos de la prueba diagnóstica
  const [descripcion, setDescripcion] = useState("");
  const [tiempoLimite, setTiempoLimite] = useState("60");
  const [puntajeMinimo, setPuntajeMinimo] = useState("60.00");

  const [modulo, setModulo] = useState("");
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [cargandoModulos, setCargandoModulos] = useState(false);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

  // Estados para el Banco de Preguntas
  const [modalBancoAbierto, setModalBancoAbierto] = useState(false);
  const [preguntasBanco, setPreguntasBanco] = useState<PreguntaBanco[]>([]);
  const [cargandoBanco, setCargandoBanco] = useState(false);
  const [seleccionadasBanco, setSeleccionadasBanco] = useState<number[]>([]);

  // Filtros para el Banco
  const [filtroBancoTexto, setFiltroBancoTexto] = useState("");
  const [filtroBancoModulo, setFiltroBancoModulo] = useState("todos");
  const [filtroBancoTipo, setFiltroBancoTipo] = useState("todos");

  // Estado para ver detalle de pregunta del banco
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [preguntaDetalle, setPreguntaDetalle] = useState<PreguntaBanco | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Estados para Aleatorias
  const [modalAleatorioAbierto, setModalAleatorioAbierto] = useState(false);
  const [configAleatoria, setConfigAleatoria] = useState({
    modulo: "todos",
    tipo: "todos",
    cantidad: 1
  });
  const [disponiblesAleatorias, setDisponiblesAleatorias] = useState(0);

  // Referencia para el scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Cargar módulos desde el endpoint
  useEffect(() => {
    const cargarModulos = async () => {
      setCargandoModulos(true);
      try {
        // Reemplaza esta URL con tu endpoint real
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
        // Aquí podrías mostrar un mensaje de error al usuario
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
    scrollToBottom();
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
          // Resetear opciones según el tipo
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
            // Si la respuesta correcta era la opción eliminada, cambiar a la primera
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

  // Funciones para el Banco de Preguntas
  const cargarPreguntasBanco = async () => {
    setModalBancoAbierto(true);
    setCargandoBanco(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prueba_diagnostica/preguntas/banco/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      setPreguntasBanco(response.data);
    } catch (error) {
      console.error("Error al cargar banco de preguntas:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar el banco de preguntas" });
    } finally {
      setCargandoBanco(false);
    }
  };

  const handleToggleSeleccionBanco = (id: number) => {
    setSeleccionadasBanco((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const verDetallePregunta = async (id: number) => {
    setModalDetalleAbierto(true);
    setCargandoDetalle(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prueba_diagnostica/preguntas/${id}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      setPreguntaDetalle(response.data);
    } catch (error) {
      console.error("Error al cargar detalle de pregunta:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar el detalle de la pregunta" });
      setModalDetalleAbierto(false);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const handleAgregarSeleccionadas = async () => {
    // Necesitamos obtener el detalle completo de cada pregunta seleccionada para mostrarla correctamente
    // Aunque para la asignación solo necesitamos el ID, para la visualización necesitamos todo.
    // Por eficiencia, podríamos solo mostrar un resumen, pero el usuario querrá ver qué agregó.

    const nuevasPreguntas: Pregunta[] = [];

    for (const id of seleccionadasBanco) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/prueba_diagnostica/preguntas/${id}/`,
          {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` },
          }
        );
        const pBanco = response.data;

        // Convertir al formato local Pregunta
        const nuevaP: Pregunta = {
          id: Date.now() + Math.random(), // ID temporal local único
          id_banco: pBanco.id_pregunta, // Guardamos el ID real del banco
          tipo: pBanco.tipo_pregunta === "multiple" ? "multiple" : "verdadero-falso",
          enunciado: pBanco.texto_pregunta,
          imagen: pBanco.imagen,
          puntaje: parseFloat(pBanco.puntaje),
          explicacion: pBanco.explicacion || "",
          respuestaCorrecta: "A", // Valor por defecto, se ajustará abajo
          opciones: [],
        };

        // Mapear respuestas a opciones
        if (pBanco.respuestas && Array.isArray(pBanco.respuestas)) {
          nuevaP.opciones = pBanco.respuestas.map((r: any, idx: number) => {
            const letra = String.fromCharCode(65 + idx); // A, B, C...
            if (r.es_correcta) nuevaP.respuestaCorrecta = letra;
            return {
              id: letra,
              texto: r.texto_respuesta,
              id_respuesta: r.id_respuesta
            };
          });
        }

        nuevasPreguntas.push(nuevaP);
      } catch (error) {
        console.error(`Error cargando detalle de pregunta ${id}`, error);
      }
    }

    setPreguntas([...preguntas, ...nuevasPreguntas]);
    setSeleccionadasBanco([]);
    setModalBancoAbierto(false);
    setMensaje({ tipo: "success", texto: `${nuevasPreguntas.length} preguntas agregadas del banco` });
    scrollToBottom();
  };

  // Lógica para Aleatorias
  useEffect(() => {
    if (modalAleatorioAbierto) {
      const idsExistentes = preguntas.map(p => p.id_banco).filter(Boolean);

      const disponibles = preguntasBanco.filter(p => {
        // Excluir si ya existe en la prueba
        if (idsExistentes.includes(p.id_pregunta)) return false;

        // Filtro por módulo
        if (configAleatoria.modulo !== "todos" && p.id_modulo?.nombre_modulo !== configAleatoria.modulo) return false;

        // Filtro por tipo
        if (configAleatoria.tipo !== "todos" && p.tipo_pregunta !== configAleatoria.tipo) return false;

        return true;
      });

      setDisponiblesAleatorias(disponibles.length);

      // Ajustar cantidad si excede disponibles
      if (configAleatoria.cantidad > disponibles.length && disponibles.length > 0) {
        setConfigAleatoria(prev => ({ ...prev, cantidad: disponibles.length }));
      }
    }
  }, [configAleatoria.modulo, configAleatoria.tipo, modalAleatorioAbierto, preguntas, preguntasBanco]);

  const handleAgregarAleatorias = async () => {
    const idsExistentes = preguntas.map(p => p.id_banco).filter(Boolean);

    // 1. Filtrar candidatos
    const candidatos = preguntasBanco.filter(p => {
      if (idsExistentes.includes(p.id_pregunta)) return false;
      if (configAleatoria.modulo !== "todos" && p.id_modulo?.nombre_modulo !== configAleatoria.modulo) return false;
      if (configAleatoria.tipo !== "todos" && p.tipo_pregunta !== configAleatoria.tipo) return false;
      return true;
    });

    // 2. Seleccionar aleatoriamente
    const seleccionados = [];
    const copiaCandidatos = [...candidatos];
    const cantidad = Math.min(configAleatoria.cantidad, copiaCandidatos.length);

    for (let i = 0; i < cantidad; i++) {
      const randomIndex = Math.floor(Math.random() * copiaCandidatos.length);
      seleccionados.push(copiaCandidatos[randomIndex]);
      copiaCandidatos.splice(randomIndex, 1);
    }

    // 3. Obtener detalles y agregar (reutilizando lógica similar a handleAgregarSeleccionadas)
    // Para no duplicar código, podríamos extraer la conversión a una función, pero por ahora lo haré aquí
    // para asegurar que funcione rápido.

    // Usamos setSeleccionadasBanco temporalmente para reutilizar handleAgregarSeleccionadas?
    // No, mejor hacemos la lógica directa aquí para tener control.

    const nuevasPreguntas: Pregunta[] = [];
    setCargandoBanco(true); // Reusamos este estado de carga visual

    for (const p of seleccionados) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/prueba_diagnostica/preguntas/${p.id_pregunta}/`,
          { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
        const pBanco = response.data;

        const nuevaP: Pregunta = {
          id: Date.now() + Math.random(),
          id_banco: pBanco.id_pregunta,
          tipo: pBanco.tipo_pregunta === "multiple" ? "multiple" : "verdadero-falso",
          enunciado: pBanco.texto_pregunta,
          imagen: pBanco.imagen,
          puntaje: parseFloat(pBanco.puntaje),
          explicacion: pBanco.explicacion || "",
          respuestaCorrecta: "A",
          opciones: [],
        };

        if (pBanco.respuestas && Array.isArray(pBanco.respuestas)) {
          nuevaP.opciones = pBanco.respuestas.map((r: any, idx: number) => {
            const letra = String.fromCharCode(65 + idx);
            if (r.es_correcta) nuevaP.respuestaCorrecta = letra;
            return { id: letra, texto: r.texto_respuesta, id_respuesta: r.id_respuesta };
          });
        }
        nuevasPreguntas.push(nuevaP);
      } catch (error) {
        console.error("Error cargando detalle aleatorio", error);
      }
    }

    setPreguntas([...preguntas, ...nuevasPreguntas]);
    setModalAleatorioAbierto(false);
    setCargandoBanco(false);
    setMensaje({ tipo: "success", texto: `${nuevasPreguntas.length} preguntas aleatorias agregadas` });
    scrollToBottom();
  };

  const guardarPruebaDiagnostica = async () => {
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
        texto: "Debes agregar al menos una pregunta",
      });
      return;
    }

    // Validar que todas las preguntas tengan enunciado
    const preguntasSinEnunciado = preguntas.filter((p) => !p.enunciado.trim());
    if (preguntasSinEnunciado.length > 0) {
      setMensaje({
        tipo: "error",
        texto: "Todas las preguntas deben tener un enunciado",
      });
      return;
    }

    // Validar que todas las opciones tengan texto (excepto verdadero/falso)
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
      // 1. Crear la Prueba Diagnóstica
      const moduloSeleccionado = modulos.find(m => m.id_modulo === parseInt(modulo));
      const nombrePrueba = moduloSeleccionado ? moduloSeleccionado.nombre_modulo : "Prueba Diagnóstica";

      const datosPrueba = {
        nombre_prueba: nombrePrueba,
        descripcion: descripcion || null,
        id_modulo: parseInt(modulo),
        tiempo_limite: parseInt(tiempoLimite),
        puntaje_minimo: parseFloat(puntajeMinimo),
        estado: true,
      };

      // Usamos el endpoint corregido por el usuario
      const responsePrueba = await axios.post(
        `${API_BASE_URL}/prueba_diagnostica/pruebas/`,
        datosPrueba,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      const idPrueba = responsePrueba.data.id_prueba;

      if (!idPrueba) {
        throw new Error("No se recibió el ID de la prueba creada");
      }

      // 2. Iterar y procesar cada Pregunta
      for (const pregunta of preguntas) {
        // CASO A: Pregunta del Banco (Asignación)
        if (pregunta.id_banco) {
          try {
            await axios.post(
              `${API_BASE_URL}/prueba_diagnostica/preguntas/asignar-a-prueba/`,
              {
                id_pregunta: pregunta.id_banco,
                id_prueba: idPrueba,
              },
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (error) {
            console.error(`Error asignando pregunta del banco ${pregunta.id_banco}`, error);
            // Podríamos agregar un mensaje de advertencia pero no detener todo el proceso
          }
        }
        // CASO B: Pregunta Nueva (Creación)
        else {
          const datosPregunta = {
            id_prueba: idPrueba,
            texto_pregunta: pregunta.enunciado,
            tipo_pregunta: pregunta.tipo === "multiple" ? "multiple" : "verdadero_falso",
            puntaje: pregunta.puntaje,
            explicacion: pregunta.explicacion,
            imagen: pregunta.imagen || null,
          };

          // Asumimos el endpoint para preguntas basado en la convención
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

          // 3. Iterar y crear las Respuestas para esta pregunta
          for (const opcion of pregunta.opciones) {
            const datosRespuesta = {
              id_pregunta: idPregunta,
              texto_respuesta: opcion.texto,
              es_correcta: opcion.id === pregunta.respuestaCorrecta,
            };

            // Asumimos el endpoint para respuestas
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
        }
      }

      console.log("Prueba completa creada exitosamente");

      setMensaje({
        tipo: "success",
        texto: "Prueba diagnóstica creada exitosamente",
      });

      // Limpiar el formulario después de guardar
      setDescripcion("");
      setTiempoLimite("60");
      setPuntajeMinimo("60.00");
      setModulo("");
      setPreguntas([]);
    } catch (error) {
      console.error("Error al crear la prueba:", error);

      let mensajeError = "Hubo un error al crear la prueba. Por favor, inténtalo de nuevo.";

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
        Crear Pruebas Diagnósticas
      </Typography>

      {/* Información de la Prueba */}
      <Box className="mt-4">
        <Typography variant="h6" className="mb-2 font-bold text-secondary">
          Información de la Prueba
        </Typography>

        <Box className="flex flex-col gap-6 md:flex-row">
          {/* Columna 2: Configuración */}
          <Box className="flex-1 flex flex-col">
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
                height: '100%',
                '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' }
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

      {/* Referencia para scroll automático */}
      <div ref={bottomRef} />

      {/* Espacio para evitar que el contenido quede oculto por la barra flotante */}
      <Box className="h-4" />

      {/* Barra de Acciones Flotante */}
      <Paper
        elevation={3}
        className="sticky bottom-4 z-50 mx-auto mt-4 flex w-full flex-col items-center justify-between gap-4 rounded-xl border bg-white/95 p-4 backdrop-blur-sm sm:flex-row sm:px-8"
        sx={{
          boxShadow: "0px -4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outlined"
            className="buttons-primary"
            onClick={agregarPregunta}
            startIcon={<AddIcon />}
          >
            Nueva pregunta
          </Button>
          <Button
            variant="contained"
            className="buttons-principal"
            onClick={cargarPreguntasBanco}
            startIcon={<SearchIcon />}
            sx={{
              background: "linear-gradient(to right, #c20e1a, #a00c15)",
            }}
          >
            Desde Banco
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              cargarPreguntasBanco(); // Aseguramos que estén cargadas
              setModalAleatorioAbierto(true);
            }}
            startIcon={<ShuffleIcon />}
            sx={{
              background: "linear-gradient(to right, #4a4a4a, #2c2c2c)",
              color: "white"
            }}
          >
            Aleatorias
          </Button>
        </Box>

        <Box className="flex w-full sm:w-auto">
          <Button
            variant="contained"
            className="buttons-principal w-full sm:w-auto"
            onClick={guardarPruebaDiagnostica}
            disabled={guardando || preguntas.length === 0}
            size="large"
            sx={{
              minWidth: "200px",
              boxShadow: "0px 4px 12px rgba(194, 14, 26, 0.4)",
            }}
          >
            {guardando ? "Guardando..." : "Guardar Prueba"}
          </Button>
        </Box>
      </Paper>

      {/* Modal de Selección del Banco */}
      <Dialog
        open={modalBancoAbierto}
        onClose={() => setModalBancoAbierto(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: "rounded-2xl h-[90vh]"
        }}
      >
        <DialogTitle className="bg-gray-50 p-4">
          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-bold text-primary text-center">
              Seleccionar Preguntas del Banco
            </Typography>

            {/* Filtros */}
            <Paper className="flex flex-col gap-4 p-4 sm:flex-row bg-white rounded-xl border shadow-sm">
              <TextField
                label="Buscar en enunciado"
                variant="outlined"
                size="small"
                fullWidth
                value={filtroBancoTexto}
                onChange={(e) => setFiltroBancoTexto(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" className="mr-2" />,
                }}
                className="flex-[2]"
              />
              <TextField
                select
                label="Módulo"
                variant="outlined"
                size="small"
                fullWidth
                value={filtroBancoModulo}
                onChange={(e) => setFiltroBancoModulo(e.target.value)}
                className="flex-1"
                SelectProps={{ native: true }}
              >
                <option value="todos">Todos los módulos</option>
                {Array.from(new Set(preguntasBanco.map(p => p.id_modulo?.nombre_modulo).filter(Boolean))).sort().map(nombre => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </TextField>
              <TextField
                select
                label="Tipo"
                variant="outlined"
                size="small"
                fullWidth
                value={filtroBancoTipo}
                onChange={(e) => setFiltroBancoTipo(e.target.value)}
                className="flex-1"
                SelectProps={{ native: true }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="multiple">Múltiple</option>
                <option value="verdadero_falso">Verdadero/Falso</option>
              </TextField>
            </Paper>
          </Box>
        </DialogTitle>

        <DialogContent className="p-0">
          {cargandoBanco ? (
            <Box className="flex min-h-[200px] items-center justify-center">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer className="h-full">
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" className="bg-gray-100">
                      <Checkbox
                        indeterminate={
                          seleccionadasBanco.length > 0 &&
                          seleccionadasBanco.length < preguntasBanco.length
                        }
                        checked={
                          preguntasBanco.length > 0 &&
                          seleccionadasBanco.length === preguntasBanco.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSeleccionadasBanco(preguntasBanco.map((p) => p.id_pregunta));
                          } else {
                            setSeleccionadasBanco([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="bg-gray-100 font-bold">Enunciado</TableCell>
                    <TableCell className="bg-gray-100 font-bold">Tipo</TableCell>
                    <TableCell className="bg-gray-100 font-bold">Módulo</TableCell>
                    <TableCell className="bg-gray-100 font-bold" align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preguntasBanco
                    .filter(p => {
                      const matchTexto = p.texto_pregunta.toLowerCase().includes(filtroBancoTexto.toLowerCase());
                      const matchModulo = filtroBancoModulo === "todos" || p.id_modulo?.nombre_modulo === filtroBancoModulo;
                      const matchTipo = filtroBancoTipo === "todos" || p.tipo_pregunta === filtroBancoTipo;
                      return matchTexto && matchModulo && matchTipo;
                    })
                    .map((pregunta) => {
                      const isSelected = seleccionadasBanco.includes(pregunta.id_pregunta);
                      return (
                        <TableRow
                          key={pregunta.id_pregunta}
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onClick={() => handleToggleSeleccionBanco(pregunta.id_pregunta)}
                            />
                          </TableCell>
                          <TableCell
                            className="max-w-xs truncate cursor-pointer"
                            onClick={() => handleToggleSeleccionBanco(pregunta.id_pregunta)}
                          >
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
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                verDetallePregunta(pregunta.id_pregunta);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {preguntasBanco.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8 text-gray-500">
                        No hay preguntas disponibles en el banco.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t">
          <Button onClick={() => setModalBancoAbierto(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAgregarSeleccionadas}
            variant="contained"
            disabled={seleccionadasBanco.length === 0}
            sx={{
              background: "linear-gradient(to right, #c20e1a, #a00c15)",
            }}
          >
            Agregar ({seleccionadasBanco.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalle de Pregunta */}
      <Dialog
        open={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-2xl"
        }}
      >
        <DialogTitle className="bg-gray-50 flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-primary">
            Detalle de Pregunta
          </Typography>
          <IconButton onClick={() => setModalDetalleAbierto(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="mt-4">
          {cargandoDetalle ? (
            <Box className="flex min-h-[200px] items-center justify-center">
              <CircularProgress />
            </Box>
          ) : preguntaDetalle ? (
            <Box className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Enunciado</Typography>
                <Typography variant="body1" className="font-medium text-lg">
                  {preguntaDetalle.texto_pregunta}
                </Typography>
              </Box>

              {preguntaDetalle.imagen && (
                <Box>
                  <img
                    src={preguntaDetalle.imagen}
                    alt="Imagen pregunta"
                    className="max-h-64 rounded-lg border"
                  />
                </Box>
              )}

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                  <Chip
                    label={preguntaDetalle.tipo_pregunta === "multiple" ? "Opción Múltiple" : "Verdadero/Falso"}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Puntaje</Typography>
                  <Typography variant="body1">{preguntaDetalle.puntaje}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" className="mb-2 font-bold text-secondary">Respuestas</Typography>
                <Box className="flex flex-col gap-2">
                  {preguntaDetalle.respuestas?.map((resp: any) => (
                    <Box
                      key={resp.id_respuesta}
                      className={`p-3 rounded-lg border flex justify-between items-center ${resp.es_correcta ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <Typography>{resp.texto_respuesta}</Typography>
                      {resp.es_correcta && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Correcta"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              {preguntaDetalle.explicacion && (
                <Box className="bg-blue-50 p-4 rounded-lg mt-2">
                  <Typography variant="subtitle2" className="font-bold text-blue-800">Explicación:</Typography>
                  <Typography variant="body2" className="text-blue-900">{preguntaDetalle.explicacion}</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography align="center" color="error">No se pudo cargar la información.</Typography>
          )}
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={() => setModalDetalleAbierto(false)} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Configuración Aleatoria */}
      <Dialog
        open={modalAleatorioAbierto}
        onClose={() => setModalAleatorioAbierto(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "rounded-2xl"
        }}
      >
        <DialogTitle className="bg-gray-50 text-center font-bold text-primary">
          Agregar Preguntas Aleatorias
        </DialogTitle>
        <DialogContent className="mt-4 flex flex-col gap-6">
          <Typography variant="body2" color="text.secondary" className="text-center">
            Configura los criterios para seleccionar preguntas al azar del banco.
            Solo se seleccionarán preguntas que no estén ya en la prueba.
          </Typography>

          <TextField
            select
            label="Módulo"
            fullWidth
            value={configAleatoria.modulo}
            onChange={(e) => setConfigAleatoria({ ...configAleatoria, modulo: e.target.value })}
            SelectProps={{ native: true }}
          >
            <option value="todos">Todos los módulos</option>
            {Array.from(new Set(preguntasBanco.map(p => p.id_modulo?.nombre_modulo).filter(Boolean))).sort().map(nombre => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </TextField>

          <TextField
            select
            label="Tipo de Pregunta"
            fullWidth
            value={configAleatoria.tipo}
            onChange={(e) => setConfigAleatoria({ ...configAleatoria, tipo: e.target.value })}
            SelectProps={{ native: true }}
          >
            <option value="todos">Todos los tipos</option>
            <option value="multiple">Múltiple</option>
            <option value="verdadero_falso">Verdadero/Falso</option>
          </TextField>

          <Box>
            <Typography gutterBottom>Cantidad de preguntas</Typography>
            <Box className="flex items-center gap-4">
              <TextField
                type="number"
                fullWidth
                value={configAleatoria.cantidad}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setConfigAleatoria({ ...configAleatoria, cantidad: val });
                  }
                }}
                inputProps={{ min: 1, max: disponiblesAleatorias }}
              />
              <Typography variant="body2" color="text.secondary" className="whitespace-nowrap">
                de {disponiblesAleatorias} disponibles
              </Typography>
            </Box>
          </Box>

          {disponiblesAleatorias === 0 && (
            <Alert severity="warning">
              No hay preguntas disponibles con estos criterios (o ya están todas agregadas).
            </Alert>
          )}
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={() => setModalAleatorioAbierto(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAgregarAleatorias}
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            disabled={disponiblesAleatorias === 0 || configAleatoria.cantidad < 1}
            sx={{
              background: "linear-gradient(to right, #4a4a4a, #2c2c2c)",
            }}
          >
            Agregar {Math.min(configAleatoria.cantidad, disponiblesAleatorias)} Preguntas
          </Button>
        </DialogActions>
      </Dialog>

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
