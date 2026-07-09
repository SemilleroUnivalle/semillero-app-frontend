"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import Matricula from "@/components/matricula-form";
import { Estudiante } from "@/interfaces/interfaces";

export default function NuevaMatricula() {
  const router = useRouter();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(false);

  const matriculaFormRef = useRef<{
    getFormData: () => {
      oferta: string;
      modulo: string;
      tipo_vinculacion: string;
      terminos: boolean;
      reciboPago: File | null;
      certificado: File | null;
      reciboServicio: File | null;
      id_oferta_categoria: string;
    };
    validate: () => boolean;
  }>(null);

  useEffect(() => {
    const estudianteStorage = localStorage.getItem("estudiante");
    if (estudianteStorage) {
      setEstudiante(JSON.parse(estudianteStorage));
    }
  }, []);

  const handleRegistrar = async () => {
    // Validar el formulario

    if (matriculaFormRef.current && !matriculaFormRef.current.validate()) {
      alert("Por favor completa todos los campos del formulario de matrícula");
      return;
    }

    setLoading(true);

    try {
      const matriculaData = matriculaFormRef.current?.getFormData();

      // Crear FormData para enviar archivos
      const matriculaFormData = new FormData();

      matriculaFormData.append("id_oferta_categoria", matriculaData?.id_oferta_categoria || "");

      matriculaFormData.append(
        "id_estudiante",
        estudiante?.id_estudiante.toString() || "",
      );
      matriculaFormData.append("id_modulo", matriculaData?.modulo || "");
      matriculaFormData.append(
        "tipo_vinculacion",
        matriculaData?.tipo_vinculacion || "",
      );
      matriculaFormData.append(
        "terminos",
        matriculaData?.terminos ? "True" : "False",
      );

      if (matriculaData?.reciboPago) {
        matriculaFormData.append("recibo_pago", matriculaData.reciboPago);
      }
      if (matriculaData?.certificado) {
        matriculaFormData.append("certificado", matriculaData.certificado);
      }
      if (matriculaData?.reciboServicio) {
        matriculaFormData.append(
          "recibo_servicio",
          matriculaData.reciboServicio,
        );
      }

      console.log("FormData a enviar:", matriculaFormData);
      for (const [key, value] of matriculaFormData.entries()) {
        console.log(key, value);
      }

      // Hacer la solicitud POST
      const response = await axios.post(
        `${API_BASE_URL}/inscripcion/`,
        matriculaFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Si es exitoso
      if (response.status === 201 || response.status === 200) {
        alert("¡Matrícula registrada exitosamente!");
        router.push("/estudiante/matriculas"); // o la ruta que corresponda
      }
    } catch (error: any) {
      console.error("Error al registrar matrícula:", error);
      alert(
        error.response?.data?.message ||
          "Error al registrar la matrícula. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-10 mt-10 w-11/12">
      <Matricula
        ref={matriculaFormRef}
        estamento_form={estudiante?.estamento || ""}
        grado_form={estudiante?.grado || ""}
        tipoVinculacion_form={""}
      />
      <div className="my-4 rounded-2xl bg-white p-5 text-center shadow-sm">
        <Button
          onClick={handleRegistrar}
          disabled={loading}
          variant="outlined"
          className="m-auto w-full rounded-2xl border-2 border-[#C20E1A] py-2 font-semibold text-[#C20E1A] transition hover:bg-[#C20E1A] hover:text-white md:w-1/4"
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </div>
  );
}
