import "./auth.css";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Image
          className="m-4"
          src="/logoSemillero.png"
          alt="Logo Semillero"
          width={200}
          height={68}
          priority
        />
      </div>
      <div className="mt-20 flex items-center justify-center">
        <div className="w-min hidden flex-grow p-20 md:block">
          <Image
            className="w-3/4 mx-auto hidden md:block"
            src="/estudiante.png"
            alt="Logo Semillero"
            width={516}
            height={516}
            priority
          />
        </div>

        <div className="w-min flex-grow">{children}</div>

        <div className="w-min hidden flex-grow p-20 md:block">
          <Image
            className="w-3/4 mx-auto hidden md:block"
            src="/estudiando.png"
            alt="Logo Semillero"
            width={516}
            height={516}
            priority
          ></Image>
        </div>
      </div>
    </div>
  );
}
