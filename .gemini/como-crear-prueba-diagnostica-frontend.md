# Cómo Crear una Prueba Diagnóstica desde el Frontend

## Resumen

Se ha implementado la funcionalidad completa para crear pruebas diagnósticas desde el frontend y enviarlas al backend. El proceso incluye validaciones, formateo de datos, manejo de errores y feedback visual al usuario.

## Componentes Implementados

### 1. Estados Agregados

```typescript
const [guardando, setGuardando] = useState(false);
const [mensaje, setMensaje] = useState<{
  tipo: "success" | "error";
  texto: string;
} | null>(null);
```

- **guardando**: Indica si la petición está en proceso
- **mensaje**: Almacena mensajes de éxito o error para mostrar al usuario

### 2. Función Principal: `guardarPruebaDiagnostica`

Esta función maneja todo el proceso de guardado:

#### Validaciones Implementadas

1. **Módulo seleccionado**: Verifica que se haya seleccionado un módulo
2. **Al menos una pregunta**: Asegura que haya preguntas en la prueba
3. **Enunciados completos**: Todas las preguntas deben tener enunciado
4. **Opciones completas**: Todas las opciones de preguntas múltiples deben tener texto

#### Formato de Datos Enviados

```typescript
const datosPrueba = {
  id_modulo: parseInt(modulo),
  preguntas: preguntas.map((pregunta) => ({
    enunciado: pregunta.enunciado,
    tipo: pregunta.tipo === "multiple" ? "opcion_multiple" : "verdadero_falso",
    imagen: pregunta.imagen || null,
    opciones: pregunta.opciones.map((opcion) => ({
      texto: opcion.texto,
      es_correcta: opcion.id === pregunta.respuestaCorrecta,
    })),
  })),
};
```

#### Estructura del Payload

```json
{
  "id_modulo": 1,
  "preguntas": [
    {
      "enunciado": "¿Cuál es la capital de Francia?",
      "tipo": "opcion_multiple",
      "imagen": null,
      "opciones": [
        {
          "texto": "París",
          "es_correcta": true
        },
        {
          "texto": "Londres",
          "es_correcta": false
        },
        {
          "texto": "Madrid",
          "es_correcta": false
        },
        {
          "texto": "Roma",
          "es_correcta": false
        }
      ]
    },
    {
      "enunciado": "El agua hierve a 100°C al nivel del mar",
      "tipo": "verdadero_falso",
      "imagen": null,
      "opciones": [
        {
          "texto": "Verdadero",
          "es_correcta": true
        },
        {
          "texto": "Falso",
          "es_correcta": false
        }
      ]
    }
  ]
}
```

### 3. Petición HTTP

```typescript
const response = await axios.post(
  `${API_BASE_URL}/prueba-diagnostica/crear/`,
  datosPrueba,
  {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  },
);
```

**Importante**: Ajusta el endpoint `/prueba-diagnostica/crear/` según tu API real.

### 4. Manejo de Respuestas

#### Éxito
- Muestra mensaje de éxito
- Limpia el formulario (módulo y preguntas)
- Registra la respuesta en consola

#### Error
- Captura errores de Axios
- Extrae mensajes de error del backend si están disponibles
- Muestra mensaje de error al usuario
- Mantiene los datos del formulario para que el usuario pueda corregir

### 5. Feedback Visual

Se usa un **Snackbar** con **Alert** de Material-UI:

```typescript
<Snackbar
  open={mensaje !== null}
  autoHideDuration={6000}
  onClose={() => setMensaje(null)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert
    onClose={() => setMensaje(null)}
    severity={mensaje?.tipo || "info"}
    sx={{ width: "100%" }}
  >
    {mensaje?.texto}
  </Alert>
</Snackbar>
```

### 6. Botón de Guardar

```typescript
<Button
  variant="contained"
  className="buttons-principal"
  onClick={guardarPruebaDiagnostica}
  disabled={guardando}
>
  {guardando ? "Guardando..." : "Guardar Prueba Diagnóstica"}
</Button>
```

- Se deshabilita mientras está guardando
- Cambia el texto para indicar el estado de carga

## Configuración del Backend

### Endpoint Esperado

**URL**: `POST /prueba-diagnostica/crear/`

### Headers Requeridos

```
Authorization: Token <tu-token>
Content-Type: application/json
```

### Ejemplo de Respuesta Exitosa

```json
{
  "id": 1,
  "id_modulo": 1,
  "fecha_creacion": "2025-12-03T11:52:43Z",
  "preguntas": [
    {
      "id": 1,
      "enunciado": "¿Cuál es la capital de Francia?",
      "tipo": "opcion_multiple",
      "opciones": [...]
    }
  ]
}
```

### Ejemplo de Respuesta de Error

```json
{
  "error": "El módulo no existe",
  "message": "No se encontró el módulo con id 999"
}
```

## Flujo Completo

1. **Usuario llena el formulario**
   - Selecciona un módulo
   - Agrega preguntas con sus opciones
   - Marca las respuestas correctas

2. **Usuario hace clic en "Guardar"**
   - Se ejecuta `guardarPruebaDiagnostica()`

3. **Validaciones**
   - Se verifican todos los campos requeridos
   - Si hay errores, se muestra mensaje y se detiene

