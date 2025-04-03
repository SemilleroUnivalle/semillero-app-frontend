"use client";

import {
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

interface CrearOfertaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CrearOfertaModal({
  open,
  onClose,
}: CrearOfertaModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="w-3/3 mx-auto mt-10 rounded-2xl bg-white p-4 sm:w-2/4 md:w-1/4">
        <h2 className="mb-2 text-center">Crear oferta</h2>
        <div>
          <form action="" method="post" className="space-y-4">
            {/* Campo nombre de la oferta */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Nombre"
              name="nombre_oferta"
              variant="outlined"
              type="text"
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />
            <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Required" />

            </FormGroup>
            {/* Campo selector de area */}
            <FormControl className="inputs-textfield w-full">
              <InputLabel id="area_oferta">Área</InputLabel>
              <Select
                labelId="area_oferta"
                id="area_oferta"
                label="area_oferta"
                required
              >
                <MenuItem value={"Matemáticas"}>Matemáticas</MenuItem>
                <MenuItem value={"Física"}>Física</MenuItem>
                <MenuItem value={"Química"}>Química</MenuItem>
                <MenuItem value={"Lenguaje"}>Lenguaje</MenuItem>
                <MenuItem value={"Inglés"}>Inglés</MenuItem>
                <MenuItem value={"Música"}>Música</MenuItem>
                <MenuItem value={"Inglés"}>Inglés</MenuItem>
                <MenuItem value={"Artes Escénicas"}>Artes Escénicas</MenuItem>
                <MenuItem value={"NAS"}>
                  NAS - Nivelación Académica Semillero
                </MenuItem>
                <MenuItem value={"Otra"}>Otra</MenuItem>
              </Select>
            </FormControl>

            {/* Campo intensidad horaria */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Intensidad horaria"
              name="intensidad_horaria"
              variant="outlined"
              type="text"
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />

            {/* Campo descripción */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Descripción"
              name="descripción_oferta"
              variant="outlined"
              type="text"
              multiline
              rows={4}
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />

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
