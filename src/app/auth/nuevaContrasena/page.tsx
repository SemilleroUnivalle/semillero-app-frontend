"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
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

export default function NuevaContrasena() {
  const [formData, setFormData] = useState({
    nuevaContrasena: "",
    confirmarContrasena: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para mostrar/ocultar contraseñas
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar fortaleza
    const errorMsg = validarContrasena(formData.nuevaContrasena);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    // Validar coincidencia
    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // Aquí iría la petición al backend para guardar la nueva contraseña
    setSuccess(true);
    setError(null);
    setFormData({ nuevaContrasena: "", confirmarContrasena: "" });
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white p-8 shadow-md">
      <h2 className="mb-6 text-center text-xl font-semibold text-primary">
        Nueva contraseña
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          label="Nueva contraseña"
          name="nuevaContrasena"
          type={showNueva ? "text" : "password"}
          value={formData.nuevaContrasena}
          onChange={handleChange}
          required
          className="inputs-textfield w-full"
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
        <TextField
          label="Confirmar contraseña"
          name="confirmarContrasena"
          type={showConfirmar ? "text" : "password"}
          value={formData.confirmarContrasena}
          onChange={handleChange}
          required
          className="inputs-textfield w-full"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowConfirmar((show) => !show)}
                  edge="end"
                >
                  {showConfirmar ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Alert severity="info" className="w-full">
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
          color="primary"
          className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800"
        >
          Guardar nueva contraseña
        </Button>
      </form>
    </div>
  );
}
