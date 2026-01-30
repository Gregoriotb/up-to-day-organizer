# Arquitectura del Proyecto UP TO DAY

## Visión General

UP TO DAY es una aplicación Single Page Application (SPA) construida con React que sigue un patrón de arquitectura modular y basada en componentes.

## Estructura de Carpetas

### `/src/components`
Contiene todos los componentes de React organizados por funcionalidad:

#### `/auth`
Componentes relacionados con autenticación:
- **Login.jsx**: Formulario de inicio de sesión con opciones OAuth
- **Register.jsx**: Formulario de registro con validación

#### `/dashboard`
Componentes del dashboard principal:
- **Dashboard.jsx**: Componente principal que orquesta los paneles
- **TabSystem.jsx**: Sistema de pestañas dinámicas

#### `/dashboard/panels`
Paneles laterales del dashboard:
- **LeftPanel.jsx**: Panel de perfil, proyectos y configuración
- **RightPanel.jsx**: Panel de herramientas rápidas

#### `/dashboard/features`
Vistas de funcionalidades principales:
- **HomeView.jsx**: Vista de inicio con estadísticas
- **TasksView.jsx**: Gestor de tareas estilo Kanban
- **IdeasView.jsx**: Anotador de ideas con checklist
- **CalendarView.jsx**: Calendario interactivo
- **FilesView.jsx**: Gestor de archivos multimedia
- **ProjectsView.jsx**: Vista de proyectos activos
- **IntegrationsView.jsx**: Gestión de integraciones

### `/src/contexts`
Contextos de React para manejo de estado global:
- **AuthContext.jsx**: Gestión de autenticación y sesión de usuario

### `/src/hooks`
Custom hooks reutilizables (pendiente de implementación)

### `/src/utils`
Funciones utilitarias y helpers (pendiente de implementación)

## Flujo de Datos

### Autenticación
```
User Input → Login/Register Component → AuthContext
                                            ↓
                                    localStorage
                                            ↓
                                    Protected Routes
```

### Navegación
```
Dashboard → Panel Actions → TabSystem → Feature Views
    ↓
State Management (React useState)
```

### Gestión de Estado

#### Estado Local (useState)
- Estado de UI (paneles abiertos/cerrados)
- Estado de pestañas activas
- Formularios
- Filtros y búsquedas

#### Estado Global (Context API)
- Información del usuario autenticado
- Sesión activa
- Funciones de autenticación

## Componentes Principales

### Dashboard
**Responsabilidad**: Contenedor principal de la aplicación

**Estado**:
- `leftPanelOpen`: boolean
- `rightPanelOpen`: boolean
- `fullscreenMode`: boolean
- `openTabs`: array
- `activeTab`: string

**Props Drilling**:
- `onOpenTab`: función para abrir nuevas pestañas

### TabSystem
**Responsabilidad**: Gestión de pestañas y renderizado de vistas

**Props**:
- `tabs`: array de pestañas abiertas
- `activeTab`: ID de la pestaña activa
- `onTabChange`: función para cambiar de pestaña
- `onTabClose`: función para cerrar pestañas

### AuthContext
**Responsabilidad**: Manejo de autenticación global

**Métodos**:
- `login(username, password)`: Autenticación tradicional
- `register(userData)`: Registro de nuevos usuarios
- `loginWithGoogle()`: OAuth con Google
- `loginWithGithub()`: OAuth con GitHub
- `logout()`: Cerrar sesión
- `updateUser(updates)`: Actualizar datos del usuario

**Estado**:
- `user`: objeto del usuario autenticado
- `loading`: boolean de carga
- `isAuthenticated`: boolean de autenticación

## Patrones de Diseño

### Composition
Los componentes se componen de otros componentes más pequeños y reutilizables.

```jsx
<Dashboard>
  <LeftPanel />
  <TabSystem>
    <HomeView />
  </TabSystem>
  <RightPanel />
</Dashboard>
```

### Container/Presenter
- **Containers**: Componentes con lógica (Dashboard, AuthContext)
- **Presenters**: Componentes de UI pura (panels, views)

### Context Provider Pattern
Uso de Context API para estado global sin prop drilling.

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## Enrutamiento

### Estructura de Rutas

```
/                  → Redirect to /login
/login            → Login Component
/register         → Register Component
/dashboard        → Dashboard Component (Protected)
```

### Protección de Rutas

