"use client";

import Link from "next/link";
import { Box, Button } from "@mui/material";

export default function CrearGrupoPage() {
  return (
    <Box className="mx-auto mt-4 flex w-11/12 flex-col justify-between gap-4 rounded-2xl bg-white p-2 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Crear Grupos</h2>
      <p className="text-center text-gray-600">
        Selecciona cómo deseas crear el grupo:
      </p>

      <div className="flex w-full flex-col items-center justify-around gap-4 text-center">
        <Link href="/admin/grupos/crear-manualmente" className="w-full sm:w-1/4">
          <Button
            className="w-full rounded-2xl bg-white p-4 text-base capitalize text-secondary hover:bg-primary hover:text-white"
            variant="contained"
          >
            Crear manualmente
          </Button>
        </Link>

        <Link href="/admin/grupos/crear-automaticamente" className="w-full sm:w-1/4">
          <Button
            className="w-full rounded-2xl bg-white p-4 text-base capitalize text-secondary hover:bg-primary hover:text-white"
            variant="contained"
          >
            Crear automáticamente
          </Button>
        </Link>
      </div>
    </Box>
  );
}
