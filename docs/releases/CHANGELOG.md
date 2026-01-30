# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0-alpha] - 2026-01-30

### 🎨 ETAPA 1: ACTUALIZACIÓN GRÁFICA (COMPLETADA)

**⚠️ IMPORTANTE:** Esta es la **primera parte de una actualización mayor** dividida en tres etapas.
Esta versión NO es definitiva. Ver `VERSION_NOTES.md` para detalles completos.

### ✨ Agregado

#### Backend - Nuevos Módulos

**💰 Módulo de Finanzas**
- Modelo `Transaction` con 17 categorías (5 ingresos, 12 gastos)
- Controlador con 8 funciones: CRUD, summary, breakdown, stats, trends
- Rutas RESTful en `/api/finance`
- Estadísticas y análisis de tendencias

**📧 Módulo de Correos**
- Modelo `EmailAccount` con encriptación AES-256
- Modelo `EmailMessage` con soporte completo de metadatos
- Sincronización IMAP/SMTP con nodemailer
- Soporte para Gmail, Outlook, Yahoo, iCloud
- 11 funciones de gestión y búsqueda
- Rutas en `/api/email`

**🔐 Módulo de Contraseñas**
- Modelo `Password` con encriptación AES-256-GCM
- Generador de contraseñas seguras
- Análisis de fortaleza (weak, medium, strong, very-strong)
- Dashboard de seguridad con score (0-100%)
- 13 funciones incluyendo import/export
- Rutas en `/api/password`

**💡 Módulo de Ideas**
- Modelo `Idea` con 8 categorías y 4 prioridades
- Estados: draft, active, archived, completed
- Sistema de favoritos y fijado (pin)
- Checklist integrado
- 15 funciones con operaciones en lote
- Rutas en `/api/idea`

#### Frontend - Nuevos Componentes

**FinanceView.jsx** (670 líneas)
- 3 pestañas: Overview, Transactions, Add
- Desglose por categorías con porcentajes
- Formulario completo con validación
- Formateo de moneda y fechas
- Integración completa con API

**EmailView.jsx** (900+ líneas)
- 5 vistas: Accounts, Add Account, Inbox, Email Detail, Compose
- Interfaz tipo Thunderbird
- Sincronización manual y búsqueda
- Vista de adjuntos
- Compositor completo

**PasswordView.jsx** (1000+ líneas)
- 5 vistas: Vault, Details, Add/Edit, Generator, Security Dashboard
- Copiar al portapapeles con feedback
- Generador personalizable (8-32 caracteres)
- Análisis de seguridad en tiempo real
- Distribución por fortaleza y categoría

**IdeasView.jsx** (535 líneas - Actualizado)
- Integración completa con backend
- Sistema de favoritos y pin
- Filtros avanzados por estado
- Edición inline
- Estadísticas en tiempo real

#### Seguridad

**Encriptación Implementada**
- AES-256-GCM para contraseñas con auth tags
- IVs únicos por registro
- Derivación de claves con scrypt
- Variables de entorno: `MASTER_KEY_SECRET`, `EMAIL_ENCRYPTION_KEY`

**Autenticación**
- Middleware `protect` en todas las rutas sensibles
- Validación de ownership en operaciones
- JWT con 7 días de expiración

### 🔧 Modificado

**server/src/server.js**
- Integradas 4 nuevas rutas: `/api/finance`, `/api/email`, `/api/password`, `/api/idea`
- Configuración CORS actualizada
- Límite de payload a 10mb

**RightPanel.jsx**
- Agregados 4 botones de herramientas con gradientes personalizados
- Finanzas (emerald), Correos (cyan), Contraseñas (indigo-purple)

**TabSystem.jsx**
- Registrados 4 nuevos componentes en componentMap
- Animaciones mejoradas

### 📦 Dependencias Agregadas

**Backend**
- `nodemailer` - Envío SMTP
- `imap` - Conexión IMAP
- `mailparser` - Parseo de emails

### 📊 Estadísticas

- **Líneas de código agregadas:** ~15,000+
- **Modelos nuevos:** 6 (Transaction, EmailAccount, EmailMessage, Password, Idea, User actualizado)
- **Controladores nuevos:** 4 (financeController, emailController, passwordController, ideaController)
- **Endpoints API:** 50+ nuevos
- **Componentes React:** 4 nuevos + 1 actualizado

### 🔜 Próximas Etapas

**Etapa 2: Integración de APIs** (Próxima)
- Integraciones con servicios externos
- Sistema de notificaciones push
- Webhooks y automatizaciones
- Sincronización multi-dispositivo

**Etapa 3: Refinamiento Final** (Futura)
- Testing completo
- Optimizaciones de rendimiento
- Documentación completa
- **Versión estable 2.0.0**

---

## [1.2.0] - 2026-01-29

### ✅ Agregado

