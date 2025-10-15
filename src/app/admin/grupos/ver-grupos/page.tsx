"use client";

import * as React from "react";
import { Matricula, Modulo } from "@/interfaces/interfaces";
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

export default function VerGrupos() {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1,
    },
    {
      field: "categoria",
      headerName: "Categoría",
      flex: 1,
    },
    {
      field: "modulo",
      headerName: "Módulo",
      flex: 1,
    },
    { field: "nombre", headerName: "Nombre", flex: 1 },

    {
      field: "cantidad",
      headerName: "Cantidad estudiantes",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
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

  interface GruposRow {
    grupo_id: number;
    nombre: string;
    matriculas: Matricula[];
    cantidad: number;
    periodo: string;
    modulo: string;
    categoria: string;
    estado: string;
  }

  const [rows, setRows] = useState<GruposRow[]>([]);
  const [success, setSuccess] = useState(false);

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

      setRows((prevRows) => prevRows.filter((row) => row.grupo_id !== id));

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

        const response = await axios.get(
          `${API_BASE_URL}/matricula/mat/matricula-grupo`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.status === 200) {
          // Formatea los datos para la tabla
          const formateado = response.data.map((grupo: GruposRow) => ({
            id: grupo.grupo_id,
            grupo_id: grupo.grupo_id,
            nombre: grupo.nombre || "",
            periodo:
              grupo.matriculas && grupo.matriculas.length > 0
                ? grupo.matriculas[0]?.oferta_categoria?.id_oferta_academica
                    ?.nombre || ""
                : "",
            categoria:
              grupo.matriculas && grupo.matriculas.length > 0
                ? grupo.matriculas[0]?.modulo?.id_categoria?.nombre || ""
                : "",
            modulo:
              grupo.matriculas && grupo.matriculas.length > 0
                ? grupo.matriculas[0]?.modulo?.nombre_modulo || ""
                : "",
            cantidad: grupo.cantidad || 0,
            estado:
              grupo.matriculas && grupo.matriculas.length > 0
                ? grupo.matriculas[0]?.modulo?.estado
                  ? "Activo"
                  : "Inactivo"
                : "Sin estado",
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
  const [selectedCategorias, setSelectedCategoria] = React.useState<string[]>(
    [],
  );
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
  const handleChangeCategoria = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedCategoria(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstado = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedEstado(typeof value === "string" ? value.split(",") : value);
  };

  const filteredRows = React.useMemo(() => {
    if (rows.length === 0) return rows;
    return rows.filter((row) => {
      const periodoMatch =
        selectedPeriodos.length === 0 ||
        selectedPeriodos.includes(row.periodo || "");

      const moduloMatch =
        selectedModulos.length === 0 ||
        selectedModulos.includes(row.modulo || "");

      const categoriaMatch =
        selectedCategorias.length === 0 ||
        selectedCategorias.includes(row.categoria || "");

      // const estadoAsString = row.estado ? "Activo" : "Inactivo";
      // const estadoMatch =
      //   selectedEstado.length === 0 || selectedEstado.includes(estadoAsString);

      return (
        periodoMatch && moduloMatch && categoriaMatch
        // && estadoMatch
      );
    });
  }, [
    rows,
    selectedPeriodos,
    selectedModulos,
    selectedCategorias,
    selectedEstado,
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

        {/* Filtro por Categorias */}
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
          <InputLabel id="filtro-categorias">Categorías</InputLabel>
          <Select
            labelId="filtro-categorias"
            id="filtro-categorias"
            label="filtro-categorias"
            multiple
            value={selectedCategorias}
            onChange={handleChangeCategoria}
            renderValue={(selected) => selected.join(", ")}
          >
            {[
              ...new Set(rows.map((row) => row.categoria)),
            ].map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                <Checkbox
                  checked={selectedCategorias.indexOf(categoria) > -1}
                />
                <ListItemText primary={categoria} />
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
            {[...new Set(rows.map((row) => row.modulo))].map(
              (modulo) => (
                <MenuItem key={modulo} value={modulo}>
                  <Checkbox checked={selectedModulos.indexOf(modulo) > -1} />
                  <ListItemText primary={modulo} />
                </MenuItem>
              ),
            )}
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
            {[
              ...new Set(
                rows.map((row) => (row.estado ? "Activo" : "Inactivo")),
              ),
            ].map((estado) => (
              <MenuItem key={estado} value={estado}>
                <Checkbox checked={selectedEstado.indexOf(estado) > -1} />
                <ListItemText primary={estado} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
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
