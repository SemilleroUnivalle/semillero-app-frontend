// Mock data for dashboard statistics with detailed information for filtering
export interface Module {
  name: string
  area: string
  enrollments: number
}

export interface GenderDistribution {
  gender: string
  count: number
  percentage: number
}

export interface EstamentoData {
  estamento: string
  count: number
  percentage: number
}

export interface ModuleGenderData {
  module: string
  male: number
  female: number
  other: number
}

export interface EstratoData {
  estrato: string
  count: number
}

export interface VinculacionData {
  type: string
  count: number
}

export interface MunicipioData {
  municipality: string
  count: number
}

export interface DashboardFilters {
  period: string
  module: string
  estamento: string
  gender: string
}

// Database structure with complete data
const COMPLETE_DATA = {
  periods: ["2024-1", "2024-2", "2025-1", "2025-2"],
  modules: [
    { name: "Álgebra y Cálculo", area: "Matemáticas" },
    { name: "Geometría Analítica", area: "Matemáticas" },
    { name: "Trigonometría Aplicada", area: "Matemáticas" },
    { name: "Estadística y Probabilidad", area: "Matemáticas" },
    { name: "Biología Molecular", area: "Biología" },
    { name: "Ecología y Ecosistemas", area: "Biología" },
    { name: "Anatomía Humana", area: "Biología" },
    { name: "Genética y Evolución", area: "Biología" },
    { name: "Lengua Española", area: "Lenguaje" },
    { name: "Literatura Colombiana", area: "Lenguaje" },
    { name: "Oratoria y Comunicación", area: "Lenguaje" },
    { name: "Escritura Creativa", area: "Lenguaje" },
    { name: "Física Clásica", area: "Física" },
    { name: "Termodinámica", area: "Física" },
    { name: "Óptica y Ondas", area: "Física" },
    { name: "Electromagnetismo", area: "Física" },
    { name: "Técnicas Teatrales", area: "Teatro" },
    { name: "Actuación y Dirección", area: "Teatro" },
    { name: "Historia del Teatro", area: "Teatro" },
    { name: "Teoría Musical Básica", area: "Música" },
    { name: "Instrumentos de Viento", area: "Música" },
    { name: "Composición y Armonía", area: "Música" },
    { name: "Historia de la Música", area: "Música" },
  ],
  estamentos: ["Público", "Privado", "Cobertura"],
  vinculacionTypes: ["Particular", "Becados", "Relación Univalle", "Hijos de egresados", "Convenios colegio"],
  grados: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Egresados"],
};

