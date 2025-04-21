"use client";

import {
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

interface CrearCursoModalProps {
    open: boolean;
    onClose: () => void;
  }

export default function CrearCursoModal({ open, onClose }: CrearCursoModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="mx-auto mt-10 w-3/3 rounded-2xl bg-white p-4 sm:w-2/4 md:w-1/4">
        <h2 className="mb-2 text-center">Crear curso</h2>
        <div>
          <form action="" method="post" className="space-y-4">
            {/* Campo nombre del curso */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Nombre"
              name="nombre_curso"
              variant="outlined"
              type="text"
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />

            {/* Campo selector de area */}
            <FormControl className="inputs-textfield w-full">
              <InputLabel id="area_curso">Área</InputLabel>
              <Select
                labelId="area_curso"
                id="area_curso"
                label="area_curso"
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

            {/* Campo selector de categoria */}
            <FormControl className="inputs-textfield w-full">
              <InputLabel id="categoria_curso">Categoría</InputLabel>
              <Select
                labelId="categoria_curso"
                id="categoria_curso"
                label="categoria_curso"
                required
              >
                <MenuItem value={"Modulos por área"}>Módulos por área</MenuItem>
                <MenuItem value={"NAS Presencial"}> NAS Presencial</MenuItem>
                <MenuItem value={"NAS Virtual"}> NAS Virtual</MenuItem>
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
              name="descripción_curso"
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
              Crear Curso
            </Button>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
