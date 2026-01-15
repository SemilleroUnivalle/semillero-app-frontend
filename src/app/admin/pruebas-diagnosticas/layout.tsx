"use client";

import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";
import { Button, Breadcrumbs, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function LayoutCursos({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Divide la ruta en segmentos y genera los enlaces
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // Quita el primer segmento "admin"

  const basePath = "/admin/prueba-diagnostica/ver-pruebas";
  const breadcrumbNames: Record<string, string> = {

    // Agrega más traducciones si lo deseas
  };

  const breadcrumbLinks = [
    { href: basePath, label: "Pruebas" },
    ...pathSegments.slice(1).map((segment, idx) => {
      const href = basePath + "/" + pathSegments.slice(1, idx + 2).join("/");
      const label =
        breadcrumbNames[segment] ||
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/([A-Z])/g, " $1");
      return { href, label };
    }),
  ];
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-col">
        <h1>Pruebas Diagnósticas</h1>

        <Breadcrumbs aria-label="breadcrumb" className="">
          {breadcrumbLinks.map((crumb, idx) =>
            idx < breadcrumbLinks.length - 1 ? (
              <Link
                key={crumb.href}
                href={crumb.href}
                className="text-primary hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.href} color="text.primary">
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>

        {/* Contenedor de botones principales */}
        <div className="mx-auto my-4 flex w-11/12 flex-wrap justify-center gap-4">
          <Link href="/admin/pruebas-diagnosticas/ver-pruebas" className="w-full sm:w-auto flex-1">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white shadow-md transition-all duration-300"
              variant="contained"
            >
              Pruebas Diagnósticas
            </Button>
          </Link>
          <Link href="/admin/pruebas-diagnosticas/banco-preguntas/ver" className="w-full sm:w-auto flex-1">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white shadow-md transition-all duration-300"
              variant="contained"
            >
              Banco de Preguntas
            </Button>
          </Link>
          <Link href="/admin/pruebas-diagnosticas/estadisticas" className="w-full sm:w-auto flex-1">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white shadow-md transition-all duration-300"
              variant="contained"
            >
              Estadísticas
            </Button>
          </Link>
        </div>
        <div id="container" className="">
          {children}
        </div>
      </div>
    </StyledEngineProvider>
  );
}
