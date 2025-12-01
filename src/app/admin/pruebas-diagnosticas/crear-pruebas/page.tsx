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
} from "@mui/material";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface Opcion {
  id: string;
  texto: string;
}

interface Pregunta {
  id: number;
  tipo: "multiple" | "verdadero-falso";
  enunciado: string;
  imagen: string | null;
  opciones: Opcion[];
  respuestaCorrecta: string;
}

export default function CrearPruebas() {
  const [modulo, setModulo] = useState("");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const eliminarPregunta = (id: number) => {
    setPreguntas(preguntas.filter((p) => p.id !== id));
  };

  const actualizarPregunta = (id: number, campo: string, valor: string) => {
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

  return (
    <Box className="inputs-textfield mx-auto flex w-11/12 flex-col rounded-2xl bg-white p-4">
      <Typography variant="h6" className="text-center font-bold text-primary">
        Crear Pruebas Diagnósticas
      </Typography>
      <TextField
        className="mx-auto w-full sm:w-1/4"
        label="Módulo"
        fullWidth
        margin="normal"
        value={modulo}
        onChange={(e) => setModulo(e.target.value)}
      />

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
            onClick={() => console.log({ modulo, preguntas })}
          >
            Guardar Prueba Diagnóstica
          </Button>
        </Box>
      )}
    </Box>
  );
}
