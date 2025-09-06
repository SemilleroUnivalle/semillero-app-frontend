"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper } from "@mui/material";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Box, Alert, Snackbar, Tooltip, Button, Avatar } from "@mui/material";

import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../../config";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const paginationModel = { page: 0, pageSize: 20 };

export default function VerCursos() {
  interface Modulo {
    id_modulo: number;
    nombre_modulo: string;
    descripcion_modulo: string;
    id_area: {
      id_area: string;
      nombre_area: string;
    };
    id_categoria: {
      id_categoria: string;
      nombre: string;
    };
  }

  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [expandirTodos, setExpandirTodos] = useState(false);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState<
    Record<string, boolean>
  >({});

  const columnsOfertas: GridColDef[] = [
    {
      field: "logo",
      headerName: "Logo",
      flex: 0.5,
      renderCell: () => (
        <div className="flex h-full w-full flex-row items-center justify-around">
          {" "}
          <Avatar
            src="/NAS.png"
            // alt={nombreCategoria}
            sx={{ width: 32, height: 32 }}
          />{" "}
        </div>
      ),
    },
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "categoria", headerName: "Categoría", flex: 1 },
    { field: "area", headerName: "Área", flex: 1, width: 90 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
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
                  "cursoSeleccionado",
                  JSON.stringify(rowData),
                ); // 👉 Guarda la fila completa como JSON
                router.push("/admin/cursos/detallarCurso/");
              }}
            />
          </Tooltip>
          <Tooltip title="Editar curso" placement="top">
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
          </Tooltip>
          <Tooltip title="Eliminar curso" placement="top">
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => handleDelete(params.row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const [modulosPorCategoria, setModulosPorCategoria] = useState<
    Record<string, Modulo[]>
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
          const formateado: Record<string, Modulo[]> = {};

          if (Array.isArray(categoriasData)) {
            categoriasData.forEach(
              (categoria: { nombre: string; modulos: Modulo[] }) => {
                formateado[categoria.nombre] = categoria.modulos.map((mod) => ({
                  id_modulo: mod.id_modulo,
                  nombre_modulo: mod.nombre_modulo,
                  descripcion_modulo: mod.descripcion_modulo,
                  id_area: {
                    id_area: mod.id_area.id_area,
                    nombre_area: mod.id_area.nombre_area,
                  },
                  id_categoria: {
                    id_categoria: mod.id_categoria.id_categoria,
                    nombre: mod.id_categoria.nombre,
                  },
                }));
              },
            );
            setModulosPorCategoria(formateado);
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

        const formateado = res.map((data: Modulo) => ({
          id: data.id_modulo,
          nombre: data.nombre_modulo,
          id_area: data.id_area.id_area,
          area: data.id_area.nombre_area,
          id_categoria: data.id_categoria.id_categoria,
          categoria: data.id_categoria.nombre,
          descripcion: data.descripcion_modulo,
        }));
        console.log("Modulos:", formateado);
        // setRows(formateado);
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

      // setRows((prevRows) => prevRows.filter((row) => row.id !== id));

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

  const todosLosCursos = Object.keys(modulosPorCategoria).flatMap(
    (nombreCategoria) =>
      modulosPorCategoria[nombreCategoria].map((mod) => ({
        id: mod.id_modulo,
        nombre: mod.nombre_modulo,
        descripcion: mod.descripcion_modulo,
        id_area: mod.id_area,
        area: mod.id_area.nombre_area,
        id_categoria: mod.id_categoria,
        categoria: nombreCategoria,
      })),
  );

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
        <div className="flex flex-row-reverse items-start">
          <Button
            variant="contained"
            color="primary"
            className="rounded-lg bg-transparent text-xs font-semibold text-primary shadow-none"
            onClick={() => {
              const nuevoEstado: Record<string, boolean> = {};
              Object.keys(modulosPorCategoria).forEach((cat) => {
                nuevoEstado[cat] = !expandirTodos;
              });
              setAcordeonesAbiertos(nuevoEstado);
              setExpandirTodos((prev) => !prev);
            }}
          >
            {expandirTodos ? "Contraer todos" : "Expandir todos"}
          </Button>
        </div>
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
              <Accordion
                className="border-b shadow-none"
                expanded={!!acordeonesAbiertos[nombreCategoria]}
                onChange={() =>
                  setAcordeonesAbiertos((prev) => ({
                    ...prev,
                    [nombreCategoria]: !prev[nombreCategoria],
                  }))
                }
              >
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {/* {nombreCategoria}
                  <Avatar
                    src="/NAS.png"
                    alt={nombreCategoria}
                    sx={{ width: 32, height: 32, marginRight: 2 }}
                  /> */}
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
                        area: mod.id_area.nombre_area,
                        id_categoria: mod.id_categoria,
                        categoria: nombreCategoria,
                      }))}
                      columns={columnsOfertas}
                      initialState={{ pagination: { paginationModel } }}
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
                </AccordionDetails>
              </Accordion>
            </Box>
          ))
        )}
      </div>
    </div>
  );
}
