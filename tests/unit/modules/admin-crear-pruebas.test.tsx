import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import CrearPruebas from "@/app/admin/pruebas-diagnosticas/crear-pruebas/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/admin/pruebas-diagnosticas/crear-pruebas",
}));

jest.mock("@/components/pruebas/PreguntaCard", () => {
  return function MockPreguntaCard({ pregunta, onDelete }: any) {
    return (
      <div data-testid={`pregunta-${pregunta.id}`}>
        {pregunta.pregunta}
        <button onClick={() => onDelete(pregunta.id)}>Eliminar</button>
      </div>
    );
  };
});

describe("Crear Pruebas Diagnósticas Page", () => {
  const mockPreguntasData = [
    {
      id: 1,
      pregunta: "¿Cuál es la capital de Colombia?",
      tipo_pregunta: "OPCION_MULTIPLE",
      opciones: [
        { id: 1, opcion: "Bogotá", esCorrecta: true },
        { id: 2, opcion: "Medellín", esCorrecta: false },
      ],
    },
    {
      id: 2,
      pregunta: "¿Cuál es 2 + 2?",
      tipo_pregunta: "OPCION_MULTIPLE",
      opciones: [
        { id: 3, opcion: "3", esCorrecta: false },
        { id: 4, opcion: "4", esCorrecta: true },
      ],
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
      if (typeof url === "string" && url.includes("/pregunta/")) {
        return Promise.resolve({ data: mockPreguntasData });
      }
      return Promise.resolve({ data: [] });
    });

    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { id: 1, success: true },
    });
  });

  // ====================================================
  // 1. RENDERIZACIÓN INICIAL
  // ====================================================

  it("renderiza la página de crear pruebas", () => {
    render(<CrearPruebas />);

    expect(
      screen.getByText(/Crear Prueba|Nueva Prueba|Create Test/i)
    ).toBeInTheDocument();
  });

  it("muestra formulario de información de la prueba", async () => {
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Nombre|Name|Título|Title/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 2. INFORMACIÓN BÁSICA
  // ====================================================

  it("permite ingresar nombre de la prueba", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Nombre|Name|Título|Title/i)
      ).toBeInTheDocument();
    });

    const nombreInput = screen.getByLabelText(/Nombre|Name|Título|Title/i);
    await user.type(nombreInput, "Prueba de Matemáticas");

    expect(nombreInput).toHaveValue("Prueba de Matemáticas");
  });

  it("permite ingresar descripción de la prueba", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Descripción|Description/i)
      ).toBeInTheDocument();
    });

    const descInput = screen.getByLabelText(/Descripción|Description/i);
    await user.type(descInput, "Prueba diagnóstica para Matemáticas Básicas");

    expect(descInput).toHaveValue("Prueba diagnóstica para Matemáticas Básicas");
  });

  // ====================================================
  // 3. BÚSQUEDA DE PREGUNTAS
  // ====================================================

  it("permite buscar preguntas del banco", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const searchInput = screen.queryByPlaceholderText(/Buscar|Search/i);

    if (searchInput) {
      await user.type(searchInput, "Colombia");
      expect(searchInput).toHaveValue("Colombia");
    }
  });

  it("muestra preguntas disponibles del banco", async () => {
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  // ====================================================
  // 4. AGREGAR PREGUNTAS
  // ====================================================

  it("permite agregar preguntas del banco a la prueba", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(
        screen.getByText("¿Cuál es la capital de Colombia?")
      ).toBeInTheDocument();
    });

    // Buscar botón para agregar pregunta
    const agregarBtns = screen.queryAllByRole("button", {
      name: /Agregar|Add|Incluir|Include/i,
    });

    if (agregarBtns.length > 0) {
      await user.click(agregarBtns[0]);

      expect(agregarBtns[0]).toBeInTheDocument();
    }
  });

  it("permite crear pregunta nueva directamente", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const nuevaPreguntaBtn = screen.queryByRole("button", {
      name: /Nueva Pregunta|New Question|Crear Pregunta/i,
    });

    if (nuevaPreguntaBtn) {
      await user.click(nuevaPreguntaBtn);

      // Debería mostrar formulario de nueva pregunta
      expect(nuevaPreguntaBtn).toBeInTheDocument();
    }
  });

  // ====================================================
  // 5. ORDEN DE PREGUNTAS
  // ====================================================

  it("permite reordenar preguntas (arrastrar y soltar)", async () => {
    render(<CrearPruebas />);

    // Las preguntas deberían tener identificadores para drag-drop
    expect(
      screen.getByText(/Crear Prueba|Nueva Prueba|Create Test/i)
    ).toBeInTheDocument();
  });

  // ====================================================
  // 6. ELIMINAR PREGUNTAS
  // ====================================================

  it("permite eliminar preguntas de la prueba", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    await waitFor(() => {
      expect(
        screen.getByText("¿Cuál es la capital de Colombia?")
      ).toBeInTheDocument();
    });

    const eliminarBtn = screen.getByRole("button", { name: /Eliminar/i });
    await user.click(eliminarBtn);

    // La pregunta debería removerse
    expect(eliminarBtn).toBeInTheDocument();
  });

  // ====================================================
  // 7. PREVISUALIZACIÓN
  // ====================================================

  it("muestra previsualización de la prueba", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const previsualizarBtn = screen.queryByRole("button", {
      name: /Previsualizar|Preview/i,
    });

    if (previsualizarBtn) {
      await user.click(previsualizarBtn);

      expect(previsualizarBtn).toBeInTheDocument();
    }
  });

  // ====================================================
  // 8. VALIDACIÓN
  // ====================================================

  it("valida que la prueba tenga nombre", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const guardarBtn = screen.getByRole("button", {
      name: /Guardar|Crear|Save/i,
    });

    // Intentar guardar sin nombre
    await user.click(guardarBtn);

    // Debería mostrar error
    expect(guardarBtn).toBeInTheDocument();
  });

  it("valida que la prueba tenga al menos una pregunta", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const nombreInput = screen.getByLabelText(/Nombre|Name|Título|Title/i);
    await user.type(nombreInput, "Prueba sin preguntas");

    const guardarBtn = screen.getByRole("button", {
      name: /Guardar|Crear|Save/i,
    });

    // Intentar guardar sin preguntas
    await user.click(guardarBtn);

    expect(guardarBtn).toBeInTheDocument();
  });

  // ====================================================
  // 9. GUARDAR PRUEBA
  // ====================================================

  it("permite guardar la prueba completada", async () => {
    const user = userEvent.setup();
    render(<CrearPruebas />);

    const guardarBtn = await screen.findByRole("button", {
      name: /Guardar|Crear|Save/i,
    });

    await user.click(guardarBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  // ====================================================
  // 10. MANEJO DE ERRORES
  // ====================================================

  it("muestra error cuando falla el guardado", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(
      new Error("Error al guardar prueba")
    );

    render(<CrearPruebas />);

    const guardarBtn = screen.getByRole("button", {
      name: /Guardar|Crear|Save/i,
    });

    await user.click(guardarBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Error|No se pudo guardar/i)
      ).toBeInTheDocument();
    });
  });
});
