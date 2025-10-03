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
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TrashIcon } from "@heroicons/react/24/outline";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../../config";
import { useRouter } from "next/navigation";

export default function VisualizarFuncionarios() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "apellido", headerName: "Apellidos", flex: 1 },
    { field: "nombre", headerName: "Nombres", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1 },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
    },
    {
      field: "area_desempeño",
      headerName: "Área de Desempeño",
      flex: 0.5,
    },
    {
      field: "estado",
      headerName: "Estado",
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
                  "funcionarioSeleccionado",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/funcionarios/detallar-funcionario/");
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar inscripcion" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => handleDelete(params.row) }
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  interface FuncionarioRow {
    id: number;
    apellido: string;
    nombre: string;
    email: string;
    tipo: string;
    area_desempeño: string;
    estado: string;
  }

  const [rows, setRows] = useState<FuncionarioRow[]>([]);
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(true);

  // Función para eliminar un funcionario
  const handleDelete = async (row: FuncionarioRow) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este funcionario?",
    );
    if (!confirmDelete) return;

    let endpoint = "";
    if (row.tipo === "Profesor") {
      endpoint = `${API_BASE_URL}/profesor/prof/${row.id}/`;
    } else if (row.tipo === "Monitor Académico") {
      endpoint = `${API_BASE_URL}/monitor_academico/mon/${row.id}/`;
    } else if (row.tipo === "Monitor Administrativo") {
      endpoint = `${API_BASE_URL}/monitor_administrativo/mon/${row.id}/`;
    } else {
      alert("Tipo de funcionario desconocido.");
      return;
    }

    console.log("Endpoint para eliminar:", endpoint);

    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== row.id));

      setSuccess(true);
    } catch (error) {
      console.error("Error al eliminar el funcionario:", error);
      alert(
        "Hubo un error al eliminar el funcionario. Por favor, inténtalo de nuevo.",
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

        const responseProfesor = await axios.get(`${API_BASE_URL}/profesor/prof/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const responseMonitorAcad = await axios.get(`${API_BASE_URL}/monitor_academico/mon/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const responseMonitorAdmin = await axios.get(`${API_BASE_URL}/monitor_administrativo/mon/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });


const profesores =
  responseProfesor.status === 204
    ? []
    : Array.isArray(responseProfesor.data)
      ? responseProfesor.data
      : responseProfesor.data?.results || [];

const monitoresAcad =
  responseMonitorAcad.status === 204
    ? []
    : Array.isArray(responseMonitorAcad.data)
      ? responseMonitorAcad.data
      : responseMonitorAcad.data?.results || [];

const monitoresAdmin =
  responseMonitorAdmin.status === 204
    ? []
    : Array.isArray(responseMonitorAdmin.data)
      ? responseMonitorAdmin.data
      : responseMonitorAdmin.data?.results || [];

  const formateadoProfesores = profesores.map((profesor: any) => ({
    id: profesor.id,
    apellido: profesor.apellido || "",
    nombre: profesor.nombre || "",
    email: profesor.email || "",
    tipo: "Profesor",
    area_desempeño: profesor.area_desempeño || "",
    estado: profesor.estado,
  }));

  const formateadoMonAcad = monitoresAcad.map((monitor: any) => ({
    id: monitor.id,
    apellido: monitor.apellido || "",
    nombre: monitor.nombre || "",
    email: monitor.email || "",
    tipo: "Monitor Académico",
    area_desempeño: monitor.area_desempeño || "",
    estado: monitor.estado,
  }));

  const formateadoMonAdmin = monitoresAdmin.map((monitor: any) => ({
    id: monitor.id,
    apellido: monitor.apellido || "",
    nombre: monitor.nombre || "",
    email: monitor.email || "",
    tipo: "Monitor Administrativo",
    area_desempeño: monitor.area_desempeño || "",
    estado: monitor.estado,
  }));

  // Une todos los arrays
  const todosFuncionarios = [
    ...formateadoProfesores,
    ...formateadoMonAcad,
    ...formateadoMonAdmin,
  ];

  setRows(todosFuncionarios);


        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtros

  const [selectedTipo, setSelectedTipo] = React.useState<string[]>(
    [],
  );
  const [selectedArea, setSelectedArea] = React.useState<string[]>([]);
  const [selectedEstado, setSelectedEstado] = React.useState<string[]>([]);

  const handleChangeTipo = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTipo(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeArea = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedArea(typeof value === "string" ? value.split(",") : value);
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

      const tipoMatch =
        selectedTipo.length === 0 ||
        selectedTipo.includes(row.area_desempeño);

      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(row.area_desempeño);

      const estadoAsString = row.estado ? "Verificado" : "No verificado";
      const estadoMatch =
        selectedEstado.length === 0 || selectedEstado.includes(estadoAsString);

      return (
        tipoMatch &&
        areaMatch &&
        estadoMatch
      );
    });
  }, [
    rows,
    selectedTipo,
    selectedArea,
    selectedEstado,
  ]);

  if(loading!){
    return ( <div>Loading...</div> )
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
          Funcionario eliminado exitosamente.
        </Alert>
      </Snackbar>
      <div className="mx-auto mt-4 flex w-11/12 justify-around rounded-2xl bg-white p-2 shadow-md">
        

        {/* Filtro por Estamento */}
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-estamento">Tipo</InputLabel>
          <Select
            labelId="filtro-estamento"
            id="filtro-estamento"
            label="filtro-estamento"
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

        {/* Filtro por Area de desempeño */}
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-area">Area de desempeño</InputLabel>
          <Select
            labelId="filtro-area"
            id="filtro-area"
            label="filtro-area"
            multiple
            value={selectedArea}
            onChange={handleChangeArea}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.area_desempeño))].map((area) => (
              <MenuItem key={area} value={area}>
                <Checkbox checked={selectedArea.indexOf(area) > -1} />
                <ListItemText primary={area} />
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
            {["Verificado", "No verificado"].map((estado) => (
              <MenuItem key={estado} value={estado}>
                <Checkbox checked={selectedEstado.indexOf(estado) > -1} />
                <ListItemText primary={estado} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
        {/* <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          className="m-4 rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
          onClick={handleExportExcel}
        >
          Exportar a Excel
        </Button> */}
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
