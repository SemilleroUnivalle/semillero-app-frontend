import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioDatos from "@/components/formulario";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("FormularioDatos", () => {
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
      if (typeof url === "string" && url.includes("Department")) {
        return Promise.resolve({
          data: [],
        });
      }

      if (typeof url === "string" && url.includes("/estudiante/est/1")) {
        return Promise.resolve({
          data: {
            id_estudiante: 1,
            nombre: "JUAN",
            apellido: "PEREZ",
            email: "juan@gmail.com",
            celular: "3001111111",
            grado: "11",
            estamento: "PÚBLICO",

            acudiente: {
              id_acudiente: 1,
              nombre_acudiente: "MARIA",
              apellido_acudiente: "PEREZ",
              email_acudiente: "maria@gmail.com",
              celular_acudiente: "3000000000",
            },
          },
        });
      }

      return Promise.resolve({
        data: [],
      });
    });
  });

  /**
   * UT-001
   * Debe mostrar pantalla de carga
   */
  test("muestra loading inicialmente", () => {
    mockedAxios.get.mockImplementation(
      () =>
        new Promise(() => {
          // nunca resuelve
        }),
    );

    render(<FormularioDatos id_estudiante={1} />);

    expect(
      screen.getByText(/Cargando datos del estudiante/i),
    ).toBeInTheDocument();
  });

  /**
   * UT-002
   * Debe renderizar el formulario
   */
  test("renderiza formulario correctamente", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(/INFORMACIÓN DEL ESTUDIANTE/i),
      ).toBeInTheDocument();
    });
  });

  /**
   * UT-003
   * Debe mostrar sección de contacto
   */
  test("muestra información de contacto", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Información de Contacto y Ubicación/i),
      ).toBeInTheDocument();
    });
  });

  /**
   * UT-004
   * Debe mostrar sección de salud
   */
  test("muestra información de salud", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Información de Salud/i)).toBeInTheDocument();
    });
  });

  /**
   * UT-005
   * Debe mostrar sección académica
   */
  test("muestra información académica", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Información Académica/i)).toBeInTheDocument();
    });
  });

  /**
   * UT-006
   * Debe mostrar información del acudiente
   */
  test("muestra sección de acudiente", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Información del Acudiente o Responsable del Estudiante/i,
        ),
      ).toBeInTheDocument();
    });
  });

  /**
   * UT-007
   * Debe mostrar documentación
   */
  test("muestra sección documentación", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Documentación/i)).toBeInTheDocument();
    });
  });

  /**
   * UT-008
   * Debe mostrar verificaciones
   */
  test("muestra sección verificaciones", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Verificaciones/i)).toBeInTheDocument();
    });
  });

  /**
   * UT-009
   * Permite activar modo edición
   */
  test("cambia de editar a guardar", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    const botonEditar = await screen.findByRole("button", {
      name: /Editar/i,
    });

    await userEvent.click(botonEditar);

    expect(
      screen.getByRole("button", {
        name: /Guardar/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * UT-010
   * Debe mostrar campos básicos
   */
  test("muestra campos personales", async () => {
    render(<FormularioDatos id_estudiante={1} />);

    await waitFor(() => {
      const nombresInputs = screen.getAllByLabelText(/Nombres/i);
      expect(nombresInputs[0]).toBeInTheDocument();

      const apellidosInputs = screen.getAllByLabelText(/Apellidos/i);
      expect(apellidosInputs[0]).toBeInTheDocument();

      const numeroIdInputs = screen.getAllByLabelText(
        /Número de identificación/i,
      );
      expect(numeroIdInputs[0]).toBeInTheDocument();
    });
  });
});