#### Tema Oscuro Completo en Toda la Aplicación
- **Todos los componentes actualizados con tema oscuro**:
  - Login y Register: Fondos, textos, bordes y botones adaptados
  - RightPanel: Herramientas, estadísticas y tips con tema oscuro
  - TabSystem: Pestañas y contenido con soporte dark
  - HomeView: Cards de resumen, actividad reciente y progreso
  - TasksView: Tablero Kanban con columnas y tarjetas en dark mode
  - IdeasView: Formulario, filtros y lista de ideas adaptados
  - CalendarView: Grid de calendario y eventos con tema oscuro
  - FilesView: Sidebar de proyectos y grid de archivos
  - ProjectsView: Estadísticas y cards de proyectos
  - IntegrationsView: Filtros y cards de integraciones

### 🎨 Mejorado

#### Switch de Tema
- Simplificado a solo el toggle switch (sin contenedor con texto)
- Centrado en la sección inferior del LeftPanel
- Tooltips descriptivos al hacer hover
- Focus ring mejorado para accesibilidad

#### Consistencia Visual
- Paleta `darkTheme` aplicada consistentemente en todos los componentes
- Transiciones suaves de 200ms en todos los cambios de color
- Contraste optimizado para legibilidad en modo oscuro
- Gradientes adaptados preservando la identidad visual

### 🐛 Corregido
- Error de conflicto de nombres de clases (dark → darkTheme)
- Caché de Vite limpiado para reflejar cambios de configuración

---

## [1.1.0] - 2026-01-29

### ✅ Agregado

#### Sistema de Tema Oscuro/Claro
- **ThemeContext**: Nuevo contexto para gestión global del tema
  - Hook `useTheme()` para acceder al tema en cualquier componente
  - Funciones: `toggleTheme()`, `setTheme()`, `isDark`
  - Persistencia en localStorage

- **Switch de Tema en LeftPanel**:
  - Ubicado en la parte inferior del panel de perfil
  - Toggle animado con transición suave de 300ms
  - Iconos Sol/Luna que indican el tema actual
  - Gradiente lavanda/rosa cuando está activado (modo oscuro)
  - Focus ring para accesibilidad

- **Paleta de Colores para Modo Oscuro**:
  - `dark-bg`: #0F0F1A (Fondo principal con tinte lavanda)
  - `dark-card`: #1A1A2E (Tarjetas)
  - `dark-border`: #2B2B40 (Bordes)
  - `dark-text`: #E5E5F0 (Texto principal)
  - `dark-muted`: #A0A0B8 (Texto secundario)

- **Componentes Actualizados con Soporte Dark**:
  - LeftPanel: Perfil, botones, integraciones
  - Dashboard: Navbar, fondo principal
  - Estilos globales: body, btn-*, input-field, card, panel
  - Transiciones suaves en todos los cambios de color

#### Configuración
- Tailwind CSS: `darkMode: 'class'` habilitado en config
- Clase `dark` aplicada dinámicamente al elemento `<html>`
- Transiciones CSS de 200-300ms para cambios suaves

### 🎨 Mejorado

#### Experiencia de Usuario
- Cambio de tema instantáneo sin parpadeo
- Preferencia del usuario persistente entre sesiones
- Indicadores visuales claros del tema activo
- Animaciones fluidas en el toggle switch

#### Accesibilidad
- `aria-label` en botón de toggle
- Focus ring visible en el switch
- Contraste adecuado en ambos temas
- Iconos descriptivos (Sol/Luna)

### 📝 Documentado
- README.md actualizado con sección de tema oscuro
- CHANGELOG.md con detalles de implementación
- Código comentado con JSDoc
- Guía de uso del sistema de temas

---

## [1.0.0] - 2026-01-29

### ✅ Agregado

#### Funcionalidades Principales
- Sistema de autenticación completo (Login/Register)
- OAuth simulado con Google y GitHub
- Dashboard principal con paneles colapsables
- Sistema de pestañas dinámico sin refresco de página
- Panel izquierdo: Perfil, Proyectos, Integraciones
- Panel derecho: 4 herramientas principales

#### Herramientas del Dashboard
- **Tareas**: Organizador estilo Trello con columnas (Por Hacer, En Progreso, Completado)
- **Ideas**: Anotador con checklist, categorías y favoritos
- **Calendario**: Vista mensual interactiva con eventos
- **Archivos**: Gestor multimedia organizado por proyectos
- **Proyectos**: Vista de proyectos activos con estadísticas
- **Integraciones**: Gestión de conexiones con herramientas externas

#### Integración
- Soporte para 8 integraciones principales
- Sistema de categorías (Código, Diseño, Productividad, Publicidad, Comunicación)
- UI para conectar/desconectar servicios

