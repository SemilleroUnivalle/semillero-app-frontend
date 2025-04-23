"use client";

import {
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

interface CrearCursoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CrearCursoModal({
  open,
  onClose,
}: CrearCursoModalProps) {

  const [areas, setAreas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);


  const [area, setArea] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    setArea(event.target.value);
  };

  const handleCategoriaChange = (event: SelectChangeEvent<string>) => {
    setCategoria(event.target.value);
  };


  useEffect(() => {
      const fetchAreas = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/area/are/`,
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
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
          const response = await axios.get(
            `${API_BASE_URL}/area/are/`,
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
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

      fetchAreas();
      fetchCategorias();
    }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="w-3/3 mx-auto mt-10 rounded-2xl bg-white p-4 sm:w-2/4 md:w-1/4">
        <h2 className="mb-2 text-center">Crear curso</h2>
        <div>
          <form action="" method="post" className="space-y-4">
            {/* Campo nombre del curso */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Nombre"
              name="nombre_curso"
              variant="outlined"
              type="text"
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />

            {/* Campo selector de area */}
            <FormControl className="inputs-textfield w-full">
              <InputLabel id="area_curso">Área</InputLabel>
              <Select
                labelId="area_curso"
                id="area_curso"
                label="area_curso"
                value={area}
                onChange={handleAreaChange}
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
            {area === "Otra" && (
              <TextField
                className="inputs-textfield flex w-full flex-col"
                label="Especificar Área"
                name="otra_area"
                variant="outlined"
                type="text"
                fullWidth
                required
              />
            )}

            {/* Campo selector de categoria */}
            <FormControl className="inputs-textfield w-full">
              <InputLabel id="categoria_curso">Categoría</InputLabel>
              <Select
                labelId="categoria_curso"
                id="categoria_curso"
                label="categoria_curso"
                value={categoria}
                onChange={handleCategoriaChange}
                required
              >
                <MenuItem value={"Modulos por área"}>Módulos por área</MenuItem>
                <MenuItem value={"NAS Presencial"}> NAS Presencial</MenuItem>
                <MenuItem value={"NAS Virtual"}> NAS Virtual</MenuItem>
                <MenuItem value={"Otra"}>Otra</MenuItem>
              </Select>
            </FormControl>

            {/* Campo para especificar otra área */}
            {categoria === "Otra" && (
              <TextField
                className="inputs-textfield flex w-full flex-col"
                label="Especificar Categoría"
                name="otra_categoria"
                variant="outlined"
                type="text"
                fullWidth
                required
              />
            )}

            {/* Campo intensidad horaria */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Intensidad horaria"
              name="intensidad_horaria"
              variant="outlined"
              type="text"
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
            />

            {/* Campo descripción */}
            <TextField
              className="inputs-textfield flex w-full flex-col"
              label="Descripción"
              name="descripción_curso"
              variant="outlined"
              type="text"
              multiline
              rows={4}
              fullWidth
              required

              // value={formData.nombre}
              // onChange={handleChange}
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
      </Box>
    </Modal>
  );
}
