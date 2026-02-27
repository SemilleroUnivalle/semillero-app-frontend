import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Matricula } from "@/interfaces/interfaces"; // Asegúrate de que esta ruta sea correcta para tus interfaces

export const exportMatriculasToExcel = (data: Matricula[]) => {
  // 🔹 Transformamos la estructura anidada a algo plano
  const formattedData = data.map((matricula) => ({
    ID: matricula.id_inscripcion,
    Estado: matricula.estado,
    Grupo: matricula.grupo,
    Fecha_Inscripcion: matricula.fecha_inscripcion,
    Tipo_Vinculacion: matricula.tipo_vinculacion,

    // Estudiante
    Nombre: `${matricula.estudiante.nombre} ${matricula.estudiante.apellido}`,
    Documento: matricula.estudiante.numero_documento,
    Email: matricula.estudiante.email,
    Celular: matricula.estudiante.celular,
    Ciudad: matricula.estudiante.ciudad_residencia,

    // Módulo
    Modulo: matricula.modulo.nombre_modulo,

    // Oferta
    Oferta: matricula.oferta_categoria.id_oferta_academica.nombre,
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