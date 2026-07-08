import client from "./client";

// Interfaz para el desglose de género dentro de un módulo
export interface ModuleGenderBreakdown {
  [gender: string]: number; // Por ejemplo: { "Femenino": 60, "Masculino": 40, "Otro": 5 }
}

// Interfaz para la data cruzada de inscripciones por módulo y género
export interface ModuleGenderEnrollment {
  moduleName: string;
  genderBreakdown: ModuleGenderBreakdown;
}

export interface FilterOptions {
  modules: Array<{ id_modulo: number; nombre_modulo: string; id_area_id: number }>;
  areas: Array<{ id_area: number; nombre_area: string }>;
  vinculaciones: string[];
  estamentos: string[];
}

export interface DashboardData {
  totalEnrollments: number
  totalRegister: number
  activeModules: number
  totalProfessors: number
  totalMonitors: number
  inscritosMatriculados: number
  inscritosNoMatriculados: number
  enrollmentsByModule: Array<{
    name: string
    enrollments: number
    area: string
  }>
  enrollmentsByModuleAndGender: ModuleGenderEnrollment[]
  enrollmentsByEstamento: Array<{
    estamento: string
    count: number
    percentage: number
  }>
  enrollmentsByGrade: Array<{
    grade: string
    count: number
  }>
  recentEnrollments: Array<{
    id: number
    studentName: string
    module: string
    date: string
    status: string
  }>
  genderDistribution: Array<{
    gender: string
    count: number
  }>
  estratoDistribution?: Array<{
    estrato: string
    count: number
  }>
  vinculacionDistribution?: Array<{
    type: string
    count: number
  }>
  municipioDistribution?: Array<{
    municipality: string
    count: number
  }>
  filterOptions?: FilterOptions
}

export interface Period {
  id_oferta_academica: number;
  nombre: string;
  estado: string;
}

export const isPeriodActive = (p: Period) => {
  const s = p.estado?.toString().toLowerCase();
  return s === "en inscripcion" || s === "inscripciones" || s === "inscripcion" || s === "en desarrollo" || s === "true" || s === "activo";
};

export const isInRegistration = (p: Period) => {
  const s = p.estado?.toString().toLowerCase();
  return s === "en inscripcion" || s === "inscripciones" || s === "inscripcion";
};


export async function fetchDashboardData(
  periodId?: number | string,
  moduloId?: number | string,
  areaId?: number | string,
  tipoVinculacion?: string,
  estamento?: string
): Promise<DashboardData> {
  const params: Record<string, any> = {};
  if (periodId && periodId !== "all") params.periodo = periodId;
  if (moduloId && moduloId !== "all") params.modulo = moduloId;
  if (areaId && areaId !== "all") params.area = areaId;
  if (tipoVinculacion && tipoVinculacion !== "all") params.tipo_vinculacion = tipoVinculacion;
  if (estamento && estamento !== "all") params.estamento = estamento;

  const res = await client.get("/inscripcion/dashboard/", { params });
  return res.data as DashboardData;
}

export async function fetchPeriods(): Promise<Period[]> {
  const res = await client.get("/oferta_academica/");
  return res.data as Period[];
}

export default fetchDashboardData;