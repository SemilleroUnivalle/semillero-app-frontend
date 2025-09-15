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
  const [editable, setEditable] = useState(false);
  const [editData, setEditData] = useState<any>(null);


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
            setEditData(res.data); // Inicializa los datos editables
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }
  }, []);

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!editData?.id_estudiante) return;
    const userString = localStorage.getItem("user");
    let token = "";
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token;
    }
    try {
      await axios.patch(
        `${API_BASE_URL}/estudiante/est/${editData.id_estudiante}/`,
        editData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setEstudiante(editData);
      setEditable(false);
    } catch (error) {
      alert("Error al guardar los cambios.");
    }
  };

  if (loading) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <CircularProgress />
        <Typography className="mt-2">
          Cargando datos del estudiante...
        </Typography>
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

  if (loading) {
    return (
      <Box className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-4 shadow">
        <CircularProgress />
        <Typography className="mt-2">
          Cargando datos del estudiante...
        </Typography>
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
    <div className="mx-auto my-4 w-11/12 content-center rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="mb-4 text-center font-semibold text-primary">
        Detalle de Inscripción
      </h2>

      <Button
        variant="contained"
        color={editable ? "success" : "primary"}
        className="mb-4"
        onClick={() => {
          if (editable) {
            handleSave();
          } else {
            setEditable(true);
          }
        }}
      >
        {editable ? "Guardar" : "Editar"}
      </Button>

      <div className="flex flex-col justify-around">
        {/* Fotografía */}
        <div className="my-4 flex flex-col items-center justify-around">
          <Avatar
            src={estudiante.foto || ""}
            sx={{ width: 150, height: 150 }}
            alt="Foto del estudiante"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-around gap-4 text-gray-600">
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Nombres"
              value={editable ? editData?.nombre || "" : estudiante.nombre || ""}
              InputProps={{ readOnly: !editable }}
              onChange={editable ? (e) => handleEditChange("nombre", e.target.value) : undefined}
           
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Apellidos"
              value={estudiante.apellido || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Correo Electrónico"
              value={estudiante.email || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Número de identificación"
              value={estudiante.numero_documento || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Tipo de documento"
              value={estudiante.tipo_documento || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Género"
              value={estudiante.genero || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Fecha de nacimiento"
              value={estudiante.fecha_nacimiento || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Celular"
              value={estudiante.celular || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Teléfono fijo"
              value={estudiante.telefono_fijo || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Departamento"
              value={estudiante.departamento_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Ciudad"
              value={estudiante.ciudad_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Comuna"
              value={estudiante.comuna_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Dirección"
              value={estudiante.direccion_residencia || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Colegio"
              value={estudiante.colegio || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Grado"
              value={estudiante.grado || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Estamento"
              value={estudiante.estamento || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="EPS"
              value={estudiante.eps || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Discapacidad"
              value={estudiante.discapacidad ? "Sí" : "No"}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Tipo discapacidad"
              value={estudiante.tipo_discapacidad || ""}
              InputProps={{ readOnly: !editable }}
            />
            <TextField
              className={
                editable
                  ? "inputs-textfield flex w-full flex-col sm:w-1/4"
                  : "inputs-textfield-readonly flex w-full flex-col sm:w-1/4"
              }
              label="Descripción discapacidad"
              value={estudiante.descripcion_discapacidad || ""}
              InputProps={{ readOnly: !editable }}
            />
          </div>
        </div>
      </div>
      {/* Documentos */}
      <div className="mt-4 flex flex-col items-center">
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
