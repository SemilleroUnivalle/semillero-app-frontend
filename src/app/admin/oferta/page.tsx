
"use client";

import * as React from "react";
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
  GridToolbar,
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

const rows = [
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
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "Gómez",
    email: "ana.gomez@email.com",
    periodo: "2022A",
    modulo: "Ciencias",
    estamento: "Privado",
    tipo: "Becado",
    estado: false,
  },
  {
    id: 3,
    firstName: "Luis",
    lastName: "Rodríguez",
    email: "luis.rodriguez@email.com",
    periodo: "2023A",
    modulo: "Historia",
    estamento: "Cobertura",
    tipo: "Relación Univalle",
    estado: true,
  },
  {
    id: 4,
    firstName: "Elena",
    lastName: "Martínez",
    email: "elena.martinez@email.com",
    periodo: "2024A",
    modulo: "Física",
    estamento: "Privado",
    tipo: "Particular",
    estado: true,
  },
  {
    id: 5,
    firstName: "Javier",
    lastName: "Sánchez",
    email: "javier.sanchez@email.com",
    periodo: "2020A",
    modulo: "Química",
    estamento: "Público",
    tipo: "Becado",
    estado: true,
  },
  {
    id: 6,
    firstName: "Lucía",
    lastName: "Fernández",
    email: "lucia.fernandez@email.com",
    periodo: "2021B",
    modulo: "Biología",
    estamento: "Cobertura",
    tipo: "Relación Univalle",
    estado: false,
  },
  {
    id: 7,
    firstName: "Miguel",
    lastName: "López",
    email: "miguel.lopez@email.com",
    periodo: "2025A",
    modulo: "Arte",
    estamento: "Privado",
    tipo: "Particular",
    estado: true,
  },
  {
    id: 8,
    firstName: "Patricia",
    lastName: "Díaz",
    email: "patricia.diaz@email.com",
    periodo: "2023B",
    modulo: "Literatura",
    estamento: "Público",
    tipo: "Becado",
    estado: true,
  },
  {
    id: 9,
    firstName: "Raúl",
    lastName: "Torres",
    email: "raul.torres@email.com",
    periodo: "2022B",
    modulo: "Música",
    estamento: "Cobertura",
    tipo: "Relación Univalle",
    estado: true,
  },
];

const columnsOfertas: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 130 },
  { field: "fecha_inicio", headerName: "Fecha de inicio", width: 130 },
  { field: "modulos", headerName: "Módulos por área", width: 130 },
  { field: "nas_presencial", headerName: "NAS Presencial", width: 130 },
  { field: "nas_virtual", headerName: "NAS Virtual", width: 130 },

  {
    field: "estado",
    headerName: "Estado",
    width: 130,
    type: "boolean",
  },
];

const rowsOfertasII = [
  {
    id: 1,
    nombre: "2025A",
    fecha_inicio: "10/10/2025",
    modulos: "12/12/2025",
    nas_presencial: "12/12/2025",
    nas_virtual: "12/12/2025",
    estado: true,
  },
  {
    id: 2,
    nombre: "2024A",
    fecha_inicio: "10/10/2025",
    modulos: "12/12/2025",
    nas_presencial: "12/12/2025",
    nas_virtual: "12/12/2025",
    estado: false,
  },
  {
    id: 3,
    nombre: "2024B",
    fecha_inicio: "10/10/2025",
    modulos: "12/12/2025",
    nas_presencial: "12/12/2025",
    nas_virtual: "12/12/2025",
    estado: true,
  },
  {
    id: 4,
    nombre: "2023A",
    fecha_inicio: "10/10/2025",
    modulos: "12/12/2025",
    nas_presencial: "12/12/2025",
    nas_virtual: "12/12/2025",
    estado: true,
  },
];


