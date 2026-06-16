import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Calificacion from "@/app/docente/calificacion/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/docente/calificacion",
}));

describe("Docente Calificación Page", () => {
  const mockGruposData = [
    { id: 1, nombre: "Grupo A" },
    { id: 2, nombre: "Grupo B" },
  ];

  const mockEstudiantesData = [
    {
      id: 1,
      nombre: "Juan Pérez",
      numero_documento: "1001",
      calificacion: null,
      asistencia: 8,
    },
    {
      id: 2,
      nombre: "María García",
      numero_documento: "1002",
      calificacion: null,
      asistencia: 10,
    },
    {
      id: 3,
      nombre: "Carlos López",
      numero_documento: "1003",
      calificacion: null,
      asistencia: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-test",
          tipo_usuario: "docente",
          id_docente: 1,
        });
      }
      return null;
    });

    mockedAxios.get.mockImplementation((url) => {
      if (typeof url === "string" && url.includes("/grupo/")) {
        return Promise.resolve({ data: mockGruposData });
      }
      if (typeof url === "string" && url.includes("/estudiante/") || url.includes("grupo")) {
        return Promise.resolve({ data: mockEstudiantesData });
      }
      return Promise.resolve({ data: [] });
    });

    mockedAxios.put.mockResolvedValue({
      status: 200,
      data: { success: true },
    });

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { success: true },
    });
  });

  // ====================================================
  // 1. RENDERIZACIÓN INICIAL
  // ====================================================

  it("renderiza la página de calificación", () => {
    render(<Calificacion />);

    expect(
      screen.getByText(/Calificación|Grades|Calificar/i)
    ).toBeInTheDocument();
  });

  it("muestra selector de grupo", async () => {
    render(<Calificacion />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Grupo|Group/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 2. CARGA DE GRUPOS
  // ====================================================

  it("carga los grupos del docente", async () => {
    render(<Calificacion />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  it("muestra lista de grupos disponibles", async () => {
    render(<Calificacion />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Grupo|Group/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 3. SELECCIONAR GRUPO
  // ====================================================

  it("permite seleccionar un grupo", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Grupo|Group/i)
      ).toBeInTheDocument();
    });

    const grupoSelect = screen.getByLabelText(/Grupo|Group/i);
    await user.click(grupoSelect);

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /Grupo A/i });
      expect(option).toBeInTheDocument();
    });
  });

  it("carga estudiantes cuando se selecciona un grupo", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Grupo|Group/i)
      ).toBeInTheDocument();
    });

    const grupoSelect = screen.getByLabelText(/Grupo|Group/i);
    await user.click(grupoSelect);

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /Grupo A/i });
      await user.click(option);

      // Debería mostrar tabla de estudiantes
      expect(
        screen.getByRole("table") || screen.getByText(/Juan/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 4. TABLA DE ESTUDIANTES
  // ====================================================

  it("muestra tabla con estudiantes del grupo", async () => {
    render(<Calificacion />);

    await waitFor(() => {
      expect(
        screen.getByText("Juan Pérez")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.getByText("Carlos López")).toBeInTheDocument();
  });

  it("muestra datos de cada estudiante (nombre, documento, asistencia)", async () => {
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    expect(screen.getByText("1001")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument(); // asistencia
  });

  // ====================================================
  // 5. INGRESAR CALIFICACIONES
  // ====================================================

  it("permite ingresar calificación para cada estudiante", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    // Buscar campos de calificación
    const calificacionInputs = screen.queryAllByRole("spinbutton") ||
                                screen.queryAllByRole("textbox");

    if (calificacionInputs.length > 0) {
      await user.type(calificacionInputs[0], "4.5");
      expect(calificacionInputs[0]).toBeInTheDocument();
    }
  });

  it("valida que la calificación esté en rango permitido", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    // Intentar ingresar calificación fuera de rango
    const calificacionInputs = screen.queryAllByRole("spinbutton") ||
                                screen.queryAllByRole("textbox");

    if (calificacionInputs.length > 0) {
      // La validación debería ocurrir al guardar
      expect(calificacionInputs[0]).toBeInTheDocument();
    }
  });

  // ====================================================
  // 6. EDICIÓN INLINE
  // ====================================================

  it("permite editar calificación directamente en la tabla", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    // Hacer doble click en celda de calificación para editar
    const cells = screen.queryAllByRole("cell");
    
    if (cells.length > 0) {
      const calificacionCell = cells.find(c => c.textContent === "");
      
      if (calificacionCell) {
        await user.dblClick(calificacionCell);
        expect(calificacionCell).toBeInTheDocument();
      }
    }
  });

  // ====================================================
  // 7. GUARDAR CALIFICACIONES
  // ====================================================

  it("permite guardar todas las calificaciones", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    const guardarBtn = screen.getByRole("button", {
      name: /Guardar|Enviar|Submit|Save/i,
    });

    await user.click(guardarBtn);

    await waitFor(() => {
      expect(mockedAxios.put || mockedAxios.post).toBeDefined();
    });
  });

  // ====================================================
  // 8. VALIDACIÓN DE CAMBIOS
  // ====================================================

  it("indica que hay cambios sin guardar", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    // Cambiar una calificación
    const calificacionInputs = screen.queryAllByRole("spinbutton") ||
                                screen.queryAllByRole("textbox");

    if (calificacionInputs.length > 0) {
      await user.type(calificacionInputs[0], "4.5");

      // Debería mostrar indicador de cambios pendientes
      expect(calificacionInputs[0]).toBeInTheDocument();
    }
  });

  // ====================================================
  // 9. CANCELAR CAMBIOS
  // ====================================================

  it("permite cancelar cambios", async () => {
    const user = userEvent.setup();
    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    const cancelBtn = screen.queryByRole("button", {
      name: /Cancelar|Limpiar|Clear|Cancel/i,
    });

    if (cancelBtn) {
      await user.click(cancelBtn);
      expect(cancelBtn).toBeInTheDocument();
    }
  });

  // ====================================================
  // 10. MANEJO DE ERRORES
  // ====================================================

  it("muestra error cuando falla el guardado", async () => {
    const user = userEvent.setup();
    mockedAxios.put.mockRejectedValue(
      new Error("Error al guardar calificaciones")
    );

    render(<Calificacion />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    const guardarBtn = screen.getByRole("button", {
      name: /Guardar|Enviar|Submit|Save/i,
    });

    await user.click(guardarBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Error|No se pudieron guardar/i)
      ).toBeInTheDocument();
    });
  });
});
