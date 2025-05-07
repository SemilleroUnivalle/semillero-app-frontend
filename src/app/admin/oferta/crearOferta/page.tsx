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

export default function CrearOferta() {
  // Estado mínimo necesario para que el Select múltiple funcione
  const [selectedCursosPorCategoria, setSelectedCursosPorCategoria] =
    React.useState<Record<number, number[]>>({});

  const [modulosPorCategoria, setModulosPorCategoria] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    // Obtener modulos por categoria de la API

    const fetchModulosCategoria = async () => {
      try {
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

        Object.keys(categoriasData).forEach((nombreCategoria) => {
          formateado[nombreCategoria] = categoriasData[nombreCategoria].map(
            (mod: any) => ({
              id_modulo: mod.id_modulo,
              nombre_modulo: mod.nombre_modulo,
              descripcion_modulo: mod.descripcion_modulo,
              id_area: mod.id_area.id_area,
              nombre_area: mod.id_area.nombre_area,
            }),
          );
        });

        setModulosPorCategoria(formateado);
        console.log("Modulos por categoría:", formateado);
      } catch (error) {
        console.error("Error al obtener los módulos por categoría", error);
      }
    };

    fetchModulosCategoria();
  }, []);

  const handleCursoChange = (categoriaId: number, selected: number[]) => {
    setSelectedCursosPorCategoria((prev) => ({
      ...prev,
      [categoriaId]: selected, // Actualiza los cursos seleccionados para la categoría específica
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    try {
      // Iterar sobre las categorías para enviar los datos de cada una
      for (const nombreCategoria of Object.keys(modulosPorCategoria)) {
        const modulosSeleccionados =
          selectedCursosPorCategoria[nombreCategoria] || [];

        if (modulosSeleccionados.length === 0) {
          continue; // Si no hay módulos seleccionados, pasa a la siguiente categoría
        }

        // Obtener los valores de los campos de precios y fecha
        const precioPublico = (
          document.getElementById(
            `precio-publico-${nombreCategoria}`,
          ) as HTMLInputElement
        )?.value;
        const precioPrivado = (
          document.getElementById(
            `precio-privado-${nombreCategoria}`,
          ) as HTMLInputElement
        )?.value;
        const precioUnivalle = (
          document.getElementById(
            `precio-univalle-${nombreCategoria}`,
          ) as HTMLInputElement
        )?.value;
        const fechaFinalizacion = (
          document.getElementById(
            `fecha-finalizacion-${nombreCategoria}`,
          ) as HTMLInputElement
        )?.value;

        // Formatear los datos para la API
        const data = {
          modulo: modulosSeleccionados,
          precio_publico: precioPublico,
          precio_privado: precioPrivado,
          precio_univalle: precioUnivalle,
          fecha_finalizacion: fechaFinalizacion,
          id_oferta_academica: 1, // Cambia esto según el ID de la oferta académica
          id_categoria: modulosPorCategoria[nombreCategoria][0]?.id_categoria, // Obtén el ID de la categoría
        };

        console.log("Enviando datos:", data);

        // Realizar la solicitud POST
        await axios.post(`${API_BASE_URL}/oferta_categoria/ofer/`, data, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        alert(
          `Datos enviados correctamente para la categoría: ${nombreCategoria}`,
        );
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un problema al enviar los datos. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="mx-auto mt-4 w-11/12 rounded-2xl p-2">
      <div className="mx-auto items-center justify-center rounded-2xl bg-white p-3 shadow-md sm:w-4/5">
        <h2 className="mb-2 text-center">Crear oferta</h2>
        <div className="mx-auto flex w-full flex-row items-center justify-between sm:w-4/5">
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
      </div>

      {/* Contenedor de cursos */}
      <div className="mx-auto mt-5 flex w-full flex-row items-center justify-center rounded-2xl bg-white pt-3 sm:w-4/5">
        <form action="" method="post" className="space-y-4">
          <h2>Cursos</h2>

          {/* {categorias.map((categoria) => (
            <Box
              className="border-b-2 border-primary p-3"
              key={categoria.id_categoria}
              borderRadius={2}
            >
              <FormLabel className="font-semibold">
                {categoria.nombre}
              </FormLabel>

              <FormGroup className="flex flex-row flex-wrap justify-around gap-2">
                {modulos.map((curso) => (
                  <FormControlLabel
                    key={curso.id_modulo}
                    control={
                      <Checkbox
                        checked={
                          selectedCursosPorCategoria[
                            categoria.id_categoria
                          ]?.includes(curso.id_modulo) || false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const currentSeleccionados =
                            selectedCursosPorCategoria[
                              categoria.id_categoria
                            ] || [];

                          let nuevosSeleccionados;

                          if (checked) {
                            // Agrega el curso si fue seleccionado
                            nuevosSeleccionados = [
                              ...currentSeleccionados,
                              curso.id_modulo,
                            ];
                          } else {
                            // Elimina el curso si fue deseleccionado
                            nuevosSeleccionados = currentSeleccionados.filter(
                              (id) => id !== curso.id_modulo,
                            );
                          }

                          handleCursoChange(
                            categoria.id_categoria,
                            nuevosSeleccionados,
                          );
                        }}
                      />
                    }
                    label={curso.nombre_modulo}
                  />
                ))}
              </FormGroup>

              <Box className="wrap flex w-full flex-col justify-between gap-2 sm:flex-row">
                <TextField
                  className="inputs-textfield"
                  label="Precio Colegio Público"
                  type="number"
                />
                <TextField
                  className="inputs-textfield"
                  label="Precio Colegio Privado"
                  type="number"
                />
                <TextField
                  className="inputs-textfield"
                  label="Precio Relación Univalle"
                  type="number"
                />
              </Box>

              <TextField
                className="inputs-textfield"
                sx={{ mt: 2 }}
                type="date"
                label="Fecha de finalización"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          ))} */}

          {Object.keys(modulosPorCategoria).map((nombreCategoria) => (
            <Box
              className="border-b border-solid border-primary py-12"
              key={nombreCategoria}
              borderRadius={2}
            >
              <FormLabel className="font-semibold">{nombreCategoria}</FormLabel>

              <FormGroup className="flex flex-row flex-wrap justify-around gap-2">
                {modulosPorCategoria[nombreCategoria].map((modulo) => (
                  <FormControlLabel
                    key={modulo.id_modulo}
                    control={
                      <Checkbox
                        checked={
                          selectedCursosPorCategoria[nombreCategoria]?.includes(
                            modulo.id_modulo,
                          ) || false
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
                        }}
                      />
                    }
                    label={modulo.nombre_modulo}
                  />
                ))}
              </FormGroup>

              <Box className="wrap flex w-full flex-col justify-between gap-2 sm:flex-row">
                <TextField
                  id={`precio-publico-${nombreCategoria}`}
                  className="inputs-textfield"
                  label="Precio Colegio Público"
                  type="number"
                />
                <TextField
                  id={`precio-privado-${nombreCategoria}`}
                  className="inputs-textfield"
                  label="Precio Colegio Privado"
                  type="number"
                />
                <TextField
                  id={`precio-univalle-${nombreCategoria}`}
                  className="inputs-textfield"
                  label="Precio Relación Univalle"
                  type="number"
                />
              </Box>

              <TextField
                id={`fecha-finalizacion-${nombreCategoria}`}
                className="inputs-textfield"
                sx={{ mt: 2 }}
                type="date"
                label="Fecha de finalización"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          ))}
          <Button
            type="submit"
            variant="contained"
            className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
          >
            Crear oferta
          </Button>
        </form>
      </div>
    </div>
  );
}
