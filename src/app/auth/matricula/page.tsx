"use client";

import { useState } from "react";
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

  // Encontrar las áreas disponibles según el periodo seleccionado
  const areasDisponibles =
    periodos.find((p) => p.id === Number(formData.oferta))?.area || [];

  // Encontrar los módulos disponibles según el área seleccionada
  const modulosDisponibles =
    areasDisponibles.find((a) => a.id === Number(formData.area))?.modulos || [];

  const handleChange = (event: SelectChangeEvent<string>, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
      ...(field === "oferta" ? { area: "", modulo: "" } : {}), // Resetear área y módulo si cambia el período
      ...(field === "area" ? { modulo: "" } : {}), // Resetear módulo si cambia el área
    }));
  };

  return (
    <div className="mx-auto my-4 w-full rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="text-center font-semibold text-primary">
        Oferta Académica
      </h2>

      <form className="items-center">
        {/* Selector de Período */}
        <FormControl className="inputs-textfield mx-auto mt-2 flex w-full sm:w-1/4">
          <InputLabel id="oferta-label">Periodo</InputLabel>
          <Select
            labelId="oferta-label"
            id="oferta"
            label="oferta-label"
            value={formData.oferta}
            onChange={(e) => handleChange(e, "oferta")}
          >
            {periodos.map((periodo) => (
              <MenuItem key={periodo.id} value={periodo.id}>
                {periodo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <h2 className="my-4 text-center font-semibold text-primary">
          Módulo a matricular
        </h2>
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Selector de Área (dependiente del Período) */}
          <FormControl
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
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
              {areasDisponibles.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Selector de Módulo (dependiente del Área) */}
          <FormControl
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
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
              {modulosDisponibles.map((modulo) => (
                <MenuItem key={modulo.id} value={modulo.id}>
                  {modulo.nombre}
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
