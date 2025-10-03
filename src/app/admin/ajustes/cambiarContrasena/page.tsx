"use client";

import axios from "axios";
import { API_BASE_URL } from "../../../../../config"; // Ajusta la ruta si es necesario

import {
  Button,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function validarContrasena(password: string): string | null {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!regex.test(password)) {
    return "La contraseña no cumple con los requisitos de seguridad";
  }
  return null;
}

export default function CambiarContrasena() {
  const [formData, setFormData] = useState({
    contrasenaAnterior: "",
    nuevaContrasena: "",
  });

  // Estado para manejar errores y éxito
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para mostrar/ocultar contraseñas
  const [showAntigua, setShowAntigua] = useState(false);
  const [showNueva, setShowNueva] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar fortaleza
    const errorMsg = validarContrasena(formData.nuevaContrasena);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("No se encontró el usuario.");
        return;
      }
      const user = JSON.parse(userString);
      const userId = user.id;
      const token = user.token;

      if (!userId || !token) {
        alert("No se encontró el usuario o el token.");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/administrador/admin/${userId}/`,
        {
          contrasena: formData.nuevaContrasena,
          // Si tu backend requiere la contraseña anterior, agrégala aquí:
          // contrasena_anterior: formData.contrasenaAnterior,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setFormData({ contrasenaAnterior: "", nuevaContrasena: "" });
      setError(null);

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setSuccess(false);
    }
  };

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-center rounded-2xl bg-white p-1 py-2 shadow-md">
      <h2>Cambiar contraseña</h2>
      <form
        action=""
        method="patch"
        onSubmit={handleSubmit}
        className="flex w-1/3 flex-col gap-4 mt-2"
      >
        
        <TextField
          className="inputs-textfield w-full"
          label="Contraseña anterior"
          name="contrasenaAnterior"
          variant="outlined"
          type={showAntigua ? "text" : "password"}
          required
          value={formData.contrasenaAnterior}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showAntigua ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowAntigua((show) => !show)}
                  edge="end"
                >
                  {showAntigua ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className="inputs-textfield w-full"
          label="Nueva contraseña"
          name="nuevaContrasena"
          variant="outlined"
          required
          type={showNueva ? "text" : "password"}
          value={formData.nuevaContrasena}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showNueva ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowNueva((show) => !show)}
                  edge="end"
                >
                  {showNueva ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Alert severity="info">
          La contraseña debe tener al menos 8 caracteres, una mayúscula, una
          minúscula, un número y un símbolo.
        </Alert>
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success">
            Contraseña actualizada correctamente.
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
        >
          Cambiar contraseña
        </Button>
      </form>
      {success && (
        <Alert severity="success" className="mb-4 w-full">
          Contraseña actualizada correctamente.
        </Alert>
      )}
    </div>
  );
}
