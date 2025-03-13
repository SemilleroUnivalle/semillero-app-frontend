import "../globals.css";
import Image from "next/image";
import Navbar from "../../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="bg-white">
        <h1 className="">Semillero Univalle - Estudiante</h1>
        <Navbar></Navbar>
      </div>
      <div className="">{children}</div>
    </div>
  );
}
