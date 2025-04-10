"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "apellido", headerName: "Apellidos", width: 130 },
  { field: "nombre", headerName: "Nombres", width: 130 },
  { field: "email", headerName: "Correo Electrónico", width: 130 },
  {
    field: "numero_identificacion",
    headerName: "Numero de Identificación",
    width: 130,
  },
  {
    field: "direccion",
    headerName: "Direccion",
    width: 130,
    // type: "boolean",
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
];

const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://54.234.86.157:8080/student/student/");
        const estudiantes = response.data;

        const formateado = estudiantes.map((student: any) => ({
          id: student.id,
          apellido: student.apellido,
          nombre: student.nombre,
          email: student.email,
          numero_identificacion: student.numero_identificacion || "Sin asignar",
          direccion: student.direccion,
        }));

        setRows(formateado);
      } catch (error) {
        console.error("Error al obtener los datos de los estudiantes:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Inscripciones</h1>
      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        <Paper
          className="border-none shadow-none"
          sx={{ height: 800, width: "100%" }}
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
    </div>
  );
}
