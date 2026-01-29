# Guía de Desarrollo - UP TO DAY

## Configuración del Entorno

### Requisitos del Sistema
- Node.js 16+ (recomendado 18+)
- npm 8+ o yarn 1.22+
- Git 2.30+
- Editor de código (VS Code recomendado)

### Extensiones Recomendadas para VS Code
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

## Instalación Detallada

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd up-to-day-organizer
```

### 2. Instalar Dependencias

⚠️ **IMPORTANTE para Trabajo en Equipo:**

Este proyecto requiere versiones específicas de dependencias. Si experimentas errores de PostCSS o Tailwind, asegúrate de usar las versiones correctas.

```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

**Versiones Verificadas:**
- tailwindcss: `^3.4.1` (NO usar v4.x)
- postcss: `^8.x`
- autoprefixer: `^10.x`

Si tienes problemas, reinstala con versiones específicas:
```bash
npm install -D tailwindcss@^3.4.1 autoprefixer postcss
```

### 3. Configurar Variables de Entorno (Futuro)
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
up-to-day-organizer/
├── public/               # Archivos estáticos
│   └── assets/          # Imágenes y recursos
├── src/
│   ├── components/      # Componentes de React
│   │   ├── auth/       # Autenticación
│   │   ├── dashboard/  # Dashboard y features
│   │   └── common/     # Componentes reutilizables
│   ├── contexts/       # Context API
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilidades
│   ├── App.jsx         # Componente raíz
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── tailwind.config.js  # Configuración de Tailwind
├── vite.config.js      # Configuración de Vite
└── package.json        # Dependencias
```

## Scripts de Desarrollo

### Servidor de Desarrollo
```bash
npm run dev
# Inicia el servidor en modo desarrollo con hot reload
```

### Build de Producción
```bash
npm run build
# Genera la versión optimizada en /dist
```

### Preview de Producción
```bash
npm run preview
# Previsualiza la build de producción localmente
```

### Linting
```bash
npm run lint
# Ejecuta ESLint para verificar el código
```

## Flujo de Trabajo

### 1. Crear una Nueva Funcionalidad

#### Paso 1: Crear una rama
```bash
git checkout -b feature/nombre-de-la-feature
```

#### Paso 2: Desarrollar
Sigue esta estructura según el tipo de cambio:

**Para un nuevo componente:**
```bash
# Crear el componente
touch src/components/[categoria]/NuevoComponente.jsx

# Estructura básica
```
```jsx
import { useState } from 'react';

/**
 * Descripción del componente
 * @param {Object} props - Props del componente
 */
const NuevoComponente = ({ prop1, prop2 }) => {
  // Estado local
  const [state, setState] = useState(initialValue);

  // Funciones auxiliares
  const handleAction = () => {
    // Lógica
  };

  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default NuevoComponente;
```

**Para una nueva vista:**
```bash
touch src/components/dashboard/features/NuevaView.jsx
```

**Para un nuevo contexto:**
```bash
touch src/contexts/NuevoContext.jsx
```

#### Paso 3: Importar y usar
```jsx
// En el componente padre
import NuevoComponente from './components/NuevoComponente';

// Uso
<NuevoComponente prop1={value1} prop2={value2} />
```

#### Paso 4: Commit
```bash
git add .
git commit -m "feat: agregar nuevo componente de [descripción]"
```

### 2. Convenciones de Commits

Seguimos Conventional Commits:

```bash
# Nuevas funcionalidades
git commit -m "feat: agregar sistema de notificaciones"

# Corrección de bugs
git commit -m "fix: corregir error en calendario"

# Documentación
git commit -m "docs: actualizar README con nuevas instrucciones"

# Estilos (formato, espacios, etc.)
git commit -m "style: formatear código con Prettier"

# Refactorización
git commit -m "refactor: reorganizar estructura de componentes"

# Tests
git commit -m "test: agregar tests para TasksView"

# Tareas de build o CI/CD
git commit -m "chore: actualizar dependencias"
```

### 3. Code Review
Antes de hacer merge:
- ✅ El código compila sin errores
- ✅ No hay warnings críticos
- ✅ Los estilos son consistentes
- ✅ Los componentes están documentados
- ✅ Se sigue la estructura del proyecto

## Guía de Estilos

### Tailwind CSS

#### Clases Personalizadas
```jsx
// Botones
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>

// Inputs
<input className="input-field" />

// Tarjetas
<div className="card">Contenido</div>

// Paneles
<aside className="panel">Panel</aside>
```

#### Colores del Tema
```jsx
// Primarios
bg-primary          // Lavanda
bg-primary-light    // Rosa lavanda
bg-primary-dark     // Azul marino

// Secundarios
bg-secondary        // Violeta
bg-secondary-light  // Rosa claro

// Acentos
text-accent-pink    // Rosa
text-accent-blue    // Azul
```

#### Espaciado Consistente
```jsx
// Padding de contenedores
p-4   // 16px - Elementos pequeños
p-6   // 24px - Tarjetas
p-8   // 32px - Secciones

// Gaps
gap-2  // 8px - Elementos muy cercanos
gap-4  // 16px - Elementos relacionados
gap-6  // 24px - Elementos separados
```

#### Responsive
```jsx
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive
</div>
```

### JavaScript/React

#### Nombres de Variables
```jsx
// ✅ Correcto
const userName = 'John';
const isLoading = false;
const handleClick = () => {};

// ❌ Incorrecto
const username = 'John';
const loading = false;
const clickHandler = () => {};
```

#### Estado
```jsx
// ✅ Usar nombres descriptivos
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);

