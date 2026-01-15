# Estructura de Datos para Crear Prueba Diagnóstica

## Modelo Django: PruebaDiagnostica

```python
class PruebaDiagnostica(models.Model):
    id_prueba = models.AutoField(primary_key=True)
    id_modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE)
    nombre_prueba = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    tiempo_limite = models.PositiveIntegerField(default=60)  # minutos
    puntaje_minimo = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)  # %
    estado = models.BooleanField(default=True)  # Activo/Inactivo
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
```

## Estructura del Payload desde el Frontend

### Formato JSON Completo

```json
{
  "nombre_prueba": "Prueba Diagnóstica de Matemáticas Básicas",
  "descripcion": "Evalúa conocimientos fundamentales en álgebra y geometría",
  "id_modulo": 1,
  "tiempo_limite": 60,
  "puntaje_minimo": 60.00,
  "estado": true,
  "preguntas": [
    {
      "enunciado": "¿Cuál es el resultado de 2 + 2?",
      "tipo": "opcion_multiple",
      "imagen": null,
      "opciones": [
        {
          "texto": "3",
          "es_correcta": false
        },
        {
          "texto": "4",
          "es_correcta": true
        },
        {
          "texto": "5",
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

## Campos del Formulario

### 1. **nombre_prueba** (requerido)
- **Tipo**: String
- **Max Length**: 200 caracteres
- **Ejemplo**: "Prueba Diagnóstica de Matemáticas Básicas"
- **Validación Frontend**: No puede estar vacío

### 2. **descripcion** (opcional)
- **Tipo**: String (Text)
- **Puede ser**: null o vacío
- **Ejemplo**: "Esta prueba evalúa los conocimientos básicos necesarios para el módulo"

### 3. **id_modulo** (requerido)
- **Tipo**: Integer (Foreign Key)
- **Ejemplo**: 1
- **Validación Frontend**: Debe seleccionarse un módulo

### 4. **tiempo_limite** (requerido)
- **Tipo**: Integer (Positivo)
- **Default**: 60
- **Unidad**: Minutos
- **Ejemplo**: 60
- **Validación Frontend**: Debe ser mayor a 0

### 5. **puntaje_minimo** (requerido)
- **Tipo**: Decimal (5 dígitos, 2 decimales)
- **Default**: 60.00
- **Unidad**: Porcentaje (%)
- **Rango**: 0.00 - 100.00
- **Ejemplo**: 60.00
- **Validación Frontend**: Entre 0 y 100

### 6. **estado** (automático)
- **Tipo**: Boolean
- **Default**: true
- **Valores**: true (Activo) / false (Inactivo)
- **Frontend**: Se envía siempre como `true`

### 7. **preguntas** (requerido)
- **Tipo**: Array de objetos
- **Mínimo**: 1 pregunta
- **Estructura**: Ver sección "Estructura de Preguntas"

## Estructura de Preguntas

Cada pregunta en el array tiene:

```typescript
{
  enunciado: string,           // Texto de la pregunta
  tipo: string,                // "opcion_multiple" o "verdadero_falso"
  imagen: string | null,       // Base64 de imagen o null
  opciones: Array<{
    texto: string,             // Texto de la opción
    es_correcta: boolean       // true si es la respuesta correcta
  }>
}
```

## Código del Frontend

### Estados

```typescript
const [nombrePrueba, setNombrePrueba] = useState("");
const [descripcion, setDescripcion] = useState("");
const [tiempoLimite, setTiempoLimite] = useState("60");
const [puntajeMinimo, setPuntajeMinimo] = useState("60.00");
const [modulo, setModulo] = useState("");
const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
```

### Formateo de Datos

```typescript
const datosPrueba = {
  nombre_prueba: nombrePrueba,
  descripcion: descripcion || null,
  id_modulo: parseInt(modulo),
  tiempo_limite: parseInt(tiempoLimite),
  puntaje_minimo: parseFloat(puntajeMinimo),
  estado: true,
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

### Validaciones

```typescript
// 1. Nombre de la prueba
if (!nombrePrueba.trim()) {
  // Error: campo requerido
}

// 2. Módulo
if (!modulo) {
  // Error: debe seleccionar un módulo
}

// 3. Al menos una pregunta
if (preguntas.length === 0) {
  // Error: debe agregar preguntas
}

// 4. Todas las preguntas con enunciado
const preguntasSinEnunciado = preguntas.filter((p) => !p.enunciado.trim());
if (preguntasSinEnunciado.length > 0) {
  // Error: preguntas sin enunciado
}

// 5. Todas las opciones con texto (para múltiple)
for (const pregunta of preguntas) {
  if (pregunta.tipo === "multiple") {
    const opcionesSinTexto = pregunta.opciones.filter((op) => !op.texto.trim());
    if (opcionesSinTexto.length > 0) {
      // Error: opciones sin texto
    }
  }
}
```

## Petición HTTP

```typescript
const response = await axios.post(
  `${API_BASE_URL}/prueba-diagnostica/crear/`,
  datosPrueba,
  {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }
);
```

## Respuesta Esperada del Backend

### Éxito (201 Created)

```json
{
  "id_prueba": 1,
  "nombre_prueba": "Prueba Diagnóstica de Matemáticas Básicas",
  "descripcion": "Evalúa conocimientos fundamentales...",
  "id_modulo": 1,
  "tiempo_limite": 60,
  "puntaje_minimo": "60.00",
  "estado": true,
  "fecha_creacion": "2025-12-03T12:00:00Z",
  "fecha_modificacion": "2025-12-03T12:00:00Z",
  "preguntas": [
    {
      "id_pregunta": 1,
      "enunciado": "¿Cuál es el resultado de 2 + 2?",
      "tipo": "opcion_multiple",
      "opciones": [...]
    }
  ]
}
```

### Error (400 Bad Request)

```json
{
  "error": "Datos inválidos",
  "message": "El nombre de la prueba es requerido",
  "fields": {
    "nombre_prueba": ["Este campo es requerido"]
  }
}
```

## Ejemplo Completo de Uso

```typescript
// 1. Usuario llena el formulario
setNombrePrueba("Prueba de Álgebra Básica");
setDescripcion("Evalúa conceptos de ecuaciones lineales");
setModulo("1");
setTiempoLimite("45");
setPuntajeMinimo("70.00");

// 2. Usuario agrega preguntas
agregarPregunta(); // Agrega pregunta 1
actualizarPregunta(1, "enunciado", "¿Cuánto es x si 2x = 10?");
// ... configura opciones y respuesta correcta

// 3. Usuario hace clic en "Guardar"
guardarPruebaDiagnostica();

// 4. Se envía al backend:
{
  "nombre_prueba": "Prueba de Álgebra Básica",
  "descripcion": "Evalúa conceptos de ecuaciones lineales",
  "id_modulo": 1,
  "tiempo_limite": 45,
  "puntaje_minimo": 70.00,
  "estado": true,
  "preguntas": [...]
}
```

## Notas Importantes

### 1. **Conversión de Tipos**
- `id_modulo`: String → Integer con `parseInt()`
- `tiempo_limite`: String → Integer con `parseInt()`
- `puntaje_minimo`: String → Float con `parseFloat()`

### 2. **Valores Null vs Vacíos**
- `descripcion`: Si está vacía, se envía como `null`
- `imagen`: Si no hay imagen, se envía como `null`

### 3. **Tipo de Pregunta**
- Frontend usa: `"multiple"` o `"verdadero-falso"`
- Backend espera: `"opcion_multiple"` o `"verdadero_falso"`
- **Importante**: Hacer la conversión en el formateo

### 4. **Respuesta Correcta**
- Frontend: Guarda el ID de la opción (A, B, C, D)
- Backend: Espera un booleano `es_correcta` en cada opción
- **Conversión**: `es_correcta: opcion.id === pregunta.respuestaCorrecta`

### 5. **Estado Activo**
- Siempre se envía como `true` al crear
- El administrador puede desactivarlo después desde otra vista

## Relación con Otros Modelos

```
PruebaDiagnostica
    ↓ (ForeignKey)
Modulo
    ↓ (relacionado)
Categoria, Area

PruebaDiagnostica
    ↓ (relacionado)
Pregunta
    ↓ (relacionado)
Opcion
```

Cada **Pregunta** debe tener:
- `id_prueba` (ForeignKey a PruebaDiagnostica)
- Las preguntas se crean en la misma petición o en una petición separada según el diseño del backend

## Endpoint del Backend

Asegúrate de que tu endpoint coincida con:

```
POST /prueba-diagnostica/crear/
```

O ajusta en el código:
```typescript
const response = await axios.post(
  `${API_BASE_URL}/tu-endpoint-aqui/`,
  datosPrueba,
  // ...
);
```

## Debugging

Para ver exactamente qué se está enviando:

```typescript
console.log("Datos a enviar:", JSON.stringify(datosPrueba, null, 2));
```

Esto mostrará en la consola el JSON formateado que se enviará al backend.
