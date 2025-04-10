import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Perfil from "../page"; // Ajusta la ruta según tu estructura
import axios from "axios";

jest.mock("axios");

describe("Perfil Component", () => {
  
    test("Renderizar el componente Perfil", () => {
    render(<Perfil />);
    
    // Verifica que el título está presente
    expect(screen.getByText(/Tu información/i)).toBeInTheDocument();

    // Verifica que el botón para subir imagen existe
    expect(screen.getByText(/Elegir Imagen/i)).toBeInTheDocument();

    // Verifica que el botón de editar está presente
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
  });

  test("Muestra un campo extra cuando se selecciona 'Otro' genero", () => {
    render(<Perfil />);
    
    const genderSelect = screen.getByLabelText("Género");
    fireEvent.change(genderSelect, { target: { value: "Otro" } });

    expect(screen.getByLabelText("Otro género")).toBeInTheDocument();
  });

  test("Muestra campo de 'Tipo de discapacidad' cuando se selecciona 'Si'", () => {
    render(<Perfil />);
    
    const disabilitySelect = screen.getByLabelText("Discapacidad");
    fireEvent.change(disabilitySelect, { target: { value: "sí" } });

    expect(screen.getByLabelText("Tipo de discapacidad")).toBeInTheDocument();
  });

  test("Peticion y muestra de departamentos", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: "Cundinamarca" }, { id: 2, name: "Antioquia" }]
    });

    render(<Perfil />);
    
    await waitFor(() => {
      expect(screen.getByText("Cundinamarca")).toBeInTheDocument();
      expect(screen.getByText("Antioquia")).toBeInTheDocument();
    });
  });

  test("Actualiza las ciudades cuando el departamento es seleccionado", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ id: 1, name: "Cundinamarca" }] }) // Mock para departamentos
      .mockResolvedValueOnce({ data: [{ id: 10, name: "Bogotá" }] }); // Mock para ciudades

    render(<Perfil />);

    await waitFor(() => {
      expect(screen.getByText("Cundinamarca")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Departamento"), { target: { value: 1 } });

    await waitFor(() => {
      expect(screen.getByText("Bogotá")).toBeInTheDocument();
    });
  });

  test("el avatar se actualiza cuando se carga una imagen", async () => {
    render(<Perfil />);
    
    const fileInput = screen.getByLabelText("Elegir Imagen");
    const file = new File(["dummy-content"], "test-image.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute("src", expect.stringContaining("data:image/png;base64"));
    });
  });
});
