# Cómo Cargar Módulos desde un Endpoint

## Resumen de Cambios

Se ha modificado el componente `CrearPruebas` para cargar los módulos disponibles desde un endpoint API en lugar de usar un campo de texto manual.

## Cambios Realizados

### 1. Importaciones
```typescript
import { useState, useEffect } from "react";
```
Se agregó `useEffect` para poder ejecutar el fetch cuando el componente se monte.

### 2. Nueva Interfaz
```typescript
interface Modulo {
  id: number;
  nombre: string;
}
```
Define la estructura de datos que esperamos del endpoint.

### 3. Nuevos Estados
```typescript
const [modulos, setModulos] = useState<Modulo[]>([]);
const [cargandoModulos, setCargandoModulos] = useState(false);
```
- `modulos`: Almacena la lista de módulos obtenidos del API
- `cargandoModulos`: Indica si está en proceso de carga

### 4. useEffect para Cargar Datos
```typescript
useEffect(() => {
  const cargarModulos = async () => {
    setCargandoModulos(true);
    try {
      const response = await fetch("http://tu-api.com/api/modulos");
      
      if (!response.ok) {
        throw new Error("Error al cargar los módulos");
      }
      
      const data = await response.json();
      setModulos(data);
    } catch (error) {
      console.error("Error cargando módulos:", error);
    } finally {
      setCargandoModulos(false);
    }
  };

  cargarModulos();
}, []);
```

### 5. Select en lugar de TextField
```typescript
<TextField
  select
  className="mx-auto w-full sm:w-1/4"
  label="Módulo"
  fullWidth
  margin="normal"
  value={modulo}
  onChange={(e) => setModulo(e.target.value)}
  disabled={cargandoModulos}
  helperText={cargandoModulos ? "Cargando módulos..." : ""}
  SelectProps={{
    native: true,
  }}
>
  <option value="">Selecciona un módulo</option>
  {modulos.map((mod) => (
    <option key={mod.id} value={mod.id}>
      {mod.nombre}
    </option>
  ))}
</TextField>
```

## Configuración Necesaria

### 1. Reemplazar la URL del Endpoint
En el `useEffect`, cambia esta línea:
```typescript
const response = await fetch("http://tu-api.com/api/modulos");
```

Por tu endpoint real, por ejemplo:
```typescript
const response = await fetch("http://localhost:8000/api/modulos");
```

### 2. Formato de Respuesta Esperado
El endpoint debe devolver un JSON con este formato:
```json
[
  {
    "id": 1,
    "nombre": "Módulo de Matemáticas"
  },
  {
    "id": 2,
    "nombre": "Módulo de Física"
  },
  {
    "id": 3,
    "nombre": "Módulo de Química"
  }
]
```

### 3. Autenticación (Si es necesario)
Si tu API requiere autenticación, agrega headers:
```typescript
const response = await fetch("http://tu-api.com/api/modulos", {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. CORS
Asegúrate de que tu backend permita peticiones desde tu frontend. En Django, por ejemplo:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## Mejoras Opcionales

### 1. Manejo de Errores con UI
```typescript
const [error, setError] = useState<string | null>(null);

// En el catch:
catch (error) {
  console.error("Error cargando módulos:", error);
  setError("No se pudieron cargar los módulos. Intenta de nuevo.");
}

// En el JSX:
{error && (
  <Typography color="error" variant="caption">
    {error}
  </Typography>
)}
```

### 2. Usar Autocomplete en lugar de Select
Para una mejor experiencia de usuario con muchos módulos:
```typescript
import { Autocomplete } from "@mui/material";

<Autocomplete
  options={modulos}
  getOptionLabel={(option) => option.nombre}
  value={modulos.find(m => m.id === modulo) || null}
  onChange={(_, newValue) => setModulo(newValue?.id.toString() || "")}
  loading={cargandoModulos}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Módulo"
      helperText={cargandoModulos ? "Cargando módulos..." : ""}
    />
  )}
/>
```

### 3. Reintentar si Falla
```typescript
const [reintentos, setReintentos] = useState(0);

const cargarModulos = async () => {
  setCargandoModulos(true);
  try {
    const response = await fetch("http://tu-api.com/api/modulos");
    if (!response.ok) throw new Error("Error al cargar");
    const data = await response.json();
    setModulos(data);
    setReintentos(0);
  } catch (error) {
    if (reintentos < 3) {
      setTimeout(() => {
        setReintentos(prev => prev + 1);
      }, 2000);
    }
  } finally {
    setCargandoModulos(false);
  }
};

useEffect(() => {
  cargarModulos();
}, [reintentos]);
```

## Verificación

Para verificar que funciona correctamente:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Deberías ver una petición a tu endpoint de módulos
5. El selector debería mostrar los módulos cargados

## Troubleshooting

### El selector está vacío
- Verifica que el endpoint esté respondiendo correctamente
- Revisa la consola del navegador para errores
- Verifica que el formato de respuesta coincida con la interfaz `Modulo`

### Error de CORS
- Configura CORS en tu backend
- O usa un proxy en Next.js (next.config.js)

### Los módulos no se actualizan
- Verifica que el `useEffect` tenga el array de dependencias vacío `[]`
- Asegúrate de que `setModulos(data)` se esté ejecutando
