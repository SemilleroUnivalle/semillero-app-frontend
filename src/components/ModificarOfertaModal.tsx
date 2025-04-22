import {
  Modal,
  Box,
  Typography,
  Button,
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

interface ModificarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  data: any; // Puedes reemplazar `any` con un tipo específico si lo tienes
}

export default function ModificarOfertaModal({
  open,
  onClose,
  data,
}: ModificarOfertaModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="mx-auto mt-20 max-w-lg rounded-xl bg-white p-4 shadow-lg">
        <h2>Modificar oferta</h2>

{data && (
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
                value={data.nombre}
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
                value={data.fecha_inicio}
              />
            </div>

            <h2>Cursos</h2>

            {/* {categorias.map((categoria) => (
              <Box key={categoria} borderRadius={2}>
                <FormLabel className="font-semibold">{categoria}</FormLabel>

                <FormControl
                  className="inputs-textfield"
                  fullWidth
                  sx={{ mt: 2 }}
                >
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
                  <TextField
                    className="inputs-textfield"
                    label="Precio Público"
                    type="number"
                  />
                  <TextField
                    className="inputs-textfield"
                    label="Precio Privado"
                    type="number"
                  />
                  <TextField
                    className="inputs-textfield"
                    label="Precio Relación Univalle"
                    type="number"
                  />
                </Box>

                <TextField
                  className="inputs-textfield"
                  sx={{ mt: 2 }}
                  type="date"
                  label="Fecha de finalización"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            ))} */}

            <Button
              type="submit"
              variant="contained"
              className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
            >
              Crear oferta
            </Button>
          </form>
        </div>
        )}

        <Button onClick={onClose} className="mt-4" variant="contained">
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}