4. **Formateo de datos**
   - Los datos se transforman al formato esperado por el backend

5. **Envío al backend**
   - Se hace POST con axios
   - Se incluye el token de autenticación

6. **Respuesta del backend**
   - **Éxito**: Mensaje verde, formulario limpio
   - **Error**: Mensaje rojo, datos preservados

7. **Feedback al usuario**
   - Snackbar aparece en la parte inferior central
   - Se cierra automáticamente después de 6 segundos
   - Usuario puede cerrarlo manualmente

## Personalización

### Cambiar el Endpoint

Modifica la línea 295 del archivo:

```typescript
const response = await axios.post(
  `${API_BASE_URL}/tu-endpoint-personalizado/`,
  datosPrueba,
  // ...
);
```

### Ajustar el Formato de Datos

Si tu backend espera un formato diferente, modifica el objeto `datosPrueba`:

```typescript
const datosPrueba = {
  modulo_id: parseInt(modulo), // Cambiar nombre de campo
  questions: preguntas.map((pregunta) => ({ // Cambiar a inglés
    question_text: pregunta.enunciado,
    question_type: pregunta.tipo === "multiple" ? "MC" : "TF",
    // ... etc
  })),
};
```

### Agregar Más Validaciones

Puedes agregar validaciones adicionales antes del envío:

```typescript
// Validar número mínimo de preguntas
if (preguntas.length < 5) {
  setMensaje({
    tipo: "error",
    texto: "Debes agregar al menos 5 preguntas",
  });
  return;
}

// Validar número mínimo de opciones
for (const pregunta of preguntas) {
  if (pregunta.tipo === "multiple" && pregunta.opciones.length < 3) {
    setMensaje({
      tipo: "error",
      texto: "Las preguntas múltiples deben tener al menos 3 opciones",
    });
    return;
  }
}
```

### Cambiar Comportamiento Post-Guardado

Si no quieres limpiar el formulario después de guardar:

```typescript
// Comentar estas líneas:
// setModulo("");
// setPreguntas([]);

// O redirigir a otra página:
import { useRouter } from "next/navigation";
const router = useRouter();

// Después de guardar exitosamente:
router.push("/admin/pruebas-diagnosticas");
```

## Debugging

### Ver los Datos que se Envían

Los datos se registran en la consola antes de enviar:

```typescript
console.log("Datos a enviar:", datosPrueba);
```

### Ver la Respuesta del Backend

```typescript
console.log("Prueba creada exitosamente:", response.data);
```

### Ver Errores Completos

```typescript
console.error("Error al crear la prueba:", error);
```

### Usar las DevTools del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Haz clic en "Guardar Prueba Diagnóstica"
4. Busca la petición POST
5. Revisa:
   - **Headers**: Token de autorización
   - **Payload**: Datos enviados
   - **Response**: Respuesta del servidor

## Solución de Problemas

### Error 401 (No Autorizado)
- Verifica que el token esté en localStorage
- Verifica que el token sea válido
- Verifica el formato del header de autorización

### Error 400 (Bad Request)
- Revisa el formato de los datos enviados
- Compara con lo que espera el backend
- Revisa los logs del backend para ver el error específico

### Error 404 (Not Found)
- Verifica que el endpoint sea correcto
- Verifica que `API_BASE_URL` esté configurado correctamente

### Error 500 (Server Error)
- Revisa los logs del backend
- Puede ser un error en la lógica del servidor

### El Snackbar no se muestra
- Verifica que `mensaje` no sea null
- Verifica que los imports de Snackbar y Alert estén correctos
- Revisa la consola para errores de React

### Los datos no se limpian después de guardar
- Verifica que la petición sea exitosa
- Verifica que no haya errores en el catch
- Revisa que `setModulo("")` y `setPreguntas([])` se ejecuten

## Mejoras Futuras

### 1. Confirmación antes de Limpiar

```typescript
if (window.confirm("¿Deseas crear otra prueba?")) {
  setModulo("");
  setPreguntas([]);
} else {
  router.push("/admin/pruebas-diagnosticas");
}
```

### 2. Guardar como Borrador

```typescript
const guardarBorrador = async () => {
  // Similar a guardarPruebaDiagnostica pero con estado "borrador"
  const datosPrueba = {
    id_modulo: parseInt(modulo),
    estado: "borrador",
    preguntas: preguntas.map(/* ... */),
  };
  // ...
};
```

### 3. Vista Previa antes de Guardar

```typescript
const [vistaPrevia, setVistaPrevia] = useState(false);

// Mostrar modal con vista previa de la prueba
```

### 4. Progreso de Guardado

```typescript
const [progreso, setProgreso] = useState(0);

// Actualizar progreso mientras se guardan las preguntas
```

### 5. Validación en Tiempo Real

```typescript
// Mostrar errores mientras el usuario escribe
const [errores, setErrores] = useState<string[]>([]);

useEffect(() => {
  const nuevosErrores = [];
  if (!modulo) nuevosErrores.push("Selecciona un módulo");
  if (preguntas.length === 0) nuevosErrores.push("Agrega al menos una pregunta");
  setErrores(nuevosErrores);
}, [modulo, preguntas]);
```