Las rutas protegidas usan el componente `ProtectedRoute` que:
1. Verifica si el usuario está autenticado
2. Muestra un loader mientras carga
3. Redirige a /login si no está autenticado
4. Renderiza el componente si está autenticado

## Estilos

### Tailwind CSS
Uso de clases utilitarias con configuración personalizada:

#### Colores Personalizados
```javascript
colors: {
  primary: { DEFAULT, light, dark },
  secondary: { DEFAULT, light, dark },
  accent: { pink, blue }
}
```

#### Componentes CSS Personalizados
```css
.btn-primary    → Botón principal
.btn-secondary  → Botón secundario
.btn-outline    → Botón con borde
.input-field    → Campo de entrada
.card           → Tarjeta de contenido
.panel          → Panel lateral
```

### Animaciones
```javascript
animate-slide-in-right  → Entrada desde derecha
animate-slide-in-left   → Entrada desde izquierda
animate-fade-in         → Fade in suave
```

## Gestión de Datos

### Almacenamiento Actual (MVP)

#### localStorage
- **users**: Array de usuarios registrados
- **user**: Usuario autenticado actual

#### Estructura de Usuario
```javascript
{
  id: string,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string, // Solo en users array
  profileImage: string,
  createdAt: string,
  projects: array,
  integrations: array
}
```

### Futuro: Backend con Next.js

#### API Routes (Planeado)
```
/api/auth/login
/api/auth/register
/api/auth/logout
/api/tasks
/api/ideas
/api/calendar
/api/files
/api/projects
/api/integrations
```

#### Base de Datos (Planeado)
- Desarrollo: SQLite o JSON local
- Producción: Firebase Firestore

## Optimizaciones

### Código
- Uso de React.memo para componentes puros (futuro)
- Lazy loading de vistas con React.lazy (futuro)
- Code splitting por rutas (futuro)

### Rendimiento
- Tailwind CSS purge en producción
- Optimización de imágenes
- Minificación de código con Vite

## Seguridad

### Actual
- Validación de formularios en cliente
- CAPTCHA en registro
- Sanitización básica de inputs

### Futuro
- HTTPS en producción
- Tokens JWT para autenticación
- Refresh tokens
- CORS configurado
- Rate limiting en API
- Validación en servidor
- Sanitización de datos
- Protección contra XSS y CSRF

## Testing (Futuro)

### Unit Tests
- Vitest para tests unitarios
- Testing Library para componentes

### Integration Tests
- Cypress para tests E2E

### Coverage
- Objetivo: 80%+ de cobertura

## Deployment

### Build
```bash
npm run build
```

### Hosting Recomendado
- **Frontend**: Vercel, Netlify
- **Backend**: Vercel, Railway
- **DB**: Firebase, Supabase

## Roadmap Técnico

### Fase 1 - MVP ✅
- [x] Estructura de componentes
- [x] Sistema de autenticación básico
- [x] Routing con React Router
- [x] Context API para estado global
- [x] Tailwind CSS configurado

### Fase 2 - Backend
- [ ] Next.js API Routes
- [ ] Base de datos local
- [ ] CRUD completo
- [ ] Migración a Firebase

### Fase 3 - Optimizaciones
- [ ] React.memo y useMemo
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Service Worker (PWA)

### Fase 4 - Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] CI/CD pipeline

## Contribución

Para contribuir al proyecto:

1. Sigue la estructura de carpetas establecida
2. Documenta todos los componentes con JSDoc
3. Usa nombres descriptivos y consistentes
4. Implementa TypeScript (futuro)
5. Escribe tests para nuevas funcionalidades
6. Sigue las convenciones de código del proyecto

## Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Utils: `camelCase.js`
- Contextos: `PascalCaseContext.jsx`

### Nombres de Componentes
```jsx
// ✅ Correcto
function UserProfile() {}
const TaskCard = () => {}

// ❌ Incorrecto
function userprofile() {}
const taskcard = () => {}
```

### Imports
```jsx
// Orden de imports
1. React y librerías externas
2. Contextos
3. Componentes
4. Hooks
5. Utils
6. Estilos
```

### Comentarios
```jsx
/**
 * Descripción del componente
 * @param {Object} props - Props del componente
 * @returns {JSX.Element}
 */
```

## Recursos Adicionales

- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [Documentación de Tailwind](https://tailwindcss.com)
- [Documentación de React Router](https://reactrouter.com)
