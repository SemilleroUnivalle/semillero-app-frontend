"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
  Tooltip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../../config";
import { useRouter } from "next/navigation";

export default function VerInscripciones() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "apellido", headerName: "Apellidos", flex: 1 },
    { field: "nombre", headerName: "Nombres", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1 },
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1,
    },
    {
      field: "modulo",
      headerName: "Módulo",
      flex: 1,
    },
    {
      field: "estamento",
      headerName: "Estamento",
      flex: 1,
    },
    {
      field: "tipo",
      headerName: "Tipo de Inscrito",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      type: "boolean",
    },
    {
      field: "editar",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full flex-row items-center justify-around">
          <Tooltip title="Ver detalles" placement="top">
            <VisibilityOutlinedIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => {
                const rowData = params.row;

                localStorage.setItem(
                  "inscritoSeleccionado",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/inscripciones/detallarInscripcion/");
              }}
            />
          </Tooltip>
          <Tooltip title="Editar inscripcion" placement="top">
            <PencilSquareIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => {
                const rowData = params.row;

                localStorage.setItem(
                  "cursoSeleccionado",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/inscripciones//"); // 👉 Navega a la pantalla de modificar
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar inscripcion" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              // onClick={() => handleDelete(params.row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  interface EstudianteRow {
    id: number;
    apellido: string;
    nombre: string;
    email: string;
    direccion: string;
    periodo: string;
    modulo: string;
    estamento: string;
    tipo: string;
    estado: boolean;
  }

  interface Estudiante {
    id_estudiante: number;
    nombre: string;
    apellido: string;
    contrasena: string;
    numero_documento: string;
    email: string;
    is_active: boolean;
    ciudad_residencia: string;
    eps: string;
    grado: string;
    colegio: string;
    tipo_documento: string;
    genero: string;
    fecha_nacimiento: string;
    telefono_fijo: string;
    celular: string;
    departamento_residencia: string;
    comuna_residencia: string;
    direccion_residencia: string;
    estamento: string;
    discapacidad: boolean;
    tipo_discapacidad: string;
    descripcion_discapacidad: string;
    area_desempeño: string | null;
    grado_escolaridad: string | null;
    documento_identidad: string | null;
    recibo_pago: string | null;
    foto: string | null;
    constancia_estudios: string | null;
    user: number;
    acudiente: number;
  }

  const datosEjemplo: EstudianteRow[] = [
    {
      id: 1,
      apellido: "García",
      nombre: "María Fernanda",
      email: "maria.garcia@email.com",
      direccion: "Cra 10 #20-30",
      periodo: "2024-1",
      modulo: "Matemáticas Básicas",
      estamento: "Estudiante",
      tipo: "Regular",
      estado: true,
    },
    {
      id: 2,
      apellido: "Rodríguez",
      nombre: "Juan Pablo",
      email: "juan.rodriguez@email.com",
      direccion: "Cll 5 #15-22",
      periodo: "2024-1",
      modulo: "Ciencias Naturales",
      estamento: "Estudiante",
      tipo: "Becado",
      estado: true,
    },
    {
      id: 3,
      apellido: "Martínez",
      nombre: "Laura Sofía",
      email: "laura.martinez@email.com",
      direccion: "Av 3N #45-67",
      periodo: "2024-1",
      modulo: "Lengua Castellana",
      estamento: "Estudiante",
      tipo: "Regular",
      estado: false,
    },
    {
      id: 4,
      apellido: "López",
      nombre: "Carlos Andrés",
      email: "carlos.lopez@email.com",
      direccion: "Cll 8 #12-34",
      periodo: "2024-2",
      modulo: "Educación Física",
      estamento: "Docente",
      tipo: "Invitado",
      estado: true,
    },
    {
      id: 5,
      apellido: "Ramírez",
      nombre: "Ana Lucía",
      email: "ana.ramirez@email.com",
      direccion: "Cra 15 #25-40",
      periodo: "2024-2",
      modulo: "Artes",
      estamento: "Estudiante",
      tipo: "Regular",
      estado: true,
    },
  ];

  const [rows, setRows] = useState<EstudianteRow[]>(datosEjemplo);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }

        const response = await axios.get(`${API_BASE_URL}/estudiante/est/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setEstudiantes(response.data);
        console.log("Estudiantes:", response.data);

        // const formateado = estudiantes.map(
        //   (student: {
        //     id: number;
        //     username: string;
        //     name: string;
        //     email: string;
        //     address: {
        //       city: string;
        //       street: string;
        //       suite: string;
        //       zipcode: string;
        //     };
        //   }) => ({
        //     id: student.id,
        //     apellido: student.username,
        //     nombre: student.name,
        //     email: student.email,
        //     direccion: student.address,
        //     periodo: student.address.city,
        //     modulo: student.address.street,
        //     estamento: student.address.suite,
        //     tipo: student.address.zipcode,
        //     estado: true,
        //   }),
        // );

        // setRows(formateado);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_BASE_URL}/estudiante/est/`,
  //       );
  //       const estudiantes = response.data;

  //       const formateado = estudiantes.map((student: any) => ({
  //         id: student.id,
  //         apellido: student.apellido,
  //         nombre: student.nombre,
  //         email: student.email,
  //         numero_identificacion: student.numero_identificacion || "Sin asignar",
  //         direccion: student.direccion,
  //       }));

  //       setRows(formateado);
  //     } catch (error) {
  //       console.error("Error al obtener los datos de los estudiantes:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Filtros

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

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/estudiante/est/export-excel/`,
        {
          responseType: "blob", // Importante para archivos
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Inscripciones.xlsx"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("No se pudo exportar el archivo.");
      console.error(error);
    }
  };

  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;
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
    rows,
    selectedPeriodos,
    selectedModulos,
    selectedEstamento,
    selectedTipo,
    selectedEstado,
  ]);

  return (
    <div>
      
      <div className="mx-auto mt-4 flex w-11/12 justify-between rounded-2xl bg-white p-2 shadow-md">
        {/* Filtro por Periodos */}
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
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
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-modulos">Módulos</InputLabel>
          <Select
            labelId="filtro-modulos"
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
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-estamento">Estamentos</InputLabel>
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
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-tipo">Tipos de Inscritos</InputLabel>
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
          <InputLabel id="filtro-estado">Estados</InputLabel>
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

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
      <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          className="m-4 rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
          onClick={handleExportExcel}
        >
          Exportar a Excel
        </Button>
        <Paper
          className="border-none shadow-none"
          sx={{ height: 800, width: "100%" }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            pageSizeOptions={[25, 50, 75, 100]}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                color: "#575757",
                fontSize: "1rem",
              },

              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#e8e8e8",
              },
            }}
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
