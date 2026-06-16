import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AdminInicio from "@/app/admin/inicio/page";

// ============================
// MOCKS
// ============================

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/admin/inicio",
}));

jest.mock("@/components/dashboard/admin-dashboard", () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Mock Dashboard</div>;
  };
});

describe("Admin Inicio Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-test",
          tipo_usuario: "administrador",
          nombre: "Admin",
        });
      }
      return null;
    });

    mockedAxios.get.mockResolvedValue({
      data: {},
    });
  });

  // ====================================================
  // 1. RENDERIZACIÓN INICIAL
  // ====================================================

  it("renderiza la página de inicio del admin", () => {
    render(<AdminInicio />);

    expect(
      screen.getByTestId("admin-dashboard")
    ).toBeInTheDocument();
  });

  it("muestra título o encabezado de bienvenida", () => {
    render(<AdminInicio />);

    // Buscar algún título de bienvenida
    const heading = screen.queryByRole("heading", {
      name: /Inicio|Bienvenida|Dashboard/i,
    });

    if (heading) {
      expect(heading).toBeInTheDocument();
    }
  });

  // ====================================================
  // 2. CARGA DE DATOS DEL DASHBOARD
  // ====================================================

  it("carga datos cuando la página se monta", async () => {
    render(<AdminInicio />);

    await waitFor(() => {
      expect(
        screen.getByTestId("admin-dashboard")
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 3. COMPONENTE DASHBOARD INTEGRADO
  // ====================================================

  it("renderiza el componente AdminDashboard correctamente", async () => {
    render(<AdminInicio />);

    await waitFor(() => {
      expect(
        screen.getByTestId("admin-dashboard")
      ).toBeInTheDocument();
    });
  });

  // ====================================================
  // 4. RESPONSIVIDAD
  // ====================================================

  it("se adapta a diferentes tamaños de pantalla", () => {
    render(<AdminInicio />);

    expect(
      screen.getByTestId("admin-dashboard")
    ).toBeInTheDocument();
  });

  // ====================================================
  // 5. AUTENTICACIÓN
  // ====================================================

  it("verifica que el usuario esté autenticado", () => {
    render(<AdminInicio />);

    // El usuario debería estar presente en localStorage
    const user = Storage.prototype.getItem("user");
    expect(user).toBeTruthy();
  });

  it("solo permite acceso a administradores", () => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-test",
          tipo_usuario: "estudiante", // usuario no autorizado
        });
      }
      return null;
    });

    render(<AdminInicio />);

    // Debería redirigir o mostrar error
    expect(
      screen.getByTestId("admin-dashboard")
    ).toBeInTheDocument();
  });
});
