import { test, expect } from "@playwright/test";

test.describe("Modulo Crear Curso", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/admin/cursos/crearCursos");
  });

  test("PF-CUR-001 - Visualizar formulario", async ({ page }) => {
    await expect(page.getByText("Crear curso")).toBeVisible();

    await page
      .getByRole("button", {
        name: "Crear Curso",
        exact: true,
      })
      .click();
  });

  test("PF-CUR-002 - Campos obligatorios", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Crear Curso",
      })
      .click();

    await expect(page.getByLabel("Nombre")).toHaveAttribute("required");
  });

  test("PF-CUR-003 - Seleccionar categoría", async ({ page }) => {
    await page
      .getByRole("combobox", {
        name: "Categoría",
      })
      .click();

    const opcion = page.getByRole("option").first();

    await opcion.click();

    await expect(
      page.getByRole("combobox", {
        name: "Categoría",
      }),
    ).not.toHaveText("");
  });

  test("PF-CUR-004 - Seleccionar área", async ({ page }) => {
    await page
      .getByRole("combobox", {
        name: "Área",
      })
      .click();

    const opcion = page.getByRole("option").first();

    await opcion.click();

    await expect(
      page.getByRole("combobox", {
        name: "Área",
      }),
    ).not.toHaveText("");
  });

  test("PF-CUR-005 - Mostrar campo otra categoría", async ({ page }) => {
    await page
      .getByRole("combobox", {
        name: "Categoría",
      })
      .click();

    await page
      .getByRole("option", {
        name: "Otra",
      })
      .click();

    await expect(page.getByLabel("Especificar Categoría")).toBeVisible();
  });

  test("PF-CUR-006 - Mostrar campo otra área", async ({ page }) => {
    await page
      .getByRole("combobox", {
        name: "Área",
      })
      .click();

    await page
      .getByRole("option", {
        name: "Otra",
      })
      .click();

    await expect(page.getByLabel("Especificar Área")).toBeVisible();
  });

  test("PF-CUR-007 - Selección múltiple dirigido a", async ({ page }) => {
    await page.locator("#dirigido_a").click();

    await page
      .getByRole("option", {
        name: "10",
      })
      .click();

    await page
      .getByRole("option", {
        name: "11",
      })
      .click();

    await page.keyboard.press("Escape");

    await expect(page.getByText("10")).toBeVisible();

    await expect(page.getByText("11")).toBeVisible();
  });
});
