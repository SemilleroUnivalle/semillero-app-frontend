import "./auth.css";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Image
          className=""
          src="/logoSemillero.png"
          alt="Logo Semillero"
          width={250}
          height={68}
          priority
        />
      </div>
      <div className="items-center justify-center">{children}</div>
    </div>
  );
}
