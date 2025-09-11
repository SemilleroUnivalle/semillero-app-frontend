"use client";

import {
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

import { useRouter } from "next/navigation";
import internal from "stream";

export default function DetallarCurso() {
  interface Curso {
    id_modulo: number;
    nombre_modulo: string;
    descripcion_modulo: string;
    id_area: { id_area: string; nombre_area: string };
    id_categoria: { id_categoria: string; nombre: string };
    intensidad_horaria: number;
    dirigido_a: string;
    incluye: string;
  }

  interface Area {
    id_area: string;
    nombre_area: string;
  }

  interface Categoria {
    id_categoria: string;
    nombre: string;
  }

  // Obtener el curso seleccionado del localStorage
  // y guardarlo en el estado del componente
  const [curso, setCurso] = useState<Curso>();
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre_modulo: "", // Usar el nombre del curso seleccionado
    descripcion_modulo: "", // Usar la descripción del curso seleccionado
    id_area: "", // Usar el área del curso seleccionado
    id_categoria: "", // Usar la categoría del curso seleccionado
    intensidad_horaria: 0, // Usar la intensidad horaria del curso seleccionado
    dirigido_a: "", // Usar el dirigido del curso seleccionado
    incluye: "", // Usar el incluye del curso seleccionado
  });
  //Estado para manejar el mensaje de éxito
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
        nombre_modulo: curso.nombre_modulo || "",
        descripcion_modulo: curso.descripcion_modulo || "",
        id_area: curso.id_area.id_area || "",
        id_categoria: curso.id_categoria.id_categoria || "",
        intensidad_horaria: curso.intensidad_horaria,
        dirigido_a: curso.dirigido_a || "",
        incluye: curso.incluye || "",
      });
    }
  }, [curso]);

  const [areas, setAreas] = useState<Area[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/area/are/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const area = response.data;

        const formateado = area.map((are: Area) => ({
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

        const formateado = categoria.map((cat: Categoria) => ({
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

  // Función para eliminar un curso
  const handleDelete = async (id: number) => {
    console.log("ID del curso a eliminar:", id);
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

      setSuccess(true);
      router.push("/admin/cursos/verCursos");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      alert(
        "Hubo un error al eliminar el curso. Por favor, inténtalo de nuevo.",
      );
    }
  };

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-center rounded-2xl bg-white p-4 py-2 shadow-md">
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
      <h2 className="mb-2 text-center">{formData.nombre_modulo}</h2>
      <div className="flex w-full flex-col gap-3 sm:w-1/3">
        {/* Campo nombre del curso */}
        <TextField
          className="inputs-textfield w-full"
          label="Nombre"
          name="nombre_modulo"
          variant="outlined"
          type="text"
          fullWidth
          value={formData.nombre_modulo}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
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
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
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

        {/* Campo selector de area */}
        <FormControl className="inputs-textfield w-full">
          <InputLabel id="area_curso">Área</InputLabel>
          <Select
            labelId="area_curso"
            name="id_area"
            id="area_curso"
            label="area_curso"
            value={formData.id_area}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
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
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          value={formData.descripcion_modulo}
        />
        {/* Campo Intensidad Horaria*/}
        <TextField
          className="inputs-textfield w-full"
          label="Intensidad Horaria"
          name="intensidad_horaria"
          variant="outlined"
          type="text"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          value={formData.intensidad_horaria}
        />

        {/* Campo Dirigido a*/}
        <TextField
          className="inputs-textfield w-full"
          label="Dirigido a"
          name="dirigido_a"
          variant="outlined"
          type="text"
          fullWidth
          value={formData.dirigido_a}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        {/* Campo Incluye*/}
        <TextField
          className="inputs-textfield w-full"
          label="Incluye"
          name="incluye"
          variant="outlined"
          type="text"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          value={formData.incluye}
        />
        <div className="flex flex-row gap-2">
          <Button
            variant="contained"
            href="/admin/cursos/modificarCursos/"
            className="text-md mt-4 w-1/2 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
          >
            Editar
          </Button>
          <Button
            variant="contained"
            onClick={() => curso && handleDelete(curso.id_modulo)}
            className="text-md mt-4 w-1/2 rounded-2xl border-2 border-solid border-primary bg-white py-2 font-semibold capitalize text-primary shadow-none transition hover:bg-primary hover:text-white"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
