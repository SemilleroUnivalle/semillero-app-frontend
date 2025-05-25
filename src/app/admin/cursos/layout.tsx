import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";
import { Button } from "@mui/material";

export default function LayoutCursos({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-col">
        <h1>Catálogo de cursos</h1>

        {/* Contenedor de botones para crear ofertas y cursos */}
        <div className="mx-auto my-4 flex w-11/12 flex-wrap justify-around gap-2">
          <Link href="/admin/cursos/verCursos/" className="w-full sm:w-1/4">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white"
              variant="contained"
            >
              Ver Cursos
            </Button>
          </Link>
          <Link href="/admin/cursos/crearCursos/" className="w-full sm:w-1/4">
            <Button
              className="w-full rounded-2xl bg-white p-4 capitalize text-secondary hover:bg-primary hover:text-white"
              variant="contained"
            >
              Crear Cursos
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
