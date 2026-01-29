# Guía de Solución de Problemas - UP TO DAY

## Problemas Comunes y Soluciones

### 1. Error: PostCSS / Tailwind CSS

#### Síntoma
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

#### Causa
Se instaló Tailwind CSS v4 que tiene una configuración diferente de PostCSS.

#### Solución
```bash
cd up-to-day-organizer
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.1 autoprefixer postcss
```

**Versiones verificadas que funcionan:**
- tailwindcss: ^3.4.1
- postcss: latest
- autoprefixer: latest

---

### 2. Error: `border-border` class does not exist

#### Síntoma
```
[postcss] The `border-border` class does not exist
```

#### Causa
Clase CSS inexistente en la capa `@layer base` de Tailwind.

#### Solución
Editar `src/index.css` línea 11-13:

**Antes:**
```css
@layer base {
  * {
    @apply border-border;
  }
}
```

**Después:**
```css
@layer base {
  * {
    box-sizing: border-box;
  }
}
```

---

### 3. Error: @import must precede all other statements

#### Síntoma
```
[postcss] @import must precede all other statements (besides @charset or empty @layer)
```

#### Causa
El `@import` de Google Fonts está después de las directivas `@tailwind`.

#### Solución
Editar `src/index.css` - mover el `@import` al inicio:

**Antes:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/...');
```

**Después:**
```css
@import url('https://fonts.googleapis.com/...');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 4. Error: Port already in use

#### Síntoma
```
Port 5173 is in use, trying another one...
```

#### Causa
Múltiples instancias del servidor de desarrollo corriendo.

#### Solución

**Windows:**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :5173

# Matar el proceso (reemplaza PID con el número encontrado)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Ver y matar proceso en un solo comando
lsof -ti:5173 | xargs kill -9
```

**O simplemente:**
Vite automáticamente intentará usar otro puerto (5174, 5175, etc.)

---

### 5. Error: Cannot find module

#### Síntoma
```
Error: Cannot find module 'react-router-dom'
```

#### Causa
Dependencias no instaladas o corruptas.

#### Solución
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install

# O con cache limpia
npm ci
```

---

### 6. Estilos de Tailwind no se aplican

#### Síntoma
Los estilos no aparecen o se ven sin formato.

#### Checklist de Solución

1. **Verificar `index.css` importa Tailwind:**
```css
@import url('https://fonts.googleapis.com/...');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. **Verificar `main.jsx` importa el CSS:**
```jsx
import './index.css'
```

3. **Verificar `tailwind.config.js` content:**
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

4. **Reiniciar el servidor:**
```bash
# Detener servidor (Ctrl+C)
# Limpiar cache
rm -rf node_modules/.vite
# Reiniciar
npm run dev
```

---

### 7. Build falla con errores de linter

#### Síntoma
```
✖ 12 problems (12 errors, 0 warnings)
```

#### Solución

**Opción 1: Arreglar errores automáticamente**
```bash
npm run lint -- --fix
```

**Opción 2: Deshabilitar linter temporalmente**
Editar `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  // Comentar o eliminar el plugin de eslint si existe
})
```

---

### 8. Problemas con OAuth (Google/GitHub)

#### Síntoma
OAuth no funciona, botones no hacen nada.

#### Causa
El sistema actual usa simulación de OAuth (localStorage).

#### Nota
Para OAuth real, necesitas:

1. **Registrar aplicación:**
   - Google: https://console.cloud.google.com/
   - GitHub: https://github.com/settings/developers

2. **Obtener credenciales:**
   - Client ID
   - Client Secret

3. **Configurar variables de entorno:**
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_GITHUB_CLIENT_ID=tu_client_id
```

4. **Implementar flujo OAuth real:**
Actualmente usa simulación. Para producción, implementar con biblioteca como `@react-oauth/google` o `react-github-login`.

---

### 9. Error: Context is null

#### Síntoma
```
Error: useAuth must be used within an AuthProvider
```

#### Causa
Componente intenta usar `useAuth()` fuera del `AuthProvider`.

#### Solución
Verificar que `main.jsx` envuelva la app:
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

---

### 10. Errores de rutas 404

#### Síntoma
Al navegar manualmente a una URL, aparece 404.

#### Causa
Servidor de desarrollo no está configurado para SPA.

#### Solución
Vite ya maneja esto automáticamente en desarrollo.

Para producción, configurar el servidor web:

**Netlify** (_redirects):
```
/*    /index.html   200
```

**Vercel** (vercel.json):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Comandos Útiles de Debug

### Limpiar y Reinstalar
```bash
# Limpiar todo
rm -rf node_modules package-lock.json dist .vite

# Reinstalar
npm install

# Reiniciar servidor
npm run dev
```

### Verificar Versiones
```bash
# Ver versiones instaladas
npm list tailwindcss react react-dom vite

# Ver versión de Node
node -v

# Ver versión de npm
npm -v
```

### Ver Logs Detallados
```bash
# Servidor con logs detallados
npm run dev -- --debug

# Build con información detallada
npm run build -- --debug
```

### Analizar Build
```bash
# Instalar analizador
npm install -D rollup-plugin-visualizer

# Agregar a vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()]
})

# Build y ver análisis
npm run build
# Abre stats.html generado
```

---

## Errores Específicos del Proyecto

### AuthContext warnings

Si ves warnings sobre actualizaciones de estado en componentes desmontados:

**Causa:** Llamadas async que actualizan estado después de desmontar.

**Solución:** Usar cleanup en useEffect:
```jsx
useEffect(() => {
  let mounted = true;

  fetchData().then(data => {
    if (mounted) {
      setState(data);
    }
  });

  return () => { mounted = false; };
}, []);
```

---

## Contacto y Soporte

Si encuentras un problema no listado aquí:

1. Revisa la [documentación principal](README.md)
2. Revisa la [guía de desarrollo](DEVELOPMENT.md)
3. Busca en issues existentes
4. Crea un nuevo issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs de error completos
   - Versión de Node y npm
   - Sistema operativo

---

## Checklist de Verificación Rápida

Antes de reportar un problema, verifica:

- [ ] Node.js 16+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Sin errores en la consola del navegador
- [ ] Tailwind CSS v3.4.1 (no v4)
- [ ] `@import` antes de `@tailwind` en index.css
- [ ] Servidor corriendo en el puerto correcto
- [ ] Cache limpia (`.vite` eliminada)
- [ ] Build funciona (`npm run build`)

---

**Última actualización:** 2026-01-29
**Versión del proyecto:** 1.0.0
