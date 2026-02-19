"use client";

import * as React from "react";
import { Estudiante, Matricula } from "@/interfaces/interfaces";
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
  TextField,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TrashIcon } from "@heroicons/react/24/outline";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../../config";
import { useRouter } from "next/navigation";

export default function VerRegistros() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "apellido", headerName: "Apellidos", flex: 1 },
    { field: "nombre", headerName: "Nombres", flex: 1 },
    { field: "numero_documento", headerName: "Número de Documento", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1 },
    {
      field: "estamento",
      headerName: "Estamento",
      flex: 1,
    },
    {
      field: "grado",
      headerName: "Grado",
      flex: 0.5,
    },
    {
    field: "matriculas", 
    headerName: "Matrículas",
    flex: 0.5,
    renderCell: (params) => (
      <Chip label={params.value} color="primary" variant="outlined" />
    ),
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
      flex: 0.5,
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
                router.push("/admin/registros/detallarRegistro/");
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar inscripcion" placement="top">
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

  interface EstudianteRow {
    id: number;
    numero_documento: string;
    apellido: string;
    nombre: string;
    email: string;
    direccion: string;
    periodo: string;
    modulo: string;
    estamento: string;
    grado: string;
    estado: string;
    matriculas: number;
  }

  const [rows, setRows] = useState<EstudianteRow[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Función para eliminar un inscrito
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este inscrito?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/estudiante/est/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));

      setSuccess(true);
    } catch (error) {
      console.error("Error al eliminar el inscrito:", error);
      alert(
        "Hubo un error al eliminar el inscrito. Por favor, inténtalo de nuevo.",
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

        const response = await axios.get(`${API_BASE_URL}/estudiante/est/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
        // Obtén todas las matrículas
        const matriculasResponse = await axios.get(
          `${API_BASE_URL}/matricula/mat/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        const matriculasPorEstudiante: Record<number, number> = {};
        matriculasResponse.data.forEach((matricula: Matricula) => {
          const idEst = matricula.estudiante.id_estudiante;
          matriculasPorEstudiante[idEst] =
            (matriculasPorEstudiante[idEst] || 0) + 1;
        });

        console.log("Matrículas por estudiante:", matriculasPorEstudiante); // Verifica el conteo de matrículas

        const formateado = response.data.map((student: Estudiante) => ({
          id: student.id_estudiante,
          numero_documento: student.numero_documento || "",
          apellido: student.apellido || "",
          nombre: student.nombre || "",
          email: student.email || "",
          direccion: student.direccion_residencia || "",
          estamento: student.estamento || "",
          grado: student.grado || "",
          estado: student.estado || "",
          matriculas: matriculasPorEstudiante[student.id_estudiante] || 0, // 👈 Aquí
        }));

        setRows(formateado);
      }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtros

  const [selectedEstamento, setSelectedEstamento] = React.useState<string[]>(
    [],
  );
  const [selectedGrado, setSelectedGrado] = React.useState<string[]>([]);
  const [selectedEstado, setSelectedEstado] = React.useState<string[]>([]);

  const handleChangeEstamento = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedEstamento(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeGrado = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedGrado(typeof value === "string" ? value.split(",") : value);
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
      const estamentoMatch =
        selectedEstamento.length === 0 ||
        selectedEstamento.includes(row.estamento);

      const gradoMatch =
        selectedGrado.length === 0 || selectedGrado.includes(row.grado);

      const estadoMatch =
        selectedEstado.length === 0 || selectedEstado.includes(row.estado);

        // Filtro de búsqueda por texto
      const searchMatch =
        searchText === "" ||
        row.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        row.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
        row.email.toLowerCase().includes(searchText.toLowerCase()) ||
        row.numero_documento.toLowerCase().includes(searchText.toLowerCase());

      return estamentoMatch && gradoMatch && estadoMatch && searchMatch;
    });
  }, [rows, selectedEstamento, selectedGrado, selectedEstado, searchText]);

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
      <div className="mx-auto mt-4 flex w-11/12 justify-around rounded-2xl bg-white p-2 shadow-md">
        <TextField
          label="Buscar por nombre, apellido o correo"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Escribe para buscar..."
          className="inputs-textfield w-full sm:w-1/6"
        />
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

        {/* Filtro por Grado */}
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-grado">Grado</InputLabel>
          <Select
            labelId="filtro-grado"
            id="filtro-grado"
            label="filtro-grado"
            multiple
            value={selectedGrado}
            onChange={handleChangeGrado}
            renderValue={(selected) => selected.join(", ")}
          >
            {[...new Set(rows.map((row) => row.grado))].map((grado) => (
              <MenuItem key={grado} value={grado}>
                <Checkbox checked={selectedGrado.indexOf(grado) > -1} />
                <ListItemText primary={grado} />
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
            {[...new Set(rows.map((row) => row.estado))].map((estado) => (
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
