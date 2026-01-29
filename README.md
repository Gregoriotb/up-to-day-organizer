# UP TO DAY - Organizador Personal para Desarrolladores

<div align="center">
  <img src="public/assets/logo.png" alt="UP TO DAY Logo" width="200"/>

  <p><strong>Organiza tu día, alcanza tus metas</strong> 🚀</p>
</div>

## 📖 Descripción

**UP TO DAY** es un organizador personal completo diseñado específicamente para desarrolladores, diseñadores, programadores y creadores de contenido. Centraliza todas las herramientas necesarias para gestionar proyectos, tareas, ideas y archivos en un solo lugar.

## ✨ Características Principales

### 🎯 Gestión de Tareas
- Organizador estilo Trello con columnas personalizables
- Sistema de prioridades (Alta, Media, Baja)
- Etiquetas y categorías
- Fechas de vencimiento
- Estado de tareas (Por Hacer, En Progreso, Completado)

### 💡 Anotador de Ideas
- Sistema de checklist para capturar ideas
- Categorización por áreas (UI/UX, Backend, Frontend, etc.)
- Marcadores de favoritos
- Edición y eliminación rápida

### 📅 Calendario de Actividades
- Vista mensual interactiva
- Sincronización con tareas e ideas
- Gestión de eventos
- Integración con fechas de entrega

### 📁 Gestor de Archivos
- Organización por proyectos
- Soporte para múltiples formatos (imágenes, videos, documentos)
- Búsqueda rápida
- Carpetas personalizables

### 🔗 Integraciones
Conecta tus herramientas favoritas:
- **Código**: GitHub, Vercel
- **Diseño**: Figma, Canva
- **Productividad**: Trello, Notion
- **Publicidad**: CapCut
- **Comunicación**: Slack

### 👤 Gestión de Proyectos
- Vista general de proyectos activos
- Seguimiento de progreso
- Estadísticas de tareas
- Gestión de equipo

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Navegación SPA
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

### Backend (Próximamente)
- **Next.js** - Framework de React con API routes
- **Base de datos local** con migración fácil a Firebase

### Autenticación
- Sistema de login tradicional (username/password)
- OAuth con Google
- OAuth con GitHub
- Almacenamiento en localStorage (desarrollo)

## 📁 Estructura del Proyecto

```
up-to-day-organizer/
├── public/
│   └── assets/                # Recursos estáticos
│       ├── logo.png          # Logo principal
│       └── libro.png         # Icono del panel derecho
├── src/
│   ├── components/
│   │   ├── auth/            # Componentes de autenticación
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/       # Componentes del dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TabSystem.jsx
│   │   │   ├── panels/      # Paneles laterales
│   │   │   │   ├── LeftPanel.jsx
│   │   │   │   └── RightPanel.jsx
│   │   │   └── features/    # Vistas de funcionalidades
│   │   │       ├── HomeView.jsx
│   │   │       ├── TasksView.jsx
│   │   │       ├── IdeasView.jsx
│   │   │       ├── CalendarView.jsx
│   │   │       ├── FilesView.jsx
│   │   │       ├── ProjectsView.jsx
│   │   │       └── IntegrationsView.jsx
│   │   └── common/          # Componentes reutilizables
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.jsx  # Gestión de autenticación
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Funciones utilitarias
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── package.json             # Dependencias del proyecto
└── vite.config.js           # Configuración de Vite
```

## 🚀 Instalación

### Requisitos Previos
- Node.js 16+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd up-to-day-organizer
```

2. **Instalar dependencias**
```bash
npm install
```

⚠️ **Nota Importante:** Si experimentas errores con Tailwind CSS o PostCSS, consulta la [Guía de Solución de Problemas](TROUBLESHOOTING.md).

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Acceder a la aplicación**
Abre tu navegador en `http://localhost:5173` (o el puerto que Vite asigne automáticamente)

## 📚 Guía de Uso

### Primer Uso

1. **Registro**
   - Accede a la página de registro
   - Completa el formulario
   - Verifica el CAPTCHA
   - Haz clic en "Registrarse"

2. **Inicio de Sesión**
   - Ingresa tu usuario y contraseña
   - O usa Google/GitHub para acceso rápido

### Navegación en el Dashboard

#### Barra Superior
- **Botón izquierdo**: Abre/cierra el panel de perfil
- **Botón central**: Modo pantalla completa
- **Botón derecho**: Abre/cierra el panel de herramientas

#### Panel Izquierdo (Perfil)
- Ver información del perfil
- Acceder a "Mis Proyectos"
- Gestionar "Integraciones"
- Cerrar sesión

#### Panel Derecho (Herramientas)
- **Tareas**: Organizador estilo Kanban
- **Ideas**: Anotador con checklist
- **Calendario**: Vista mensual de eventos
- **Archivos**: Gestor de multimedia

## 🎨 Paleta de Colores

```css
/* Colores Primarios */
--primary: #ABA5FA (Lavanda)
--primary-light: #E2A5FA (Rosa lavanda)
--primary-dark: #2B1E54 (Azul marino)

/* Colores Secundarios */
--secondary: #C7A5FA (Violeta medio)
--secondary-light: #FAA5F1 (Rosa claro)

/* Colores de Acento */
--accent-pink: #FF6B9D
--accent-blue: #5778FF
```

## 📜 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Preview de la build
```

## ✅ Buenas Prácticas Implementadas

### Código
- ✅ Componentes funcionales con hooks
- ✅ Comentarios JSDoc en cada componente
- ✅ Separación de responsabilidades
- ✅ Context API para estado global

### Estilos
- ✅ Tailwind CSS con configuración personalizada
- ✅ Sistema de diseño consistente
- ✅ Responsive design
- ✅ Animaciones suaves

## 🗺️ Roadmap

### Fase 1 - MVP ✅
- [x] Sistema de autenticación
- [x] Dashboard con paneles colapsables
- [x] Gestión de tareas
- [x] Anotador de ideas
- [x] Calendario de eventos
- [x] Gestor de archivos
- [x] Vista de proyectos
- [x] Vista de integraciones

### Fase 2 - Backend
- [ ] API con Next.js
- [ ] Base de datos local
- [ ] CRUD completo
- [ ] Migración a Firebase

### Fase 3 - Funcionalidades Avanzadas
- [ ] Drag & drop real
- [ ] Sincronización con APIs externas
- [ ] Notificaciones push
- [ ] Modo oscuro

## 📚 Documentación Adicional

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura detallada del proyecto
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guía completa para desarrolladores
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solución de problemas comunes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**UP TO DAY** - Organiza tu día, alcanza tus metas 🚀
