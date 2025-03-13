import "./auth.css";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Image
<<<<<<< HEAD
          className=""
          src="/logoSemillero.png"
          alt="Logo Semillero"
          width={250}
=======
          className="m-4"
          src="/logoSemillero.png"
          alt="Logo Semillero"
          width={200}
>>>>>>> e81d02fa03943ebade2d7e9c65e66fe0f1932c5c
          height={68}
          priority
        />
      </div>
<<<<<<< HEAD
      <div className="items-center justify-center">{children}</div>
=======
      <div className="flex items-center justify-center">
        <Image
          className="mx-20 hidden w-1 flex-grow md:block"
          src="/estudiante.png"
          alt="Logo Semillero"
          width={516}
          height={516}
          priority
        />

        <div className="w-min flex-grow">{children}</div>

        <Image
          className="mx-20 hidden w-1 flex-grow md:block"
          src="/estudiando.png"
          alt="Logo Semillero"
          width={516}
          height={516}
          priority
        ></Image>
      </div>
>>>>>>> e81d02fa03943ebade2d7e9c65e66fe0f1932c5c
    </div>
  );
}
