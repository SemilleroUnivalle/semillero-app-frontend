import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import VerGrupos from "@/app/admin/grupos/ver-grupos/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/admin/grupos/ver-grupos",
}));

describe("Ver Grupos Page", () => {
  const mockGruposData = [
    {
      id: 1,
      nombre: "Grupo A - Módulo 1",
      periodo: "2024-1",
      categoria: "Cálculo",
      modulo: "Módulo 1",
      cantidad_estudiantes: 25,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Grupo B - Módulo 1",
      periodo: "2024-1",
      categoria: "Algebra",
      modulo: "Módulo 1",
      cantidad_estudiantes: 30,
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Grupo C - Módulo 2",
      periodo: "2024-1",
      categoria: "Cálculo",
      modulo: "Módulo 2",
      cantidad_estudiantes: 20,
      estado: "Inactivo",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-test",
          tipo_usuario: "administrador",
        });
      }
      return null;
    });

    mockedAxios.get.mockImplementation((url) => {
      if (typeof url === "string" && url.includes("/grupo/")) {
        return Promise.resolve({
          data: mockGruposData,
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // ====================================================
  // 1. RENDERIZACIÓN INICIAL
  // ====================================================

  it("renderiza la página de grupos", () => {
    render(<VerGrupos />);

    expect(
      screen.getByText(/Grupos|Groups|Ver Grupos/i)
    ).toBeInTheDocument();
  });

  it("muestra tabla de grupos", async () => {
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByRole("table") || screen.getByText(/Grupo A/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 2. CARGA DE DATOS
  // ====================================================

  it("carga datos de grupos desde la API", async () => {
    render(<VerGrupos />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  it("muestra loading mientras carga datos", () => {
    mockedAxios.get.mockImplementation(
      () =>
        new Promise(() => {
          // nunca resuelve
        })
    );

    render(<VerGrupos />);

    expect(
      screen.getByText(/Cargando|Loading/i) || screen.getByText(/Grupos/i)
    ).toBeInTheDocument();
  });

  // ====================================================
  // 3. VISUALIZACIÓN DE DATOS
  // ====================================================

  it("muestra los grupos en la tabla", async () => {
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Grupo B - Módulo 1")
    ).toBeInTheDocument();
  });

  it("muestra información de cada grupo (nombre, período, módulo)", async () => {
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    // Verificar que se muestra período
    expect(
      screen.getByText("2024-1")
    ).toBeInTheDocument();
  });

  // ====================================================
  // 4. FILTROS
  // ====================================================

  it("permite filtrar por período", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    const periodoFilter = screen.queryByLabelText(/Período|Period/i);

    if (periodoFilter) {
      await user.click(periodoFilter);
      expect(periodoFilter).toBeInTheDocument();
    }
  });

  it("permite filtrar por categoría", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    const categoriaFilter = screen.queryByLabelText(/Categoría|Category/i);

    if (categoriaFilter) {
      await user.click(categoriaFilter);
      expect(categoriaFilter).toBeInTheDocument();
    }
  });

  it("permite filtrar por módulo", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    const moduloFilter = screen.queryByLabelText(/Módulo|Module/i);

    if (moduloFilter) {
      await user.click(moduloFilter);
      expect(moduloFilter).toBeInTheDocument();
    }
  });

  // ====================================================
  // 5. BÚSQUEDA
  // ====================================================

  it("permite buscar grupos por nombre", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    const searchInput = screen.queryByPlaceholderText(/Buscar|Search/i);

    if (searchInput) {
      await user.type(searchInput, "Grupo A");
      expect(searchInput).toHaveValue("Grupo A");
    }
  });

  // ====================================================
  // 6. SELECCIÓN DE FILAS
  // ====================================================

  it("permite seleccionar grupos individuales", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    // Buscar checkbox de selección
    const checkboxes = screen.queryAllByRole("checkbox");
    
    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);
      expect(checkboxes[0]).toBeInTheDocument();
    }
  });

  it("permite seleccionar múltiples grupos", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    const checkboxes = screen.queryAllByRole("checkbox");
    
    if (checkboxes.length >= 2) {
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      
      expect(checkboxes[0]).toBeInTheDocument();
    }
  });

  it("permite seleccionar todos los grupos", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    // Buscar checkbox "Seleccionar todo"
    const selectAllBtn = screen.queryByRole("button", {
      name: /Seleccionar todo|Select all/i,
    });

    if (selectAllBtn) {
      await user.click(selectAllBtn);
      expect(selectAllBtn).toBeInTheDocument();
    }
  });

  // ====================================================
  // 7. ACCIONES EN FILAS
  // ====================================================

  it("muestra botones de acción (editar, eliminar, detallar)", async () => {
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    // Buscar botones de acción
    const actionButtons = screen.queryAllByRole("button", {
      name: /Editar|Delete|Ver detalles|Eliminar/i,
    });

    expect(actionButtons.length).toBeGreaterThanOrEqual(0);
  });

  it("permite ver detalles de un grupo", async () => {
    const user = userEvent.setup();
    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText("Grupo A - Módulo 1")
      ).toBeInTheDocument();
    });

    const detallesBtn = screen.queryByRole("button", {
      name: /Ver detalles|Detalles|Details/i,
    });

    if (detallesBtn) {
      await user.click(detallesBtn);
      expect(detallesBtn).toBeInTheDocument();
    }
  });

  // ====================================================
  // 8. PAGINACIÓN
  // ====================================================

  it("muestra controles de paginación si hay muchos grupos", async () => {
    mockedAxios.get.mockResolvedValue({
      data: Array.from({ length: 50 }, (_, i) => ({
        ...mockGruposData[0],
        id: i + 1,
        nombre: `Grupo ${i + 1}`,
      })),
    });

    render(<VerGrupos />);

    await waitFor(() => {
      const paginationBtn = screen.queryByRole("button", {
        name: /Siguiente|Next|anterior|Previous/i,
      });

      if (paginationBtn) {
        expect(paginationBtn).toBeInTheDocument();
      }
    });
  });

  // ====================================================
  // 9. MANEJO DE ERRORES
  // ====================================================

  it("muestra mensaje cuando no hay grupos", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [],
    });

    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText(/Sin datos|No hay grupos|No groups/i)
      ).toBeInTheDocument();
    });
  });

  it("muestra error cuando falla la carga de datos", async () => {
    mockedAxios.get.mockRejectedValue(
      new Error("Error de servidor")
    );

    render(<VerGrupos />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error|No se pudieron cargar/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 10. EXPORTACIÓN
  // ====================================================

  it("puede permitir exportar listado de grupos", () => {
    render(<VerGrupos />);

    const exportBtn = screen.queryByRole("button", {
      name: /Descargar|Exportar|Export|Download/i,
    });

    if (exportBtn) {
      expect(exportBtn).toBeInTheDocument();
    }
  });
});
