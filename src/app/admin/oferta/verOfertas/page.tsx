"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper } from "@mui/material";
import { GridColDef, DataGrid} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../../config";

const columnsOfertas: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 130 },
  { field: "categoria", headerName: "Categoria", width: 130 },
  { field: "precio_publico", headerName: "Precio publico", width: 130 },
  { field: "precio_privado", headerName: "Precio privado", width: 130 },
  { field: "precio_univalle", headerName: "Precio Univalle", width: 130 },
  { field: "fecha_inicio", headerName: "Fecha inicio", width: 130 },
  { field: "fecha_finalizacion", headerName: "Fecha finalización", width: 130 },


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
  const router = useRouter();

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oferta_categoria/ofer/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        const res = response.data;

        const formateado = res.map((data: any) => ({
          id: data.id_oferta_categoria,
          nombre: data.id_oferta_academica.nombre,
          categoria: data.id_categoria.nombre,
          precio_publico: data.precio_publico,
          precio_privado: data.precio_privado,
          precio_univalle: data.precio_univalle,
          fecha_inicio: data.id_oferta_academica.fecha_inicio,
          fecha_finalizacion: data.fecha_finalizacion,
          pagina_web: "prueba",
          lat: "prueba",
          lng: "prueba",
          _original: "prueba",
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


  return (
    <div>
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
            onRowClick={(params) => {
              const fullData = params.row._original;
              localStorage.setItem('ofertaSeleccionada', JSON.stringify(fullData)); 
              router.push('/admin/oferta/modificarOfertas/'); 
            }}
            pageSizeOptions={[20, 40]}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e8e8e8", // Fondo de todo el header
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold", // Negrita en el título
                color: "#575757", // Color del texto
                fontSize: "1rem", // (opcional) Tamaño de letra
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
