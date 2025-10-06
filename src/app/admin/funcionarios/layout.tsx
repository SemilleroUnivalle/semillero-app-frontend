"use client";

import { StyledEngineProvider } from "@mui/material/styles";

import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";


import { usePathname } from "next/navigation";

export default function LayoutFuncionarios({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Divide la ruta en segmentos y genera los enlaces
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // Quita el primer segmento "admin"

  const basePath = "/admin/funcionarios/visualizar-funcionarios";
  const breadcrumbNames: Record<string, string> = {
    // Agrega más traducciones si lo deseas
  };

  const breadcrumbLinks = [
    { href: basePath, label: "Funcionarios" },
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
        <h1>Funcionarios registrados</h1>
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

        <div id="container" className="">
          {children}
        </div>
      </div>
      
    </StyledEngineProvider>
  );
}