import { TextField, InputLabel, Select, MenuItem } from "@mui/material";

export default function Perfil() {
  return (
    <div className="mx-auto my-4 w-3/4 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="text-center text-lg font-semibold text-primary">
        Tu información
      </h2>

      <div className="my-4 flex justify-center">
        <input type="file" className="block w-full text-sm text-gray-500" />
      </div>

      <form className="flex flex-wrap justify-around gap-2 text-gray-600">
        {/* Campo Primer Nombre */}
        {/* <div className="flex w-full flex-col sm:w-1/4">
          <label htmlFor="nombres" className="text-sm font-medium">
            Nombres
          </label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            className="mt-1 w-full px-4 py-2 uppercase text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div> */}

        <TextField
          className="flex w-full flex-col sm:w-1/4"
          label="Nombres"
          name="nombres"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem", // Cambia el radio
              "& fieldset": { borderColor: "#374151" }, // Borde normal (gris oscuro)
              "&:hover fieldset": { borderColor: "red" }, // Borde al pasar el mouse
              "&.Mui-focused fieldset": { borderColor: "red" }, // Borde al enfocar
            },
          }}
          // value={formData.nombre}
          // onChange={handleChange}
        />
        <TextField
          className="flex w-full flex-col sm:w-1/4"
          label="Apellidos"
          name="apellidos"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem", // Cambia el radio
              "& fieldset": { borderColor: "374151" }, // Borde normal (gris oscuro)
              "&:hover fieldset": { borderColor: "red" }, // Borde al pasar el mouse
              "&.Mui-focused fieldset": { borderColor: "red" }, // Borde al enfocar
            },
          }}
          // value={formData.nombre}
          // onChange={handleChange}
        />

        <InputLabel id="tipo_documento">Tipo de documento</InputLabel>
        <Select
          className=""
          labelId="tipo_documento"
          id="tipo_documento"
          label="Tipo de documento"
          // value={age}
          // onChange={handleChange}
        >
          <MenuItem value={10}>T.I.</MenuItem>
          <MenuItem value={20}>C.C.</MenuItem>
          <MenuItem value={30}>C.E.</MenuItem>
        </Select>

        <TextField
          className="flex w-full flex-col sm:w-1/4"
          label="Número de identificación"
          name="documento"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem", // Cambia el radio
              "& fieldset": { borderColor: "#374151" }, // Borde normal (gris oscuro)
              "&:hover fieldset": { borderColor: "red" }, // Borde al pasar el mouse
              "&.Mui-focused fieldset": { borderColor: "red" }, // Borde al enfocar
              "& .MuiInputLabel-root": { color: "#6b7280" }, // Color inicial del label (gris)
              "& .MuiInputLabel-root.Mui-focused": { color: "#374151" }, // Color del label al enfocar (gris oscuro)
            },
            "& .MuiInputLabel-root": { color: "#6b7280" }, // Color inicial del label (gris)
            "& .MuiInputLabel-root.Mui-focused": { color: "#374151" }, // Color del label al enfocar (gris oscuro)
          }}
          // value={formData.nombre}
          // onChange={handleChange}
        />
      </form>
    </div>
  );
}
