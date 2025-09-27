"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useRouter } from "next/navigation";

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

export default function NuevaMatricula() {

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

  // Estado para las ofertas académicas activas
  const [ofertas, setOfertas] = useState<any>({});

  const [estamento, setEstamento] = useState<string>("");

  useEffect(() => {
    const est = JSON.parse(localStorage.getItem("estudiante") || "{}").estamento;
    if (est) setEstamento(est);
  }, []);

  useEffect(() => {
    // Reemplaza la URL por la de tu endpoint real
    axios
      .get(`${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`)
      .then((res) => {
        console.log("Ofertas académicas obtenidas:", res.data);
        setOfertas(res.data);

      })
      .catch(() => console.log("No se pudo obtener las ofertas"));
  }, []);

  // Obtén la lista de ofertas académicas
  const ofertasAcademicas = Object.values(ofertas)
    .flat()
    .map((oferta: any) => oferta.id_oferta_academica)
    .filter(
      (value, index, self) =>
        self.findIndex(
          (v) => v.id_oferta_academica === value.id_oferta_academica,
        ) === index,
    );

  // Categorías disponibles según la oferta seleccionada
  const categoriasDisponibles = formData.oferta
    ? ofertas[formData.oferta]?.map((cat: any) => cat.id_categoria) || []
    : [];

  // Módulos disponibles según la categoría seleccionada
  const modulosDisponibles =
    formData.oferta && formData.area
      ? ofertas[formData.oferta]?.find(
          (cat: any) => cat.id_categoria.id_categoria === Number(formData.area),
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const estudiante = JSON.parse(localStorage.getItem("estudiante") || "{}");
    const id_estudiante = estudiante.id_estudiante;
    const estamento = estudiante.estamento;

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
  for (let pair of formDataToSend.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

    try {
      await axios.post(`${API_BASE_URL}/matricula/mat/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Matrícula enviada correctamente.");
      router.push("/auth/login"); // Redirige al login
   
    } catch (error) {
      console.error("Error al enviar la matrícula:", error);
      alert("Hubo un error al enviar la matrícula.");
    }
  };

  return (
    <div className="mx-auto my-4 w-3/4 rounded-2xl bg-white p-5 text-center shadow-md">
      <h2 className="text-center font-semibold text-primary">
        Oferta Académica
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
            {ofertasAcademicas.map((oferta: any) => (
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
                onChange={(e) =>
                  setCertificado(e.target.files?.[0] || null)
                }
              />
            </div>
          )}
        </div>
        {/* Checkbox para términos */}
        <div className="my-4 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="terminos"
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            required
          />
          <label htmlFor="terminos" className="text-sm">
            Acepto los términos de la inscripción
          </label>
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
