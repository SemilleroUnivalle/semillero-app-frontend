import "../globals.css";

import { StyledEngineProvider } from "@mui/material/styles";
import Sidebar from "../../components/Sidebar";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-row">
        <div className="h-screen w-1/5 bg-white p-4">
          <h1 className="block md:hidden text-center">SUV</h1>
          <h1 className="hidden md:block">Semillero Univalle</h1>
          <div className="mx-auto flex w-full flex-col justify-around mt-2">
            <Sidebar></Sidebar>
          </div>
        </div>
        <div id="container" className="w-4/5 p-5">
          {children}
        </div>
      </div>
    </StyledEngineProvider>
  );
}
