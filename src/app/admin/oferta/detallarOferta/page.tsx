"use client";

import {
  Button,
  Box,
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function DetallarOferta() {
  interface Oferta {
    id_oferta_academica: {
      id_oferta_academica: number;
      nombre: string;
      fecha_inicio: string;
    };
    id_categoria: {
      nombre: string;
    };
    modulo: { id_modulo: number }[];
    precio_publico: string;
    precio_privado: string;
    precio_univalle: string;
    fecha_finalizacion: string;
    id_oferta_categoria: number;
  }

  interface Modulo {
    id_modulo: number;
    nombre_modulo: string;
    descripcion_modulo: string;
    id_area: string;
    nombre_area: string;
    id_categoria: string;
  }
  // Estado para los módulos seleccionados por categoría
  const [selectedCursosPorCategoria, setSelectedCursosPorCategoria] = useState<
    Record<string, number[]>
  >({});

  // Estado para indicar si un usuario ha interactuado con el formulario
  const [formTouched, setFormTouched] = useState(false);

  // Estado para los módulos agrupados por categoría
  const [modulosPorCategoria, setModulosPorCategoria] = useState<
    Record<string, Modulo[]>
  >({});

  // Estado para manejo de errores y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para la oferta seleccionada
  const [oferta, setOferta] = useState<Oferta | null>(null);

  // Estado para el nombre y fecha de inicio de la oferta
  const [nombreOferta, setNombreOferta] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  // Estado para los precios y fechas de finalización por categoría
  const [preciosPorCategoria, setPreciosPorCategoria] = useState<
    Record<string, { publico: string; privado: string; univalle: string }>
  >({});
  const [fechasFinalizacionPorCategoria, setFechasFinalizacionPorCategoria] =
    useState<Record<string, string>>({});

  useEffect(() => {
    const storedOferta = localStorage.getItem("ofertaSeleccionada");
    if (storedOferta) {
      const ofertas: Oferta[] = JSON.parse(storedOferta);

      // Precargar nombre y fecha de inicio de la oferta académica (toma la primera)
      setNombreOferta(ofertas[0]?.id_oferta_academica?.nombre || "");
      setFechaInicio(ofertas[0]?.id_oferta_academica?.fecha_inicio || "");

      // Precargar módulos seleccionados, precios y fechas por cada categoría
      const cursosPorCategoria: Record<string, number[]> = {};
      const preciosPorCategoria: Record<
        string,
        { publico: string; privado: string; univalle: string }
      > = {};
      const fechasPorCategoria: Record<string, string> = {};

      ofertas.forEach((oferta) => {
        const nombreCategoria = oferta.id_categoria?.nombre;
        if (!nombreCategoria) return;

        // Módulos seleccionados
        cursosPorCategoria[nombreCategoria] = oferta.modulo.map(
          (m) => m.id_modulo,
        );

        // Precios
        preciosPorCategoria[nombreCategoria] = {
          publico: oferta.precio_publico || "",
          privado: oferta.precio_privado || "",
          univalle: oferta.precio_univalle || "",
        };

        // Fecha de finalización
        fechasPorCategoria[nombreCategoria] = oferta.fecha_finalizacion || "";
      });

      setSelectedCursosPorCategoria(cursosPorCategoria);
      setPreciosPorCategoria(preciosPorCategoria);
      setFechasFinalizacionPorCategoria(fechasPorCategoria);
    }
  }, []);

  //Llamada a la API para obtener los módulos por categoría
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

        const categoriasData = response.data;

        // Formatear los datos para que sean más fáciles de usar
        const formateado: Record<string, Modulo[]> = {};

        categoriasData.forEach(
          (categoria: { nombre: string; modulos: Modulo[] }) => {
            formateado[categoria.nombre] = categoria.modulos.map((mod) => ({
              id_modulo: mod.id_modulo,
              nombre_modulo: mod.nombre_modulo,
              descripcion_modulo: mod.descripcion_modulo,
              id_area: mod.id_area,
              nombre_area: mod.nombre_area,
              id_categoria: mod.id_categoria,
            }));
          },
        );

        setModulosPorCategoria(formateado);
        console.log("Modulos por categoría:", formateado);
      } catch (error) {
        console.error("Error al obtener los módulos por categoría", error);
        setError("Error al cargar los módulos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchModulosCategoria();
  }, []);

  // Manejo de cambios en los checkboxes de los módulos
  const handleCursoChange = (categoriaId: string, selected: number[]) => {
    setSelectedCursosPorCategoria((prev) => ({
      ...prev,
      [categoriaId]: selected, // Actualiza los cursos seleccionados para la categoría específica
    }));
  };

  // Manejo del cierre del snackbar
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <div>
      {/* Contenedor de cursos */}
      <div className="mx-auto mt-5 flex w-full flex-col items-center justify-center rounded-2xl bg-white p-3 sm:w-11/12">
        <h2 className="mb-2 text-center text-xl font-bold">
          Oferta: {nombreOferta}
        </h2>

        <form className="w-full space-y-4 px-4">
          <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 sm:w-4/5 sm:flex-row">
            {/* Campo nombre de la oferta */}
            <TextField
              className="inputs-textfield flex w-full sm:w-1/3"
              label="Nombre de la oferta"
              name="nombre_oferta"
              variant="outlined"
              type="text"
              fullWidth
              value={nombreOferta}
              InputProps={{ readOnly: true }}
            />
            {/* Campo fecha de inicio de la oferta */}
            <TextField
              className="inputs-textfield flex w-full sm:w-1/3"
              label="Fecha de inicio"
              name="fecha_inicio"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={fechaInicio}
              InputProps={{ readOnly: true }}
            />
          </div>

          <h2 className="text-xl font-semibold">Categorías</h2>

          {loading ? (
            <div className="py-8 text-center">Cargando módulos...</div>
          ) : Object.keys(modulosPorCategoria).length === 0 ? (
            <div className="py-8 text-center">
              No hay categorías disponibles
            </div>
          ) : (
            Object.keys(modulosPorCategoria).map((nombreCategoria) => (
              <Box
                className="border-b-2 border-solid border-primary py-8"
                key={nombreCategoria}
                borderRadius={2}
              >
                <FormLabel className="text-lg font-semibold">
                  {nombreCategoria}
                </FormLabel>

                <FormGroup className="mt-4 flex flex-row flex-wrap justify-start gap-4">
                  {modulosPorCategoria[nombreCategoria].map((modulo) => (
                    <FormControlLabel
                      key={modulo.id_modulo}
                      control={
                        <Checkbox
                          checked={
                            selectedCursosPorCategoria[
                              nombreCategoria
                            ]?.includes(modulo.id_modulo) || false
                          }
                          disabled
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const currentSeleccionados =
                              selectedCursosPorCategoria[nombreCategoria] || [];

                            let nuevosSeleccionados;

                            if (checked) {
                              nuevosSeleccionados = [
                                ...currentSeleccionados,
                                modulo.id_modulo,
                              ];
                            } else {
                              nuevosSeleccionados = currentSeleccionados.filter(
                                (id) => id !== modulo.id_modulo,
                              );
                            }

                            handleCursoChange(
                              nombreCategoria,
                              nuevosSeleccionados,
                            );

                            if (!formTouched) {
                              setFormTouched(true);
                            }
                          }}
                        />
                      }
                      label={modulo.nombre_modulo}
                    />
                  ))}
                </FormGroup>

                <Box className="mt-6 flex w-full flex-col justify-between gap-4 sm:flex-row">
                  <TextField
                    id={`precio-publico-${nombreCategoria}`}
                    name={`precio-publico-${nombreCategoria}`}
                    className="inputs-textfield w-full sm:w-1/3"
                    label="Precio Colegio Público"
                    type="number"
                    value={preciosPorCategoria[nombreCategoria]?.publico || ""}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    id={`precio-privado-${nombreCategoria}`}
                    name={`precio-privado-${nombreCategoria}`}
                    className="inputs-textfield w-full sm:w-1/3"
                    label="Precio Colegio Privado"
                    type="number"
                    required={
                      selectedCursosPorCategoria[nombreCategoria]?.length > 0
                    }
                    value={preciosPorCategoria[nombreCategoria]?.privado || ""}
                    onChange={(e) =>
                      setPreciosPorCategoria((prev) => ({
                        ...prev,
                        [nombreCategoria]: {
                          ...prev[nombreCategoria],
                          privado: e.target.value,
                        },
                      }))
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    id={`precio-univalle-${nombreCategoria}`}
                    name={`precio-univalle-${nombreCategoria}`}
                    className="inputs-textfield w-full sm:w-1/3"
                    label="Precio Relación Univalle"
                    type="number"
                    value={preciosPorCategoria[nombreCategoria]?.univalle || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Box>

                <TextField
                  id={`fecha-finalizacion-${nombreCategoria}`}
                  name={`fecha-finalizacion-${nombreCategoria}`}
                  className="inputs-textfield"
                  sx={{ mt: 4 }}
                  type="date"
                  label="Fecha de finalización"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  value={fechasFinalizacionPorCategoria[nombreCategoria] || ""}
                />
              </Box>
            ))
          )}

          <div className="flex flex-row gap-2">
            <Button
              variant="contained"
              href="/admin/oferta/modificarOfertas/"
              className="text-md mt-4 w-1/2 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
            >
              Editar
            </Button>
            <Button
              variant="contained"
              // onClick={() => curso && handleDelete(curso.id)}
              className="text-md mt-4 w-1/2 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
            >
              Eliminar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
