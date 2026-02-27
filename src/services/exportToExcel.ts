import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Matricula } from "@/interfaces/interfaces"; // Asegúrate de que esta ruta sea correcta para tus interfaces

export const exportMatriculasToExcel = (data: Matricula[]) => {
  // 🔹 Transformamos la estructura anidada a algo plano
  const formattedData = data.map((matricula) => ({
    //Matricula
    ID: matricula.id_inscripcion,
    Fecha_Inscripcion: matricula.fecha_inscripcion,

    // Estudiante
    Nombres: matricula.estudiante.nombre,
    Apellidos: matricula.estudiante.apellido,
    Documento: matricula.estudiante.numero_documento,
    Email: matricula.estudiante.email,
    Celular: matricula.estudiante.celular,
    Grado: matricula.estudiante.grado,
    Colegio: matricula.estudiante.colegio,
    Estamento: matricula.estudiante.estamento,

    Nombre_Acudiente:
      matricula.estudiante.acudiente.nombre_acudiente +
      " " +
      matricula.estudiante.acudiente.apellido_acudiente,
    Celular_Acudiente: matricula.estudiante.acudiente.celular_acudiente,
    Email_Acudiente: matricula.estudiante.acudiente.email_acudiente,

    // Oferta
    Oferta: matricula.oferta_categoria.id_oferta_academica.nombre,

    // Módulo
    Modulo: matricula.modulo.nombre_modulo,

    //Matricula
    Tipo_Vinculacion: matricula.tipo_vinculacion,
    Estado: matricula.estado,

    // Documentos
    Recibo_Pago: matricula.recibo_pago,
    Certificado: matricula.certificado,
    Recibo_Servicio: matricula.recibo_servicio,

  }));

  // 🔹 Crear hoja
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 🔹 Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Matriculas");

  // 🔹 Generar archivo
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, "matriculas.xlsx");
};
