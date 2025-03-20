import Image from "next/image";

export default function Inicio() {
  return (
    <div className="pt-4">
      <div className="mx-auto w-3/4 rounded-lg bg-white p-5 text-center content-center">
        <h2 className="font-semibold text-primary text-lg"> Bienvenido/a estudiante</h2>

        <div className="w-full">
          <Image
          className="mt-3 mx-auto"
            src="/oferta_2025A.jpg"
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
