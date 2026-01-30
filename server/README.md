# UP TO DAY - Backend API

Backend Node.js + Express + MongoDB para UP TO DAY Organizer.

## Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (instalado localmente o MongoDB Atlas)
- npm o yarn

## Instalación

1. Navegar a la carpeta del servidor:
```bash
cd server
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

4. Asegurarse de que MongoDB esté corriendo:
```bash
# En Windows (si MongoDB está instalado localmente)
mongod

# O usar MongoDB Atlas (cloud)
```

## Ejecutar el Servidor

### Modo Desarrollo (con nodemon)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor correrá en `http://localhost:5000`

## Endpoints Disponibles

### Autenticación

- **POST** `/api/auth/register` - Registrar nuevo usuario
  ```json
  {
    "username": "usuario123",
    "email": "usuario@email.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
  ```

- **POST** `/api/auth/login` - Iniciar sesión
  ```json
  {
    "username": "usuario123",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Obtener perfil actual (requiere token)

### Usuario

- **PUT** `/api/user/profile` - Actualizar perfil (requiere token)
- **POST** `/api/user/profile-image` - Subir imagen de perfil (requiere token)
- **POST** `/api/user/cover-image` - Subir imagen de portada (requiere token)

### Health Check

- **GET** `/api/health` - Verificar estado del servidor

## Autenticación

La API usa JWT (JSON Web Tokens). Después del login o registro, se devuelve un token que debe incluirse en las peticiones protegidas:

```
Authorization: Bearer {token}
```

## Estructura del Proyecto

```
server/
├── src/
│   ├── config/         # Configuraciones (DB, etc.)
│   ├── controllers/    # Controladores de rutas
│   ├── middleware/     # Middlewares (auth, upload, etc.)
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definición de rutas
│   └── server.js       # Punto de entrada
├── uploads/            # Archivos subidos por usuarios
├── .env               # Variables de entorno (no en git)
├── .env.example       # Ejemplo de variables
├── package.json       # Dependencias
└── README.md          # Este archivo
```

## Tecnologías

- **Express** - Framework web
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **Multer** - Subida de archivos
- **CORS** - Manejo de CORS

## Notas de Desarrollo

- Las contraseñas se hashean automáticamente con bcrypt antes de guardar
- Las imágenes se guardan en `/uploads` con nombres únicos
- El token JWT expira en 7 días (configurable en .env)
- MongoDB debe estar corriendo antes de iniciar el servidor
