'use client'

import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";

import axios from "axios";

export default function Perfil() {
  const [seleccion, setSeleccion] = useState("");
  const [mostrarOtroGenero, setMostrarOtroGenero] = useState(false);

  const handleChangeGenero = (event: any) => {
    const value = event.target.value;
    setSeleccion(value);
    setMostrarOtroGenero(value === "Otro");
  };

  return (
    <div className="mx-auto my-4 w-3/4 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="text-center text-lg font-semibold text-primary">
        Tu información
      </h2>

      <div className="my-4 flex justify-center">
        <input type="file" className="block w-full text-sm text-gray-500" />
      </div>

      <form className="flex flex-wrap justify-around gap-4 text-gray-600">
        {/* Campo Primer Nombre */}
        {/* <div className="flex w-full flex-col sm:w-1/4">
          <label htmlFor="nombres" className="text-sm font-medium">
            Nombres
          </label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            className="mt-1 w-full px-4 py-2 uppercase text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div> */}

        {/* Campo Nombres */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Nombres"
          name="nombres"
          variant="outlined"
          fullWidth
          type="text"
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Apellidos */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Apellidos"
          name="apellidos"
          variant="outlined"
          fullWidth
          type="text"
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Tipo de Documento */}

        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="tipo_documento">Tipo de documento</InputLabel>
          <Select
            labelId="tipo_documento"
            id="tipo_documento"
            label="tipo_documento"
            required
            // value={tipoDocumento}
            // onChange={handleChange}
          >
            <MenuItem value={10}>T.I.</MenuItem>
            <MenuItem value={20}>C.C.</MenuItem>
            <MenuItem value={30}>C.E.</MenuItem>
          </Select>
        </FormControl>

        {/* Campo Numero de Documento */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Número de identificación"
          name="documento"
          variant="outlined"
          type="number"
          fullWidth
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Correo Electronico */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Correo Electrónico"
          name="email"
          variant="outlined"
          type="email"
          fullWidth
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Celular */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Celular"
          name="celular"
          variant="outlined"
          type="number"
          fullWidth
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Celular Alternativo */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Teléfono fijo o celular alternativo"
          name="telefono"
          variant="outlined"
          type="number"
          fullWidth
          required
          // value={formData.nombre}
          // onChange={handleChange}
        />

        {/* Campo Género */}

        <FormControl className="inputs-textfield w-full sm:w-1/4">
          <InputLabel id="genero">Género</InputLabel>
          <Select
            labelId="genero"
            id="genero"
            label="genero"
            required
            // value={tipoDocumento}
            onChange={handleChangeGenero}
          >
            <MenuItem value={10}>Masculino</MenuItem>
            <MenuItem value={20}>Femenino</MenuItem>
            <MenuItem value={"Otro"}>Otro</MenuItem>
          </Select>
        </FormControl>

        {/* Campo Otro Genero */}
        {mostrarOtroGenero && (
          <TextField
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
            label="Otro género"
            name="otro_genero"
            variant="outlined"
            type="text"
            fullWidth
            required
            // value={formData.nombre}
            // onChange={handleChange}
          />
        )}

        {/* Campo Celular Alternativo */}

        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required

          // value={formData.nombre}
          // onChange={handleChange}
        />
      </form>
    </div>
  );
}
