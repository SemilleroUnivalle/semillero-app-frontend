
"use client";

import * as React from "react";
import {
  Button,
  Paper,
  Modal,
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "lastName", headerName: "Apellidos", width: 130 },
  { field: "firstName", headerName: "Nombres", width: 130 },
  { field: "email", headerName: "Correo Electrónico", width: 130 },
  {
    field: "age",
    headerName: "Módulo",
    width: 130,
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 130,
    type: "boolean",
  },
];

const rows = [
  {
    id: 1,
    lastName: "Pérez",
    firstName: "Carlos",
    email: "carlos.perez@email.com",
    age: "Matemáticas",
    estado: true,
  },
  {
    id: 2,
    lastName: "Gómez",
    firstName: "Ana",
    email: "ana.gomez@email.com",
    age: "Ciencias",
    estado: false,
  },
  {
    id: 3,
    lastName: "Rodríguez",
    firstName: "Luis",
    email: "luis.rodriguez@email.com",
    age: "Historia",
    estado: true,
  },
  {
    id: 4,
    lastName: "Martínez",
    firstName: "Elena",
    email: "elena.martinez@email.com",
    age: "Física",
    estado: true,
  },
  {
    id: 5,
    lastName: "Sánchez",
    firstName: "Javier",
    email: "javier.sanchez@email.com",
    age: "Química",
    estado: true,
  },
  {
    id: 6,
    lastName: "Fernández",
    firstName: "Lucía",
    email: "lucia.fernandez@email.com",
    age: "Biología",
    estado: false,
  },
  {
    id: 7,
    lastName: "López",
    firstName: "Miguel",
    email: "miguel.lopez@email.com",
    age: "Arte",
    estado: true,
  },
  {
    id: 8,
    lastName: "Díaz",
    firstName: "Patricia",
    email: "patricia.diaz@email.com",
    age: "Literatura",
    estado: true,
  },
  {
    id: 9,
    lastName: "Torres",
    firstName: "Raúl",
    email: "raul.torres@email.com",
    age: "Música",
    estado: true,
  },
  {
    id: 10,
    lastName: "Ramírez",
    firstName: "Sofía",
    email: "sofia.ramirez@email.com",
    age: "Informática",
    estado: false,
  },
  {
    id: 11,
    lastName: "Flores",
    firstName: "Diego",
    email: "diego.flores@email.com",
    age: "Matemáticas",
    estado: true,
  },
  {
    id: 12,
    lastName: "Gutiérrez",
    firstName: "Andrea",
    email: "andrea.gutierrez@email.com",
    age: "Ciencias",
    estado: true,
  },
  {
    id: 13,
    lastName: "Castro",
    firstName: "Jorge",
    email: "jorge.castro@email.com",
    age: "Historia",
    estado: false,
  },
  {
    id: 14,
    lastName: "Mendoza",
    firstName: "Valeria",
    email: "valeria.mendoza@email.com",
    age: "Física",
    estado: true,
  },
  {
    id: 15,
    lastName: "Reyes",
    firstName: "Fernando",
    email: "fernando.reyes@email.com",
    age: "Química",
    estado: true,
  },
  {
    id: 16,
    lastName: "Ortiz",
    firstName: "Camila",
    email: "camila.ortiz@email.com",
    age: "Biología",
    estado: true,
  },
  {
    id: 17,
    lastName: "Navarro",
    firstName: "Ricardo",
    email: "ricardo.navarro@email.com",
    age: "Arte",
    estado: false,
  },
  {
    id: 18,
    lastName: "Vargas",
    firstName: "Isabel",
    email: "isabel.vargas@email.com",
    age: "Literatura",
    estado: true,
  },
  {
    id: 19,
    lastName: "Silva",
    firstName: "Esteban",
    email: "esteban.silva@email.com",
    age: "Música",
    estado: true,
  },
  {
    id: 20,
    lastName: "Rojas",
    firstName: "Gabriela",
    email: "gabriela.rojas@email.com",
    age: "Informática",
    estado: false,
  },
  {
    id: 21,
    lastName: "Herrera",
    firstName: "Sergio",
    email: "sergio.herrera@email.com",
    age: "Matemáticas",
    estado: true,
  },
  {
    id: 22,
    lastName: "Morales",
    firstName: "Natalia",
    email: "natalia.morales@email.com",
    age: "Ciencias",
    estado: true,
  },
  {
    id: 23,
    lastName: "Ibarra",
    firstName: "Alberto",
    email: "alberto.ibarra@email.com",
    age: "Historia",
    estado: false,
  },
  {
    id: 24,
    lastName: "Campos",
    firstName: "Beatriz",
    email: "beatriz.campos@email.com",
    age: "Física",
    estado: true,
  },
  {
    id: 25,
    lastName: "Peña",
    firstName: "Mario",
    email: "mario.pena@email.com",
    age: "Química",
    estado: true,
  },
  {
    id: 26,
    lastName: "Soto",
    firstName: "Daniela",
    email: "daniela.soto@email.com",
    age: "Biología",
    estado: true,
  },
  {
    id: 27,
    lastName: "Maldonado",
    firstName: "Hugo",
    email: "hugo.maldonado@email.com",
    age: "Arte",
    estado: false,
  },
  {
    id: 28,
    lastName: "Suárez",
    firstName: "Mariana",
    email: "mariana.suarez@email.com",
    age: "Literatura",
    estado: true,
  },
  {
    id: 29,
    lastName: "Delgado",
    firstName: "Cristian",
    email: "cristian.delgado@email.com",
    age: "Música",
    estado: true,
  },
  {
    id: 30,
    lastName: "Cortés",
    firstName: "Lorena",
    email: "lorena.cortes@email.com",
    age: "Informática",
    estado: false,
  },
];

