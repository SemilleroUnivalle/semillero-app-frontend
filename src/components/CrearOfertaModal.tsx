"use client";

import {
  Button,
  Modal,
  Box,
  TextField,
  OutlinedInput,
  ListItemText,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  MenuItem,
  Checkbox,
} from "@mui/material";

import React from "react";

interface CrearOfertaModalProps {
  open: boolean;
  onClose: () => void;
}

const categorias = [
  "Módulos por área",
  "NAS Presencial",
  "NAS Virtual",
  "Otros",
];

const cursos = [
  { id: 1, nombre: "Enteros" },
  { id: 2, nombre: "Trigonometria" },
  { id: 3, nombre: "Geometria Analitica" },
  { id: 4, nombre: "Logica" },
  { id: 5, nombre: "Funciones" },
  { id: 6, nombre: "Ingles" },
  { id: 7, nombre: "Taller Infantil" },
];

export default function CrearOfertaModal({
  open,
  onClose,
}: CrearOfertaModalProps) {
  // Estado mínimo necesario para que el Select múltiple funcione
  const [selectedCursos, setSelectedCursos] = React.useState<number[]>([]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="w-3/3 max-h-[80vh] overflow-y-auto mx-auto mt-4 rounded-2xl bg-white p-4 sm:w-3/4 md:w-3/4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2 className="mb-2 text-center">Crear oferta</h2>
        <div className="flex w-full flex-row items-center justify-center">
          <form action="" method="post" className="space-y-4">
            <div className="flex w-full flex-wrap justify-between gap-4 text-gray-600">
              {/* Campo nombre de la oferta */}
              <TextField
                className="inputs-textfield flex w-full sm:w-1/3"
                label="Nombre de la oferta"
                name="nombre_oferta"
                variant="outlined"
                type="text"
                fullWidth
                required
              />
              {/* Campo fecha de inicio de la oferta */}

              <TextField
                className="inputs-textfield flex w-full sm:w-1/3"
                label="Fecha de inicio"
                name="fecha_inicio"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </div>

            <h2>Cursos</h2>

            {categorias.map((categoria) => (
              <Box key={categoria} borderRadius={2}>
                <FormLabel className="font-semibold">{categoria}</FormLabel>

                <FormControl className="inputs-textfield" fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Cursos</InputLabel>
                  <Select
                    multiple
                    value={selectedCursos}
                    onChange={(e) =>
                      setSelectedCursos(e.target.value as number[])
                    }
                    input={<OutlinedInput label="Cursos" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => cursos.find((c) => c.id === id)?.nombre)
                        .filter(Boolean)
                        .join(", ")
                    }
                  >
                    {cursos.map((curso) => (
                      <MenuItem key={curso.id} value={curso.id}>
                        <Checkbox checked={selectedCursos.includes(curso.id)} />
                        <ListItemText primary={curso.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2} mt={2}>
                  <TextField className="inputs-textfield"  label="Precio Público" type="number" />
                  <TextField className="inputs-textfield" label="Precio Privado" type="number" />
                  <TextField className="inputs-textfield" label="Precio Relación Univalle" type="number" />
                </Box>

                <TextField className="inputs-textfield" 
                  sx={{ mt: 2 }}
                  type="date"
                  label="Fecha de finalización"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            ))}

            <Button
              type="submit"
              variant="contained"
              className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
            >
              Crear oferta
            </Button>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