#### Estilos y Diseño
- Paleta de colores personalizada (lavanda y rosa)
- Tailwind CSS v3.4.1 configurado
- Componentes reutilizables (botones, inputs, cards)
- Animaciones suaves y transiciones
- Diseño responsive

#### Documentación
- README.md completo con guía de uso
- ARCHITECTURE.md con estructura del proyecto
- DEVELOPMENT.md con guía para desarrolladores
- TROUBLESHOOTING.md con solución de problemas
- CHANGELOG.md para seguimiento de cambios

### 🔧 Corregido

#### PostCSS y Tailwind CSS
- **Problema**: Tailwind CSS v4 instalado por defecto con configuración incompatible
- **Solución**: Downgrade a Tailwind CSS v3.4.1
- **Archivos afectados**: `package.json`, `postcss.config.js`

#### Error `border-border`
- **Problema**: Clase CSS inexistente en `@layer base` causando error de compilación
- **Solución**: Reemplazado `@apply border-border` con `box-sizing: border-box`
- **Archivo**: `src/index.css` línea 12

#### Error de orden `@import`
- **Problema**: `@import` de Google Fonts después de directivas `@tailwind`
- **Solución**: Movido `@import` al inicio del archivo antes de `@tailwind`
- **Archivo**: `src/index.css` líneas 1-6

### 📝 Documentado

#### Guías de Usuario
- Instalación paso a paso
- Guía de uso del dashboard
- Navegación y controles
- Funcionalidades de cada herramienta

#### Guías Técnicas
- Estructura del proyecto explicada
- Arquitectura de componentes
- Flujo de datos y estado
- Patrones de diseño utilizados
- Convenciones de código
- Scripts de desarrollo

#### Solución de Problemas
- 10 problemas comunes documentados
- Soluciones paso a paso
- Comandos útiles de debug
- Checklist de verificación

### 🔒 Seguridad

#### Autenticación
- Validación de formularios en cliente
- CAPTCHA en registro
- Sanitización básica de inputs
- Almacenamiento seguro en localStorage (desarrollo)

**Nota**: Para producción, implementar:
- HTTPS obligatorio
- Tokens JWT
- Validación en servidor
- Rate limiting

### ⚡ Rendimiento

- Build optimizada con Vite
- CSS purgado con Tailwind
- Componentes funcionales con React Hooks
- Lazy loading preparado (futuro)

**Estadísticas de Build:**
- Bundle principal: 324.68 kB (97.74 kB gzip)
- CSS: 35.93 kB (5.86 kB gzip)
- Tiempo de build: ~29s

### 🧪 Testing

- Estructura preparada para tests
- Guía de testing en DEVELOPMENT.md
- Configuración futura de Vitest

**Pendiente:**
- Tests unitarios
- Tests de integración
- Tests E2E con Cypress

### 📦 Dependencias

#### Principales
- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^7.1.3
- lucide-react: ^0.468.0
- date-fns: ^4.1.0

#### Desarrollo
- vite: ^7.3.1
- tailwindcss: ^3.4.1
- postcss: ^8.4.49
- autoprefixer: ^10.4.20
- @vitejs/plugin-react: ^4.3.4

### 🛠️ Herramientas

- Editor: VS Code con extensiones recomendadas
- Linter: ESLint (configuración base de Vite)
- Build: Vite 7.3.1
- Estilos: Tailwind CSS 3.4.1

### 📋 Pendiente para Fase 2

#### Backend
- [ ] Implementar API con Next.js
- [ ] Base de datos local (SQLite)
- [ ] CRUD completo para todas las entidades
- [ ] Sistema de autenticación con JWT
- [ ] Migración a Firebase

#### Funcionalidades
- [ ] Drag & drop real en Tareas
- [ ] Sincronización real con APIs externas
- [ ] Sistema de notificaciones
- [ ] Modo oscuro
- [ ] Exportar datos
- [ ] Colaboración en tiempo real

#### Optimización
- [ ] PWA (Service Workers)
- [ ] Lazy loading de componentes
- [ ] Code splitting por rutas
- [ ] Optimización de imágenes
- [ ] Tests unitarios y E2E
- [ ] CI/CD pipeline

---

## Tipos de Cambios

- `Agregado` - Nuevas funcionalidades
- `Cambiado` - Cambios en funcionalidades existentes
- `Obsoleto` - Funcionalidades que serán removidas
- `Eliminado` - Funcionalidades removidas
- `Corregido` - Corrección de bugs
- `Seguridad` - Cambios de seguridad

---

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/lang/es/):
- **MAJOR** (1.x.x): Cambios incompatibles con versiones anteriores
- **MINOR** (x.1.x): Nuevas funcionalidades compatibles
- **PATCH** (x.x.1): Correcciones de bugs compatibles

---

**Última actualización:** 2026-01-29
**Versión actual:** 1.0.0
**Estado:** Estable (MVP completado)