// Generate mock students data based on filters
function generateStudentData(filters: DashboardFilters) {
  const { period, module, estamento, gender } = filters;

  // Base calculation - more students in recent periods
  const periodMultiplier = {
    "2024-1": 0.6,
    "2024-2": 0.75,
    "2025-1": 0.9,
    "2025-2": 1.0,
  }[period] || 1.0;

  const baseEnrollments = 170;
  const totalEnrollments = Math.round(baseEnrollments * periodMultiplier);
  const notEnrolled = Math.round(totalEnrollments * 0.15);
  const enrolled = totalEnrollments - notEnrolled;

  // Generate module data
  let moduleData: Module[] = [];
  if (module === "todos") {
    moduleData = COMPLETE_DATA.modules.map((m) => ({
      ...m,
      enrollments: Math.round((enrolled / COMPLETE_DATA.modules.length) * (0.8 + Math.random() * 0.4)),
    }));
  } else {
    const selectedModule = COMPLETE_DATA.modules.find((m) => m.name === module);
    moduleData = selectedModule ? [{ ...selectedModule, enrollments: enrolled }] : [];
  }

  // Generate gender distribution
  let maleCount = Math.round(enrolled * 0.55);
  let femaleCount = Math.round(enrolled * 0.42);
  let otherCount = enrolled - maleCount - femaleCount;

  if (gender !== "todos") {
    if (gender === "masculino") {
      maleCount = enrolled;
      femaleCount = 0;
      otherCount = 0;
    } else if (gender === "femenino") {
      maleCount = 0;
      femaleCount = enrolled;
      otherCount = 0;
    }
  }

  const genderData: GenderDistribution[] = [
    { gender: "Masculino", count: maleCount, percentage: Math.round((maleCount / enrolled) * 100) },
    { gender: "Femenino", count: femaleCount, percentage: Math.round((femaleCount / enrolled) * 100) },
    { gender: "Otro", count: otherCount, percentage: Math.round((otherCount / enrolled) * 100) },
  ].filter((g) => g.count > 0);

  // Generate estamento distribution
  let estamentoData: EstamentoData[] = [];
  if (estamento === "todos") {
    const publicoCount = Math.round(enrolled * 0.50);
    const privadoCount = Math.round(enrolled * 0.35);
    const coberturaCount = enrolled - publicoCount - privadoCount;
    estamentoData = [
      { estamento: "Público", count: publicoCount, percentage: 50 },
      { estamento: "Privado", count: privadoCount, percentage: 35 },
      { estamento: "Cobertura", count: coberturaCount, percentage: 15 },
    ];
  } else {
    estamentoData = [{ estamento, count: enrolled, percentage: 100 }];
  }

  // Generate socioeconomic strata distribution
  const estratoData: EstratoData[] = [
    { estrato: "1", count: Math.round(enrolled * 0.32) },
    { estrato: "2", count: Math.round(enrolled * 0.25) },
    { estrato: "3", count: Math.round(enrolled * 0.20) },
    { estrato: "4", count: Math.round(enrolled * 0.15) },
    { estrato: "5", count: Math.round(enrolled * 0.06) },
    { estrato: "6", count: Math.round(enrolled * 0.02) },
  ];

  // Generate vinculación distribution
  const vinculacionData: VinculacionData[] = [
    { type: "Particular", count: Math.round(enrolled * 0.35) },
    { type: "Becados", count: Math.round(enrolled * 0.25) },
    { type: "Relación Univalle", count: Math.round(enrolled * 0.20) },
    { type: "Hijos de egresados", count: Math.round(enrolled * 0.12) },
    { type: "Convenios colegio", count: Math.round(enrolled * 0.08) },
  ];

  // Generate municipio distribution
  const municipios = [
    "Cali",
    "Palmira",
    "Buenaventura",
    "Cartago",
    "Tuluá",
    "Buga",
    "Yumbo",
    "Jamundí",
    "Otros",
  ];
  const municipioData: MunicipioData[] = municipios.map((m, index) => ({
    municipality: m,
    count: Math.round(enrolled * (index === 0 ? 0.35 : index === 1 ? 0.15 : 0.05)),
  }));

  // Generate module gender breakdown
  const moduleGenderData = moduleData.map((m) => {
    const male = Math.round((m.enrollments * maleCount) / enrolled);
    const female = Math.round((m.enrollments * femaleCount) / enrolled);
    const other = m.enrollments - male - female;
    return {
      moduleName: m.name,
      genderBreakdown: {
        "Masculino": male,
        "Femenino": female,
        "Otro": other,
      },
    };
  });

  return {
    moduleData,
    genderData,
    estamentoData,
    estratoData,
    vinculacionData,
    municipioData,
    moduleGenderData,
    totalEnrollments: enrolled,
    totalNotEnrolled: notEnrolled,
    totalRegister: totalEnrollments,
    totalProfessors: Math.round(enrolled / 15),
    totalMonitors: Math.round(enrolled / 25),
    activeModules: module === "todos" ? COMPLETE_DATA.modules.length : 1,
  };
}

export function getMockDashboardData(filters: DashboardFilters) {
  const data = generateStudentData(filters);

  // Generate grade distribution (Grados 1-11 y Egresados)
  const totalEnrolled = data.totalEnrollments;
  const gradesDistribution = [
    { grade: "Grado 1", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 2", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 3", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 4", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 5", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 6", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 7", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 8", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 9", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 10", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Grado 11", count: Math.round(totalEnrolled * 0.08) },
    { grade: "Egresados", count: totalEnrolled - Math.round(totalEnrolled * 0.88) },
  ];

  return {
    enrollmentsByModule: data.moduleData,
    enrollmentsByModuleAndGender: data.moduleGenderData,
    enrollmentsByGrade: gradesDistribution,
    enrollmentsByEstamento: data.estamentoData,
    genderDistribution: data.genderData,
    estratoDistribution: data.estratoData,
    vinculacionDistribution: data.vinculacionData,
    municipioDistribution: data.municipioData,
    totalEnrollments: data.totalEnrollments,
    totalRegister: data.totalRegister,
    inscritosMatriculados: Math.round((data.totalEnrollments / data.totalRegister) * 100),
    inscritosNoMatriculados: 100 - Math.round((data.totalEnrollments / data.totalRegister) * 100),
    totalProfessors: data.totalProfessors,
    totalMonitors: data.totalMonitors,
    activeModules: data.activeModules,
  };
}

export function getPeriods() {
  return COMPLETE_DATA.periods;
}

export function getModules() {
  return ["todos", ...COMPLETE_DATA.modules.map((m) => m.name)];
}

export function getEstamentos() {
  return ["todos", ...COMPLETE_DATA.estamentos];
}

export function getGenders() {
  return ["todos", "masculino", "femenino", "otro"];
}

export function getVinculacionTypes() {
  return COMPLETE_DATA.vinculacionTypes;
}

export function getGrados() {
  return COMPLETE_DATA.grados;
}
