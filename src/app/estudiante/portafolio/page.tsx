"use client";

import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import {
  CloudUploadOutlined,
  SchoolOutlined,
  EmojiEventsOutlined,
} from "@mui/icons-material";
import Link from "next/link";

export default function Portafolio() {
  return (
    <div className="mx-auto mt-4 w-11/12 rounded-2xl bg-white bg-gradient-to-br p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-primary">
            Mi Portafolio
          </h1>
          <p className="text-gray-600">Visualiza tus certificados </p>
        </div>

        {/* Empty State Card */}
        <Card className="rounded-2xl border border-blue-100 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16">
            {/* Icon */}
            <div className="mb-6">
              <EmojiEventsOutlined
                sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }}
              />
            </div>

            {/* Main Message */}
            <Typography
              variant="h5"
              className="mb-3 text-center font-bold text-gray-700"
            >
              Aún no tienes certificados
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              className="mb-6 max-w-sm text-center text-gray-600"
            >
              No tienes notas ni certificados disponibles. Cuando finalices un
              curso, podrás visualizar tus certificados aquí.
            </Typography>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-3">
              <Link href="/estudiante/matriculas" className="w-full">
                <Button
                  className="rounded-2xl bg-primary"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#3b82f6",
                    padding: "10px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "",
                    },
                  }}
                >
                  Ver mis cursos matriculados
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">💡 Tip:</span> Revisa regularmente
            esta sección para descargar tus certificados una vez que completes
            tus cursos.
          </p>
        </div>
      </div>
    </div>
  );
}
