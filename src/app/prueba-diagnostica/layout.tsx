import Image from "next/image";
import "../globals.css";
import Footer from "@/components/Footer";
import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";
import "katex/dist/katex.min.css"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <div className="p-5">
       
        <div className="">
          <Link href={"/auth/login"}>
            <Image
              className="m-4"
              src="/logoSemillero.png"
              alt="Logo Semillero"
              width={200}
              height={68}
              priority
            />
          </Link>
        </div>
        <div className="flex items-center justify-center w-3/5 m-auto">
          {children}
        </div>
        {/* ✅ Imagen decorativa en la parte inferior izquierda */}
        <div className="absolute bottom-0 left-0 hidden md:block z-0"> {/* z-0 para estar debajo */}
          <Image
            src="/prueba-diagnostica/decoracion.svg"
            alt="Decoración"
            width={300} // ✅ Tamaño más pequeño para que no interfiera
            height={300}
            priority
            className="opacity-30" // ✅ Opcional: semi-transparente para que no distraiga
          />
        </div>
      </div>
      <Footer />
    </StyledEngineProvider>
  );
}
