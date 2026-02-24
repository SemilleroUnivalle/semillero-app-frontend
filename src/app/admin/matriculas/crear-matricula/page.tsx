"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modulo, OfertaCategoria } from "@/interfaces/interfaces";
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
  Switch,
  Alert,
  Snackbar,
  TextField,
  CircularProgress,
  Autocomplete,
  Box,
} from "@mui/material";

interface Estudiante {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  estamento: string;
  grado: string;
}

export default function CrearMatricula() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id_estudiante: "",
    oferta: "",
    area: "",
    modulo: "",
    tipo_vinculacion: "",
  });

  // Estados para los archivos
  const [reciboPago, setReciboPago] = useState<File | null>(null);
  const [certificado, setCertificado] = useState<File | null>(null);

  // Estado para términos
  const [terminos, setTerminos] = useState(false);

  // Estado para alertas
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para las ofertas académicas activas
  const [ofertas, setOfertas] = useState<Record<string, OfertaCategoria[]>>({});
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [estamento, setEstamento] = useState<string>("");
  const [grado, setGrado] = useState<string>("");

  // Obtener estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/estudiante/est/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        console.log("Estudiantes obtenidos:", response.data);
        setEstudiantes(response.data);
      } catch (err) {
        console.error("Error al obtener estudiantes:", err);
        setError("Error al cargar los estudiantes");
      }
    };

    const fetchModulos = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`,
        );
        console.log("Ofertas académicas obtenidas:", response.data);
        setOfertas(response.data);
      } catch (err) {
        console.error("Error al obtener ofertas:", err);
        setError("Error al cargar las ofertas académicas");
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
    fetchModulos();
  }, []);

  // Obtén la lista de ofertas académicas
  const ofertasAcademicas = Object.values(ofertas)
    .flat()
    .map((oferta) => oferta.id_oferta_academica)
    .filter(
      (value, index, self) =>
        self.findIndex(
          (v) => v.id_oferta_academica === value.id_oferta_academica,
        ) === index,
    );

  // Categorías disponibles según la oferta seleccionada
  const categoriasDisponibles = formData.oferta
    ? ofertas[formData.oferta]?.map((ofertaCat) => ofertaCat.id_categoria) || []
    : [];

  // Módulos disponibles según la categoría seleccionada Y el grado del estudiante
  const modulosDisponibles =
    formData.oferta && formData.area
      ? ofertas[formData.oferta]?.find(
          (ofertaCat) =>
            ofertaCat.id_categoria.id_categoria === Number(formData.area),
        )?.modulo || []
      : [];

  const handleChangeSelect = (
    event: SelectChangeEvent<string>,
    field: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
      ...(field === "oferta" ? { area: "", modulo: "" } : {}),
      ...(field === "area" ? { modulo: "" } : {}),
    }));

    // Si cambia el estudiante, actualizar grado y estamento
    if (field === "id_estudiante") {
      const estudiante = estudiantes.find(
        (est) => est.id_estudiante === Number(event.target.value),
      );
      if (estudiante) {
        setGrado(estudiante.grado);
        setEstamento(estudiante.estamento);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.id_estudiante ||
      !formData.modulo ||
      !formData.tipo_vinculacion
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    if (!reciboPago) {
      setError("El recibo de pago es obligatorio");
      return;
    }

    // El certificado es obligatorio SOLO si NO es (estamento PRIVADO AND tipo_vinculacion Particular)
    const certificadoObligatorio = !(
      estamento === "PRIVADO" && formData.tipo_vinculacion === "Particular"
    );

    if (certificadoObligatorio && !certificado) {
      setError("El certificado es obligatorio");
      return;
    }

    if (!terminos) {
      setError("Debe aceptar los términos y condiciones");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id_estudiante", formData.id_estudiante);
      formDataToSend.append("id_modulo", formData.modulo);
      formDataToSend.append("tipo_vinculacion", formData.tipo_vinculacion);
      formDataToSend.append("terminos", terminos ? "True" : "False");

      if (reciboPago) {
        formDataToSend.append("recibo_pago", reciboPago);
      }
      if (certificado) {
        formDataToSend.append("certificado", certificado);
      }

      // Imprime todos los datos que se van a enviar
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      await axios.post(`${API_BASE_URL}/matricula/mat/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(true);
      // Limpiar formulario
      setFormData({
        id_estudiante: "",
        oferta: "",
        area: "",
        modulo: "",
        tipo_vinculacion: "",
      });
      setReciboPago(null);
      setCertificado(null);
      setTerminos(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/admin/matriculas/verMatriculas");
      }, 2000);
    } catch (err: any) {
      console.error("Error al enviar la matrícula:", err);
      setError(
        err.response?.data?.detail || "Hubo un error al enviar la matrícula.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="mx-auto my-4 w-11/12 rounded-2xl bg-white p-5 shadow-md">
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Matrícula creada exitosamente.
        </Alert>
      </Snackbar>

      <h2 className="mb-6 text-center text-xl font-semibold text-primary">
        CREAR MATRÍCULA
      </h2>

      <form
        className="inputs-textfield flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* Selector de Estudiante */}
        <FormControl fullWidth required>
          <Autocomplete
            id="id_estudiante"
            options={estudiantes}
            getOptionLabel={(option) =>
              `${option.nombre} ${option.apellido} (${option.numero_documento}) - ${option.estamento} - Grado: ${option.grado}`
            }
            value={
              estudiantes.find(
                (est) => est.id_estudiante === Number(formData.id_estudiante),
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                id_estudiante: newValue
                  ? newValue.id_estudiante.toString()
                  : "",
              }));
              // Update grado and estamento if estudiante changes
              if (newValue) {
                setGrado(newValue.grado);
                setEstamento(newValue.estamento);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar Estudiante" required />
            )}
          />
        </FormControl>

        <Box className="flex flex-col space-y-4 sm:flex-row sm:gap-4 sm:space-y-0">
          {/* Selector de Oferta Académica */}
          <FormControl fullWidth required disabled={!formData.id_estudiante}>
            <InputLabel id="oferta-label">Oferta académica</InputLabel>
            <Select
              labelId="oferta-label"
              id="oferta"
              label="Oferta académica"
              value={formData.oferta}
              onChange={(e) => handleChangeSelect(e, "oferta")}
            >
              {ofertasAcademicas.map((oferta) => (
                <MenuItem
                  key={oferta.id_oferta_academica}
                  value={oferta.id_oferta_academica}
                >
                  {oferta.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selector de Categoría */}
          <FormControl fullWidth required disabled={!formData.oferta}>
            <InputLabel id="area-label">Categoría</InputLabel>
            <Select
              labelId="area-label"
              id="area"
              label="Categoría"
              value={formData.area}
              onChange={(e) => handleChangeSelect(e, "area")}
            >
              {categoriasDisponibles.map((cat) => (
                <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selector de Módulo */}
          <FormControl fullWidth required disabled={!formData.area}>
            <InputLabel id="modulo-label">Módulo</InputLabel>
            <Select
              labelId="modulo-label"
              id="modulo"
              label="Módulo"
              value={formData.modulo}
              onChange={(e) => handleChangeSelect(e, "modulo")}
            >
              {modulosDisponibles.map((modulo: Modulo) => (
                <MenuItem key={modulo.id_modulo} value={modulo.id_modulo}>
                  {modulo.nombre_modulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Selector de Tipo de Vinculación */}
        <FormControl fullWidth required>
          <FormLabel className="mb-2 font-semibold">
            TIPO DE VINCULACIÓN
          </FormLabel>
          <RadioGroup
            row
            value={formData.tipo_vinculacion}
            onChange={(e) =>
              setFormData({ ...formData, tipo_vinculacion: e.target.value })
            }
          >
            <FormControlLabel
              value="Particular"
              control={<Radio />}
              label="Particular"
            />
            <FormControlLabel
              value="Relacion Univalle - Hijos de funcionarios"
              control={<Radio />}
              label="Relación Univalle - Hijos de funcionarios"
            />
            <FormControlLabel
              value="Relacion Univalle - Hijos de egresados"
              control={<Radio />}
              label="Relación Univalle - Hijos de egresados"
            />
            <FormControlLabel
              value="Convenio colegios"
              control={<Radio />}
              label="Convenio colegios"
            />
            <FormControlLabel
              value="Becados - Relación Docentes"
              control={<Radio />}
              label="Becados - Relación Docentes"
            />
            <FormControlLabel
              value="Becados - SINTRAUNICOL"
              control={<Radio />}
              label="Becados - SINTRAUNICOL"
            />
            <FormControlLabel
              value="Becados - Universidad pal Barrio"
              control={<Radio />}
              label="Becados - Universidad pal Barrio"
            />
            <FormControlLabel
              value="Becados - Solicitud Individual"
              control={<Radio />}
              label="Becados - Solicitud Individual"
            />
          </RadioGroup>
        </FormControl>

        {/* Documentación requerida */}
        <h2 className="my-4 text-center font-semibold text-primary">
          DOCUMENTACIÓN REQUERIDA
        </h2>

        {/* Recibo de Pago */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">
            Recibo de Pago <span className="text-red-500">*</span>
          </label>
          <input
            name="recibo_pago"
            type="file"
            accept=".pdf"
            required
            className="block w-full rounded border border-gray-300 p-2 text-sm text-gray-500"
            onChange={(e) => setReciboPago(e.target.files?.[0] || null)}
          />
        </div>

        {/* Certificado - Solo si NO es (estamento PRIVADO AND tipo_vinculacion Particular) */}
        {!(
          estamento === "PRIVADO" && formData.tipo_vinculacion === "Particular"
        ) && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Certificado <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600">
              (Certificado de estudios, acta de grado, diploma, certificado
              relación Univalle)
            </p>
            <input
              name="certificado_estudio"
              type="file"
              accept=".pdf"
              required
              className="block w-full rounded border border-gray-300 p-2 text-sm text-gray-500"
              onChange={(e) => setCertificado(e.target.files?.[0] || null)}
            />
          </div>
        )}

        {/* Términos y Condiciones */}
        <div className="flex flex-col items-start gap-3 border-t pt-4">
          <label className="text-justify text-sm text-gray-600">
            Al enviar este formulario, autorizo a la Universidad del Valle para
            que haga uso de mis datos personales con fines académicos,
            estadísticos y/o socioeducativos, de acuerdo con lo establecido en
            la normatividad vigente. Declaro que he leído y acepto las
            Condiciones Generales y estoy de acuerdo con la{" "}
            <a
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://drive.google.com/file/d/1rP_wVpq9jBoj-aaajw1FI2jXH4cUhG_g/view?pli=1"
            >
              Política de Privacidad
            </a>
            .
          </label>

          <FormControlLabel
            control={
              <Switch
                checked={terminos}
                onChange={(e) => setTerminos(e.target.checked)}
              />
            }
            label="Acepto términos y condiciones"
          />
        </div>

        {/* Botón de Envío */}
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          className="mt-6"
          sx={{
            bgcolor: "#C20E1A",
            color: "white",
            padding: "12px",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#A00B15",
            },
            "&:disabled": {
              bgcolor: "#ccc",
            },
          }}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Enviando...
            </>
          ) : (
            "Crear Matrícula"
          )}
        </Button>
      </form>
    </div>
  );
}