// ❌ Evitar nombres genéricos
const [modal, setModal] = useState(false);
const [project, setProject] = useState(null);
```

#### Props
```jsx
// ✅ Desestructurar props
const Component = ({ title, onClose, isActive }) => {
  // ...
};

// ❌ Evitar usar props directamente
const Component = (props) => {
  return <div>{props.title}</div>;
};
```

## Debugging

### React DevTools
1. Instalar React DevTools (extensión de navegador)
2. Abrir DevTools → Pestaña "Components"
3. Inspeccionar props y estado de componentes

### Console Logs
```jsx
// Durante desarrollo
console.log('Estado actual:', state);
console.table(array); // Para arrays
console.group('Nombre del grupo'); // Agrupar logs

// Recordar eliminar antes de commit
```

### Vite HMR
Si el Hot Module Replacement no funciona:
```bash
# Limpiar cache y reiniciar
rm -rf node_modules/.vite
npm run dev
```

## Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Matar el proceso
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Tailwind no aplica estilos
1. Verificar que `index.css` importa Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. Verificar `tailwind.config.js` content:
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

3. Reiniciar el servidor

### Errores de ESLint
```bash
# Ejecutar linter
npm run lint

# Auto-fix de problemas
npm run lint -- --fix
```

## Testing (Futuro)

### Estructura de Tests
```
src/
├── components/
│   └── auth/
│       ├── Login.jsx
│       └── Login.test.jsx
```

### Escribir Tests
```jsx
import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    // Test logic
  });
});
```

## Recursos Útiles

### Documentación
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

### Comunidad
- [React Discord](https://discord.gg/react)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)

### Herramientas
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Contribuir

¿Quieres contribuir? ¡Genial!

1. Fork el proyecto
2. Crea tu rama de feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

Asegúrate de seguir las convenciones de código y documentar tus cambios.

## Problemas Comunes y Solución

Si encuentras errores durante la instalación o desarrollo, consulta la **[Guía de Solución de Problemas](TROUBLESHOOTING.md)** completa.

### Problemas Más Frecuentes

1. **Error de Tailwind CSS v4**
   - Síntoma: `tailwindcss directly as a PostCSS plugin`
   - Solución: Reinstalar con `npm install -D tailwindcss@^3.4.1`

2. **Error `border-border` class**
   - Síntoma: `The border-border class does not exist`
   - Solución: Ya corregido en `src/index.css`

3. **Error `@import`**
   - Síntoma: `@import must precede all other statements`
   - Solución: Ya corregido - `@import` está antes de `@tailwind`

4. **Puerto ocupado**
   - Síntoma: `Port 5173 is in use`
   - Solución: Vite automáticamente usa otro puerto (5174, 5175, etc.)

5. **Estilos no aplican**
   - Solución: Limpiar cache y reiniciar
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

## Soporte

Si encuentras problemas:
1. Revisa la [Guía de Solución de Problemas](TROUBLESHOOTING.md)
2. Revisa la [Documentación Principal](README.md)
3. Busca en issues existentes
4. Crea un nuevo issue con:
   - Descripción del problema
   - Logs completos del error
   - Versión de Node/npm
   - Sistema operativo

---

¡Happy Coding! 🚀
