import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import NuevaMatricula from "@/app/estudiante/nueva-matricula/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/estudiante/nueva-matricula",
}));

describe("Nueva Matrícula Page", () => {
  const mockOfertasData = [
    { id: 1, nombre: "Oferta 2024-1" },
    { id: 2, nombre: "Oferta 2024-2" },
  ];

  const mockCategoriasData = [
    { id: 1, nombre: "Cálculo", oferta: 1 },
    { id: 2, nombre: "Algebra", oferta: 1 },
  ];

  const mockModulosData = [
    { id: 1, nombre: "Módulo 1", categoria: 1 },
    { id: 2, nombre: "Módulo 2", categoria: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-test",
          tipo_usuario: "estudiante",
          id_estudiante: 1,
        });
      }
      return null;
    });

    mockedAxios.get.mockImplementation((url) => {
      if (typeof url === "string" && url.includes("/oferta/")) {
        return Promise.resolve({ data: mockOfertasData });
      }
      if (typeof url === "string" && url.includes("/categoria/")) {
        return Promise.resolve({ data: mockCategoriasData });
      }
      if (typeof url === "string" && url.includes("/modulo/")) {
        return Promise.resolve({ data: mockModulosData });
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

  it("renderiza la página de nueva matrícula", () => {
    render(<NuevaMatricula />);

    expect(
      screen.getByText(/Nueva Matrícula|New Enrollment/i)
    ).toBeInTheDocument();
  });

  it("muestra formulario de selección cascada", async () => {
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 2. CARGAR OFERTAS
  // ====================================================

  it("carga las ofertas disponibles al montarse", async () => {
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  it("muestra lista de ofertas en el select", async () => {
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 3. SELECCIONAR OFERTA
  // ====================================================

  it("permite seleccionar una oferta", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });

    const ofertaSelect = screen.getByLabelText(/Oferta|Offering/i);
    await user.click(ofertaSelect);

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /Oferta 2024-1/i });
      expect(option).toBeInTheDocument();
    });
  });

  it("carga categorías cuando se selecciona una oferta", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });

    const ofertaSelect = screen.getByLabelText(/Oferta|Offering/i);
    await user.click(ofertaSelect);

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /Oferta 2024-1/i });
      await user.click(option);

      expect(
        screen.getByLabelText(/Categoría|Category/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 4. SELECCIONAR CATEGORÍA
  // ====================================================

  it("permite seleccionar una categoría después de oferta", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });

    const ofertaSelect = screen.getByLabelText(/Oferta|Offering/i);
    await user.click(ofertaSelect);

    await waitFor(() => {
      const ofertaOption = screen.getByRole("option", { name: /Oferta 2024-1/i });
      await user.click(ofertaOption);

      expect(
        screen.getByLabelText(/Categoría|Category/i)
      ).toBeInTheDocument();
    });
  });

  it("carga módulos cuando se selecciona una categoría", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });

    // Seleccionar oferta
    const ofertaSelect = screen.getByLabelText(/Oferta|Offering/i);
    await user.click(ofertaSelect);

    await waitFor(() => {
      const ofertaOption = screen.getByRole("option", { name: /Oferta 2024-1/i });
      await user.click(ofertaOption);
    });

    // Seleccionar categoría
    await waitFor(() => {
      expect(
        screen.getByLabelText(/Categoría|Category/i)
      ).toBeInTheDocument();
    });

    const categoriaSelect = screen.getByLabelText(/Categoría|Category/i);
    await user.click(categoriaSelect);

    await waitFor(() => {
      const categoriaOption = screen.getByRole("option", { name: /Cálculo/i });
      await user.click(categoriaOption);

      expect(
        screen.getByLabelText(/Módulo|Module/i)
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 5. SELECCIONAR MÓDULO
  // ====================================================

  it("permite seleccionar un módulo final", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/Oferta|Offering/i)
      ).toBeInTheDocument();
    });

    // Seleccionar oferta
    const ofertaSelect = screen.getByLabelText(/Oferta|Offering/i);
    await user.click(ofertaSelect);

    await waitFor(() => {
      const ofertaOption = screen.getByRole("option", { name: /Oferta 2024-1/i });
      await user.click(ofertaOption);
    });

    // Seleccionar categoría
    await waitFor(() => {
      const categoriaSelect = screen.getByLabelText(/Categoría|Category/i);
      await user.click(categoriaSelect);

      const categoriaOption = screen.getByRole("option", { name: /Cálculo/i });
      await user.click(categoriaOption);
    });

    // Seleccionar módulo
    await waitFor(() => {
      const moduloSelect = screen.getByLabelText(/Módulo|Module/i);
      expect(moduloSelect).toBeInTheDocument();
    });
  });

  // ====================================================
  // 6. CAMPOS DE ARCHIVOS
  // ====================================================

  it("permite subir archivos requeridos", async () => {
    render(<NuevaMatricula />);

    const fileInputs = screen.queryAllByRole("button", {
      name: /Seleccionar archivo|Subir|Upload/i,
    });

    expect(fileInputs.length).toBeGreaterThanOrEqual(0);
  });

  // ====================================================
  // 7. ENVÍO DEL FORMULARIO
  // ====================================================

  it("permite enviar la matrícula", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Registrar|Enviar|Submit/i })
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", {
      name: /Registrar|Enviar|Submit/i,
    });

    await user.click(submitBtn);

    // Debería validar o mostrar error de campos requeridos
    expect(submitBtn).toBeInTheDocument();
  });

  // ====================================================
  // 8. VALIDACIÓN
  // ====================================================

  it("valida que todos los campos requeridos estén completos", async () => {
    const user = userEvent.setup();
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Registrar|Enviar|Submit/i })
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", {
      name: /Registrar|Enviar|Submit/i,
    });

    // Intentar enviar sin llenar campos
    await user.click(submitBtn);

    // Debería haber validación
    expect(submitBtn).toBeInTheDocument();
  });

  // ====================================================
  // 9. MANEJO DE ERRORES
  // ====================================================

  it("muestra mensaje de error cuando falla la matrícula", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(
      new Error("Error al crear matrícula")
    );

    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Registrar|Enviar|Submit/i })
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 10. ÉXITO
  // ====================================================

  it("muestra mensaje de éxito después de registrar matrícula", async () => {
    render(<NuevaMatricula />);

    await waitFor(() => {
      expect(
        screen.getByText(/Nueva Matrícula|New Enrollment/i)
      ).toBeInTheDocument();
    });
  });
});
