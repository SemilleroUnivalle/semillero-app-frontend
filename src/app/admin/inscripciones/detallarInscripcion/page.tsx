"use client";

import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Avatar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";

export default function DetallarInscripcion() {
  const [estudiante, setEstudiante] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("inscritoSeleccionado");
    if (storedData) {
      const seleccionado = JSON.parse(storedData);
      const id = seleccionado.id || seleccionado.id_estudiante;
      if (id) {
        const userString = localStorage.getItem("user");
        let token = "";
        if (userString) {
          const user = JSON.parse(userString);
          token = user.token;
        }
        axios
          .get(`${API_BASE_URL}/estudiante/est/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((res) => {
            setEstudiante(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }
  }, []);

  if (loading) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <CircularProgress />
        <Typography className="mt-2">Cargando datos del estudiante...</Typography>
      </Box>
    );
  }

  if (!estudiante) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <Typography>No se encontró información del estudiante.</Typography>
      </Box>
    );
  }

  return (
    <div className="mx-auto my-4 w-full content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="text-center font-semibold text-primary mb-4">
        Detalle de Inscripción
      </h2>
      <div className="flex w-full flex-col justify-between">
        {/* Fotografía */}
        <div className="my-4 flex w-1/3 flex-col items-center justify-around">
          <Avatar
            src={estudiante.foto || ""}
            sx={{ width: 150, height: 150 }}
            alt="Foto del estudiante"
          />
        </div>
        <div className="flex w-2/3 flex-col items-center justify-center">
          <div className="flex flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Nombres"
              value={estudiante.nombre || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Apellidos"
              value={estudiante.apellido || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Correo Electrónico"
              value={estudiante.email || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Número de identificación"
              value={estudiante.numero_documento || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Tipo de documento"
              value={estudiante.tipo_documento || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Género"
              value={estudiante.genero || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Fecha de nacimiento"
              value={estudiante.fecha_nacimiento || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Celular"
              value={estudiante.celular || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Teléfono fijo"
              value={estudiante.telefono_fijo || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Departamento"
              value={estudiante.departamento_residencia || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Ciudad"
              value={estudiante.ciudad_residencia || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Comuna"
              value={estudiante.comuna_residencia || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Dirección"
              value={estudiante.direccion_residencia || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Colegio"
              value={estudiante.colegio || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Grado"
              value={estudiante.grado || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Estamento"
              value={estudiante.estamento || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="EPS"
              value={estudiante.eps || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Discapacidad"
              value={estudiante.discapacidad ? "Sí" : "No"}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Tipo discapacidad"
              value={estudiante.tipo_discapacidad || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              className="inputs-textfield flex w-full flex-col sm:w-1/3"
              label="Descripción discapacidad"
              value={estudiante.descripcion_discapacidad || ""}
              InputProps={{ readOnly: true }}
            />
          </div>
        </div>
      </div>
      {/* Documentos */}
      <div className="flex flex-col items-center mt-4">
        {estudiante.documento_identidad && (
          <Button
            variant="outlined"
            color="primary"
            href={estudiante.documento_identidad}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2"
          >
            Ver documento de identidad
          </Button>
        )}
        {estudiante.constancia_estudios && (
          <Button
            variant="outlined"
            color="primary"
            href={estudiante.constancia_estudios}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2"
          >
            Ver constancia de estudios
          </Button>
        )}
        {estudiante.recibo_pago && (
          <Button
            variant="outlined"
            color="primary"
            href={estudiante.recibo_pago}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2"
          >
            Ver recibo de pago
          </Button>
        )}
      </div>
    </div>
  );
}