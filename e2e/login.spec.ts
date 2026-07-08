import { test, expect } from "@playwright/test";

test.describe("Módulo Login", () => {

  test("PF-LOGIN-001 - Inicio de sesión exitoso", async ({ page }) => {

    await page.goto("http://localhost:3000/auth/login");

    await page.fill("#numero_documento", "1234");
    await page.fill("#contrasena", "1234");

    await page.getByRole("button", {
      name: "Ingresar",
    }).click();

    await expect(page).toHaveURL(/inicio/);

  });

  test("PF-LOGIN-002 - Validar campos obligatorios", async ({ page }) => {

    await page.goto("http://localhost:3000/auth/login");

    await page.getByRole("button", {
      name: "Ingresar",
    }).click();

    const documento = page.locator("#numero_documento");
    const contrasena = page.locator("#contrasena");

    await expect(documento).toHaveAttribute("required");
    await expect(contrasena).toHaveAttribute("required");

  });

  test("PF-LOGIN-003 - Credenciales incorrectas", async ({ page }) => {

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        "Credenciales incorrectas"
      );
      await dialog.accept();
    });

    await page.goto("http://localhost:3000/auth/login");

    await page.fill("#numero_documento", "99999999");
    await page.fill("#contrasena", "incorrecta");

    await page.getByRole("button", {
      name: "Ingresar",
    }).click();

  });

  test("PF-LOGIN-004 - Navegar a recuperación de contraseña", async ({ page }) => {

    await page.goto("http://localhost:3000/auth/login");

    await page.getByText(
      "¿Olvidaste tu contraseña?"
    ).click();

    await expect(page).toHaveURL(
      /auth\/recuperarContrasena/
    );

  });

  test("PF-LOGIN-005 - Navegar a crear cuenta", async ({ page }) => {

    await page.goto("http://localhost:3000/auth/login");

    await page.getByRole("button", {
      name: "Crear cuenta",
    }).click();

    await expect(page).toHaveURL(
      /auth\/registro/
    );

  });

});