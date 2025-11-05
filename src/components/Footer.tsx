import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // Usado como TikTok

export default function Footer() {
  return (
    <footer className="mt-16 flex w-full flex-col items-center justify-center p-4 text-white bg-cover bg-center bg-no-repeat "
    style={{ backgroundImage: "url('/footer.jpg')" }}>
      <div className="flex w-full flex-row items-center justify-around">
        <div>
          <Image
            className="m-4"
            src="/logoBlancoSemillero.png"
            alt="Logo Semillero"
            width={200}
            height={68}
            priority
          />
        </div>
        <div>
          <p className="text-sm">
            <span className="font-bold">E-mail:</span>{" "}
            semillero@correounivalle.edu.co <br />{" "}
            <span className="font-bold">Dirección:</span> Calle 13 No. 100 - 00{" "}
            <br /> Edificio B23 - Doris Hinestroza Gutiérrez - (Antiguo
            Multitaller) - Oficina A01 <br /> Ciudadela Universitaria Meléndez -
            Cali, Colombia
          </p>
        </div>
        <div>
          <p className="text-sm">
            <span className="font-bold">Horario de Atención Presencial:</span>{" "}
            <br /> Lunes a viernes <br /> - 8:00 a.m. a 12:00 m. <br /> - 2:00
            p.m. a 5:00 p.m.
          </p>
        </div>
        <div className="ml-6 flex flex-col items-center justify-center">
          <p className="mb-2 font-semibold">Síguenos:</p>
          <div className="flex flex-row gap-4 text-2xl">
            <a
              href="https://www.instagram.com/semillero.univalle/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-300"
            >
              <InstagramIcon fontSize="inherit" />
            </a>
            <a
              href="https://www.facebook.com/semillerounivalle/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gray-300"
            >
              <FacebookIcon fontSize="inherit" />
            </a>
            <a
              href="https://www.tiktok.com/@semillerounivalle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-gray-300"
            >
              <MusicNoteIcon fontSize="inherit" />
            </a>
          </div>
        </div>
      </div>

      <p className="p-5 text-center text-sm">
        &copy; {new Date().getFullYear()} Semillero Universidad del Valle. Todos
        los derechos reservados. <br />
        Desarrollado por Johan Sebastian Tombe Campo y César Alejandro Grijalba
        Zuñiga, bajo la dirección de la profesora Beatriz Florián Gaviria.{" "}
        <br />
        Proyecto realizado en la{" "}
        <span className="font-semibold">
          EISC - Escuela de Ingeniería de Sistemas y Computación
        </span>
        , como parte del grupo de investigación <span>GUIA</span>, laboratorio{" "}
        <span className="font-semibold">TEL &amp; STEAM</span>.
      </p>
      <p></p>
    </footer>
  );
}
