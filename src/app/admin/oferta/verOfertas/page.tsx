"use client";

import * as React from "react";
import { OfertaCategoria } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Alert, Snackbar, Tooltip, Chip } from "@mui/material";
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
    estado: boolean;
  }

  const router = useRouter();

  const [success, setSuccess] = useState(false);

  const [rows, setRows] = useState<OfertaRow[]>([]);

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<boolean>(true);
  const [ofertas, setOfertas] = useState<any[]>([]);

  const columnsOfertas: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "fecha_inicio", headerName: "Fecha inicio", flex: 1 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value === true) {
          return (
            <Chip
              label="Activo"
              color="success"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        }
        if (params.value === false) {
          return (
            <Chip
              label="Inactivo"
              color="error"
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
                const fullData = params.row._original;
                localStorage.setItem(
                  "ofertaSeleccionada",
                  JSON.stringify(fullData),
                );
                console.log("Estos son los datos enviados", fullData); // 👉 Guarda la fila completa como JSON
                router.push("/admin/oferta/detallarOferta/"); // 👉 Navega a la pantalla de modificar
              }}
            />
          </Tooltip>

          <Tooltip title="Editar oferta" placement="top">
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
          </Tooltip>

          <Tooltip title="Eliminar oferta" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => handleDelete(params.row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
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

  // Función para actualizar el estado de una oferta
  const handleUpdateStatus = async () => {
    if (selectedOfferId === null) {
      alert("Por favor, selecciona una oferta.");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/oferta_academica/ofer/${selectedOfferId}/`,
        { estado: newStatus },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      // Actualizar el estado en las filas
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedOfferId ? { ...row, estado: newStatus } : row,
        ),
      );
      // Actualizar el estado en las ofertas
      setOfertas((prevOfertas) =>
        prevOfertas.map((oferta) =>
          oferta.id_oferta_academica === selectedOfferId ? { ...oferta, estado: newStatus } : oferta,
        ),
      );
      setSuccess(true);
      setSelectedOfferId(null);
      setNewStatus(true);
    } catch (error) {
      console.error("Error al actualizar el estado de la oferta:", error);
      alert(
        "Hubo un error al actualizar el estado de la oferta. Por favor, inténtalo de nuevo.",
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        const res = response.data;

        // Agrupar por id_oferta_academica
        const ofertasPorAcademica: Record<number, OfertaCategoria[]> = {};
        Object.values(res).forEach((ofertasArray) => {
          (ofertasArray as OfertaCategoria[]).forEach((oferta) => {
            const id = oferta.id_oferta_academica?.id_oferta_academica;
            if (!ofertasPorAcademica[id]) ofertasPorAcademica[id] = [];
            ofertasPorAcademica[id].push(oferta);
          });
        });

        // Construir filas: una por cada oferta académica
        const rows = Object.values(ofertasPorAcademica).map((ofertas) => {
          const primera = ofertas[0];
          return {
            id: primera.id_oferta_academica.id_oferta_academica,
            nombre: primera.id_oferta_academica.nombre,
            fecha_inicio: primera.id_oferta_academica.fecha_inicio,
            estado: primera.id_oferta_academica.estado,
            _original: ofertas, // Guarda todas las ofertas_categoria asociadas
          };
        });

        setRows(rows);
      } catch (error) {
        console.error("Error al obtener los datos de las categorías:", error);
      }
    };

    fetchData();
  }, []);

  // Nueva petición para visualizar ofertas en consola
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/oferta_academica/ofer`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        console.log("Ofertas académicas:", response.data);
        setOfertas(response.data);
      } catch (error) {
        console.error("Error al obtener las ofertas académicas:", error);
      }
    };

    fetchOfertas();
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

      {/* Sección para actualizar estado de oferta */}
      <div className="mx-auto mt-8 w-11/12 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Actualizar Estado de Oferta
        </h2>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Oferta
            </label>
            <select
              value={selectedOfferId || ""}
              onChange={(e) => setSelectedOfferId(Number(e.target.value) || null)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            >
              <option value="">Selecciona una oferta</option>
              {ofertas.map((oferta) => (
                <option key={oferta.id_oferta_academica} value={oferta.id_oferta_academica}>
                  {oferta.nombre} (ID: {oferta.id_oferta_academica})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Estado:</label>
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                checked={newStatus === true}
                onChange={() => setNewStatus(true)}
                className="mr-2"
              />
              Activo
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                checked={newStatus === false}
                onChange={() => setNewStatus(false)}
                className="mr-2"
              />
              Inactivo
            </label>
          </div>
          <button
            onClick={handleUpdateStatus}
            className="rounded-md bg-primary px-4 py-2 text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Actualizar Estado
          </button>
        </div>
      </div>
    </div>
  );
}
