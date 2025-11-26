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
} from "@mui/material";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Pregunta {
  id: number;
  enunciado: string;
  imagen: string | null;
  opciones: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  respuestaCorrecta: string;
}

export default function CrearPruebas() {
  const [modulo, setModulo] = useState("");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  const agregarPregunta = () => {
    const nuevaPregunta: Pregunta = {
      id: Date.now(),
      enunciado: "",
      imagen: null,
      opciones: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
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
    id: number,
    opcion: keyof Pregunta["opciones"],
    valor: string,
  ) => {
    setPreguntas(
      preguntas.map((p) =>
        p.id === id
          ? { ...p, opciones: { ...p.opciones, [opcion]: valor } }
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
                <IconButton
                  onClick={() => eliminarPregunta(pregunta.id)}
                  className="text-secondary hover:text-primary"
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
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
              <Typography
                variant="subtitle1"
                className="mt-4 font-bold text-secondary"
              >
                Opciones de respuesta
              </Typography>
              <Box className="grid gap-2 md:grid-cols-2">
                {(["A", "B", "C", "D"] as const).map((letra) => (
                  <TextField
                    key={letra}
                    label={`Opción ${letra}`}
                    fullWidth
                    margin="normal"
                    value={pregunta.opciones[letra]}
                    onChange={(e) =>
                      actualizarOpcion(pregunta.id, letra, e.target.value)
                    }
                    placeholder="Puedes usar LaTeX: x^2 + y^2"
                  />
                ))}
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
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
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
