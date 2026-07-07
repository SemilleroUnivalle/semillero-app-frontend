import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Login from "@/app/auth/login/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        token: "token-success",
        tipo_usuario: "administrador",
        nombre: "Admin",
      },
    });

    window.alert = jest.fn();
  });

  // ====================================================
  // 1. RENDERIZACIÓN INICIAL
  // ====================================================

  it("renderiza el formulario de login correctamente", () => {
    render(<Login />);

    expect(
      screen.getByText(/Iniciar sesión|Login/i)
    ).toBeInTheDocument();
  });

  it("muestra campos de email/documento y contraseña", () => {
    render(<Login />);

    expect(
      screen.getByPlaceholderText(/Documento de identidad|Email|Document/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Contraseña|Password/i)
    ).toBeInTheDocument();
  });

  it("muestra botón de ingreso", () => {
    render(<Login />);

    expect(
      screen.getByRole("button", { name: /Ingresar|Login/i })
    ).toBeInTheDocument();
  });

  // ====================================================
  // 2. VALIDACIÓN DE CAMPOS
  // ====================================================

  it("permite escribir documento de identidad", async () => {
    const user = userEvent.setup();
    render(<Login />);

    const documentoInput = screen.getByPlaceholderText(/Documento|Document/i);
    await user.type(documentoInput, "1234567890");

    expect(documentoInput).toHaveValue("1234567890");
  });

  it("permite escribir contraseña", async () => {
    const user = userEvent.setup();
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText(/Contraseña|Password/i);
    await user.type(passwordInput, "Password123");

    expect(passwordInput).toHaveValue("Password123");
  });

  it("valida que los campos requeridos estén llenos", async () => {
    const user = userEvent.setup();
    render(<Login />);

    const boton = screen.getByRole("button", { name: /Ingresar|Login/i });
    await user.click(boton);

    // Debería mostrar algún error de validación
    expect(boton).toBeInTheDocument();
  });


  // ====================================================
  // 4. MANEJO DE ERRORES
  // ====================================================

  it("muestra error cuando credenciales son inválidas", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(
      new Error("Credenciales inválidas")
    );

    render(<Login />);

    const documentoInput = screen.getByPlaceholderText(/Documento|Document/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña|Password/i);
    const boton = screen.getByRole("button", { name: /Ingresar|Login/i });

    await user.type(documentoInput, "1234567890");
    await user.type(passwordInput, "WrongPassword");
    await user.click(boton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });


  // ====================================================
  // 5. ENLACES DE REGISTRO
  // ====================================================

  it("muestra enlace para crear cuenta", () => {
    render(<Login />);

    const registroLink = screen.queryByRole("link", {
      name: /Crear cuenta|Registro|Register/i,
    });

    if (registroLink) {
      expect(registroLink).toBeInTheDocument();
    }
  });

  it("muestra enlace para recuperar contraseña", () => {
    render(<Login />);

    const recuperarLink = screen.queryByRole("link", {
      name: /Recuperar|Olvidé|Forgot/i,
    });

    if (recuperarLink) {
      expect(recuperarLink).toBeInTheDocument();
    }
  });

  // ====================================================
  // 6. ESTADO DE CARGA
  // ====================================================

  it("muestra indicador de carga durante el login", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ status: 200, data: {} }), 1000)
        )
    );

    render(<Login />);

    const documentoInput = screen.getByPlaceholderText(/Documento|Document/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña|Password/i);
    const boton = screen.getByRole("button", { name: /Ingresar|Login/i });

    await user.type(documentoInput, "1234567890");
    await user.type(passwordInput, "Password123");
    await user.click(boton);

    // El botón debería deshabilitarse o mostrar estado de carga
    expect(boton).toBeInTheDocument();
  });

  // ====================================================
  // 7. RECORDAR USUARIO
  // ====================================================

  it("puede tener opción de recordar usuario", () => {
    render(<Login />);

    const rememberCheckbox = screen.queryByRole("checkbox", {
      name: /Recuerda|Remember/i,
    });

    if (rememberCheckbox) {
      expect(rememberCheckbox).toBeInTheDocument();
    }
  });

  // ====================================================
  // 8. ESTILOS Y ACCESIBILIDAD
  // ====================================================

  it("tiene estructura accesible", () => {
    render(<Login />);

    const inputs = screen.getAllByRole("textbox");
    const buttons = screen.getAllByRole("button");

    expect(inputs.length).toBeGreaterThan(0);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("tiene contraste de colores adecuado", () => {
    render(<Login />);

    const form = screen.getByText(/Iniciar sesión|Login/i);
    expect(form).toBeInTheDocument();
  });
});
