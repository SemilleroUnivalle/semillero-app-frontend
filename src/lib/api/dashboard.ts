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
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const res = await client.get("/matricula/mat/dashboard/");
  return res.data as DashboardData;
}

export default fetchDashboardData;