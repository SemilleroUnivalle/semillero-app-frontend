"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config";
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
} from "@mui/material";

export default function Matricula() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    oferta: "",
    area: "",
    modulo: "",
    tipo_vinculacion: "",
    terminos: true,
    id_estudiante: 1,
    id_modulo: "",
  });

  // Estados para los archivos
  const [reciboPago, setReciboPago] = useState<File | null>(null);
  const [certificado, setCertificado] = useState<File | null>(null);

  // Estado para términos
  const [terminos, setTerminos] = useState(false);

  // Estado para alertas
  const [alerta, setAlerta] = useState<{
    tipo: "error" | "success";
    mensaje: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para las ofertas académicas activas
  const [ofertas, setOfertas] = useState<Record<string, OfertaCategoria[]>>({});
  const [loading, setLoading] = useState(true);

  const [estamento, setEstamento] = useState<string>("");

  useEffect(() => {
    const est = localStorage.getItem("estamento");
    if (est) setEstamento(est);
  }, []);

  useEffect(() => {
    // Reemplaza la URL por la de tu endpoint real
    axios
      .get(`${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`)
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

  // Módulos disponibles según la categoría seleccionada
  const modulosDisponibles =
    formData.oferta && formData.area
      ? ofertas[formData.oferta]?.find(
          (ofertaCat) =>
            ofertaCat.id_categoria.id_categoria === Number(formData.area),
        )?.modulo || []
      : [];

  const handleChange = (event: SelectChangeEvent<string>, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
      ...(field === "oferta" ? { area: "", modulo: "" } : {}),
      ...(field === "area" ? { modulo: "" } : {}),
    }));
  };

  // if (loading) return <div>Cargando ofertas...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     if (!reciboPago) {
      alert("El recibo de pago es obligatorio");
      return;
    }

    if (!certificado) {
      alert("El certificado es obligatorio");
      return;
    }

    const id_estudiante = localStorage.getItem("id_estudiante");
    const estamento = localStorage.getItem("estamento");

    console.log("Estamento del usuario:", estamento);
    console.log("ID del estudiante:", id_estudiante);

    if (!id_estudiante) {
      alert("No se encontró el id del estudiante.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id_estudiante", id_estudiante);
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

    try {
      await axios.post(`${API_BASE_URL}/matricula/mat/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      router.push("/auth/matricula-finalizada"); // Redirige al login
    } catch (error) {
      console.error("Error al enviar la matrícula:", error);
      setError("Hubo un error al enviar la matrícula.");
    }
  };

  // Manejo del cierre del snackbar
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  if (loading) return <div>Cargando ofertas...</div>;

  return (
    <div className="mx-auto my-4 w-full rounded-2xl bg-white p-5 text-center shadow-md">
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
          Matrícula enviada correctamente.
        </Alert>
      </Snackbar>

      <h2 className="text-center font-semibold text-primary">
        OFERTA ACADÉMICA Y MATRÍCULA
      </h2>

      <form className="items-center" onSubmit={handleSubmit}>
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

        <div className="my-4 flex flex-wrap justify-around gap-3">
          {/* Selector de Área */}
          <FormControl
            className="inputs-textfield flex w-full flex-col sm:w-1/3"
            disabled={!formData.oferta}
          >
            <InputLabel id="area-label">Categoría</InputLabel>
            <Select
              labelId="area-label"
              id="area"
              label="area-label"
              value={formData.area}
              onChange={(e) => handleChange(e, "area")}
            >
              {categoriasDisponibles.map((cat) => (
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
              {modulosDisponibles.map((modulo: Modulo) => (
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
            <h2>TIPO DE VINCULACIÓN</h2>
          </FormLabel>
          <RadioGroup
            row
            className="selects"
            aria-labelledby="tipo-vinculacion"
            name="tipo-vinculacion"
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

            
          </RadioGroup>
        </FormControl>

        <h2 className="my-4 text-center font-semibold text-primary">
          DOCUMENTACIÓN
        </h2>
        {/* Inputs para subir archivos */}
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          <div className="my-4 flex flex-col gap-3">
            <h3>Recibo de pago</h3>
            <input
              name="recibo_pago"
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-500"
              onChange={(e) => setReciboPago(e.target.files?.[0] || null)}
            />
          </div>
          {/* Mostrar solo si NO es estamento Privado con tipo de vinculación Particular */}
          {!(
            estamento === "Privado" &&
            formData.tipo_vinculacion === "Particular"
          ) && (
            <div className="my-4 flex flex-col gap-3">
              <h3>Certificado</h3>
              <p>
                (Certificado de estudios, acta de grado, diploma, certificado
                relación Univalle)
              </p>
              <input
                name="certificado_estudio"
                type="file"
                accept=".pdf"
                className="block w-full text-sm text-gray-500"
                onChange={(e) => setCertificado(e.target.files?.[0] || null)}
              />
            </div>
          )}
        </div>
        {/* Checkbox para términos */}
        <div className="my-4 flex flex-col items-center justify-center gap-2 py-3">
          <label
            htmlFor="terminos"
            className="text-justify text-sm text-gray-600"
          >
            Al enviar este formulario, autorizo a la Universidad del Valle para
            que haga uso de mis datos personales con fines académicos,
            estadísticos y/o socioeducativos, de acuerdo con lo establecido en
            la normatividad vigente. <br /> <br />
            Declaro que he leído y acepto las Condiciones Generales y estoy de
            acuerdo con la{" "}
            <a
              className="underline"
              target="_blank"
              href="https://drive.google.com/file/d/1rP_wVpq9jBoj-aaajw1FI2jXH4cUhG_g/view?pli=1"
            >
              Política de Privacidad
            </a>{" "}
            en relación con el tratamiento de mis datos personales bajo la
            Universidad del Valle.
          </label>

          <Switch
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            id="terminos"
            required
          />
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
