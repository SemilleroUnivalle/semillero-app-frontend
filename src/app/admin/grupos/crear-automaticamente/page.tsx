"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  TextField,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { Matricula } from "@/interfaces/interfaces";
import { API_BASE_URL } from "../../../../../config";

// Interfaces para docentes y monitores
interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  numero_documento?: string;
}

interface Monitor {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  numero_documento?: string;
}

export default function CrearGruposAutomatico() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [filteredMatriculas, setFilteredMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para docentes y monitores
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  // const [loadingDocentes, setLoadingDocentes] = useState(false);
  // const [loadingMonitores, setLoadingMonitores] = useState(false);

  // Estados para eleccion de profesor y monitor
  const [selectedMonitoresPorGrupo, setSelectedMonitoresPorGrupo] = useState<{
    [key: number]: Monitor | null;
  }>({});
  const [selectedDocentesPorGrupo, setSelectedDocentesPorGrupo] = useState<{
    [key: number]: Docente | null;
  }>({});

  // Estados para filtros
  const [selectedPeriodos, setSelectedPeriodos] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedModulos, setSelectedModulos] = useState<string[]>([]);

  // Estados para configuración de grupos automáticos
  const [tipoCreacion, setTipoCreacion] = useState<
    "cantidad_grupos" | "estudiantes_por_grupo"
  >("cantidad_grupos");
  const [cantidadGrupos, setCantidadGrupos] = useState<number>(0);
  const [estudiantesPorGrupo, setEstudiantesPorGrupo] = useState<number>(0);
  const [prefijoNombre, setPrefijoNombre] = useState<string>("Grupo");

  // Función para manejar selección de monitor por grupo
  const handleMonitorSelection = (
    grupoIndex: number,
    monitor: Monitor | null,
  ) => {
    setSelectedMonitoresPorGrupo((prev) => ({
      ...prev,
      [grupoIndex]: monitor,
    }));
  };

  // Función para manejar selección de docente por grupo
  const handleDocenteSelection = (
    grupoIndex: number,
    docente: Docente | null,
  ) => {
    setSelectedDocentesPorGrupo((prev) => ({
      ...prev,
      [grupoIndex]: docente,
    }));
  };

  // Estado para la creación de grupos
  const [creatingGroups, setCreatingGroups] = useState(false);

  // Función para obtener token
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.token;
    }
    return "";
  };

  // Fetch matriculas data
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/matricula/mat/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Matricula[] = await response.json();

        const estudiantesSinGrupo = data.filter(
          (matricula: Matricula) => matricula.grupo === null,
        );

        setMatriculas(estudiantesSinGrupo);
        setFilteredMatriculas(estudiantesSinGrupo);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  // Fetch docentes
  useEffect(() => {
    const fetchDocentes = async () => {
      // setLoadingDocentes(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/profesor/prof`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Docente[] = await response.json();
        setDocentes(data);
      } catch (err) {
        console.error("Error fetching docentes:", err);
      } finally {
        // setLoadingDocentes(false);
      }
    };

    fetchDocentes();
  }, []);

  // Fetch monitores
  useEffect(() => {
    const fetchMonitores = async () => {
      // setLoadingMonitores(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/monitor_academico/mon`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Monitor[] = await response.json();
        setMonitores(data);
      } catch (err) {
        console.error("Error fetching monitores:", err);
      } finally {
        // setLoadingMonitores(false);
      }
    };

    fetchMonitores();
  }, []);

  // Efecto para aplicar filtros
  useEffect(() => {
    const filtered = matriculas.filter((matricula) => {
      const matchPeriodo =
        selectedPeriodos.length === 0 ||
        selectedPeriodos.includes(
          matricula.oferta_categoria.id_oferta_academica.nombre,
        );
      const matchCategoria =
        selectedCategorias.length === 0 ||
        selectedCategorias.includes(matricula.modulo.id_categoria.nombre);
      const matchModulo =
        selectedModulos.length === 0 ||
        selectedModulos.includes(matricula.modulo.nombre_modulo);

      return matchPeriodo && matchCategoria && matchModulo;
    });

    setFilteredMatriculas(filtered);
  }, [selectedPeriodos, selectedCategorias, selectedModulos, matriculas]);

  // Handlers para filtros
  const handleChangePeriodos = (
    event: SelectChangeEvent<typeof selectedPeriodos>,
  ) => {
    const value = event.target.value;
    setSelectedPeriodos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeCategorias = (
    event: SelectChangeEvent<typeof selectedCategorias>,
  ) => {
    const value = event.target.value;
    setSelectedCategorias(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeModulos = (
    event: SelectChangeEvent<typeof selectedModulos>,
  ) => {
    const value = event.target.value;
    setSelectedModulos(typeof value === "string" ? value.split(",") : value);
  };

  // Función para verificar si un monitor ya está seleccionado en otro grupo
  const isMonitorAlreadySelected = (
    monitorId: number,
    currentGrupoIndex: number,
  ) => {
    return Object.entries(selectedMonitoresPorGrupo).some(
      ([grupoIdx, monitor]) =>
        Number(grupoIdx) !== currentGrupoIndex && monitor?.id === monitorId,
    );
  };

  const isDocenteAlreadySelected = (
    docenteId: number,
    currentGrupoIndex: number,
  ) => {
    return Object.entries(selectedDocentesPorGrupo).some(
      ([grupoIdx, docente]) =>
        Number(grupoIdx) !== currentGrupoIndex && docente?.id === docenteId,
    );
  };

  // Obtener monitores disponibles para un grupo específico
  const getAvailableMonitoresForGrupo = (grupoIndex: number) => {
    return monitores.filter(
      (monitor) => !isMonitorAlreadySelected(monitor.id, grupoIndex),
    );
  };

  const getAvailableDocentesForGrupo = (grupoIndex: number) => {
    return docentes.filter(
      (docente) => !isDocenteAlreadySelected(docente.id, grupoIndex),
    );
  };

  // Limpiar selecciones de monitores cuando cambian los grupos
  React.useEffect(() => {
    setSelectedMonitoresPorGrupo({});
  }, [cantidadGrupos]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSelectedPeriodos([]);
    setSelectedCategorias([]);
    setSelectedModulos([]);
  };

  // Función para mezclar array (algoritmo Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Función para dividir estudiantes en grupos
  // const dividirEnGrupos = (estudiantes: Matricula[]) => {
  //   const estudiantesMezclados = shuffleArray(estudiantes);
  //   const grupos: Matricula[][] = [];

  //   if (tipoCreacion === "cantidad_grupos") {
  //     // Dividir por cantidad de grupos
  //     const estudiantesPorGrupoCalculado = Math.ceil(
  //       estudiantesMezclados.length / cantidadGrupos,
  //     );

  //     for (let i = 0; i < cantidadGrupos; i++) {
  //       const inicio = i * estudiantesPorGrupoCalculado;
  //       const fin = inicio + estudiantesPorGrupoCalculado;
  //       const grupo = estudiantesMezclados.slice(inicio, fin);
  //       if (grupo.length > 0) {
  //         grupos.push(grupo);
  //       }
  //     }
  //   } else {
  //     // Dividir por estudiantes por grupo
  //     for (
  //       let i = 0;
  //       i < estudiantesMezclados.length;
  //       i += estudiantesPorGrupo
  //     ) {
  //       const grupo = estudiantesMezclados.slice(i, i + estudiantesPorGrupo);
  //       grupos.push(grupo);
  //     }
  //   }

  //   return grupos;
  // };

  // Función para crear grupos automáticamente
  const handleCreateAutomaticGroups = async () => {
    // Validaciones
    if (filteredMatriculas.length === 0) {
      alert("No hay estudiantes disponibles con los filtros seleccionados");
      return;
    }

    if (tipoCreacion === "cantidad_grupos" && cantidadGrupos < 1) {
      alert("Debe especificar al menos 1 grupo");
      return;
    }

    if (tipoCreacion === "estudiantes_por_grupo" && estudiantesPorGrupo < 1) {
      alert("Debe especificar al menos 1 estudiante por grupo");
      return;
    }

    if (!prefijoNombre.trim()) {
      alert("Debe ingresar un prefijo para el nombre de los grupos");
      return;
    }

    // // Verificar que todos los grupos tengan monitor asignado
    // const gruposConMonitor = Object.keys(selectedMonitoresPorGrupo).length;
    // if (gruposConMonitor !== gruposPreview.length) {
    //   alert("Debe asignar un monitor a cada grupo antes de crear");
    //   return;
    // }

    // Usar la función optimizada para crear grupos reales
    const grupos = dividirEnGruposParaCreacion(filteredMatriculas);

    setCreatingGroups(true);

    try {
      const token = getToken();

      // Crear grupos y asignar estudiantes
      const resultados = [];

      for (let i = 0; i < grupos.length; i++) {
        const grupo = grupos[i];
        const monitor = selectedMonitoresPorGrupo[i] || monitores[0];
        const docente = selectedDocentesPorGrupo[i] || docentes[0];

        // if (!monitor) {
        //   throw new Error(`No hay monitor asignado para el grupo ${i + 1}`);
        // }
        if (!docente) {
          throw new Error(`No hay docente asignado para el grupo ${i + 1}`);
        }

        // Crear el grupo
        const groupData = {
          nombre: `${prefijoNombre.trim()} ${i + 1}`,
          profesor: docente.id,
          monitor_academico: monitor?.id,
        };

        const response = await fetch(`${API_BASE_URL}/grupo/grupo/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groupData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }

        const createdGroup = await response.json();

        // Asignar estudiantes al grupo
        const updatePromises = grupo.map(async (matricula) => {
          const updateResponse = await fetch(
            `${API_BASE_URL}/matricula/mat/${matricula.id_inscripcion}/`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                grupo: createdGroup.id,
              }),
            },
          );

          if (!updateResponse.ok) {
            throw new Error(
              `Error updating student ${matricula.id_inscripcion}: ${updateResponse.status}`,
            );
          }

          return await updateResponse.json();
        });

        await Promise.all(updatePromises);

        resultados.push({
          grupo: createdGroup,
          estudiantes: grupo,
          docente,
          monitor,
        });
      }

      // Mostrar mensaje de éxito
      alert(`¡${grupos.length} grupos creados exitosamente!

Resumen:
- Total de estudiantes asignados: ${filteredMatriculas.length}
- Grupos creados: ${grupos.length}
- Estudiantes por grupo: ${grupos.map((g) => g.length).join(", ")}

Los grupos han sido creados y los estudiantes han sido asignados automáticamente.`);

      // Limpiar formulario
      setPrefijoNombre("Grupo");
      setCantidadGrupos(1);
      setEstudiantesPorGrupo(5);
      clearFilters();
    } catch (err) {
      console.error("Error creating automatic groups:", err);
      alert(
        `Error al crear los grupos automáticamente: ${err instanceof Error ? err.message : "Error desconocido"}`,
      );
    } finally {
      setCreatingGroups(false);
    }
  };

  // Agregar handlers optimizados para los inputs
  const handleCantidadGruposChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
        setCantidadGrupos(value === "" ? 1 : Number(value));
      }
    },
    [],
  );

  const handleEstudiantesPorGrupoChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
        setEstudiantesPorGrupo(value === "" ? 1 : Number(value));
      }
    },
    [],
  );

  // Calcular previsualización de grupos
  const gruposPreview = React.useMemo(() => {
    if (
      filteredMatriculas.length === 0 ||
      (tipoCreacion === "cantidad_grupos" && cantidadGrupos === 0) ||
      (tipoCreacion === "estudiantes_por_grupo" && estudiantesPorGrupo === 0)
    ) {
      return [];
    }

    // NO mezclar para el preview, solo dividir
    const grupos: Matricula[][] = [];

    if (tipoCreacion === "cantidad_grupos" && cantidadGrupos > 0) {
      const estudiantesPorGrupoCalculado = Math.ceil(
        filteredMatriculas.length / cantidadGrupos,
      );

      for (let i = 0; i < cantidadGrupos; i++) {
        const inicio = i * estudiantesPorGrupoCalculado;
        const fin = inicio + estudiantesPorGrupoCalculado;
        const grupo = filteredMatriculas.slice(inicio, fin);
        if (grupo.length > 0) {
          grupos.push(grupo);
        }
      }
    } else if (
      tipoCreacion === "estudiantes_por_grupo" &&
      estudiantesPorGrupo > 0
    ) {
      for (let i = 0; i < filteredMatriculas.length; i += estudiantesPorGrupo) {
        const grupo = filteredMatriculas.slice(i, i + estudiantesPorGrupo);
        grupos.push(grupo);
      }
    }

    return grupos;
  }, [filteredMatriculas, tipoCreacion, cantidadGrupos, estudiantesPorGrupo]);

  const dividirEnGruposParaCreacion = React.useCallback(
    (estudiantes: Matricula[]) => {
      const estudiantesMezclados = shuffleArray(estudiantes);
      const grupos: Matricula[][] = [];

      if (tipoCreacion === "cantidad_grupos") {
        const estudiantesPorGrupoCalculado = Math.ceil(
          estudiantesMezclados.length / cantidadGrupos,
        );

        for (let i = 0; i < cantidadGrupos; i++) {
          const inicio = i * estudiantesPorGrupoCalculado;
          const fin = inicio + estudiantesPorGrupoCalculado;
          const grupo = estudiantesMezclados.slice(inicio, fin);
          if (grupo.length > 0) {
            grupos.push(grupo);
          }
        }
      } else {
        for (
          let i = 0;
          i < estudiantesMezclados.length;
          i += estudiantesPorGrupo
        ) {
          const grupo = estudiantesMezclados.slice(i, i + estudiantesPorGrupo);
          grupos.push(grupo);
        }
      }

      return grupos;
    },
    [tipoCreacion, cantidadGrupos, estudiantesPorGrupo],
  );

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="mx-auto mt-4 flex w-11/12 flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Crear Grupos Automáticamente
      </h2>

      {/* Filtros para seleccionar estudiantes */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography className="mb-2 font-semibold text-gray-600">
          Filtros de Estudiantes
        </Typography>

        <Box className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Filtro por Periodos */}
          <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
            <InputLabel>Periodos</InputLabel>
            <Select
              multiple
              value={selectedPeriodos}
              onChange={handleChangePeriodos}
              renderValue={(selected) => selected.join(", ")}
              label="Periodos"
            >
              {[
                ...new Set(
                  (matriculas || [])
                    .filter(
                      (est) =>
                        est?.oferta_categoria?.id_oferta_academica?.nombre,
                    )
                    .map(
                      (est) => est.oferta_categoria.id_oferta_academica.nombre,
                    ),
                ),
              ]
                .sort()
                .map((periodo) => (
                  <MenuItem key={periodo} value={periodo}>
                    <Typography>{periodo}</Typography>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Filtro por Categorías */}
          <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
            <InputLabel>Categorías</InputLabel>
            <Select
              multiple
              value={selectedCategorias}
              onChange={handleChangeCategorias}
              renderValue={(selected) => selected.join(", ")}
              label="Categorias"
            >
              {[
                ...new Set(
                  (matriculas || [])
                    .filter((est) => est?.modulo?.id_categoria?.nombre)
                    .map((est) => est.modulo.id_categoria.nombre),
                ),
              ]
                .sort()
                .map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    <Typography>{categoria}</Typography>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Filtro por Módulos */}
          <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
            <InputLabel>Módulos</InputLabel>
            <Select
              multiple
              value={selectedModulos}
              onChange={handleChangeModulos}
              renderValue={(selected) => selected.join(", ")}
              label="Módulos"
            >
              {[
                ...new Set(
                  (matriculas || [])
                    .filter((est) => est?.modulo?.nombre_modulo)
                    .map((est) => est.modulo.nombre_modulo),
                ),
              ]
                .sort()
                .map((modulo) => (
                  <MenuItem key={modulo} value={modulo}>
                    <Typography>{modulo}</Typography>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Estudiantes filtrados: {filteredMatriculas.length}
        </Typography>
      </Card>

      {/* Configuración de creación automática */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography className="mb-4 font-semibold text-gray-600">
          Configuración de Grupos
        </Typography>

        <Box className="flex flex-wrap justify-around gap-4 text-gray-600">
          {/* Prefijo del nombre */}
          <TextField
            label="Prefijo del Nombre"
            variant="outlined"
            value={prefijoNombre}
            onChange={(e) => setPrefijoNombre(e.target.value)}
            placeholder="Ej: Grupo, Equipo, etc."
            className="inputs-textfield flex w-full flex-col sm:w-1/4"
          />

          {/* Tipo de creación */}
          <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/4">
            <FormLabel component="legend">Tipo de Creación</FormLabel>
            <RadioGroup
              value={tipoCreacion}
              onChange={(e) =>
                setTipoCreacion(
                  e.target.value as "cantidad_grupos" | "estudiantes_por_grupo",
                )
              }
            >
              <FormControlLabel
                value="cantidad_grupos"
                control={<Radio />}
                label="Por cantidad de grupos"
              />
              <FormControlLabel
                value="estudiantes_por_grupo"
                control={<Radio />}
                label="Por estudiantes por grupo"
              />
            </RadioGroup>
          </FormControl>

          {/* Input dinámico según tipo de creación */}
          {tipoCreacion === "cantidad_grupos" ? (
            <TextField
              label="Cantidad de Grupos"
              type="number"
              variant="outlined"
              value={cantidadGrupos}
              onChange={handleCantidadGruposChange}
              // inputProps={{ min: 1, max: filteredMatriculas.length }}
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
            />
          ) : (
            <TextField
              label="Estudiantes por Grupo"
              type="number"
              variant="outlined"
              value={estudiantesPorGrupo}
              onChange={handleEstudiantesPorGrupoChange}
              // inputProps={{ min: 1, max: filteredMatriculas.length }}
              className="inputs-textfield flex w-full flex-col sm:w-1/4"
            />
          )}
        </Box>
      </Card>

      {/* Previsualización de grupos */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography className="mb-3 font-semibold text-gray-600">
          Previsualización de Grupos
        </Typography>

        {filteredMatriculas.length > 0 ? (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Se crearán {gruposPreview.length} grupos:
            </Typography>

            <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gruposPreview.map((grupo, index) => (
                <Card key={index} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {prefijoNombre} {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {grupo.length} estudiantes
                  </Typography>

                  {/* Autocomplete para seleccionar monitor */}
                  <Box sx={{ mt: 2 }}>
                    <Autocomplete
                    className="inputs-textfield mb-3 "

                      size="small"
                      options={getAvailableDocentesForGrupo(index)}
                      getOptionLabel={(option) =>
                        `${option.nombre} ${option.apellido}`
                      }
                      value={selectedDocentesPorGrupo[index] || null}
                      onChange={(event, newValue) =>
                        handleDocenteSelection(index, newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Docente"
                          variant="outlined"
                          placeholder="Elige un docente"
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          <Box>
                            <Typography variant="body2">
                              {option.nombre} {option.apellido}
                            </Typography>
                            {option.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {option.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                      noOptionsText="No hay docentes disponibles"
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />

                    <Autocomplete
                    className="inputs-textfield"
                      size="small"
                      options={getAvailableMonitoresForGrupo(index)}
                      getOptionLabel={(option) =>
                        `${option.nombre} ${option.apellido}`
                      }
                      value={selectedMonitoresPorGrupo[index] || null}
                      onChange={(event, newValue) =>
                        handleMonitorSelection(index, newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Monitor"
                          variant="outlined"
                          placeholder="Elige un monitor"
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          <Box>
                            <Typography variant="body2">
                              {option.nombre} {option.apellido}
                            </Typography>
                            {option.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {option.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                      noOptionsText="No hay monitores disponibles"
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay estudiantes disponibles con los filtros seleccionados
          </Typography>
        )}
      </Card>

      {/* Validaciones y advertencias */}
      <Card sx={{ p: 2, mb: 3, bgcolor: "#fff3cd" }}>
        <Typography variant="subtitle2" color="warning.main">
          Validaciones:
        </Typography>
        <ul className="ml-4 mt-2 text-sm">
          <li>Estudiantes filtrados: {filteredMatriculas.length}</li>
          <li>Docentes disponibles: {docentes.length}</li>
          <li>Monitores disponibles: {monitores.length}</li>
          <li>Grupos que se crearán: {gruposPreview.length}</li>
          <li>
            Monitores asignados: {Object.keys(selectedMonitoresPorGrupo).length}{" "}
            / {gruposPreview.length}
          </li>
          {gruposPreview.length > docentes.length && (
            <li className="text-red-600">⚠️ No hay suficientes docentes</li>
          )}
          {Object.keys(selectedMonitoresPorGrupo).length !==
            gruposPreview.length &&
            gruposPreview.length > 0 && (
              <li className="text-red-600">⚠️ Faltan monitores por asignar</li>
            )}
        </ul>
      </Card>

      {/* Botón para crear grupos */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateAutomaticGroups}
          disabled={
            creatingGroups ||
            filteredMatriculas.length === 0 ||
            gruposPreview.length > docentes.length 
          }
          startIcon={
            creatingGroups ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
          className="w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800 sm:w-1/2"
        >
          {creatingGroups
            ? "Creando grupos..."
            : `Crear ${gruposPreview.length} Grupos Automáticamente`}
        </Button>
      </Box>
    </Box>
  );
}
