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
  documento_identidad: string |  null;
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
  id_area: number;
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
  modulo: Modulo;
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
  verificacion_recibo_pago: boolean | null;
  verificacion_certificado: boolean | null;
  audit_documento_recibo_pago: AuditInterface | null;
  audit_certificado: AuditInterface | null;
}