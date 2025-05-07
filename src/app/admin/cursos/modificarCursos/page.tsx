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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function _ModificarCursos() {
  // Obtener el curso seleccionado del localStorage
  // y guardarlo en el estado del componente
  const [curso, setCurso] = useState<any>(null);
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre_modulo: "", // Usar el nombre del curso seleccionado
    descripcion_curso: "", // Usar la descripción del curso seleccionado
    id_area: "", // Usar el área del curso seleccionado
    id_categoria: "", // Usar la categoría del curso seleccionado
  });

  useEffect(() => {
    const storedCurso = localStorage.getItem("cursoSeleccionado");
    if (storedCurso) {
      setCurso(JSON.parse(storedCurso));
    }
    console.log("Curso seleccionado:", storedCurso);
  }, []);

  useEffect(() => {
    if (curso) {
      setFormData({
        nombre_modulo: curso.nombre || "",
        descripcion_curso: curso.descripcion || "",
        id_area: curso.id_area || "",
        id_categoria: curso.id_categoria || "",
      });
    }
  }, [curso]);

  const [areas, setAreas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [otraArea, setOtraArea] = useState<string>(""); // Para especificar otra área
  const [otraCategoria, setOtraCategoria] = useState<string>(""); // Para especificar otra categoría

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

      // Modifica el curso
      const cursoResponse = await axios.patch(
        `${API_BASE_URL}/modulo/mod/${curso.id}/`,
        {
          nombre_modulo: formData.nombre_modulo,
          id_area: areaId,
          id_categoria: categoriaId,
          descripcion_modulo: formData.descripcion_curso,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Curso modificado exitosamente:", cursoResponse.data);
      alert("Curso modificado exitosamente");
      // Vaciar los datos
      // setFormData({
      //   nombre_modulo: "",
      //   descripcion_curso: "",
      //   id_area: "",
      //   id_categoria: "",
      // }); // Cierra el modal
    } catch (error) {
      console.error("Error al modificar el curso:", error);
      alert("Hubo un error al modificar el curso. Por favor, inténtalo de nuevo.");
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

        const formateado = area.map((are: any) => ({
          id_area: are.id_area,
          nombre_area: are.nombre_area,
        }));

        setAreas(formateado);
        console.log("Areas", formateado);
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

        const formateado = categoria.map((cat: any) => ({
          id_categoria: cat.id_categoria,
          nombre: cat.nombre,
        }));

        setCategorias(formateado);
        console.log("Categorias", formateado);
      } catch (error) {
        console.error("Error al obtener las catgeorias", error);
      }
    };

    fetchAreas();
    fetchCategorias();
  }, []);

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-center rounded-2xl bg-white p-4 py-2 shadow-md">
      <h2 className="mb-2 text-center">Modificar curso</h2>
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

          {/* Campo para especificar otra categoria */}
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
            name="descripcion_curso"
            variant="outlined"
            type="text"
            multiline
            rows={4}
            fullWidth
            required
            value={formData.descripcion_curso}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
          >
            Editar curso
          </Button>
        </form>
      </div>
    </div>
  );
}
