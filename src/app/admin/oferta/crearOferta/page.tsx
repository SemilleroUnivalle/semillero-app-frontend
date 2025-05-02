"use client";

import {
  Button,
  Box,
  TextField,
  OutlinedInput,
  ListItemText,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  FormGroup,
  FormControlLabel,
  MenuItem,
  Checkbox,
} from "@mui/material";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function CrearOferta() {
  // Estado mínimo necesario para que el Select múltiple funcione
  const [selectedCursos, setSelectedCursos] = React.useState<number[]>([]);
  const [selectedCursosPorCategoria, setSelectedCursosPorCategoria] =
    React.useState<Record<number, number[]>>({});

  // Estado para almacenar las categorias y los modulo desde la API
  const [categorias, setCategorias] = useState<any[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);

  useEffect(() => {
    // Obtener categorias de la API
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/cat/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const categoria = response.data;

        const formateado = categoria.map((cat: any) => ({
          id_categoria: cat.id_categoria,
          nombre: cat.nombre,
          descripcion: cat.descripcion,
        }));

        setCategorias(formateado);
        console.log("Categorias", formateado);
      } catch (error) {
        console.error("Error al obtener las categorias", error);
      }
    };

    // Obtener modulos de la API

    const fetchModulos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/modulo/mod/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const modulo = response.data;

        const formateado = modulo.map((mod: any) => ({
          id_modulo: mod.id_modulo,
          nombre_modulo: mod.nombre_modulo,
          id_area: mod.descripcion,
        }));

        setModulos(formateado);
        console.log("Modulos", formateado);
      } catch (error) {
        console.error("Error al obtener los modulos", error);
      }
    };
    fetchModulos();
    fetchCategorias();
  }, []);

  const handleCursoChange = (categoriaId: number, selected: number[]) => {
    setSelectedCursosPorCategoria((prev) => ({
      ...prev,
      [categoriaId]: selected, // Actualiza los cursos seleccionados para la categoría específica
    }));
  };

  return (
    <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white p-2 shadow-md">
      <h2 className="mb-2 text-center">Crear oferta</h2>
      <div className="flex w-full flex-row items-center justify-center sm:w-4/5 mx-auto">
        <form action="" method="post" className="space-y-4">
          <div className="flex w-full flex-wrap justify-between gap-4 text-gray-600">
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

          <h2>Cursos</h2>

          {categorias.map((categoria) => (
            <Box className="border-b-2" key={categoria.id_categoria} borderRadius={2}>
              <FormLabel className="font-semibold">
                {categoria.nombre}
              </FormLabel>


              <FormGroup className="flex flex-row flex-wrap gap-2 justify-between">

                {modulos
                    // Filtra los módulos por categoría
                    .map((curso) => (

                      <FormControlLabel className="" control={<Checkbox />}
                      label={curso.nombre_modulo} />


                      // <MenuItem key={curso.id_modulo} value={curso.id_modulo}>
                      //   <Checkbox
                      //     checked={
                      //       selectedCursosPorCategoria[
                      //         categoria.id_categoria
                      //       ]?.includes(curso.id_modulo) || false
                      //     }
                      //   />
                      //   <ListItemText primary={curso.nombre_modulo} />
                      // </MenuItem>
                    ))}
              </FormGroup>

              <FormControl
                className="inputs-textfield"
                fullWidth
                sx={{ mt: 2 }}
              >
                <InputLabel>Cursos</InputLabel>
                <Select
                  multiple
                  value={
                    selectedCursosPorCategoria[categoria.id_categoria] || []
                  }
                  onChange={(e) =>
                    handleCursoChange(
                      categoria.id_categoria,
                      e.target.value as number[],
                    )
                  }
                  input={<OutlinedInput label="Cursos" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          modulos.find((c) => c.id_modulo === id)
                            ?.nombre_modulo,
                      )
                      .filter(Boolean)
                      .join(", ")
                  }
                >
                  {modulos
                    // Filtra los módulos por categoría
                    .map((curso) => (
                      <MenuItem key={curso.id_modulo} value={curso.id_modulo}>
                        <Checkbox
                          checked={
                            selectedCursosPorCategoria[
                              categoria.id_categoria
                            ]?.includes(curso.id_modulo) || false
                          }
                        />
                        <ListItemText primary={curso.nombre_modulo} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Box display="flex" gap={2} mt={2}>
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
