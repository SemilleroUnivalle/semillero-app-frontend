"use client";

import * as React from "react";
import { Matricula } from "@/interfaces/interfaces";
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
  Snackbar,
  TextField,
  Alert,
  Chip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TrashIcon } from "@heroicons/react/24/outline";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../../config";
import { useRouter } from "next/navigation";

export default function VerMatriculas() {
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
      field: "estado_registro",
      headerName: "Estado Registro",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value === "Revisado") {
          return (
            <Chip
              label="Revisado"
              color="success"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "No revisado") {
          return (
            <Chip
              label="No revisado"
              color="error"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "Pendiente") {
          return (
            <Chip
              label="Pendiente"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        return null;
      },
    },
    {
      field: "estado_matricula",
      headerName: "Estado Matrícula",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value === "Revisado") {
          return (
            <Chip
              label="Revisado"
              color="success"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "No revisado") {
          return (
            <Chip
              label="No revisado"
              color="error"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === "Pendiente") {
          return (
            <Chip
              label="Pendiente"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        return null;
      },
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
                  "matriculaSeleccionada",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/matriculas/detallarMatricula");
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar matricula" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => handleDelete(params.row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  interface MatriculaRow {
    id: number;
    apellido: string;
    nombre: string;
    email: string;
    direccion: string;
    periodo: string;
    modulo: string;
    estamento: string;
    tipo: string;
    estado_registro: string;
    estado_matricula: string;
  }

  const [rows, setRows] = useState<MatriculaRow[]>([]);
  const [success, setSuccess] = useState(false);
   const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  // Función para eliminar una matricula
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta matrícula?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/matricula/mat/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));

      setSuccess(true);
    } catch (error) {
      console.error("Error al eliminar la matrícula:", error);
      alert(
        "Hubo un error al eliminar la matrícula. Por favor, inténtalo de nuevo.",
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }

        const response = await axios.get(`${API_BASE_URL}/matricula/mat/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // Formatea los datos para la tabla
          const formateado = response.data.map((matricula: Matricula) => ({
            id: matricula.id_inscripcion,
            apellido: matricula.estudiante.apellido || "",
            nombre: matricula.estudiante.nombre || "",
            email: matricula.estudiante.email || "",
            direccion: matricula.estudiante.direccion_residencia || "",
            periodo:
              matricula.oferta_categoria &&
              matricula.oferta_categoria.id_oferta_academica
                ? matricula.oferta_categoria.id_oferta_academica.nombre
                : "", // Cambiar cuando los datos no esten nulos
            modulo: matricula.modulo.nombre_modulo || "",
            estamento: matricula.estudiante.estamento || "",
            tipo: matricula.tipo_vinculacion || "",
            estado_registro: matricula.estudiante.estado, // true si es "Verificado", false en otro caso
            estado_matricula: matricula.estado,
          }));

          console.log("Datos formateados:", formateado); // Verifica los datos formateados

          setRows(formateado);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de matriculas:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      const estadoMatch =
        selectedEstado.length === 0 || selectedEstado.includes(row.estado_registro);

// Filtro de búsqueda por texto
      const searchMatch =
        searchText === "" ||
        row.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        row.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
        row.email.toLowerCase().includes(searchText.toLowerCase());

      return (
        periodoMatch &&
        moduloMatch &&
        estamentoMatch &&
        tipoMatch &&
        estadoMatch &&
        searchMatch
      );
    });
  }, [
    rows,
    selectedPeriodos,
    selectedModulos,
    selectedEstamento,
    selectedTipo,
    selectedEstado,
    searchText,
  ]);

  if (loading!) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Inscrito eliminado exitosamente.
        </Alert>
      </Snackbar>
      <div className="mx-auto mt-4 flex w-11/12 justify-between rounded-2xl bg-white p-2 shadow-md">
        {/* Barra buscadora */}
        <TextField
          label="Buscar por nombre, apellido o correo"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Escribe para buscar..."
          className="inputs-textfield w-full sm:w-1/6"
        />
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
            {[...new Set(rows.map((row) => row.estado_registro))].map((estado) => (
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
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineOutlinedIcon />}
          className="m-4 rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
          onClick={() => router.push("/admin/matriculas/crear-matricula")}
        >
          Crear Matricula
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