const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {
  // Modal para crear curso
  const [openCrearCurso, setOpenCrearCurso] = React.useState(false);
  const handleOpenCrearCurso = () => setOpenCrearCurso(true);
  const handleCloseCrearCurso = () => setOpenCrearCurso(false);

  return (
    <div>
      <h1>Oferta Académica</h1>

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        <Paper
          className="border-none shadow-none"
          sx={{ height: 500, width: "100%" }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[20, 40]}
            sx={{ border: 0 }}
            localeText={{
              // 📌 Traducciones básicas en español
              noRowsLabel: "No hay filas",
              columnMenuSortAsc: "Ordenar ascendente",
              columnMenuSortDesc: "Ordenar descendente",
              columnMenuFilter: "Filtrar",
              columnMenuHideColumn: "Ocultar columna",
              columnMenuShowColumns: "Mostrar columnas",
              toolbarDensity: "Densidad",
              toolbarDensityLabel: "Densidad",
              toolbarDensityCompact: "Compacta",
              toolbarDensityStandard: "Estándar",
              toolbarDensityComfortable: "Cómoda",
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
                labelRowsPerPage: "Filas por página:",
              },
            }}
          />
        </Paper>
      </div>
      <div className="mx-auto my-4 flex w-11/12 flex-wrap justify-between gap-2">
        <Button
          className="text-secondary w-full rounded-xl bg-white capitalize hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
        >
          Crear Oferta
        </Button>
        <Button
          className="text-secondary w-full rounded-xl bg-white capitalize hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
        >
          Modificar Oferta
        </Button>
        <Button
          className="text-secondary w-full rounded-xl bg-white capitalize hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
          onClick={handleOpenCrearCurso}
        >
          Crear Curso
        </Button>

        {/* Modal Crear Curso*/}
        <Modal
          open={openCrearCurso}
          onClose={handleCloseCrearCurso}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="mx-auto mt-10 w-1/2 rounded-2xl bg-white p-4 sm:w-1/4">
            <h2 className="text-center mb-2">Crear curso</h2>
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
                    <MenuItem value={"Artes Escénicas"}>
                      Artes Escénicas
                    </MenuItem>
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
                  className="text-md mt-4 w-full font-semibold rounded-2xl bg-primary capitalize text-white hover:bg-red-800"
                >
                  Crear Curso
                </Button>
              </form>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

