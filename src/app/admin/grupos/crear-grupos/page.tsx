"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TextField, Autocomplete } from "@mui/material";
import { Estudiante, Matricula } from "@/interfaces/interfaces";

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

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

export default function EstudiantesTransferList() {
  const [checked, setChecked] = useState<readonly number[]>([]);
  const [left, setLeft] = useState<readonly number[]>([]);
  const [right, setRight] = useState<readonly number[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<
    readonly number[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para docentes y monitores
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [loadingMonitores, setLoadingMonitores] = useState(false);

  // Estados para filtros
  const [selectedPeriodos, setSelectedPeriodos] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedModulos, setSelectedModulos] = useState<string[]>([]);
  const [selectedEstamentos, setSelectedEstamentos] = useState<string[]>([]);

  const leftChecked = intersection(checked, filteredEstudiantes);
  const rightChecked = intersection(checked, right);

  // Estado para el nombre del grupo
  const [nombreGrupo, setNombreGrupo] = useState("");

  // Estado para la creación del grupo
  const [creatingGroup, setCreatingGroup] = useState(false);

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

        setMatriculas(data);
        // Inicialmente todos los matriculas están disponibles (izquierda)
        const allIds = data.map((est) => est.id_inscripcion);
        setLeft(allIds);
        setFilteredEstudiantes(allIds);
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
      setLoadingDocentes(true);
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
        setLoadingDocentes(false);
      }
    };

    fetchDocentes();
  }, []);

  // Fetch monitores
  useEffect(() => {
    const fetchMonitores = async () => {
      setLoadingMonitores(true);
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
        setLoadingMonitores(false);
      }
    };

    fetchMonitores();
  }, []);

  // Efecto para aplicar filtros
  useEffect(() => {
    let filtered = matriculas.filter((matricula) => {
      // Solo filtramos matriculas que están en la lista de disponibles (izquierda)
      if (!left.includes(matricula.id_inscripcion)) return false;

      const matchGrado =
        selectedPeriodos.length === 0 ||
        selectedPeriodos.includes(matricula.oferta_categoria.id_oferta_academica.nombre);
      const matchCiudad =
        selectedCategorias.length === 0 ||
        selectedCategorias.includes(matricula.modulo.id_categoria.nombre);
      const matchColegio =
        selectedModulos.length === 0 ||
        selectedModulos.includes(matricula.modulo.nombre_modulo);
      const matchEstamento =
        selectedEstamentos.length === 0 ||
        selectedEstamentos.includes(matricula.estado);

      return matchGrado && matchCiudad && matchColegio && matchEstamento;
    });

    setFilteredEstudiantes(filtered.map((est) => est.id_inscripcion
  ));
  }, [
    selectedPeriodos,
    selectedCategorias,
    selectedModulos,
    selectedEstamentos,
    left,
    matriculas,
  ]);

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

  const handleChangeColegios = (
    event: SelectChangeEvent<typeof selectedModulos>,
  ) => {
    const value = event.target.value;
    setSelectedModulos(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeEstamentos = (
    event: SelectChangeEvent<typeof selectedEstamentos>,
  ) => {
    const value = event.target.value;
    setSelectedEstamentos(typeof value === "string" ? value.split(",") : value);
  };

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const getEstudianteById = (id: number): Matricula | undefined => {
    return matriculas.find((est) => est.id_inscripcion === id);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSelectedPeriodos([]);
    setSelectedCategorias([]);
    setSelectedModulos([]);
    setSelectedEstamentos([]);
  };

  const customList = (
    title: React.ReactNode,
    items: readonly number[],
    showFilters = false,
  ) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1, bgcolor: "#e8e8e8" }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} seleccionados`}
      />
      <Divider />

      <List
        sx={{
          width: 350,
          height: 400,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((id: number) => {
          const estudiante = getEstudianteById(id);
          const labelId = `transfer-list-all-item-${id}-label`;

          if (!estudiante) return null;

          return (
            <ListItemButton key={id} role="listitem" onClick={handleToggle(id)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${estudiante.estudiante.nombre} ${estudiante.estudiante.apellido}`}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Doc: {estudiante.estudiante.numero_documento}
                    </Typography>
                    <br />
                    {`${estudiante.estudiante.grado}° - ${estudiante.estudiante.colegio}`}
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {estudiante.estudiante.ciudad_residencia} • {estudiante.estudiante.estamento}
                    </Typography>
                  </React.Fragment>
                }
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: "medium",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando matriculas...
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

  // Función para actualizar matriculas con el ID del grupo
  const updateStudentsGroup = async (
    studentIds: readonly number[],
    groupId: number,
  ) => {
    const token = getToken();
    const updatePromises = studentIds.map(async (studentId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/matricula/mat/${studentId}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grupo: groupId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `Error updating student ${studentId}: ${response.status}`,
          );
        }

        const updatedStudent = await response.json();
        console.log(`Estudiante ${studentId} actualizado:`, updatedStudent);
        return updatedStudent;
      } catch (error) {
        console.error(`Error updating student ${studentId}:`, error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(updatePromises);
      console.log("Todos los matriculas actualizados exitosamente:", results);
      return results;
    } catch (error) {
      console.error("Error updating some students:", error);
      throw error;
    }
  };

  // Función para crear el grupo
  const handleCreateGroup = async () => {
    // Validaciones
    if (!nombreGrupo.trim()) {
      alert("Debe ingresar un nombre para el grupo");
      return;
    }

    if (right.length === 0) {
      alert("Debe seleccionar al menos un estudiante");
      return;
    }

    if (!selectedDocente) {
      alert("Debe seleccionar un docente");
      return;
    }

    if (!selectedMonitor) {
      alert("Debe seleccionar un monitor académico");
      return;
    }

    setCreatingGroup(true);

    try {
      const token = getToken();

      const groupData = {
        nombre: nombreGrupo.trim(),
        profesor: selectedDocente.id,
        monitor_academico: selectedMonitor.id,
      };

      console.log("Enviando datos del grupo:", groupData);

      // Paso 1: Crear el grupo
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
      console.log("Grupo creado exitosamente:", createdGroup);

      // Paso 2: Actualizar los matriculas con el ID del grupo
      console.log("Actualizando matriculas con el grupo ID:", createdGroup.id);
      await updateStudentsGroup(right, createdGroup.id);

      // Mostrar mensaje de éxito
      alert(`¡Grupo "${nombreGrupo}" creado exitosamente!
      
Detalles:
- ${right.length} matriculas asignados al grupo
- Docente: ${selectedDocente.nombre} ${selectedDocente.apellido}
- Monitor: ${selectedMonitor.nombre} ${selectedMonitor.apellido}
- ID del grupo: ${createdGroup.id}`);

      // Limpiar formulario
      setNombreGrupo("");
      setSelectedDocente(null);
      setSelectedMonitor(null);
      setRight([]);
      setLeft(matriculas.map((est) => est.id_inscripcion));
      setFilteredEstudiantes(matriculas.map((est) => est.id_inscripcion));
      setChecked([]);
      clearFilters();
    } catch (err) {
      console.error("Error creating group or updating students:", err);
      alert(
        `Error al crear el grupo o asignar matriculas: ${err instanceof Error ? err.message : "Error desconocido"}`,
      );
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <Box className="mx-auto mt-4 flex w-11/12 flex-col justify-between gap-4 rounded-2xl bg-white p-2 shadow-md">
      <h2 className="mb-2 text-center">Crear grupo</h2>

      {/* Autocompletes para Docente y Monitor */}
      <Box className="flex flex-wrap justify-around text-gray-600">
        {/* Campo nombre del curso */}
        <TextField
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          label="Nombre del Grupo"
          variant="outlined"
          size="small"
          fullWidth
          required
          value={nombreGrupo}
          onChange={(e) => setNombreGrupo(e.target.value)}
          placeholder="Ingrese el nombre del grupo"
        />
        {/* Autocomplete para Docente */}
        <Autocomplete
          className="inputs-textfield flex w-full sm:w-1/4"
          options={docentes}
          getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
          value={selectedDocente}
          onChange={(event, newValue) => setSelectedDocente(newValue)}
          loading={loadingDocentes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Docente"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingDocentes ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box>
                <Typography variant="body1">
                  {option.nombre} {option.apellido}
                </Typography>
                {option.email && (
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          noOptionsText="No se encontraron docentes"
        />

        {/* Autocomplete para Monitor */}
        <Autocomplete
          className="inputs-textfield flex w-full flex-col sm:w-1/4"
          options={monitores}
          getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
          value={selectedMonitor}
          onChange={(event, newValue) => setSelectedMonitor(newValue)}
          loading={loadingMonitores}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Monitor Académico"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingMonitores ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box>
                <Typography variant="body1">
                  {option.nombre} {option.apellido}
                </Typography>
                {option.email && (
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          noOptionsText="No se encontraron monitores"
        />
      </Box>
      {/* Filtros */}
      <Box className="flex flex-wrap justify-around text-gray-600">
        {/* Filtro por Grados */}

       
        <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/6">
          <InputLabel>Periodos</InputLabel>
          <Select
            multiple
            value={selectedPeriodos}
            onChange={handleChangePeriodos}
            renderValue={(selected) => selected.join(", ")}
            label="Periodos"
          >
            {[...new Set(
              matriculas
                .filter(est => 
                  est?.oferta_categoria?.id_oferta_academica?.nombre
                )
                .map(est => est.oferta_categoria.id_oferta_academica.nombre)
            )]
              .sort()
              .map((periodo) => (
                <MenuItem key={periodo} value={periodo}>
                  <Checkbox checked={selectedPeriodos.indexOf(periodo) > -1} />
                  <ListItemText primary={periodo} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Filtro por Categoria */}
        <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/6">
          <InputLabel>Categoria</InputLabel>
          <Select
            multiple
            value={selectedCategorias}
            onChange={handleChangeCategorias}
            renderValue={(selected) => selected.join(", ")}
            label="Categorias"
          >
            {[...new Set(matriculas.map((est) => est.modulo.id_categoria.nombre))]
              .sort()
              .map((categoria) => (
                <MenuItem key={categoria} value={categoria}>
                  <Checkbox checked={selectedCategorias.indexOf(categoria) > -1} />
                  <ListItemText primary={categoria} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Filtro por Colegios */}
        <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/6">
          <InputLabel>Colegios</InputLabel>
          <Select
            multiple
            value={selectedModulos}
            onChange={handleChangeColegios}
            renderValue={(selected) => selected.join(", ")}
            label="Colegios"
          >
            {[...new Set(matriculas.map((est) => est.estudiante.colegio))]
              .sort()
              .map((colegio) => (
                <MenuItem key={colegio} value={colegio}>
                  <Checkbox checked={selectedModulos.indexOf(colegio) > -1} />
                  <ListItemText primary={colegio} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Filtro por Estamentos */}
        <FormControl className="inputs-textfield flex w-full flex-col sm:w-1/6">
          <InputLabel>Estamentos</InputLabel>
          <Select
            multiple
            value={selectedEstamentos}
            onChange={handleChangeEstamentos}
            renderValue={(selected) => selected.join(", ")}
            label="Estamentos"
          >
            {[...new Set(matriculas.map((est) => est.estudiante.estamento))]
              .sort()
              .map((estamento) => (
                <MenuItem key={estamento} value={estamento}>
                  <Checkbox
                    checked={selectedEstamentos.indexOf(estamento) > -1}
                  />
                  <ListItemText primary={estamento} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Typography
        variant="body1"
        gutterBottom
        textAlign="center"
        color="text.secondary"
      >
        Selecciona los matriculas que formarán parte del nuevo grupo
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 2,
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        {customList("Estudiantes Disponibles", filteredEstudiantes, true)}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 8 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="agregar matriculas seleccionados"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="remover matriculas seleccionados"
          >
            &lt;
          </Button>
        </Box>

        {customList("Estudiantes en el Grupo", right)}
      </Box>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Seleccionados: {checked.length} | Disponibles:{" "}
          {filteredEstudiantes.length} | En el grupo: {right.length}
        </Typography>

        <Button
          className="text-md mt-4 w-full rounded-2xl bg-primary font-semibold capitalize text-white hover:bg-red-800 sm:w-1/3"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateGroup}
          disabled={right.length === 0}
        >
          Crear Grupo ({right.length} matriculas)
        </Button>
      </Box>
    </Box>
  );
}
