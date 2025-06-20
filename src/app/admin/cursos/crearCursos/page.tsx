"use client";

import {
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function CrearCursos() {
  interface Area {
    id_area: string;
    nombre_area: string;
  }
  interface Categoria {
    id_categoria: string;
    nombre: string;
  }

  const [areas, setAreas] = useState<Area[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [otraArea, setOtraArea] = useState<string>(""); // Para especificar otra área
  const [otraCategoria, setOtraCategoria] = useState<string>(""); // Para especificar otra
  const [formData, setFormData] = useState({
    nombre_modulo: "",
    descripcion_modulo: "",
    id_area: "",
    id_categoria: "",
  });

  const [success, setSuccess] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | { name: string; value: string };
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let areaId = formData.id_area; // Inicialmente, el área seleccionada
      let categoriaId = formData.id_categoria; // Inicialmente, la categoría seleccionada

      // Si seleccionaron "Otra" en el área, crea una nueva área
      if (formData.id_area === "Otra") {
        const nuevaAreaResponse = await axios.post(
          `${API_BASE_URL}/area/are/`,
          { nombre_area: otraArea }, // `otraArea` es el valor del campo de texto para especificar el área
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        areaId = nuevaAreaResponse.data.id_area; // Actualiza el área con el ID de la nueva área creada
      }

      // Si seleccionaron "Otra" en la categoría, crea una nueva categoría
      if (formData.id_categoria === "Otra") {
        const nuevaCategoriaResponse = await axios.post(
          `${API_BASE_URL}/categoria/cat/`,
          { nombre: otraCategoria }, // `otraCategoria` es el valor del campo de texto para especificar la categoría
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        categoriaId = nuevaCategoriaResponse.data.id_categoria; // Actualiza la categoría con el ID de la nueva categoría creada
      }

      // Crear el curso
      const cursoResponse = await axios.post(
        `${API_BASE_URL}/modulo/mod/`,
        {
          nombre_modulo: formData.nombre_modulo,
          id_area: areaId,
          id_categoria: categoriaId,
          descripcion_modulo: formData.descripcion_modulo,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Curso creado exitosamente:", cursoResponse.data);
      alert("Curso creado exitosamente");
      // Vaciar los datos
      setFormData({
        nombre_modulo: "",
        descripcion_modulo: "",
        id_area: "",
        id_categoria: "",
      }); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el curso:", error);
      alert("Hubo un error al crear el curso. Por favor, inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/area/are/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const area = response.data;

        if (!area || (Array.isArray(area) && area.length === 0)) {
          console.log("Error: No se encontraron áreas");
        } else {
          const formateado = area.map((are: Area) => ({
            id_area: are.id_area,
            nombre_area: are.nombre_area,
          }));

          setAreas(formateado);
          console.log("Areas", formateado);
        }
      } catch (error) {
        console.error("Error al obtener las areas", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/cat/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const categoria = response.data;

        if (
          !categoria ||
          (Array.isArray(categoria) && categoria.length === 0)
        ) {
          console.log("Error: No se encontraron categorias");
        } else {
          const formateado = categoria.map((cat: Categoria) => ({
            id_categoria: cat.id_categoria,
            nombre: cat.nombre,
          }));

          setCategorias(formateado);
          console.log("Categorias", formateado);
        }
      } catch (error) {
        console.error("Error al obtener las catgeorias", error);
      }
    };

    fetchAreas();
    fetchCategorias();
  }, []);

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-center rounded-2xl bg-white p-1 py-2 shadow-md">
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
          Curso creado exitosamente.
        </Alert>
      </Snackbar>

      <h2 className="mb-2 text-center">Crear curso</h2>
      <div className="w-full sm:w-1/3">
        <form
          action=""
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          {/* Campo nombre del curso */}
          <TextField
            className="inputs-textfield w-full"
            label="Nombre"
            name="nombre_modulo"
            variant="outlined"
            type="text"
            fullWidth
            required
            value={formData.nombre_modulo}
            onChange={handleChange}
          />

          {/* Campo selector de categoria */}
          <FormControl className="inputs-textfield w-full">
            <InputLabel id="categoria_curso">Categoría</InputLabel>
            <Select
              labelId="categoria_curso"
              id="categoria_curso"
              name="id_categoria"
              label="categoria_curso"
              value={formData.id_categoria}
              onChange={handleChange}
              required
            >
              {/* Opciones de categoria */}
              {categorias.map((cat) => (
                <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </MenuItem>
              ))}
              <MenuItem value={"Otra"}>Otra</MenuItem>
            </Select>
          </FormControl>

          {/* Campo para especificar otra área */}
          {formData.id_categoria === "Otra" && (
            <TextField
              className="inputs-textfield w-full"
              label="Especificar Categoría"
              name="otra_categoria"
              variant="outlined"
              type="text"
              value={otraCategoria}
              onChange={(e) => setOtraCategoria(e.target.value)} // Actualiza el estado con el valor del campo de texto
              fullWidth
              required
            />
          )}

          {/* Campo selector de area */}
          <FormControl className="inputs-textfield w-full">
            <InputLabel id="area_curso">Área</InputLabel>
            <Select
              labelId="area_curso"
              name="id_area"
              id="area_curso"
              label="area_curso"
              value={formData.id_area}
              onChange={handleChange}
              required
            >
              {/* Opciones de área */}
              {areas.map((area) => (
                <MenuItem key={area.id_area} value={area.id_area}>
                  {area.nombre_area}
                </MenuItem>
              ))}
              <MenuItem value={"Otra"}>Otra</MenuItem>
            </Select>
          </FormControl>

          {/* Campo para especificar otra área */}
          {formData.id_area === "Otra" && (
            <TextField
              className="inputs-textfield w-full"
              label="Especificar Área"
              name="otra_area"
              variant="outlined"
              type="text"
              fullWidth
              value={otraArea}
              onChange={(e) => setOtraArea(e.target.value)} // Actualiza el estado con el valor del campo de texto
              required
            />
          )}

          {/* Campo descripción */}
          <TextField
            className="inputs-textfield w-full"
            label="Descripción"
            name="descripcion_modulo"
            variant="outlined"
            type="text"
            multiline
            rows={4}
            fullWidth
            required
            value={formData.descripcion_modulo}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
          >
            Crear Curso
          </Button>
        </form>
      </div>
    </div>
  );
}