const rowsOfertas = [
  {
    id: 1,
    id_oferta_academica: 1,
    nombre: "Oferta Semestre 2025-I",
    fecha_inicio: "2025-02-15",
    estado: "Activa",
    categorias: [
      {
        id_oferta_categoria: 101,
        id_categoria: 1,
        nombre_categoria: "Módulos por área",
        precio_publico: 150000,
        precio_privado: 180000,
        precio_relacion_univalle: 120000,
        fecha_finalizacion: "2025-06-30",
        modulos: [
          {
            id_modulo_oferta: 1001,
            id_modulo: 1,
            nombre_modulo: "Enteros",
            id_area: 2,
            nombre_area: "Matemáticas"
          },
          {
            id_modulo_oferta: 1002,
            id_modulo: 3,
            nombre_modulo: "Geometria Analitica",
            id_area: 2,
            nombre_area: "Matemáticas"
          }
        ]
      },
      {
        id_oferta_categoria: 102,
        id_categoria: 2,
        nombre_categoria: "NAS Presencial",
        precio_publico: 200000,
        precio_privado: 250000,
        precio_relacion_univalle: 170000,
        fecha_finalizacion: "2025-06-30",
        modulos: [
          {
            id_modulo_oferta: 1003,
            id_modulo: 6,
            nombre_modulo: "Ingles",
            id_area: 3,
            nombre_area: "Lenguaje"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    id_oferta_academica: 2,
    nombre: "Cursos de verano 2025",
    fecha_inicio: "2025-07-10",
    estado: "Próxima",
    categorias: [
      {
        id_oferta_categoria: 201,
        id_categoria: 4,
        nombre_categoria: "Otros",
        precio_publico: 100000,
        precio_privado: 130000,
        precio_relacion_univalle: 80000,
        fecha_finalizacion: "2025-08-25",
        modulos: [
          {
            id_modulo_oferta: 2001,
            id_modulo: 7,
            nombre_modulo: "Taller Infantil",
            id_area: 5,
            nombre_area: "Arte"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    id_oferta_academica: 3,
    nombre: "Preparación ICFES 2025",
    fecha_inicio: "2025-03-01",
    estado: "Activa",
    categorias: [
      {
        id_oferta_categoria: 301,
        id_categoria: 2,
        nombre_categoria: "NAS Presencial",
        precio_publico: 220000,
        precio_privado: 270000,
        precio_relacion_univalle: 180000,
        fecha_finalizacion: "2025-05-30",
        modulos: [
          {
            id_modulo_oferta: 3001,
            id_modulo: 2,
            nombre_modulo: "Trigonometria",
            id_area: 2,
            nombre_area: "Matemáticas"
          },
          {
            id_modulo_oferta: 3002,
            id_modulo: 4,
            nombre_modulo: "Logica",
            id_area: 2,
            nombre_area: "Matemáticas"
          }
        ]
      },
      {
        id_oferta_categoria: 302,
        id_categoria: 3,
        nombre_categoria: "NAS Virtual",
        precio_publico: 190000,
        precio_privado: 230000,
        precio_relacion_univalle: 150000,
        fecha_finalizacion: "2025-05-30",
        modulos: [
          {
            id_modulo_oferta: 3003,
            id_modulo: 5,
            nombre_modulo: "Funciones",
            id_area: 2,
            nombre_area: "Matemáticas"
          }
        ]
      }
    ]
  }
];


const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {
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

  const [selectedPeriodos, setSelectedPeriodos] = React.useState<string[]>([]);
  const [selectedModulos, setSelectedModulos] = React.useState<string[]>([]);
  const [selectedEstamento, setSelectedEstamento] = React.useState<string[]>(
    [],
  );
  const [selectedTipo, setSelectedTipo] = React.useState<string[]>([]);
  const [selectedEstado, setSelectedEstado] = React.useState<string[]>([]);

  const handleChangePeriodos = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedPeriodos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeModulos = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedModulos(typeof value === "string" ? value.split(",") : value);
  };
  const handleChangeEstamento = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedEstamento(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeTipo = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTipo(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstado = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedEstado(typeof value === "string" ? value.split(",") : value);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const periodoMatch =
        selectedPeriodos.length === 0 || selectedPeriodos.includes(row.periodo);

      const moduloMatch =
        selectedModulos.length === 0 || selectedModulos.includes(row.modulo);

      const estamentoMatch =
        selectedEstamento.length === 0 ||
        selectedEstamento.includes(row.estamento);

      const tipoMatch =
        selectedTipo.length === 0 || selectedTipo.includes(row.tipo);

      const estadoAsString = row.estado ? "Activo" : "Inactivo";
      const estadoMatch =
        selectedEstado.length === 0 || selectedEstado.includes(estadoAsString);

      return (
        periodoMatch &&
        moduloMatch &&
        estamentoMatch &&
        tipoMatch &&
        estadoMatch
      );
    });
  }, [
    selectedPeriodos,
    selectedModulos,
    selectedEstamento,
    selectedTipo,
    selectedEstado,
  ]);

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

      {/* Contenedor de filtros */}
      <div className="mx-auto mt-4 flex w-11/12 flex-wrap justify-between gap-2 rounded-2xl bg-white p-2 shadow-md">
        {/* Filtro por Periodos */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
          <InputLabel id="filtro-periodos">Periodos</InputLabel>
          <Select
            labelId="filtro-periodos"
            id="filtro-periodos"
            label="filtro-periodos"
            multiple
            value={selectedPeriodos}
            onChange={handleChangePeriodos}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.periodo))].map((periodo) => (
              <MenuItem key={periodo} value={periodo}>
                <Checkbox checked={selectedPeriodos.indexOf(periodo) > -1} />
                <ListItemText primary={periodo} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por Módulos */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
          <InputLabel id="filtro-modulos">Módulos</InputLabel>
          <Select
            labelId="filtro-modulos"
            id="filtro-modulos"
            label="filtro-modulos"
            multiple
            value={selectedModulos}
            onChange={handleChangeModulos}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.modulo))].map((modulo) => (
              <MenuItem key={modulo} value={modulo}>
                <Checkbox checked={selectedModulos.indexOf(modulo) > -1} />
                <ListItemText primary={modulo} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por Estamento */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
          <InputLabel id="filtro-estamento">Estamento</InputLabel>
          <Select
            labelId="filtro-estamento"
            id="filtro-estamento"
            label="filtro-estamento"
            multiple
            value={selectedEstamento}
            onChange={handleChangeEstamento}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.estamento))].map((estamento) => (
              <MenuItem key={estamento} value={estamento}>
                <Checkbox checked={selectedEstamento.indexOf(estamento) > -1} />
                <ListItemText primary={estamento} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por Tipo de Inscrito */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
          <InputLabel id="filtro-tipo">Tipo de Inscrito</InputLabel>
          <Select
            labelId="filtro-tipo"
            id="filtro-tipo"
            label="filtro-tipo"
            multiple
            value={selectedTipo}
            onChange={handleChangeTipo}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.tipo))].map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                <Checkbox checked={selectedTipo.indexOf(tipo) > -1} />
                <ListItemText primary={tipo} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por Estado */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
          <InputLabel id="filtro-estado">Estado</InputLabel>
          <Select
            labelId="filtro-estado"
            id="filtro-estado"
            label="filtro-estado"
            multiple
            value={selectedEstado}
            onChange={handleChangeEstado}
            renderValue={(selected) => selected.join(", ")}
          >
            {["Activo", "Inactivo"].map((estado) => (
              <MenuItem key={estado} value={estado}>
                <Checkbox checked={selectedEstado.indexOf(estado) > -1} />
                <ListItemText primary={estado} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            rows={rowsOfertas}
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
            rows={filteredRows}
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
