# Guía de Configuración de Git - UP TO DAY

## ✅ Problemas Corregidos

Se han resuelto los siguientes problemas:

1. **Archivos `nul` eliminados** - Archivos temporales que causaban conflictos en Windows
2. **`.gitignore` actualizado** - Incluye todos los archivos que no deben subirse
3. **`.gitattributes` creado** - Maneja correctamente los line endings (LF/CRLF)
4. **Git configurado** - `core.autocrlf = true` para Windows

## 📋 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón `+` (arriba derecha) → "New repository"
3. Configura el repositorio:
   - **Repository name**: `up-to-day-organizer`
   - **Description**: "Organizador personal para desarrolladores"
   - **Visibility**: Public o Private (tu elección)
   - ⚠️ **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
4. Haz clic en "Create repository"
5. **Copia la URL** que aparece (ejemplo: `https://github.com/tu-usuario/up-to-day-organizer.git`)

### 2. Configurar Git Local

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd up-to-day-organizer

# Configurar tu información (si no lo has hecho antes)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar configuración
git config --list | grep user
```

### 3. Realizar el Primer Commit

```bash
# Añadir todos los archivos
git add .

# Crear el commit inicial
git commit -m "Initial commit: UP TO DAY v1.0.0

- Sistema de autenticación completo
- Dashboard con paneles colapsables
- Gestión de tareas, ideas, calendario y archivos
- Vista de proyectos e integraciones
- Documentación completa (README, ARCHITECTURE, DEVELOPMENT, TROUBLESHOOTING)
- Paleta de colores personalizada
- Tailwind CSS v3.4.1 configurado

Co-authored-by: Claude Code <noreply@anthropic.com>"
```

### 4. Conectar con el Repositorio Remoto

```bash
# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/up-to-day-organizer.git

# Verificar que se agregó correctamente
git remote -v
```

### 5. Subir el Código

```bash
# Primera vez: push con -u para establecer upstream
git push -u origin master

# O si tu rama principal es main:
# git branch -M main
# git push -u origin main
```

## 🔧 Solución de Problemas

### Error: "failed to push some refs"

**Causa**: El repositorio remoto tiene cambios que no tienes localmente.

**Solución**:
```bash
# Obtener los cambios remotos
git pull origin master --allow-unrelated-histories

# O forzar el push (solo si estás seguro)
git push -u origin master --force
```

### Error: "Authentication failed"

**Causa**: Credenciales incorrectas o falta de permisos.

**Soluciones**:

**Opción 1: Token Personal (Recomendado)**
1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Selecciona scope: `repo` (full control)
4. Copia el token
5. Usa el token como contraseña cuando Git lo pida

**Opción 2: SSH**
```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu@email.com"

# Copiar la clave pública
cat ~/.ssh/id_ed25519.pub

# Agregar la clave en GitHub → Settings → SSH keys
# Cambiar URL remota a SSH
git remote set-url origin git@github.com:TU-USUARIO/up-to-day-organizer.git
```

### Warning: LF/CRLF

Las advertencias sobre LF/CRLF son **normales en Windows** y no impiden subir el código.

Ya está configurado con `.gitattributes` para manejar esto automáticamente.

## 📊 Flujo de Trabajo Diario

### Hacer Cambios y Subirlos

```bash
# 1. Ver estado actual
git status

# 2. Añadir archivos modificados
git add .

# 3. Crear commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad X"

# 4. Subir cambios
git push
```

### Convenciones de Commits

Usa prefijos descriptivos:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan el código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

**Ejemplos**:
```bash
git commit -m "feat: agregar modo oscuro"
git commit -m "fix: corregir error en calendario"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

## 🌿 Trabajo con Ramas

### Crear una Rama Nueva

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Subir rama al remoto
git push -u origin feature/nueva-funcionalidad
```

### Fusionar Rama

```bash
# Cambiar a master/main
git checkout master

# Fusionar la rama
git merge feature/nueva-funcionalidad

# Subir cambios
git push

# Eliminar rama (opcional)
git branch -d feature/nueva-funcionalidad
git push origin --delete feature/nueva-funcionalidad
```

## 🔄 Sincronizar con el Remoto

### Obtener Últimos Cambios

```bash
# Traer cambios sin fusionar
git fetch origin

# Traer y fusionar cambios
git pull origin master

# Ver diferencias antes de fusionar
git diff master origin/master
```

## 📁 Archivos que NO se Suben

Los siguientes archivos están en `.gitignore` y NO se subirán:

- `node_modules/` - Dependencias de npm
- `dist/` - Build de producción
- `.vite/` - Cache de Vite
- `.env` - Variables de entorno
- `*.log` - Logs
- `nul` - Archivos temporales problemáticos
- Archivos del sistema (`.DS_Store`, `Thumbs.db`)

## 🚀 Desplegar en Vercel/Netlify

### Vercel (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Configuración automática detectará Vite
5. Haz clic en "Deploy"

**Variables de entorno** (cuando las uses):
- En el dashboard de Vercel → Settings → Environment Variables

### Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist` después de hacer `npm run build`
3. O conecta tu repositorio de GitHub para deploy automático

**Build settings**:
- Build command: `npm run build`
- Publish directory: `dist`

## 📝 Checklist Final

Antes de compartir el repositorio:

- [ ] Todos los archivos están committed
- [ ] `.env` no está en el repositorio (debe estar en .gitignore)
- [ ] README.md está actualizado
- [ ] CHANGELOG.md refleja la versión actual
- [ ] `npm run build` funciona sin errores
- [ ] La documentación está completa
- [ ] Los archivos `nul` no están presentes

## 🆘 Comandos de Emergencia

### Deshacer Último Commit (sin perder cambios)

```bash
git reset --soft HEAD~1
```

### Deshacer Cambios No Committed

```bash
# Deshacer cambios en un archivo específico
git checkout -- archivo.js

# Deshacer todos los cambios
git reset --hard HEAD
```

### Ver Historial de Commits

```bash
# Simple
git log --oneline

# Detallado con gráfico
git log --graph --oneline --all
```

### Limpiar Archivos No Rastreados

```bash
# Ver qué se eliminará
git clean -n

# Eliminar archivos no rastreados
git clean -f

# Eliminar archivos y directorios
git clean -fd
```

## 📚 Recursos Adicionales

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## ⚡ Comandos Rápidos de Referencia

```bash
# Ver estado
git status

# Añadir cambios
git add .

# Commit
git commit -m "mensaje"

# Push
git push

# Pull
git pull

# Ver ramas
git branch

# Crear rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout nombre-rama

# Ver remoto
git remote -v

# Ver log
git log --oneline
```

---

**¡Listo!** Tu proyecto UP TO DAY está configurado correctamente para Git y listo para subir a GitHub. 🚀
