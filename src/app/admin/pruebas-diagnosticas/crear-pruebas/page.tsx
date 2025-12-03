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
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

interface Opcion {
  id: string;
  texto: string;
}

interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
}

interface Pregunta {
  id: number;
  tipo: "multiple" | "verdadero-falso";
  enunciado: string;
  imagen: string | null;
  opciones: Opcion[];
  respuestaCorrecta: string;
  puntaje: number;
  explicacion: string;
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
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

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

  const handleImagenChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>,
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
    preguntaId: number,
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

      // 2. Iterar y crear cada Pregunta
      for (const pregunta of preguntas) {
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
          // Si falla la creación de la pregunta, continuamos con la siguiente o lanzamos error
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
                    actualizarPregunta(pregunta.id, "puntaje", parseFloat(e.target.value))
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
                    actualizarPregunta(pregunta.id, "explicacion", e.target.value)
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
                    <Box
                      key={opcion.id}
                      className="flex items-center gap-2"
                    >
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
                            e.target.value,
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
                    e.target.value,
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

      {/* Botón guardar */}
      {preguntas.length > 0 && (
        <Box className="mt-6 flex justify-end">
          <Button
            variant="contained"
            className="buttons-principal"
            onClick={guardarPruebaDiagnostica}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Prueba Diagnóstica"}
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
