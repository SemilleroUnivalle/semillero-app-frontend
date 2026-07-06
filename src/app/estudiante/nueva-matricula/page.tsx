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
  Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  const [ofertas, setOfertas] = useState<Record<string, OfertaCategoria[]>>({});

  const [estamento, setEstamento] = useState<string>("");
  const [estudianteId, setEstudianteId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token) {
      alert("No se encontró sesión activa. Por favor inicia sesión.");
      router.push("/auth/login");
      return;
    }

    // Fallback rápido usando los datos básicos guardados en el login
    if (userRaw) {
      try {
        const userObj = JSON.parse(userRaw);
        if (userObj.id) {
          setEstudianteId(String(userObj.id));
        }
      } catch (e) {
        console.error("Error al parsear user de localStorage:", e);
      }
    }

    axios
      .get(`${API_BASE_URL}/estudiante/me/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        console.log("Información del estudiante cargada:", res.data);
        setEstamento(res.data.estamento || "");
        if (res.data.id_estudiante) {
          setEstudianteId(String(res.data.id_estudiante));
        }
      })
      .catch((err) => {
        console.error("Error al obtener perfil del estudiante:", err);
      });
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Estamento del usuario:", estamento);
    console.log("ID del estudiante:", estudianteId);

    if (!estudianteId) {
      alert("No se encontró el id del estudiante. Por favor, inicia sesión nuevamente.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id_estudiante", estudianteId);
    formDataToSend.append("id_modulo", formData.modulo);
    formDataToSend.append("tipo_vinculacion", formData.tipo_vinculacion);
    formDataToSend.append("terminos", terminos ? "True" : "False");
    if (formData.oferta) {
      formDataToSend.append("oferta_academica", formData.oferta);
    }

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

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    try {
      await axios.post(`${API_BASE_URL}/inscripcion/`, formDataToSend, {
        headers,
      });
      alert("Matrícula enviada correctamente.");
      router.push("/estudiante/matriculas"); // Redirige a mis matrículas
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
            <InputLabel id="area-label">Área</InputLabel>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 max-w-3xl mx-auto">
          {/* Recibo de Pago */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-700 text-left">Recibo de pago</h3>
            <Box
              className={`border-2 border-dashed border-[#C20E1A] rounded-xl p-4 text-center cursor-pointer transition-all ${
                reciboPago ? "bg-red-50/30 border-solid" : "bg-transparent"
              } hover:bg-red-50/10`}
            >
              <input
                name="recibo_pago"
                type="file"
                accept=".pdf"
                className="hidden"
                id="file-input-recibo"
                onChange={(e) => setReciboPago(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-input-recibo" className="flex flex-col items-center cursor-pointer gap-2 py-2 w-full">
                <CloudUploadIcon sx={{ fontSize: 32, color: "#C20E1A" }} />
                <span className="text-sm font-medium text-gray-700">
                  {reciboPago ? reciboPago.name : "Seleccionar PDF de recibo"}
                </span>
                <span className="text-xs text-gray-400">Sólo archivos .pdf</span>
              </label>
            </Box>
          </div>

          {/* Certificado */}
          {!(
            estamento === "Privado" &&
            formData.tipo_vinculacion === "Particular"
          ) && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700 text-left">Certificado requerido</h3>
              <Box
                className={`border-2 border-dashed border-[#C20E1A] rounded-xl p-4 text-center cursor-pointer transition-all ${
                  certificado ? "bg-red-50/30 border-solid" : "bg-transparent"
                } hover:bg-red-50/10`}
              >
                <input
                  name="certificado_estudio"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="file-input-certificado"
                  onChange={(e) => setCertificado(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-input-certificado" className="flex flex-col items-center cursor-pointer gap-2 py-2 w-full">
                  <CloudUploadIcon sx={{ fontSize: 32, color: "#C20E1A" }} />
                  <span className="text-sm font-medium text-gray-700 max-w-[280px] truncate">
                    {certificado ? certificado.name : "Seleccionar PDF de certificado"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Estudios, acta, diploma o relación Univalle
                  </span>
                </label>
              </Box>
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
