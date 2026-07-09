'use client';

import { Box, Button } from "@mui/material";
import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';

export default function Inicio() {


  return (
    <div className="pt-4">
      <div className="mx-auto w-11/12 rounded-lg bg-white p-5 text-center content-center">
        <h2 className="font-semibold text-primary text-lg"> Bienvenido/a estudiante</h2>

        <p className="text-md text-gray-500 my-4">
          Recuerda antes de realizar una nueva matrícula, revisar tu información personal en el apartado de "Perfil".
        </p>
        <Box className="flex justify-center my-4">

          <Button variant="outlined" className="buttons-secondary" startIcon={<AddIcon />} href="/estudiante/nueva-matricula">


            Nueva Matricula
          </Button>

        </Box>
      </div>
    </div>
  );
}