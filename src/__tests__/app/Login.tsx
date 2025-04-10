import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/app/auth/login/page";

// 👇 Mock del router de Next.js (App Router)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Login page", () => {
  beforeEach(() => {
    render(<Login />);
  });

  it("renders login title", () => {
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });

  it("renders input fields", () => {
    expect(screen.getByPlaceholderText("Documento de identidad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
  });

  it("allows user to type in input fields", async () => {
    const documentoInput = screen.getByPlaceholderText("Documento de identidad");
    const passwordInput = screen.getByPlaceholderText("Contraseña");

    await userEvent.type(documentoInput, "12345678");
    await userEvent.type(passwordInput, "password123");

    expect(documentoInput).toHaveValue("12345678");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders action buttons", () => {
    expect(screen.getByRole("button", { name: /Ingresar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Crear cuenta/i })).toBeInTheDocument();
  });

  it("has a link to the registration page", () => {
    const link = screen.getByRole("link", { name: /Crear cuenta/i });
    expect(link).toHaveAttribute("href", "/auth/registro");
  });
});
