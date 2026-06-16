import { test, expect } from "@playwright/test";

test.describe("Modulo Inscripciones", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/auth/registro");

    // Cerrar modal inicial
    const btnEntendido = page.getByRole("button", {
      name: "Entendido",
    });

    if (await btnEntendido.isVisible()) {
      await btnEntendido.click();
    }
  });

  test("PF-INS-001 - Visualizar formulario de inscripción", async ({
    page,
  }) => {
    await expect(page.getByText("FORMULARIO DE INSCRIPCIÓN")).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Registrar",
      }),
    ).toBeVisible();
  });

  test("PF-INS-002 - Correo electrónico inválido", async ({ page }) => {
    await page
      .getByLabel("Correo Electrónico")
      .first()
      .fill("correo@hotmail.com");

    await expect(
      page.getByText(
        "Solo se permiten correos @gmail.com o @correounivalle.edu.co",
      ),
    ).toBeVisible();
  });

  test("PF-INS-003 - Navegar por el formulario", async ({ page }) => {
    await page.getByLabel("Nombres").fill("JUAN");

    await page.getByLabel("Apellidos").fill("PEREZ");

    await page.getByLabel("Correo Electrónico").first().fill("juan@gmail.com");

    await page.getByLabel("Celular").first().fill("3001234567");

    await expect(page.getByLabel("Nombres")).toHaveValue("JUAN");

    await expect(page.getByLabel("Apellidos")).toHaveValue("PEREZ");
  });

  test("PF-INS-004 - Subir fotografía válida", async ({ page }) => {
    const imageInput = page.locator('input[type="file"][accept="image/*"]');

    await imageInput.setInputFiles("e2e/fixtures/foto_valida.jpg");

    await expect(page.getByText(/excede 2 MB/)).not.toBeVisible();
  });

  test("PF-INS-005 - Subir documento PDF válido", async ({ page }) => {
    const pdfInput = page.locator('input[name="documento_identidad"]');

    await pdfInput.setInputFiles("e2e/fixtures/documento_valido.pdf");

    await expect(page.getByText("documento_valido.pdf")).toBeVisible();
  });

  test("PF-INS-006 - Mostrar campos de discapacidad", async ({ page }) => {
    const discapacidad = page.getByRole("combobox", {
      name: "Discapacidad",
    });

    await discapacidad.click();

    await page
      .getByRole("option", {
        name: "SI",
      })
      .click();
    await expect(page.getByLabel("Descripción de discapacidad")).toBeVisible();
  });
});
