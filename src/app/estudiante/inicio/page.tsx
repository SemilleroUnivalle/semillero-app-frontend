import Button from '@mui/material/Button';

import Slider from '@mui/material/Slider';
import { StyledEngineProvider } from '@mui/material/styles';


export default function Inicio() {
  return (

    <div className="pt-4">


      <div className="bg-white w-3/4 mx-auto rounded-lg text-center p-5">

      <h2 className="text-primary font-semibold"> Bienvenido/a estudiante</h2>

        Pagina de inicio del estudiante
     
      </div>

      <Button variant="contained" className='bg-black'>Hello world</Button>

      <Slider defaultValue={30} className="text-red-600" />
      </div>
  );
}
