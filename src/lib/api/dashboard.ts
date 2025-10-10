import client from "./client";

export interface DashboardData {
  totalEnrollments: number
  activeModules: number
  enrollmentsByModule: Array<{
    name: string
    enrollments: number
    area: string
  }>
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
  const res = await client.get("/matricula/mat/dashboard/"); // ajusta la ruta si tu endpoint es diferente
  return res.data as DashboardData;
}

export default fetchDashboardData;
