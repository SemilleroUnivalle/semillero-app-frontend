"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config";

import axios from "axios";
import {
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  SelectChangeEvent,
} from "@mui/material";

interface Periodo {
  id: number;
  nombre: string;
  area: Area[];
}

interface Modulo {
  id: number;
  nombre: string;
}

interface Area {
  id: number;
  nombre: string;
  modulos: Modulo[];
}

const moduloUno: Modulo = { id: 1, nombre: "Enteros" };
const moduloDos: Modulo = { id: 2, nombre: "Taller Juvenil" };

const areaMatematicas: Area = {
  id: 1,
  nombre: "Matemáticas",
  modulos: [moduloUno],
};
const areaArtes: Area = { id: 2, nombre: "Artes", modulos: [moduloDos] };

const periodos: Periodo[] = [
  { id: 1, nombre: "2025A", area: [areaMatematicas, areaArtes] },
  { id: 2, nombre: "2025B", area: [] },
];

export default function Matricula() {
  const [formData, setFormData] = useState({
    oferta: "",
    area: "",
    modulo: "",
    tipoVinculacion: "",
  });

  // Estado para las ofertas académicas activas
  const [ofertas, setOfertas] = useState<any>({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Reemplaza la URL por la de tu endpoint real
    axios.get(`${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`)
      .then((res) => {
        console.log("Ofertas académicas obtenidas:", res.data);
        setOfertas(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Obtén la lista de ofertas académicas
  const ofertasAcademicas = Object.values(ofertas)
    .flat()
    .map((oferta: any) => oferta.id_oferta_academica)
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.id_oferta_academica === value.id_oferta_academica) === index
    );

  // Categorías disponibles según la oferta seleccionada
  const categoriasDisponibles = formData.oferta
    ? ofertas[formData.oferta]?.map((cat: any) => cat.id_categoria) || []
    : [];

  // Módulos disponibles según la categoría seleccionada
  const modulosDisponibles = formData.oferta && formData.area
    ? ofertas[formData.oferta]
        ?.find((cat: any) => cat.id_categoria.id_categoria === Number(formData.area))
        ?.modulo || []
    : [];

  const handleChange = (event: SelectChangeEvent<string>, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
      ...(field === "oferta" ? { area: "", modulo: "" } : {}),
      ...(field === "area" ? { modulo: "" } : {}),
    }));
  };

  if (loading) return <div>Cargando ofertas...</div>;

  return (
    <div className="mx-auto my-4 w-full rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="text-center font-semibold text-primary">
        Oferta Académica
      </h2>

      <form className="items-center">
                {/* Selector de Oferta Académica */}
        <FormControl className="inputs-textfield mx-auto mt-2 flex w-full sm:w-1/4">
          <InputLabel id="oferta-label">Oferta académica</InputLabel>
          <Select
            labelId="oferta-label"
            id="oferta"
            label="oferta-label"
            value={formData.oferta}
            onChange={(e) => handleChange(e, "oferta")}
          >
            {ofertasAcademicas.map((oferta: any) => (
              <MenuItem key={oferta.id_oferta_academica} value={oferta.id_oferta_academica}>
                {oferta.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

<div className="flex flex-wrap justify-around gap-3 my-4">
        {/* Selector de Área */}
        <FormControl
          className="inputs-textfield flex w-full flex-col sm:w-1/3"
          disabled={!formData.oferta}
        >
          <InputLabel id="area-label">Área</InputLabel>
          <Select
            labelId="area-label"
            id="area"
            label="area-label"
            value={formData.area}
            onChange={(e) => handleChange(e, "area")}
          >
            {categoriasDisponibles.map((cat: any) => (
              <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selector de Módulo */}
        <FormControl
          className="inputs-textfield flex w-full flex-col sm:w-1/3"
          disabled={!formData.area}
        >
          <InputLabel id="modulo-label">Módulo</InputLabel>
          <Select
            labelId="modulo-label"
            id="modulo"
            label="modulo-label"
            value={formData.modulo}
            onChange={(e) => handleChange(e, "modulo")}
          >
            {modulosDisponibles.map((modulo: any) => (
              <MenuItem key={modulo.id_modulo} value={modulo.id_modulo}>
                {modulo.nombre_modulo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        </div>

        {/*Selector de Tipo de Vinculacion  */}
        <FormControl className="mx-auto">
          <FormLabel
            className="my-4 text-center font-semibold text-primary"
            id="tipo-vinculacion"
          >
            <h2>Tipo de vinculación</h2>
          </FormLabel>
          <RadioGroup
            row
            className="selects"
            aria-labelledby="tipo-vinculacion"
            name="tipo-vinculacion"
            value={formData.tipoVinculacion}
            onChange={(e) =>
              setFormData({ ...formData, tipoVinculacion: e.target.value })
            }
          >
            <FormControlLabel
              value="Particular"
              control={<Radio />}
              label="Particular"
            />
            <FormControlLabel
              value="Relacion Univalle"
              control={<Radio />}
              label="Relación Univalle"
            />
            <FormControlLabel
              value="Becado"
              control={<Radio />}
              label="Becado"
            />
          </RadioGroup>
        </FormControl>

        <h2 className="my-4 text-center font-semibold text-primary">
          Documentación
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Campo Seleccionar Constancia de Estudio */}
          <div className="my-4 flex flex-col gap-3">
            <h3>Constancia de estudio</h3>
            <input
              name="constancia_estudio"
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-500"
            />
          </div>
          {/* Campo Seleccionar Recibo de Pago*/}
          <div className="my-4 flex flex-col gap-3">
            <h3>Recibo de pago</h3>
            <input
              name="recibo_pago"
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-500"
            />
          </div>
          {/* Campo Seleccionar Relación Univalle */}
          <div
            className={`my-4 flex flex-col gap-3 ${
              formData.tipoVinculacion !== "Relacion Univalle" ? "hidden" : ""
            }`}
          >
            <h3>Relación Univalle</h3>
            <input
              name="relacion_univalle"
              type="file"
              accept=".pdf"
              className={`block w-full text-sm text-gray-500 ${
                formData.tipoVinculacion !== "Relacion Univalle" ? "hidden" : ""
              }`}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="outlined"
          className="mt-4 w-3/4 rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white"
        >
          Enviar
        </Button>
      </form>
    </div>
  );
}
