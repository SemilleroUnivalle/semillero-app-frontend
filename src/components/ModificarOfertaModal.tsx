import { Modal, Box, Typography, Button } from "@mui/material";

interface ModificarOfertaModalProps {
    open: boolean;
    onClose: () => void;
    data: any; // Puedes reemplazar `any` con un tipo específico si lo tienes
  }

export default function ModificarOfertaModal({
    open,
    onClose,
    data,
  }: ModificarOfertaModalProps) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box className="p-4 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-20">
          <Typography variant="h6" gutterBottom>
            Modificar Oferta
          </Typography>
          {data && (
            <>
              <Typography>ID: {data.id}</Typography>
              <Typography>Nombre: {data.nombre}</Typography>
            </>
          )}
          <Button onClick={onClose} className="mt-4" variant="contained">
            Cerrar
          </Button>
        </Box>
      </Modal>
    );
  }
  