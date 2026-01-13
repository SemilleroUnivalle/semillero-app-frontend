"use client";

import * as React from "react";

import { useEffect, useState } from "react";
import {
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Box,

} from "@mui/material";

import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { API_BASE_URL } from "../../../../config";

export default function CursosProgramados() {

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
      flex: 2,
    },
    {
      field: "precio_publico",
      headerName: "Precio Público",
      flex: 1,
      valueFormatter: (params) =>
        `$${parseFloat(params).toLocaleString("es-CO")}`,
    },
    {
      field: "precio_privado",
      headerName: "Precio Privado",
      flex: 1,
      valueFormatter: (params) =>
        `$${parseFloat(params).toLocaleString("es-CO")}`,
    },
    {
      field: "precio_univalle",
      headerName: "Precio Univalle",
      flex: 1,
      valueFormatter: (params) =>
        `$${parseFloat(params).toLocaleString("es-CO")}`,
    },
  ];

  const paginationModel = { page: 0, pageSize: 50 };

  interface CursosRow {
    id: string;
    periodo: string;
    categoria: string;
    modulo: string;
    precio_publico: string;
    precio_privado: string;
    precio_univalle: string;
  }

  const [rows, setRows] = useState<CursosRow[]>([]);

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

        const response = await axios.get(
          `${API_BASE_URL}/oferta_categoria/ofer/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.status === 200) {
          // Formatea los datos para la tabla
          const formateado: CursosRow[] = [];

          response.data.forEach((oferta: any) => {
            // Iterar sobre cada módulo dentro de la oferta
            oferta.modulo.forEach((modulo: any) => {
              formateado.push({
                id: `${oferta.id_oferta_categoria}-${modulo.id_modulo}`,

                periodo: oferta.id_oferta_academica?.nombre || "",
                categoria: oferta.id_categoria?.nombre || "",
                modulo: modulo.nombre_modulo || "",
                precio_publico: oferta.precio_publico || "0",
                precio_privado: oferta.precio_privado || "0",
                precio_univalle: oferta.precio_univalle || "0",
              });
            });
          });

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
  ]);

  if (loading!) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <h1>Cursos Programados</h1>

      <Box className="mx-auto mt-4 flex w-11/12 justify-around rounded-2xl bg-white p-2 shadow-md">
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

        {/* Filtro por Categorias */}
        <FormControl className="inputs-textfield w-full sm:w-1/6">
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
            {[...new Set(rows.map((row) => row.categoria))].map((categoria) => (
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
        <FormControl className="inputs-textfield w-full sm:w-1/6">
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
      </Box>

      <Box className="mx-auto mt-4 flex w-11/12 rounded-2xl bg-white p-1 text-center shadow-md">
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
      </Box>
    </div>
  );
}
