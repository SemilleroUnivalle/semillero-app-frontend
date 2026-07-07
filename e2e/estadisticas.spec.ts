import { test, expect } from "@playwright/test";

test.describe("Modulo Analiticas y Estadisticas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");

    const storage = await page.evaluate(() => ({
      access: localStorage.getItem("access"),
      refresh: localStorage.getItem("refresh"),
      token: localStorage.getItem("token"),
    }));

    console.log(storage);

    await page.goto("http://localhost:3000/admin/estadisticas");
  });

  test("PF-ANA-002 - Visualizar tarjetas KPI", async ({ page }) => {
    await expect(page.getByText("Total Inscripciones")).toBeVisible();

    await expect(page.getByText("Total Matriculados")).toBeVisible();

    await expect(page.getByText("Módulos Activos")).toBeVisible();

    await expect(page.getByText("Docentes")).toBeVisible();

    await expect(page.getByText("Monitores")).toBeVisible();
  });

  test("PF-ANA-003 - Filtrar por periodo", async ({ page }) => {
    const selector = page.getByRole("combobox");

    await expect(selector).toBeVisible();

    await selector.click();

    const opcion = page.getByRole("option").first();

    await expect(opcion).toBeVisible();

    await opcion.click();

    await expect(page.getByText("Estadísticas Históricas")).toBeVisible();
  });

  test("PF-ANA-004 - Abrir pestaña Geografía", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Geografía",
        exact: true,
      })
      .click();

    await expect(page.getByText("Mapa de Procedencia")).toBeVisible();
  });

  test("PF-ANA-005 - Abrir pestaña Módulos", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Módulos",
        exact: true,
      })
      .click();

    await expect(page.getByText("Listado de Módulos")).toBeVisible();
  });

  test("PF-ANA-006 - Abrir pestaña Institucional", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Institucional",
        exact: true,
      })
      .click();

    await expect(page.getByText("Segmentación por Estamento")).toBeVisible();
  });

  test("PF-ANA-007 - Visualizar análisis general", async ({ page }) => {
    await expect(page.getByText("Módulo y Género")).toBeVisible();

    await expect(page.getByText("Inscritos por Módulo")).toBeVisible();
  });

  test("PF-ANA-008 - Visualizar mapa geográfico", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Geografía",
        exact: true,
      })
      .click();

    await expect(page.getByText("Mapa de Procedencia")).toBeVisible();
  });

  test("PF-ANA-009 - Visualizar distribución académica", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Módulos",
        exact: true,
      })
      .click();

    await expect(page.getByText("Distribución Académica")).toBeVisible();
  });

  test("PF-ANA-010 - Visualizar segmentación institucional", async ({
    page,
  }) => {
    await page
      .getByRole("button", {
        name: "Institucional",
        exact: true,
      })
      .click();

    await expect(page.getByText("Colegio público vs privado")).toBeVisible();
  });
});
