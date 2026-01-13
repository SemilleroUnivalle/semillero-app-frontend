"use client";
import "../globals.css";
import { StyledEngineProvider } from "@mui/material/styles";


import Sidebar from "../../components/Sidebar";
import Footer from "@/components/Footer";


export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-row">
        <Sidebar />
        <div id="container" className="w-4/5 p-5">
          {children}
        </div>
      </div>
      <Footer />
    </StyledEngineProvider>
  );
}
