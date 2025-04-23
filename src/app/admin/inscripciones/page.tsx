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
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "apellido", headerName: "Apellidos", width: 130 },
  { field: "nombre", headerName: "Nombres", width: 130 },
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


const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users`,
        );
        const estudiantes = response.data;

        const formateado = estudiantes.map((student: any) => ({
          id: student.id,
          apellido: student.username,
          nombre: student.name,
          email: student.email,
          direccion: student.address,
          periodo: student.address.city,
          modulo: student.address.street,
          estamento: student.address.suite,
          tipo: student.address.zipcode,
          estado: true,
        }));

        setRows(formateado);
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
      <h1>Inscripciones</h1>

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
        <FormControl className="inputs-textfield h-2 w-full sm:w-1/6">
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

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        <Paper
          className="border-none shadow-none"
          sx={{ height: 800, width: "100%" }}
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
