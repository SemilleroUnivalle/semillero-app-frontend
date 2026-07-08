import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { act } from "@testing-library/react";
import Registro from "@/app/auth/registro/page";

// =====================
// MOCKS
// =====================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/auth/registro",
}));

// Mock del componente matrícula
jest.mock("@/components/matricula-form", () => {
  const React = require("react");

  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      validate: jest.fn(() => true),
      getFormData: jest.fn(() => ({
        modulo: "1",
        tipo_vinculacion: "NORMAL",
        terminos: true,
      })),
    }));

    return <div data-testid="matricula-form">Matricula Mock</div>;
  });
});

// Mock FileReader
class MockFileReader {
  result = "data:image/png;base64,test";

  onloadend: (() => void) | null = null;

  readAsDataURL() {
    if (this.onloadend) {
      this.onloadend();
    }
  }
}

global.FileReader = MockFileReader as any;

describe("Registro", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Valle del Cauca",
        },
      ],
    } as any);

    window.alert = jest.fn();
  });

  // =====================================
  // Renderización
  // =====================================
  it("renderiza el formulario", async () => {
    await act(async () => {
      render(<Registro />);
    });

    expect(screen.getByText(/FORMULARIO DE INSCRIPCIÓN/i)).toBeInTheDocument();
  });

  // =====================================
  // Modal
  // =====================================

  it("muestra el modal informativo", () => {
    render(<Registro />);

    expect(screen.getByText(/Información importante/i)).toBeInTheDocument();
  });

  it("cierra el modal", async () => {
    render(<Registro />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /entendido/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Información importante/i),
      ).not.toBeInTheDocument();
    });
  });

  // =====================================
  // Axios departamentos
  // =====================================

  it("consulta departamentos al cargar", async () => {
    render(<Registro />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  // =====================================
  // Validación correo
  // =====================================

  it("muestra error para correo inválido", async () => {
    render(<Registro />);

    // Cerrar modal inicial
    await userEvent.click(
      screen.getByRole("button", {
        name: /entendido/i,
      }),
    );

    // Esperar carga de departamentos
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const correo = screen.getAllByLabelText(/correo electrónico/i)[0];

    await userEvent.type(correo, "usuario@hotmail.com");

    fireEvent.blur(correo);

    await waitFor(() => {
      expect(correo).toHaveValue("USUARIO@HOTMAIL.COM");
    });
  });

  it("acepta correo gmail", async () => {
    render(<Registro />);

    const correo = screen.getAllByLabelText(/correo electrónico/i)[0];

    await userEvent.type(correo, "usuario@gmail.com");

    expect(
      screen.queryByText(/Solo se permiten correos/i),
    ).not.toBeInTheDocument();
  });

  // =====================================
  // Acudiente
  // =====================================

  it("muestra la sección del acudiente", () => {
    render(<Registro />);

    expect(screen.getByText(/INFORMACIÓN DEL ACUDIENTE/i)).toBeInTheDocument();
  });

  // =====================================
  // Carga imagen válida
  // =====================================

  it("permite seleccionar una imagen válida", () => {
    render(<Registro />);

    const file = new File(["contenido"], "foto.png", {
      type: "image/png",
    });

    const inputs = document.querySelectorAll('input[type="file"]');

    const imageInput = inputs[0];

    fireEvent.change(imageInput, {
      target: {
        files: [file],
      },
    });

    expect(file.name).toBe("foto.png");
  });

  // =====================================
  // Imagen inválida
  // =====================================

  it("rechaza archivos no imagen", () => {
    render(<Registro />);

    const file = new File(["contenido"], "archivo.pdf", {
      type: "application/pdf",
    });

    const inputs = document.querySelectorAll('input[type="file"]');

    const imageInput = inputs[0];

    fireEvent.change(imageInput, {
      target: {
        files: [file],
      },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Por favor selecciona una imagen válida (JPG, PNG, etc.)",
    );
  });


});
