"use client";

import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";


export default function DetallarInscripcion() {
    
    const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
  });

  // Leer datos del localStorage al cargar el componente
  useEffect(() => {
    const storedData = localStorage.getItem("inscritoSeleccionado");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  // Guardar cambios en localStorage al modificar los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    localStorage.setItem("formData", JSON.stringify(newData));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Datos enviados correctamente");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
      />
      <TextField
        label="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Enviar
      </Button>
    </form>
  );
}