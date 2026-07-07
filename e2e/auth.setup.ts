import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");

  await page.getByPlaceholder("Documento de identidad").fill("1234");

  await page.getByPlaceholder("Contraseña").fill("1234");

  await page
    .getByRole("button", {
      name: "Ingresar",
    })
    .click();

  await page.waitForURL(/\/admin\/inicio/);

  await page.context().storageState({
    path: "playwright/.auth/admin.json",
  });
});
