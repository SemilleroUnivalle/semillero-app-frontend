export interface Departamento {
  id: number;
  nombre: string;
}
export interface DepartamentoApi {
  id: number;
  name: string;
}
export interface Ciudad {
  id: number;
  nombre: string;
}
export interface CiudadApi {
  id: number;
  name: string;
}

export interface Acudiente {
  id_acudiente: number;
  nombre_acudiente: string;
  apellido_acudiente: string;
  tipo_documento_acudiente: string;
  numero_documento_acudiente: string;
  celular_acudiente: string;
  email_acudiente: string;
}

export interface AuditInterface {
  id: number;
  usuario: string;
  timestamp: string;
}

export interface Estudiante {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  tipo_documento: string;
  fecha_nacimiento: string;
  genero: string;
  email: string;
  celular: string;
  telefono_fijo: string;
  departamento_residencia: string;
  ciudad_residencia: string;
  comuna_residencia: string;
  direccion_residencia: string;
  colegio: string;
  grado: string;
  estamento: string;
  eps: string;
  area_desempeño: string;
  grado_escolaridad: string;
  discapacidad: boolean;
  descripcion_discapacidad: string;
  tipo_discapacidad: string;
  is_active: boolean;
  acudiente: Acudiente;
  verificacion_informacion: boolean | null;
  verificacion_foto: boolean | null;
  verificacion_documento_identidad: boolean | null;
  audit_foto: AuditInterface | null;
  audit_documento_identidad: AuditInterface | null;
  audit_informacion: AuditInterface | null;
  foto: string | null;
  documento_identidad: string | null;
  estado: string;
}

export interface ProfesorInterface {
  id: number | null;
  nombre: string;
  apellido: string;
  numero_documento: string;
  tipo_documento: string;
  fecha_nacimiento: string;
  genero: string;
  email: string;
  celular: string;
  telefono_fijo: string;
  departamento_residencia: string;
  ciudad_residencia: string;
  comuna_residencia: string;
  direccion_residencia: string;
  area_desempeño: string;
  eps: string;
  is_active: boolean;
  grado_escolaridad: string;
  foto: string | null;
  documento_identidad_pdf: string | null;
  rut_pdf: string | null;
  certificado_laboral_pdf: string | null;
  certificado_bancario_pdf: string | null;
  hoja_vida_pdf: string | null;
  certificado_academico_pdf: string | null;
  modulo: Modulo;
  colegio?: string;
  estamento?: string;
}

export interface Area {
  id_area: string;
  nombre_area: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  estado: boolean;
}

export interface Modulo {
  id_modulo: number;
  id_categoria: Categoria;
  nombre_modulo: string;
  descripcion_modulo: string;
  intensidad_horaria: number;
  dirigido_a: string | null;
  incluye: string | null;
  imagen_modulo: string | null;
  estado: boolean;
  id_area: Area;
  id_oferta_categoria: number[];
}

export interface OfertaAcademica {
  id_oferta_academica: number;
  nombre: string;
  fecha_inicio: string;
  estado: boolean;
}

export interface OfertaCategoria {
  id_oferta_categoria: number;
  id_oferta_academica: OfertaAcademica;
  modulo: Modulo[];
  precio_publico: string;
  precio_privado: string;
  precio_univalle: string;
  precio_univalle_egresados: string | null;
  fecha_finalizacion: string;
  estado: boolean;
  id_categoria: Categoria;
}

export interface Matricula {
  id_inscripcion: number;
  modulo: Modulo;
  estudiante: Estudiante;
  oferta_categoria: OfertaCategoria;
  estado: string;
  grupo: string;
  fecha_inscripcion: string;
  tipo_vinculacion: string;
  terminos: boolean;
  observaciones: string | null;
  recibo_pago: string;
  certificado: string;
  recibo_servicio: string;
  verificacion_recibo_pago: boolean | null;
  verificacion_certificado: boolean | null;
  audit_documento_recibo_pago: AuditInterface | null;
  audit_certificado: AuditInterface | null;
}

export interface Grupo {
  id: number;
  nombre: string;
  profesor: ProfesorInterface;
  monitor_academico: ProfesorInterface;
}

// Estudiante mínimo incluido dentro de la inscripción
export interface EstudianteRef {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  email: string;
  colegio: string;
}

// Referencia a la inscripción usada en la asistencia
export interface InscripcionRef {
  id_estudiante: EstudianteRef;
  grupo_view: Grupo;
  modulo: Modulo;
  periodo: OfertaAcademica;
}

export interface AsistenciaResponse {
  id_asistencia: number;
  id_inscripcion: InscripcionRef;
  fecha_asistencia: string;
  estado_asistencia: string;
  comentarios: string;
  sesion: string;
}

export interface AsistenciaSent {
  id_inscripcion_id: number;
  fecha_asistencia: string;
  estado_asistencia: string;
  comentarios: string;
  sesion?: string;
}

// Pruebas Diagnosticas Interfaces

export interface Respuesta {
  id_respuesta: number;
  texto_respuesta: string;
  es_correcta: boolean;
  fecha_creacion: string;
}

export interface Pregunta {
  id_pregunta: number;
  texto_pregunta: string;
  tipo_pregunta: string;
  puntaje: string;
  imagen: string | null;
  explicacion: string;
  estado: boolean;
  fecha_creacion: string;
  respuestas: Respuesta[];
}

export interface PruebaDiagnostica {
  id_prueba: number;
  id_modulo: Modulo;
  nombre_prueba: string;
  descripcion: string;
  tiempo_limite: number;
  puntaje_minimo: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  preguntas: Pregunta[];
  total_preguntas: number;
}

export const grados: string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "EGRESADO",
  "DOCENTE",
];

export const generos = ["Masculino", "Femenino"];

export const epss = [
  "Emssanar",
  "Sura",
  "Sanitas",
  "Nueva EPS",
  "Compensar",
  "Coomeva",
  "Salud Total",
  "Famisanar",
  "Cafesalud",
  "Medimás",
  "SOS",
  "Cruz Blanca",
  "Aliansalud",
  "Colsubsidio",
  "Ecoopsos",
  "Comfenalco Valle",
  "Comfandi",
  "Mutual Ser",
  "Caprecom",
  "EPS Convida",
  "EPS Savia Salud",
  "EPS Comfachocó",
  "EPS Comfaoriente",
];