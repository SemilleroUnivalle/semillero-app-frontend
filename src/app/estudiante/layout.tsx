import "../globals.css";
import Image from "next/image";
import { StyledEngineProvider } from "@mui/material/styles";

import Navbar from "../../components/Navbar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (

    <StyledEngineProvider injectFirst>

    <div className="">
        <div className="bg-white p-4"><h1 className="">Semillero Univalle</h1>
        <div className=" flex justify-around items-center mx-auto w-3/4 rounded-2xl bg-[#e8e8e8] p-2">
          <Navbar></Navbar>
        </div></div>
      <div id="container" className="w-full">{children}</div>
    </div>
    </StyledEngineProvider>
  );
}
