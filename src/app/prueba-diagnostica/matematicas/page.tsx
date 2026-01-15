"use client";

import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Chip,
  Alert,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

interface Respuesta {
  id_respuesta: number;
  texto_respuesta: string;
  es_correcta: boolean;
}

interface Pregunta {
  id_pregunta: number;
  texto_pregunta: string;
  imagen: string | null;
  respuestas: Respuesta[];
}

interface PruebaDiagnostica {
  id_prueba: number;
  nombre_prueba: string;
  descripcion: string;
  tiempo_limite: number;
  puntaje_minimo: string;
  estado: boolean;
  id_modulo: {
    id_modulo: number;
    nombre_modulo: string;
  };
  preguntas: Pregunta[];
}

const CursosStaticos = [
  {
    curso: "Enteros a los Racionales",
    imagen: "/prueba-diagnostica/geometria.svg",
    preguntas: [
      {
        id: 1,
        pregunta:
          "Si un buzo desciende 12 metros bajo el nivel del mar y luego asciende 7 metros, ¿cuál es su posición final respecto al nivel del mar?",
        imagen: null,
        opciones: {
          A: <InlineMath math="-3" />,
          B: <InlineMath math="-\frac{1}{2}" />,
          C: "0",
          D: <InlineMath math="\frac{1}{4}" />,
        },
        respuesta_correcta: "B",
      },
      {
        id: 2,
        pregunta: "¿Cuál de los siguientes números es mayor?",
        imagen: null,
        opciones: {
          A: "-3",
          B: "-1/2",
          C: "0",
          D: "1/4",
        },
        respuesta_correcta: "D",
      },
      {
        id: 3,
        pregunta:
          "En una ciudad la temperatura pasó de -4 °C a 3 °C. ¿Cuál fue el cambio total de temperatura?",
        imagen: null,
        opciones: {
          A: "7 °C",
          B: "-7 °C",
          C: "1 °C",
          D: "-1 °C",
        },
        respuesta_correcta: "A",
      },
      {
        id: 4,
        pregunta:
          "María debe recorrer 3/4 km para llegar a su casa y ya ha caminado 1/2 km. ¿Qué fracción del recorrido le falta?",
        imagen: null,
        opciones: {
          A: "1/4 km",
          B: "1/2 km",
          C: "2/4 km",
          D: "3/8 km",
        },
        respuesta_correcta: "A",
      },
      {
        id: 5,
        pregunta:
          "¿Cuál de las siguientes situaciones se representa con un número negativo?",
        imagen: null,
        opciones: {
          A: "Subir 5 pisos",
          B: "Ganar 4 puntos",
          C: "Bajar 3 metros",
          D: "Depositar dinero",
        },
        respuesta_correcta: "C",
      },
      {
        id: 6,
        pregunta:
          "Si se multiplica un número negativo por uno positivo, ¿el resultado siempre será?",
        imagen: null,
        opciones: {
          A: "Positivo",
          B: "Negativo",
          C: "Cero",
          D: "Depende del número",
        },
        respuesta_correcta: "B",
      },
      {
        id: 7,
        pregunta:
          "¿Cuál de los siguientes pares de fracciones representa números equivalentes?",
        imagen: null,
        opciones: {
          A: "2/3 y 4/9",
          B: "3/4 y 6/8",
          C: "1/2 y 3/6",
          D: "5/7 y 10/21",
        },
        respuesta_correcta: "B",
      },
      {
        id: 8,
        pregunta:
          "Un termómetro marca -2 °C. Luego baja 5 °C más. ¿Qué temperatura indica ahora?",
        imagen: null,
        opciones: {
          A: "-7 °C",
          B: "3 °C",
          C: "7 °C",
          D: "-3 °C",
        },
        respuesta_correcta: "A",
      },
      {
        id: 9,
        pregunta: "¿Cuál es el valor de la expresión: 3/5 - 1/4?",
        imagen: null,
        opciones: {
          A: "7/20",
          B: "2/1",
          C: "3/9",
          D: "8/9",
        },
        respuesta_correcta: "A",
      },
      {
        id: 10,
        pregunta:
          "Un estudiante recorrió -8 metros (hacia atrás) y luego avanzó 12 metros. ¿Cuál fue la distancia neta recorrida?",
        imagen: null,
        opciones: {
          A: "-20 metros",
          B: "-4 metros",
          C: "4 metros",
          D: "20 metros",
        },
        respuesta_correcta: "C",
      },
    ],
  },
  {
    curso: "Trigonometría",
    imagen: "/prueba-diagnostica/geometria.svg",
    preguntas: [
      {
        id: 1,
        pregunta:
          "Si un triángulo rectángulo tiene un ángulo de 30°, ¿qué razón trigonométrica relaciona el cateto opuesto con la hipotenusa?",
        imagen: null,
        opciones: {
          A: "Coseno",
          B: "Tangente",
          C: "Seno",
          D: "Secante",
        },
        respuesta_correcta: "C",
      },
      {
        id: 2,
        pregunta:
          "Un edificio proyecta una sombra de 20 m cuando el ángulo de elevación del sol es 45°. ¿Cuál es la altura del edificio?",
        imagen: null,
        opciones: {
          A: <InlineMath math="-3" />,
          B: <InlineMath math="-\frac{1}{2}" />,
          C: "0",
          D: <InlineMath math="\frac{1}{4}" />,
        },
        respuesta_correcta: "B",
      },
      {
        id: 3,
        pregunta: "¿Cuál de los siguientes valores corresponde a cos(0°)?",
        imagen: null,
        opciones: {
          A: "0",
          B: "1",
          C: "-1",
          D: "No existe",
        },
        respuesta_correcta: "B",
      },
      {
        id: 4,
        pregunta: "Si tan(θ) = 1, ¿cuál podría ser el valor de θ?",
        imagen: null,
        opciones: {
          A: "0°",
          B: "45°",
          C: "90°",
          D: "180°",
        },
        respuesta_correcta: "B",
      },
      {
        id: 5,
        pregunta:
          "En un triángulo rectángulo, si el cateto adyacente mide 8 y la hipotenusa 10, ¿cuál es el valor del coseno?",
        imagen: null,
        opciones: {
          A: "4/5",
          B: "3/5",
          C: "8/10",
          D: "2",
        },
        respuesta_correcta: "A",
      },
      {
        id: 6,
        pregunta:
          "¿Qué relación trigonométrica se define como cateto opuesto sobre cateto adyacente?",
        imagen: null,
        opciones: {
          A: "Seno",
          B: "Coseno",
          C: "Tangente",
          D: "Cotangente",
        },
        respuesta_correcta: "C",
      },
      {
        id: 7,
        pregunta: "Si sin(θ) = 0.5, ¿cuál podría ser θ?",
        imagen: null,
        opciones: {
          A: "30°",
          B: "45°",
          C: "60°",
          D: "90°",
        },
        respuesta_correcta: "A",
      },
      {
        id: 8,
        pregunta: "¿Cuál es el valor de sin(90°)?",
        imagen: null,
        opciones: {
          A: "0",
          B: "1",
          C: "-1",
          D: "No definido",
        },
        respuesta_correcta: "B",
      },
      {
        id: 9,
        pregunta:
          "En un triángulo rectángulo, si el cateto opuesto es 12 y el adyacente es 5, ¿cuál es tan(θ)?",
        imagen: null,
        opciones: {
          A: "12/5",
          B: "5/12",
          C: "17",
          D: "7",
        },
        respuesta_correcta: "A",
      },
      {
        id: 10,
        pregunta:
          "¿Cuál es la hipotenusa de un triángulo cuyos catetos miden 9 y 12?",
        imagen: null,
        opciones: {
          A: "15",
          B: "21",
          C: "3",
          D: "√27",
        },
        respuesta_correcta: "A",
      },
    ],
  },
  {
    curso: "Geometría",
    imagen: "/prueba-diagnostica/geometria.svg",
    preguntas: [
      {
        id: 1,
        pregunta:
          "¿Cuál es el área de un triángulo con base 10 cm y altura 8 cm?",
        imagen: null,
        opciones: {
          A: "40 cm²",
          B: "80 cm²",
          C: "20 cm²",
          D: "18 cm²",
        },
        respuesta_correcta: "A",
      },
      {
        id: 2,
        pregunta:
          "Un cuadrado tiene perímetro de 36 cm. ¿Cuál es la longitud de cada lado?",
        imagen: null,
        opciones: {
          A: "4 cm",
          B: "6 cm",
          C: "9 cm",
          D: "12 cm",
        },
        respuesta_correcta: "B",
      },
      {
        id: 3,
        pregunta: "¿Cuál es el volumen de un cubo cuyos lados miden 5 cm?",
        imagen: null,
        opciones: {
          A: "25 cm³",
          B: "75 cm³",
          C: "125 cm³",
          D: "15 cm³",
        },
        respuesta_correcta: "C",
      },
      {
        id: 4,
        pregunta: "Un círculo tiene radio 7 cm. ¿Cuál es su diámetro?",
        imagen: null,
        opciones: {
          A: "3.5 cm",
          B: "7 cm",
          C: "14 cm",
          D: "49 cm",
        },
        respuesta_correcta: "C",
      },
      {
        id: 5,
        pregunta:
          "Si dos ángulos son suplementarios y uno mide 50°, ¿cuánto mide el otro?",
        imagen: null,
        opciones: {
          A: "130°",
          B: "50°",
          C: "40°",
          D: "140°",
        },
        respuesta_correcta: "A",
      },
      {
        id: 6,
        pregunta: "¿Cuál es el área de un rectángulo de 9 cm por 4 cm?",
        imagen: null,
        opciones: {
          A: "13 cm²",
          B: "36 cm²",
          C: "45 cm²",
          D: "20 cm²",
        },
        respuesta_correcta: "B",
      },
      {
        id: 7,
        pregunta: "¿Cuál es la suma de los ángulos internos de un triángulo?",
        imagen: null,
        opciones: {
          A: "90°",
          B: "180°",
          C: "270°",
          D: "360°",
        },
        respuesta_correcta: "B",
      },
      {
        id: 8,
        pregunta:
          "Una caja rectangular mide 4 cm, 5 cm y 10 cm. ¿Cuál es su volumen?",
        imagen: null,
        opciones: {
          A: "19 cm³",
          B: "100 cm³",
          C: "200 cm³",
          D: "400 cm³",
        },
        respuesta_correcta: "C",
      },
      {
        id: 9,
        pregunta: "Un ángulo recto siempre mide:",
        imagen: null,
        opciones: {
          A: "60°",
          B: "90°",
          C: "180°",
          D: "45°",
        },
        respuesta_correcta: "B",
      },
      {
        id: 10,
        pregunta:
          "El perímetro de un triángulo con lados 7 cm, 8 cm y 9 cm es:",
        imagen: null,
        opciones: {
          A: "24 cm",
          B: "26 cm",
          C: "30 cm",
          D: "32 cm",
        },
        respuesta_correcta: "A",
      },
    ],
  },
];



