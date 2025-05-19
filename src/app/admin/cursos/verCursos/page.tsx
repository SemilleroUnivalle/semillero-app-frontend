"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper } from "@mui/material";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import {
  Button,
  Box,
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";

import { GridColDef, DataGrid, GridRowParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../../config";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// const handleDelete = async (id: number) => {
//   const confirmDelete = window.confirm(
//     "¿Estás seguro de que deseas eliminar este curso?"
//   );
//   if (!confirmDelete) return;

//   try {
//     await axios.delete(`${API_BASE_URL}/modulo/mod/${id}/`, {
//       headers: {
//         Authorization: `Token ${localStorage.getItem("token")}`,
//       },
//     });

//     // Actualiza las filas eliminando el curso correspondiente
//     setRows((prevRows) => prevRows.filter((row) => row.id !== id));

//     alert("Curso eliminado con éxito");
//   } catch (error) {
//     console.error("Error al eliminar el curso:", error);
//     alert("Hubo un error al eliminar el curso. Por favor, inténtalo de nuevo.");
//   }
// };

const paginationModel = { page: 0, pageSize: 20 };

export default function VerCursos() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  const columnsOfertas: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 170 },
    { field: "categoria", headerName: "Categoría", width: 170 },
    { field: "area", headerName: "Área", width: 170 },
    { field: "descripcion", headerName: "Descripción", width: 170 },
    {
      field: "editar",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      width: 130,
      renderCell: (params) => (
        <div className="flex h-full w-full flex-row items-center justify-around">
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => {
              const rowData = params.row;

              localStorage.setItem(
                "cursoSeleccionado",
                JSON.stringify(rowData),
              ); // 👉 Guarda la fila completa como JSON
              router.push("/admin/cursos/modificarCursos/"); // 👉 Navega a la pantalla de modificar
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
    // {
    //   field: "eliminar",
    //   headerName: "Eliminar",
    //   width: 130,
    //   renderCell: (params) => (
    //     <button
    //       onClick={() => handleDelete(params.row.id)} // Llama a la función de eliminación
    //       className="text-red-500 hover:text-red-700"
    //     >
    //       <DeleteIcon />
    //     </button>
    //   ),
    // },
  ];

  const [modulosPorCategoria, setModulosPorCategoria] = useState<
    Record<string, any[]>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener modulos por categoria de la API
    const fetchModulosCategoria = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/modulo/mod/por-categoria/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.status === 204) {
          // Es un 204 No Content
          setModulosPorCategoria({});
          console.log("No hay contenido en modulos por categoria (204)");
        } else {
          const categoriasData = response.data;

          // Formatear los datos para que sean más fáciles de usar
          const formateado: Record<string, any[]> = {};

          if (Array.isArray(categoriasData)) {
            categoriasData.forEach((categoria: any) => {
              formateado[categoria.nombre] = categoria.modulos.map(
                (mod: any) => ({
                  id_modulo: mod.id_modulo,
                  nombre_modulo: mod.nombre_modulo,
                  descripcion_modulo: mod.descripcion_modulo,
                  id_area: mod.id_area.id_area,
                  nombre_area: mod.id_area.nombre_area,
                  id_categoria: mod.id_categoria.id_categoria,
                }),
              );
            });
            setModulosPorCategoria(formateado);
            // setRows(formateado);
            console.log("Modulos por categoría:", formateado);
          }
        }
      } catch (error) {
        console.error("Error al obtener los módulos por categoría", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModulosCategoria();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/modulo/mod/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const res = response.data;

        const formateado = res.map((data: any) => ({
          id: data.id_modulo,
          nombre: data.nombre_modulo,
          id_area: data.id_area.id_area,
          area: data.id_area.nombre_area,
          id_categoria: data.id_categoria.id_categoria,
          categoria: data.id_categoria.nombre,
          descripcion: data.descripcion_modulo,
        }));

        setRows(formateado);
      } catch (error) {
        console.error("Error al obtener los modulos:", error);
      }
    };

    fetchData();
  }, []);

  // Función para eliminar un curso
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este curso?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/modulo/mod/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));

      // Actualiza modulosPorCategoria eliminando el módulo de la categoría correspondiente
      setModulosPorCategoria((prev) => {
        const nuevo = { ...prev };
        Object.keys(nuevo).forEach((categoria) => {
          nuevo[categoria] = nuevo[categoria].filter(
            (mod) => mod.id_modulo !== id,
          );
        });
        // Opcional: elimina la categoría si queda vacía
        Object.keys(nuevo).forEach((categoria) => {
          if (nuevo[categoria].length === 0) {
            delete nuevo[categoria];
          }
        });
        return nuevo;
      });

      setSuccess(true);
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      alert(
        "Hubo un error al eliminar el curso. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const [openCategorias, setOpenCategorias] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleCategoria = (categoria: string) => {
    setOpenCategorias((prev) => ({ ...prev, [categoria]: !prev[categoria] }));
  };

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
          Curso eliminado exitosamente.
        </Alert>
      </Snackbar>
      {/* Contenedor de cursos */}

      <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-1 shadow-md">
        {/* <input
         type="text"
         placeholder="Buscar..."
         value={searchText}
         onChange={(e) => requestSearch(e.target.value)}
         className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none sm:w-1/3"
       /> */}

        {loading ? (
          <div className="py-8 text-center">Cargando cursos...</div>
        ) : Object.keys(modulosPorCategoria).length === 0 ? (
          <div className="py-8 text-center">No hay cursos disponibles</div>
        ) : (
          Object.keys(modulosPorCategoria).map((nombreCategoria) => (
            <Box className="py-1" key={nombreCategoria} borderRadius={0}>
              <Accordion className="border-b shadow-none">
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span">{nombreCategoria}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper
                    className="border-none shadow-none"
                    sx={{ height: "auto", width: "100%" }}
                  >
                    <DataGrid
                      rows={modulosPorCategoria[nombreCategoria].map((mod) => ({
                        id: mod.id_modulo,
                        nombre: mod.nombre_modulo,
                        descripcion: mod.descripcion_modulo,
                        id_area: mod.id_area,
                        area: mod.nombre_area,
                        id_categoria: mod.id_categoria,
                        categoria: nombreCategoria,
                      }))}
                      columns={columnsOfertas}
                      initialState={{ pagination: { paginationModel } }}
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
                </AccordionDetails>
              </Accordion>
            </Box>
          ))
        )}
      </div>
    </div>
  );
}
