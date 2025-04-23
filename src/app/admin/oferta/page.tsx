
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  GridColDef,
  DataGrid,
  GridRowParams,
} from "@mui/x-data-grid";
import CrearCursoModal from "@/components/CrearCursoModal";
import CrearOfertaModal from "@/components/CrearOfertaModal";
import ModificarOfertaModal from "@/components/ModificarOfertaModal";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "lastName", headerName: "Apellidos", width: 130 },
  { field: "firstName", headerName: "Nombres", width: 130 },
  { field: "email", headerName: "Correo Electrónico", width: 130 },
  {
    field: "periodo",
    headerName: "Periodo",
    width: 130,
  },
  {
    field: "modulo",
    headerName: "Módulo",
    width: 130,
  },
  {
    field: "estamento",
    headerName: "Estamento",
    width: 130,
  },
  {
    field: "tipo",
    headerName: "Tipo de Inscrito",
    width: 130,
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 130,
    type: "boolean",
  },
];

const rowsII = [
  {
    id: 1,
    firstName: "Carlos",
    lastName: "Pérez",
    email: "carlos.perez@email.com",
    periodo: "2021A",
    modulo: "Matemáticas",
    estamento: "Público",
    tipo: "Particular",
    estado: true,
  }
];

const columnsOfertas: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 130 },
  { field: "username", headerName: "Fecha de inicio", width: 130 },
  { field: "correo", headerName: "Módulos por área", width: 130 },
  { field: "lng", headerName: "NAS Presencial", width: 130 },
  // { field: "username", headerName: "NAS Virtual", width: 130 },
  // {
  //   field: "estado",
  //   headerName: "Estado",
  //   width: 130,
  //   type: "boolean",
  // },
];


const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {

    const [rows, setRows] = useState<any[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users`,
        );
        const res = response.data;

        const formateado = res.map((data: any) => ({
          id: data.id,
          nombre: data.name,
          username: data.username,
          correo: data.email,
          telefono: data.phone,
          pagina_web: data.website,
          lat: data.address.geo.lat,
          lng: data.address.geo.lng,
        }));

        setRows(formateado);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
      }
    };

    fetchData();
  }, []);

  //Barra de busqueda

  // const [searchText, setSearchText] = React.useState("");
  // const [filteredRows, setFilteredRows] = React.useState(rows);

  // const requestSearch = (searchValue: string) => {
  //   setSearchText(searchValue);

  //   const filtered = rows.filter((row) => {
  //     return (
  //       row.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       row.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       row.email.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       row.age.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   });

  //   setFilteredRows(filtered);
  // };


  // Modal para crear curso
  const [openCursoModal, setOpenCursoModal] = React.useState(false);
  const handleOpenCursoModal = () => setOpenCursoModal(true);
  const handleCloseCursoModal = () => setOpenCursoModal(false);

  // Modal para crear oferta
  const [openOfertaModal, setOpenOfertaModal] = React.useState(false);
  const handleOpenOfertaModal = () => setOpenOfertaModal(true);
  const handleCloseOfertaModal = () => setOpenOfertaModal(false);

  // Modal para modificar oferta
  const [openModificarOfertaModal, setOpenModificarOfertaModal] =
    React.useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = React.useState(null);
  const handleOpenModificarOfertaModal = (params: GridRowParams) => {
    setOfertaSeleccionada(params.row); // Esto guarda la fila completa
    setOpenModificarOfertaModal(true);
  };

  const handleCloseModificarOfertaModal = () =>
    setOpenModificarOfertaModal(false);


  return (
    <div>
      <h1>Oferta Académica</h1>

      {/* Contenedor de botones para crear ofertas y cursos */}
      <div className="mx-auto my-4 flex w-11/12 flex-wrap justify-between gap-2">
        <Button
          className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
          onClick={handleOpenOfertaModal}
        >
          Crear Oferta
        </Button>
        <Button
          className="w-full rounded-2xl bg-white capitalize text-secondary hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
        >
          Modificar Oferta
        </Button>
        <Button
          className="w-full rounded-2xl bg-white capitalize text-secondary hover:bg-primary hover:text-white sm:w-1/4"
          variant="contained"
          onClick={handleOpenCursoModal}
        >
          Crear Curso
        </Button>

        {/* Modals */}

        <CrearCursoModal
          open={openCursoModal}
          onClose={handleCloseCursoModal}
        />
        <CrearOfertaModal
          open={openOfertaModal}
          onClose={handleCloseOfertaModal}
        />
        
      </div>


      {/* Contenedor de ofertas */}

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        {/* <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => requestSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none sm:w-1/3"
        /> */}

        <Paper
          className="border-none shadow-none"
          sx={{ height: 500, width: "100%" }}
        >
          <DataGrid
            rows={rows}
            columns={columnsOfertas}
            initialState={{ pagination: { paginationModel } }}
            onRowClick={handleOpenModificarOfertaModal}
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

        <ModificarOfertaModal
          open={openModificarOfertaModal}
          onClose={() => setOpenModificarOfertaModal(false)}
          data={ofertaSeleccionada}
        />
      </div>

      {/* Contenedor de Inscripciones */}

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        {/* <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => requestSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none sm:w-1/3"
        /> */}

        <Paper
          className="border-none shadow-none"
          sx={{ height: 500, width: "100%" }}
        >
          <DataGrid
            rows={rowsII}
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
    </div>
  );
}
