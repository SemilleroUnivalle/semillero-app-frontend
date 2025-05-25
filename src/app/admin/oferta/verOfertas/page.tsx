"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Alert, Snackbar } from "@mui/material";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../../config";

const paginationModel = { page: 0, pageSize: 20 };

export default function Page() {
  interface OfertaRow {
    id: number;
    nombre: string;
    fecha_inicio: string;
  }

  const router = useRouter();

  const [success, setSuccess] = useState(false);

  const [rows, setRows] = useState<OfertaRow[]>([]);

  const columnsOfertas: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 300 },
    { field: "fecha_inicio", headerName: "Fecha inicio", width: 300 },
    {
      field: "editar",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      width: 300,
      renderCell: (params) => (
        <div className="flex h-full w-full flex-row items-center justify-around">
          <VisibilityOutlinedIcon
            className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => {
              const fullData = params.row._original;
              localStorage.setItem(
                "ofertaSeleccionada",
                JSON.stringify(fullData),
              );
              console.log(fullData); // 👉 Guarda la fila completa como JSON
              router.push("/admin/oferta/detallarOferta/"); // 👉 Navega a la pantalla de modificar
            }}
          />
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => {
              const fullData = params.row._original;

              localStorage.setItem(
                "ofertaSeleccionada",
                JSON.stringify(fullData),
              ); // 👉 Guarda la fila completa como JSON
              router.push("/admin/oferta/modificarOfertas/"); // 👉 Navega a la pantalla de modificar
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },

    // { field: "username", headerName: "NAS Virtual", width: 130 },
    // {
    //   field: "estado",
    //   headerName: "Estado",
    //   width: 130,
    //   type: "boolean",
    // },
  ];

  // Función para eliminar un curso
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta oferta?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/oferta_academica/ofer/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setSuccess(true);
    } catch (error) {
      console.error("Error al eliminar la oferta:", error);
      alert(
        "Hubo un error al eliminar la oferta. Por favor, inténtalo de nuevo.",
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oferta_categoria/ofer/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        const res = response.data;

        if (!res || (Array.isArray(res) && res.length === 0)) {
          console.log("Error: No se encontraron ofertas");
        } else {
          const formateado = res.map(
            (data: {
              id_oferta_categoria: number;
              id_oferta_academica: { nombre: string; fecha_inicio: string };
            }) => ({
              id: data.id_oferta_categoria,
              nombre: data.id_oferta_academica.nombre,
              fecha_inicio: data.id_oferta_academica.fecha_inicio,
              _original: data, // Guarda el objeto original
            }),
          );

          setRows(formateado);
        }
      } catch (error) {
        console.error("Error al obtener los datos de las categorías:", error);
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
          Oferta eliminada exitosamente.
        </Alert>
      </Snackbar>
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
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            // onRowClick={(params) => {
            //   const fullData = params.row._original;
            //   localStorage.setItem(
            //     "ofertaSeleccionada",
            //     JSON.stringify(fullData),
            //   );
            //   router.push("/admin/oferta/modificarOfertas/");
            // }}
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
