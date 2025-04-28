import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";
import { Button } from "@mui/material";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-col">
        <h1>Oferta Académica</h1>

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
