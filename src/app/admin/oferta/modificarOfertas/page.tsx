"use client";

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

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function ModificarOferta() {
  // Estado para los módulos seleccionados por categoría
  const [selectedCursosPorCategoria, setSelectedCursosPorCategoria] = useState<
    Record<string, number[]>
  >({});

  // Estado para indicar si un usuario ha interactuado con el formulario
  const [formTouched, setFormTouched] = useState(false);

  // Estado para los módulos agrupados por categoría
  const [modulosPorCategoria, setModulosPorCategoria] = useState<
    Record<string, any[]>
  >({});

  // Estado para manejo de errores y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para la oferta seleccionada
  const [oferta, setOferta] = useState<any>(null);

  useEffect(() => {
    const storedOferta = localStorage.getItem("ofertaSeleccionada");
    if (storedOferta) {
      setOferta(JSON.parse(storedOferta));
    }
    console.log("Oferta seleccionada:", storedOferta);
  }, []);

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
        const formateado: Record<string, any[]> = {};

        categoriasData.forEach((categoria: any) => {
          formateado[categoria.nombre] = categoria.modulos.map((mod: any) => ({
            id_modulo: mod.id_modulo,
            nombre_modulo: mod.nombre_modulo,
            descripcion_modulo: mod.descripcion_modulo,
            id_area: mod.id_area.id_area,
            nombre_area: mod.id_area.nombre_area,
            id_categoria: mod.id_categoria.id_categoria, // Ajustar para reflejar el nuevo formato
          }));
        });

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

  const handleCursoChange = (categoriaId: string, selected: number[]) => {
    setSelectedCursosPorCategoria((prev) => ({
      ...prev,
      [categoriaId]: selected, // Actualiza los cursos seleccionados para la categoría específica
    }));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Marcar el formulario como tocado para que muestre validaciones
    setFormTouched(true);

    try {
      setLoading(true);
      setError(null);

      // Validar campos obligatorios
      const formData = new FormData(e.currentTarget);
      const nombreOferta = formData.get("nombre_oferta") as string;
      const fechaInicio = formData.get("fecha_inicio") as string;

      // Verificar si hay al menos una categoría con módulos seleccionados
      const haySeleccionados = Object.values(selectedCursosPorCategoria).some(
        (seleccionados) => seleccionados && seleccionados.length > 0,
      );

      if (!haySeleccionados) {
        setError(
          "Por favor, selecciona al menos un módulo en alguna categoría.",
        );
        setLoading(false);
        return;
      }

      // Realizar la solicitud POST al endpoint /oferta_academica/ofer/
      const ofertaAcademicaResponse = await axios.post(
        `${API_BASE_URL}/oferta_academica/ofer/`,
        {
          nombre: nombreOferta,
          fecha_inicio: fechaInicio,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      // Obtener el ID de la oferta académica creada
      const idOfertaAcademica =
        ofertaAcademicaResponse.data.id_oferta_academica;
      console.log("ID de la oferta académica creada:", idOfertaAcademica);
      console.log(
        "selectedCursosPorCategoria antes de enviar datos a la API",
        selectedCursosPorCategoria,
      );

      // Iterar sobre las categorías para enviar los datos de cada una
      for (const nombreCategoria of Object.keys(modulosPorCategoria)) {
        const modulosSeleccionados =
          selectedCursosPorCategoria[nombreCategoria] || [];

        if (modulosSeleccionados.length === 0) {
          continue; // Si no hay módulos seleccionados, pasa a la siguiente categoría
        }

        // Obtener los valores de los campos de precios y fecha
        const precioPublico = formData.get(
          `precio-publico-${nombreCategoria}`,
        ) as string;
        const precioPrivado = formData.get(
          `precio-privado-${nombreCategoria}`,
        ) as string;
        const precioUnivalle = formData.get(
          `precio-univalle-${nombreCategoria}`,
        ) as string;
        const fechaFinalizacion = formData.get(
          `fecha-finalizacion-${nombreCategoria}`,
        ) as string;

        // Validar campos obligatorios para cada categoría
        if (!precioPublico) {
          setError(
            `Por favor, ingresa el precio público para la categoría: ${nombreCategoria}`,
          );
          setLoading(false);
          return;
        }

        if (!precioPrivado) {
          setError(
            `Por favor, ingresa el precio privado para la categoría: ${nombreCategoria}`,
          );
          setLoading(false);
          return;
        }

        if (!precioUnivalle) {
          setError(
            `Por favor, ingresa el precio Univalle para la categoría: ${nombreCategoria}`,
          );
          setLoading(false);
          return;
        }

        if (!fechaFinalizacion) {
          setError(
            `Por favor, selecciona la fecha de finalización para la categoría: ${nombreCategoria}`,
          );
          setLoading(false);
          return;
        }

        // Obtener el ID de la categoría del primer módulo de la categoría
        const idCategoria =
          modulosPorCategoria[nombreCategoria][0]?.id_categoria;

        if (!idCategoria) {
          setError(
            `No se pudo determinar el ID de la categoría: ${nombreCategoria}`,
          );
          return;
        }

        // Formatear los datos para la API
        const data = {
          modulo: modulosSeleccionados,
          precio_publico: precioPublico,
          precio_privado: precioPrivado,
          precio_univalle: precioUnivalle,
          fecha_finalizacion: fechaFinalizacion,
          id_oferta_academica: idOfertaAcademica,
          id_categoria: idCategoria,
        };

        console.log("Enviando datos:", data);

        // Realizar la solicitud POST al endpoint /oferta_categoria/ofer/
        await axios.post(`${API_BASE_URL}/oferta_categoria/ofer/`, data, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        console.log(
          `Datos enviados correctamente para la categoría: ${nombreCategoria}`,
        );
      }

      setSuccess(true);

      // Resetear el formulario
      if (e.currentTarget && typeof e.currentTarget.reset === "function") {
        e.currentTarget.reset();
      }
      setSelectedCursosPorCategoria({});
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setError("Hubo un problema al enviar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Oferta modificada exitosamente.
        </Alert>
      </Snackbar>

      {/* Contenedor de cursos */}
      <div className="mx-auto mt-5 flex w-full flex-col items-center justify-center rounded-2xl bg-white p-3 sm:w-11/12">
        <h2 className="mb-2 text-center text-xl font-bold">Modificar oferta</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4 px-4">
          <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 sm:w-4/5 sm:flex-row">
            {/* Campo nombre de la oferta */}
            <TextField
              className="inputs-textfield flex w-full sm:w-1/3"
              label="Nombre de la oferta"
              name="nombre_oferta"
              variant="outlined"
              type="text"
              fullWidth
              required
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
              required
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

                {formTouched &&
                  selectedCursosPorCategoria[nombreCategoria]?.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">
                      Selecciona al menos un módulo o deja todos los campos en
                      blanco para no incluir esta categoría
                    </p>
                  )}

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
                    required={
                      selectedCursosPorCategoria[nombreCategoria]?.length > 0
                    }
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
                  />
                  <TextField
                    id={`precio-univalle-${nombreCategoria}`}
                    name={`precio-univalle-${nombreCategoria}`}
                    className="inputs-textfield w-full sm:w-1/3"
                    label="Precio Relación Univalle"
                    type="number"
                    required={
                      selectedCursosPorCategoria[nombreCategoria]?.length > 0
                    }
                    // error={
                    //   formTouched &&
                    //   selectedCursosPorCategoria[nombreCategoria]?.length > 0 &&
                    //   !(
                    //     document.getElementById(
                    //       `precio-univalle-${nombreCategoria}`,
                    //     ) as HTMLInputElement
                    //   )?.value
                    // }
                    // helperText={
                    //   formTouched &&
                    //   selectedCursosPorCategoria[nombreCategoria]?.length > 0 &&
                    //   !(
                    //     document.getElementById(
                    //       `precio-univalle-${nombreCategoria}`,
                    //     ) as HTMLInputElement
                    //   )?.value
                    //     ? "Campo requerido"
                    //     : ""
                    // }
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
                  required={
                    selectedCursosPorCategoria[nombreCategoria]?.length > 0
                  }
                />
              </Box>
            ))
          )}

          <div>
            {formTouched &&
              !Object.values(selectedCursosPorCategoria).some(
                (arr) => arr?.length > 0,
              ) && (
                <p className="mb-4 text-center text-red-600">
                  Por favor, selecciona al menos un módulo en alguna categoría
                </p>
              )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="text-md mt-4 w-full rounded-2xl bg-primary py-3 font-semibold capitalize text-white hover:bg-red-800 disabled:bg-gray-400"
            >
              {loading ? "Procesando..." : "Crear oferta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
