// import { render, screen } from "@testing-library/react";
// import LoginPage from "@/app/auth/login/page";

// describe("Login page", () => {

//     beforeEach(() => {
//         render(<LoginPage />);
//     });

//   it("renders home page", () => {
//     expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
//   });
// });



import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/auth/login/page";

describe("Login page", () => {
  beforeEach(() => {
    render(<LoginPage />);
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
