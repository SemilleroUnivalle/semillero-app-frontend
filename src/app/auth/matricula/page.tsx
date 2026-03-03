"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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

interface MatriculaHandle {
  validate: () => boolean;
  getFormData: () => {
    modulo: string;
    tipo_vinculacion: string;
    terminos: boolean;
    reciboPago: File | null;
    certificado: File | null;
    reciboServicio: File | null;
  };
}
interface MatriculaProps {
  estamento_form: string;
  grado_form: string;
  tipoVinculacion_form: string;
}

const Matricula = forwardRef<MatriculaHandle, MatriculaProps>(
  ({ estamento_form, grado_form, tipoVinculacion_form }, ref) => {
    const [formData, setFormData] = useState({
      oferta: "",
      area: "",
      modulo: "",
      tipo_vinculacion: "",
      terminos: true,
      id_estudiante: 1,
      id_modulo: "",
    });

    const [reciboPago, setReciboPago] = useState<File | null>(null);
    const [certificado, setCertificado] = useState<File | null>(null);
    const [reciboServicio, setReciboServicio] = useState<File | null>(null);
    const [terminos, setTerminos] = useState(false);
    const [ofertas, setOfertas] = useState<Record<string, OfertaCategoria[]>>(
      {},
    );
    const [loading, setLoading] = useState(true);

    //Carga las ofertas académicas al montar el componente
    useEffect(() => {
      axios
        .get(`${API_BASE_URL}/oferta_categoria/ofer/por-oferta-academica/`)
        .then((res) => {
          setOfertas(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!formData.oferta) {
          alert("Por favor selecciona una oferta académica");
          return false;
        }
        if (!formData.area) {
          alert("Por favor selecciona una categoría");
          return false;
        }
        if (!formData.modulo) {
          alert("Por favor selecciona un módulo");
          return false;
        }
        if (!formData.tipo_vinculacion) {
          alert("Por favor selecciona un tipo de vinculación");
          return false;
        }
        if (!terminos) {
          alert("Debes aceptar los términos y condiciones");
          return false;
        }

        if (tipoVinculacion_form !== "Becados" && !reciboPago) {
          alert("El recibo de pago es obligatorio");
          return false;
        }

        if (tipoVinculacion_form === "Becados" && !reciboServicio) {
          alert("El recibo de servicios es obligatorio para becados");
          return false;
        }

        const certificadoObligatorio = !(
          estamento_form === "PRIVADO" &&
          formData.tipo_vinculacion === "Particular"
        );

        if (certificadoObligatorio && !certificado) {
          alert("El certificado es obligatorio");
          return false;
        }

        return true;
      },
      getFormData: () => ({
        modulo: formData.modulo,
        tipo_vinculacion: formData.tipo_vinculacion,
        terminos,
        reciboPago,
        certificado,
        reciboServicio,
      }),
    }));

    // export default function Matricula({
    //   estamento_form,
    //   grado_form,
    //   tipoVinculacion_form,
    // }: {
    //   estamento_form: string;
    //   grado_form: string;
    //   tipoVinculacion_form: string;
    // }) {
    //   const router = useRouter();

    //   const [formData, setFormData] = useState({
    //     oferta: "",
    //     area: "",
    //     modulo: "",
    //     tipo_vinculacion: "",
    //     terminos: true,
    //     id_estudiante: 1,
    //     id_modulo: "",
    //   });

    //   // Estados para los archivos
    //   const [reciboPago, setReciboPago] = useState<File | null>(null);
    //   const [certificado, setCertificado] = useState<File | null>(null);
    //   const [reciboServicio, setReciboServicio] = useState<File | null>(null);

    //   // Estado para términos
    //   const [terminos, setTerminos] = useState(false);
    //   const [error, setError] = useState<string | null>(null);
    //   const [success, setSuccess] = useState(false);

    //   // Estado para las ofertas académicas activas
    //   const [ofertas, setOfertas] = useState<Record<string, OfertaCategoria[]>>({});
    //   const [loading, setLoading] = useState(true);

    // Carga las ofertas académicas al montar el componente

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
      ? ofertas[formData.oferta]?.map((ofertaCat) => ofertaCat.id_categoria) ||
        []
      : [];

    // Módulos disponibles según la categoría seleccionada Y el grado del estudiante
    const modulosDisponibles =
      formData.oferta && formData.area
        ? (
            ofertas[formData.oferta]?.find(
              (ofertaCat) =>
                ofertaCat.id_categoria.id_categoria === Number(formData.area),
            )?.modulo || []
          ).filter((modulo: Modulo) => {
            // Verificar si el grado del estudiante está en los grados del módulo
            if (modulo.dirigido_a) {
              const gradosArray = modulo.dirigido_a
                .split(",")
                .map((g) => g.trim());
              return gradosArray.includes(grado_form);
            }
            return false;
          })
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

    // const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault();

    //   const id_estudiante = localStorage.getItem("id_estudiante");

    //   if (tipoVinculacion_form !== "Becados" && !reciboPago) {
    //     alert("El recibo de pago es obligatorio");
    //     return;
    //   }

    //   if (tipoVinculacion_form === "Becados" && !reciboServicio) {
    //     alert("El recibo de servicios es obligatorio para becados");
    //     return;
    //   }

    //   // El certificado es obligatorio SOLO si NO es (estamento PRIVADO AND tipo_vinculacion Particular)
    //   const certificadoObligatorio = !(
    //     estamento_form === "PRIVADO" && formData.tipo_vinculacion === "Particular"
    //   );

    //   if (certificadoObligatorio && !certificado) {
    //     alert("El certificado es obligatorio");
    //     return;
    //   }

    //   console.log("Grado del usuario:", grado_form);
    //   console.log("Estamento del usuario:", estamento_form);
    //   console.log("ID del estudiante:", id_estudiante);

    //   if (!id_estudiante) {
    //     alert("No se encontró el id del estudiante.");
    //     return;
    //   }

    //   const formDataToSend = new FormData();
    //   formDataToSend.append("id_estudiante", id_estudiante);
    //   formDataToSend.append("id_modulo", formData.modulo);
    //   formDataToSend.append("tipo_vinculacion", formData.tipo_vinculacion);
    //   formDataToSend.append("terminos", terminos ? "True" : "False");

    //   if (reciboPago) {
    //     formDataToSend.append("recibo_pago", reciboPago);
    //   }
    //   if (certificado) {
    //     formDataToSend.append("certificado", certificado);
    //   }
    //   if (reciboServicio) {
    //     formDataToSend.append("recibo_servicio", reciboServicio);
    //   }

    //   // Imprime todos los datos que se van a enviar
    //   for (const pair of formDataToSend.entries()) {
    //     console.log(`${pair[0]}:`, pair[1]);
    //   }

    //   try {
    //     await axios.post(`${API_BASE_URL}/matricula/mat/`, formDataToSend, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     });
    //     setSuccess(true);
    //     router.push("/auth/matricula-finalizada"); // Redirige al login
    //   } catch (error) {
    //     console.error("Error al enviar la matrícula:", error);
    //     setError("Hubo un error al enviar la matrícula.");
    //   }
    // };

    if (loading) return <div>Cargando ofertas...</div>;

    return (
      <div className="mx-auto my-4 w-full rounded-2xl bg-white p-5 text-center shadow-md">
        <h2 className="text-center font-semibold text-primary">
          OFERTA ACADÉMICA Y MATRÍCULA
        </h2>

        {/* <form className="items-center" onSubmit={handleSubmit}> */}
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
            row={false}
            className="selects"
            aria-labelledby="tipo-vinculacion"
            name="tipo-vinculacion"
            value={formData.tipo_vinculacion}
            onChange={(e) =>
              setFormData({ ...formData, tipo_vinculacion: e.target.value })
            }
          >
            {tipoVinculacion_form === "Becados" ? (
              <>
                <FormControlLabel
                  value="Becados - Ins. Educativas (Docente Enlace)"
                  control={<Radio />}
                  label="Becados - Ins. Educativas (Docente Enlace)"
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
              </>
            ) : (
              <>
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
              </>
            )}
          </RadioGroup>
        </FormControl>

        <h2 className="my-4 text-center font-semibold text-primary">
          DOCUMENTACIÓN
        </h2>
        {/* Inputs para subir archivos */}
        <div className="flex flex-wrap justify-around gap-4 text-gray-600">
          {tipoVinculacion_form === "Becados" ? (
            <div className="my-4 flex flex-col gap-3">
              <InputLabel id="recibo-servicios-label" className="font-bold">
                Recibo de servicios
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                Elegir documento (PDF)
                <input
                  name="recibo_servicio"
                  type="file"
                  hidden
                  accept=".pdf"
                  // className="block w-1/2 text-sm text-gray-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReciboServicio(file);
                    }
                  }}
                />
              </Button>

              <h2>
                {" "}
                {reciboServicio
                  ? reciboServicio.name
                  : "No se ha seleccionado un recibo de servicios"}
              </h2>
            </div>
          ) : (
            <div className="my-4 flex flex-col gap-3">
              <InputLabel id="recibo-pago-label" className="font-bold">
                Recibo de pago
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                Elegir documento (PDF)
                <input
                  name="recibo_pago"
                  type="file"
                  hidden
                  accept=".pdf"
                  // className="block w-1/2 text-sm text-gray-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReciboPago(file);
                    }
                  }}
                />
              </Button>

              <h2>
                {reciboPago ? (
                  <>
                    {reciboPago.size / (1024 * 1024) > 2 && (
                      <span style={{ color: "red", marginLeft: "8px" }}>
                        ⚠️ El documento excede 2 MB
                      </span>
                    )}
                    <br />
                    <span className="text-gray-600">
                      {reciboPago.name} -{" "}
                      {(reciboPago.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  "No se ha seleccionado documento"
                )}
              </h2>
            </div>
          )}
          {/* Mostrar solo si NO es estamento Privado con tipo de vinculación Particular */}
          {!(
            estamento_form === "PRIVADO" &&
            formData.tipo_vinculacion === "Particular"
          ) && (
            <div className="my-4 flex flex-col gap-3">
              <InputLabel id="certificado-label" className="font-bold">
                Certificado
              </InputLabel>
              <p>
                (Certificado de estudios, acta de grado, diploma, certificado
                relación Univalle)
              </p>
              <Button
                variant="contained"
                component="label"
                className="my-2 rounded-2xl bg-primary"
              >
                Elegir documento (PDF)
                <input
                  name="certificado"
                  type="file"
                  hidden
                  accept=".pdf"
                  // className="block w-1/2 text-sm text-gray-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCertificado(file);
                    }
                  }}
                />
              </Button>

              <h2>
                {certificado ? (
                  <>
                    {certificado.size / (1024 * 1024) > 2 && (
                      <span style={{ color: "red", marginLeft: "8px" }}>
                        ⚠️ El documento excede 2 MB
                      </span>
                    )}
                    <br />
                    <span className="text-gray-600">
                      {certificado.name} -{" "}
                      {(certificado.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  "No se ha seleccionado documento"
                )}
              </h2>
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
      </div>
    );
  },
);

Matricula.displayName = "Matricula";
export default Matricula;
