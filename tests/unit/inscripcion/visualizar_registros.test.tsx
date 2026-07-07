// VerRegistros.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerRegistros from "@/app/admin/registros/verRegistros/page";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock DataGrid para simplificar pruebas
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }: any) => (
    <div data-testid="datagrid">
      {rows.map((row: any) => (
        <div key={row.id}>{row.nombre}</div>
      ))}
    </div>
  ),
}));

describe("VerRegistros", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify({
          token: "token-prueba",
        });
      }

      if (key === "token") {
        return "token-prueba";
      }

      return null;
    });

    jest.clearAllMocks();
  });

  test("carga estudiantes correctamente", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id_estudiante: 1,
            nombre: "JUAN",
            apellido: "PEREZ",
            email: "juan@gmail.com",
            numero_documento: "123",
            estamento: "PUBLICO",
            grado: "11",
            estado: "Pendiente",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<VerRegistros />);

    await waitFor(() => {
      expect(screen.getByText("JUAN")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  test("muestra loading mientras consulta", () => {
    mockedAxios.get.mockImplementation(
      () =>
        new Promise(() => {
          // nunca resuelve
        }),
    );

    render(<VerRegistros />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("realiza búsqueda por texto", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id_estudiante: 1,
            nombre: "JUAN",
            apellido: "PEREZ",
            email: "juan@gmail.com",
            numero_documento: "123",
            estamento: "PUBLICO",
            grado: "11",
            estado: "Pendiente",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<VerRegistros />);

    await waitFor(() => {
      expect(screen.getByText("JUAN")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(
      "Escribe para buscar..."
    );

    await userEvent.type(input, "JUAN");

    expect(input).toHaveValue("JUAN");
  });

  test("maneja error al cargar estudiantes", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation();

    mockedAxios.get.mockRejectedValueOnce(
      new Error("Error API")
    );

    render(<VerRegistros />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });

  test("renderiza botón exportar excel", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        status: 200,
        data: [],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<VerRegistros />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /exportar a excel/i,
        })
      ).toBeInTheDocument();
    });
  });

  test("ejecuta exportación excel", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        status: 200,
        data: [],
      })
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: new Blob(),
      });

    render(<VerRegistros />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /exportar a excel/i,
        })
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole("button", {
        name: /exportar a excel/i,
      })
    );

    expect(mockedAxios.get).toHaveBeenCalled();
  });
});