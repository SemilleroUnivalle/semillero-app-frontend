import Image from "next/image";
import Footer from "@/components/Footer";
import { StyledEngineProvider } from "@mui/material/styles";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex min-h-screen flex-col">
        <div className="p-5">
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
        <div className="m-auto flex w-3/5 items-center justify-center">
          {children}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </StyledEngineProvider>
  );
}
