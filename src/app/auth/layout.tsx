import "./auth.css";
import Image from "next/image";
import "../globals.css";
import Footer from "@/components/Footer";
import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";

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
          /></Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="hidden w-min flex-grow p-20 md:block">
            <Image
              className="mx-auto hidden w-3/4 md:block"
              src="/estudiante.png"
              alt="Logo Semillero"
              width={516}
              height={516}
              priority
            />
          </div>

          <div className="w-11/12 flex-grow">{children}</div>

          <div className="hidden w-min flex-grow p-20 md:block">
            <Image
              className="mx-auto hidden w-3/4 md:block"
              src="/estudiando.png"
              alt="Logo Semillero"
              width={516}
              height={516}
              priority
            ></Image>
          </div>
        </div>

      </div>
      <Footer />

    </StyledEngineProvider>
  );
}