interface RespuestaUsuario {
  preguntaId: number;
  respuestaSeleccionada: string;
  esCorrecta: boolean;
}

export default function Page() {
  // Estados principales
  const [pruebas, setPruebas] = useState<PruebaDiagnostica[]>([]);
  const [loadingPruebas, setLoadingPruebas] = useState(true);
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState<PruebaDiagnostica | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaUsuario[]>([]);
  const [respuestaActual, setRespuestaActual] = useState("");
  const [cuestionarioCompleto, setCuestionarioCompleto] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

  // Cargar pruebas diagnósticas disponibles
  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${API_BASE_URL}/prueba-diagnostica/prueba/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPruebas(response.data);
        }
      } catch (error) {
        console.error("Error al cargar las pruebas:", error);
      } finally {
        setLoadingPruebas(false);
      }
    };

    fetchPruebas();
  }, []);

  const preguntas = pruebaSeleccionada?.preguntas || [];
  const preguntaActual = preguntas[activeStep];

  // Calcular progreso
  const progreso =
    preguntas.length > 0 ? ((activeStep + 1) / preguntas.length) * 100 : 0;
  const respuestasCorrectas = respuestas.filter((r) => r.esCorrecta).length;

  // Manejar selección de prueba
  const handleSeleccionarPrueba = (prueba: PruebaDiagnostica) => {
    setPruebaSeleccionada(prueba);
    setActiveStep(0);
    setRespuestas([]);
    setRespuestaActual("");
    setCuestionarioCompleto(false);
    setMostrarResultados(false);
  };

  // Manejar cambio de respuesta
  const handleRespuestaChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRespuestaActual(event.target.value);
  };

  // Avanzar a la siguiente pregunta
  const handleSiguiente = () => {
    if (!respuestaActual || !preguntaActual) return;

    // Buscar la respuesta correcta
    const respuestaSeleccionadaObj = preguntaActual.respuestas.find(
      (r) => r.id_respuesta.toString() === respuestaActual
    );

    const nuevaRespuesta: RespuestaUsuario = {
      preguntaId: preguntaActual.id_pregunta,
      respuestaSeleccionada: respuestaActual,
      esCorrecta: respuestaSeleccionadaObj?.es_correcta || false,
    };

    const nuevasRespuestas = [
      ...respuestas.filter((r) => r.preguntaId !== preguntaActual.id_pregunta),
      nuevaRespuesta,
    ];
    setRespuestas(nuevasRespuestas);

    // Limpiar respuesta actual
    setRespuestaActual("");

    // Avanzar o completar
    if (activeStep < preguntas.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setCuestionarioCompleto(true);
      setMostrarResultados(true);
    }
  };

  // Retroceder a la pregunta anterior
  const handleAnterior = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      // Cargar respuesta anterior si existe
      const respuestaAnterior = respuestas.find(
        (r) => r.preguntaId === preguntas[activeStep - 1].id_pregunta,
      );
      setRespuestaActual(respuestaAnterior?.respuestaSeleccionada || "");
    }
  };

  // Reiniciar cuestionario
  const handleReiniciar = () => {
    setActiveStep(0);
    setRespuestas([]);
    setRespuestaActual("");
    setCuestionarioCompleto(false);
    setMostrarResultados(false);
  };

  // Volver a la selección de pruebas
  const handleVolverPruebas = () => {
    setPruebaSeleccionada(null);
    handleReiniciar();
  };

  // Obtener color del chip según la respuesta
  const getChipColor = (respuestaId: number) => {
    if (!cuestionarioCompleto || !preguntaActual) return "default";
    
    const respuesta = preguntaActual.respuestas.find(r => r.id_respuesta === respuestaId);
    if (!respuesta) return "default";
    
    if (respuesta.es_correcta) return "success";
    if (respuestaActual === respuestaId.toString()) return "error";
    return "default";
  };

  if (loadingPruebas) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="mx-auto mt-4 w-full rounded-2xl bg-white p-6 text-secondary shadow-md">
      <Typography
        variant="h4"
        className="mb-6 text-center font-bold text-primary"
      >
        Pruebas Diagnósticas Disponibles
      </Typography>

      {/* Selección de Prueba */}
      {pruebaSeleccionada === null && (
        <Box className="m-20">
          <Typography variant="h6" className="mb-4 text-center">
            Selecciona una prueba para comenzar:
          </Typography>
          {pruebas.length === 0 ? (
            <Typography className="text-center text-gray-500">
              No hay pruebas disponibles en este momento
            </Typography>
          ) : (
            <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pruebas.filter(p => p.estado).map((prueba) => (
                <Card
                  key={prueba.id_prueba}
                  className="flex cursor-pointer justify-center rounded-2xl bg-gray-200 hover:bg-red-100 hover:shadow-lg transition-all"
                  onClick={() => handleSeleccionarPrueba(prueba)}
                >
                  <CardContent className="my-auto text-center text-secondary w-full">
                    <Typography variant="h6" className="font-bold">
                      {prueba.nombre_prueba}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mt-2">
                      {prueba.id_modulo.nombre_modulo}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500 block mt-2">
                      {prueba.preguntas?.length || 0} preguntas
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Cuestionario */}
      {pruebaSeleccionada !== null && !mostrarResultados && (
        <Box>
          {/* Header del cuestionario */}
          <Box className="mb-6">
            <Box className="mb-4 flex items-center justify-between">
              <Box>
                <Typography variant="h6">{pruebaSeleccionada.nombre_prueba}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {pruebaSeleccionada.id_modulo.nombre_modulo}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                className="rounded-2xl border-primary text-primary hover:bg-primary/10"
                size="medium"
                onClick={handleVolverPruebas}
              >
                Cambiar Prueba
              </Button>
            </Box>

            {/* Barra de progreso */}
            <Box className="mb-4">
              <Box className="mb-2 flex justify-between">
                <Typography variant="body2">
                  Pregunta {activeStep + 1} de {preguntas.length}
                </Typography>
                <Typography variant="body2">
                  {Math.round(progreso)}% completado
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                color="error"
                value={progreso}
                className="h-2 rounded"
              />
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              className="mb-6"
              sx={{
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#c20e1a",
                },
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#c20e1a",
                },
              }}
            >
              {preguntas.map((_, index) => (
                <Step key={index} color="error">
                  <StepLabel color="error">
                    {respuestas.find(
                      (r) => r.preguntaId === preguntas[index].id_pregunta,
                    ) && (
                      <CheckCircleIcon
                        className="text-primary"
                        fontSize="small"
                      />
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Pregunta actual */}
          {preguntaActual && (
            <Card className="mb-6 shadow-none">
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  {activeStep + 1}. {preguntaActual.texto_pregunta}
                </Typography>

                {/* Imagen si existe */}
                {preguntaActual.imagen && (
                  <Box className="mb-4 text-center">
                    <img
                      src={preguntaActual.imagen}
                      alt="Imagen de la pregunta"
                      className="max-w-full rounded"
                    />
                  </Box>
                )}

                {/* Opciones de respuesta */}
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" className="mb-3">
                    Selecciona tu respuesta:
                  </FormLabel>
                  <RadioGroup
                    value={respuestaActual}
                    onChange={handleRespuestaChange}
                    color="error"
                  >
                    {preguntaActual.respuestas.map((respuesta, index) => (
                      <FormControlLabel
                        key={respuesta.id_respuesta}
                        value={respuesta.id_respuesta.toString()}
                        control={<Radio />}
                        label={
                          <Box className="flex items-center gap-2">
                            <Chip
                              label={String.fromCharCode(65 + index)}
                              size="small"
                              color={getChipColor(respuesta.id_respuesta)}
                              variant="outlined"
                            />
                            <Typography>{respuesta.texto_respuesta}</Typography>
                          </Box>
                        }
                        className="mb-2 rounded border p-2 transition-colors hover:bg-gray-50"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {/* Botones de navegación */}
          <Box className="flex justify-between">
            <Button
              className="rounded-2xl border-primary text-primary hover:bg-primary/10"
              onClick={handleAnterior}
              disabled={activeStep === 0}
              startIcon={<NavigateBeforeIcon />}
              variant="outlined"
            >
              Anterior
            </Button>

            <Button
              onClick={handleSiguiente}
              disabled={!respuestaActual}
              endIcon={<NavigateNextIcon />}
              className="rounded-2xl bg-primary text-white hover:shadow-primary"
              variant="contained"
            >
              {activeStep === preguntas.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Resultados */}
      {mostrarResultados && (
        <Box>
          <Typography variant="h5" className="mb-4 text-center">
            ¡Cuestionario Completado!
          </Typography>

          <Card className="mb-6 shadow-none">
            <CardContent className="text-center">
              <Typography variant="h6" className="mb-2">
                Resultados de: {pruebaSeleccionada?.nombre_prueba}
              </Typography>
              <Typography variant="h4" className="mb-2 font-bold text-primary">
                {respuestasCorrectas} / {preguntas.length}
              </Typography>
              <Typography variant="body1" className="mb-4">
                Porcentaje:{" "}
                {Math.round((respuestasCorrectas / preguntas.length) * 100)}%
              </Typography>

              {/* Calificación */}
              {respuestasCorrectas / preguntas.length >= 0.8 ? (
                <Box className="mx-auto w-3/4 rounded-2xl bg-primary/10 p-4">
                  <Typography align="justify">
                    Has obtenido un resultado excelente en la prueba
                    diagnóstica. Tu nivel de desempeño indica que dominas los
                    contenidos de este curso, por lo que estás listo para
                    continuar avanzando. <br />
                    <br />
                    Te recomendamos tomar la prueba del siguiente curso para
                    seguir con tu proceso de aprendizaje y potenciar aún más tus
                    habilidades. ¡Sigue así!
                  </Typography>
                </Box>
              ) : respuestasCorrectas / preguntas.length >= 0.5 ? (
                <Alert severity="warning">
                  Buen intento. Te recomendamos repasar algunos conceptos.
                </Alert>
              ) : (
                <Box className="mx-auto w-3/4 rounded-2xl bg-primary/10 p-4">
                  <Typography align="justify">
                    Hemos analizado tus resultados y, por ahora, no alcanzaste
                    el puntaje mínimo requerido para este curso. <br /> Esto no
                    significa que no puedas lograrlo: simplemente indica que
                    necesitas reforzar algunos conocimientos previos. <br />{" "}
                    <br /> Para mejorar tu aprendizaje y garantizar tu éxito, te
                    recomendamos realizar la prueba del curso anterior, donde
                    podrás encontrar contenidos base que te ayudarán a avanzar
                    con mayor seguridad. <br /> <br /> Cuando estés listo,
                    puedes comenzar la prueba recomendada haciendo clic en el
                    botón correspondiente.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <Box className="flex justify-center gap-4">
            <Button
              onClick={handleReiniciar}
              startIcon={<RestartAltIcon />}
              className="rounded-2xl border-primary text-primary hover:bg-primary/10"
              variant="outlined"
            >
              Repetir Cuestionario
            </Button>
            <Button
              onClick={handleVolverPruebas}
              variant="contained"
              className="rounded-2xl bg-primary text-white hover:shadow-primary"
            >
              Seleccionar Otra Prueba
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
