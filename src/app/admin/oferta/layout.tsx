"use client";

import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";
import { Button, Breadcrumbs, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
export default function LayoutOferta({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Divide la ruta en segmentos y genera los enlaces
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // Quita el primer segmento "admin"

  const basePath = "/admin/oferta/verOfertas";
  const breadcrumbNames: Record<string, string> = {
    verOfertas: "Ver Ofertas Académicas",
    crearOferta: "Crear Oferta Académica",
    // Agrega más traducciones si lo deseas
  };

  const breadcrumbLinks = [
    { href: basePath, label: "Oferta Académica" },
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
        <h1>Oferta Académica</h1>
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

        {/* Contenedor de botones para crear ofertas y cursos */}
        <div className="mx-auto my-4 flex w-11/12 flex-wrap justify-around gap-2">
          <Link href="/admin/oferta/verOfertas/" className="w-full sm:w-1/4">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white"
              variant="contained"
              // onClick={handleOpenOfertaModal}
            >
              Ver Ofertas
            </Button>
          </Link>
          <Link href="/admin/oferta/crearOferta/" className="w-full sm:w-1/4">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white"
              variant="contained"
              // onClick={handleOpenOfertaModal}
            >
              Crear Oferta
            </Button>
          </Link>

          {/* Modals */}
        </div>
        <div id="container" className="">
          {children}
        </div>
      </div>
    </StyledEngineProvider>
  );
}
