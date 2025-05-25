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
