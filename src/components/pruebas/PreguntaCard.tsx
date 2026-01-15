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
  Tooltip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

export interface Opcion {
  id: string;
  texto: string;
  id_respuesta?: number;
}

export interface Pregunta {
  id: number;
  id_pregunta?: number;
  id_banco?: number; // ID si viene del banco de preguntas
  tipo: "multiple" | "verdadero-falso";
  enunciado: string;
  imagen: string | null;
  opciones: Opcion[];
  respuestaCorrecta: string;
  puntaje: number;
  explicacion: string;
}

interface PreguntaCardProps {
  pregunta: Pregunta;
  index: number;
  onUpdate: (id: number, campo: string, valor: string | number) => void;
  onDelete: (id: number) => void;
  onTypeChange: (id: number, tipo: "multiple" | "verdadero-falso") => void;
  onAddOption: (id: number) => void;
  onDeleteOption: (preguntaId: number, opcionId: string) => void;
  onUpdateOption: (preguntaId: number, opcionId: string, valor: string) => void;
}

export default function PreguntaCard({
  pregunta,
  index,
  onUpdate,
  onDelete,
  onTypeChange,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
}: PreguntaCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTipoSelect = (tipo: "multiple" | "verdadero-falso") => {
    onTypeChange(pregunta.id, tipo);
    handleMenuClose();
  };

  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(pregunta.id, "imagen", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-none">
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Typography variant="h6" className="text-primary">
              Pregunta {index + 1}
            </Typography>
            {pregunta.id_banco && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                Del Banco
              </span>
            )}
          </Box>
          <Box className="flex items-center gap-2">
            <Button
              variant="outlined"
              onClick={handleMenuClick}
              endIcon={<ArrowDropDownIcon />}
              className="buttons-primary"
            >
              {pregunta.tipo === "multiple"
                ? "Opción múltiple respuesta única"
                : "Verdadero/Falso"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleTipoSelect("multiple")}>
                Opción múltiple respuesta única
              </MenuItem>
              <MenuItem onClick={() => handleTipoSelect("verdadero-falso")}>
                Verdadero/Falso
              </MenuItem>
            </Menu>
            <IconButton
              onClick={() => onDelete(pregunta.id)}
              className="text-secondary hover:text-primary"
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Enunciado */}
        <TextField
          label="Enunciado de la pregunta"
          name="enunciado"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          minRows={3}
          value={pregunta.enunciado}
          onChange={(e) => onUpdate(pregunta.id, "enunciado", e.target.value)}
          placeholder="Escribe el enunciado. Puedes usar LaTeX: \frac{a}{b}"
          InputLabelProps={{
    style: { background: "#fff", padding: "0 4px" }
  }}
        />

        <Box className="flex gap-4">
          <TextField
            label="Puntaje"
            type="number"
            margin="normal"
            value={pregunta.puntaje}
            onChange={(e) =>
              onUpdate(pregunta.id, "puntaje", parseFloat(e.target.value))
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
              onUpdate(pregunta.id, "explicacion", e.target.value)
            }
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
              onChange={handleImagenChange}
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
                onClick={() => onAddOption(pregunta.id)}
                className="buttons-primary"
                disabled={pregunta.opciones.length >= 26}
              >
                Agregar opción
              </Button>
            )}
          </Box>
          <Box className="mt-2 flex flex-col gap-2">
            {pregunta.opciones.map((opcion) => (
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
                    onUpdateOption(pregunta.id, opcion.id, e.target.value)
                  }
                  placeholder="Puedes usar LaTeX: x^2 + y^2"
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        title={
                          opcion.id === pregunta.respuestaCorrecta
                            ? "Respuesta correcta"
                            : "Marcar como respuesta correcta"
                        }
                        arrow
                        placement="top"
                      >
                        <IconButton
                          onClick={() =>
                            onUpdate(
                              pregunta.id,
                              "respuestaCorrecta",
                              opcion.id,
                            )
                          }
                          size="small"
                          sx={{
                            padding: 0.5,
                            "&:hover": {
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                            },
                          }}
                        >
                          <CheckCircleIcon
                            sx={{
                              color:
                                opcion.id === pregunta.respuestaCorrecta
                                  ? "#4caf50"
                                  : "#e0e0e0",
                              fontSize: 28,
                              transition: "color 0.2s ease",
                              cursor: "pointer",
                              "&:hover": {
                                color:
                                  opcion.id === pregunta.respuestaCorrecta
                                    ? "#45a049"
                                    : "#bdbdbd",
                              },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
                {pregunta.tipo === "multiple" &&
                  pregunta.opciones.length > 2 && (
                    <IconButton
                      onClick={() => onDeleteOption(pregunta.id, opcion.id)}
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
      </CardContent>
      <Divider />
    </Card>
  );
}
