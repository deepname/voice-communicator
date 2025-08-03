# 🎵 Voice Communicator

> **Soundboard PWA moderno con Google Cast** - Reproduce sonidos de voz en dispositivos locales o Google Mini/Hub

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)](https://sass-lang.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Google Cast](https://img.shields.io/badge/Google%20Cast-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/cast)

## 📖 Descripción

**Voice Communicator** es una aplicación web progresiva (PWA) moderna que funciona como un soundboard interactivo. Permite reproducir archivos de audio de voz tanto en el dispositivo local como en dispositivos Google Cast (Google Mini, Google Hub, etc.). La aplicación está construida con TypeScript, SCSS y Webpack, ofreciendo una experiencia nativa en dispositivos móviles.

### ✨ Características principales

- 🎵 **6 botones de sonido** personalizados con colores únicos
- 📡 **Google Cast integrado** - Reproduce en Google Mini/Hub
- 📱 **PWA completa** - Instalable como app nativa en Android
- 🔒 **Bloqueo inteligente** - Evita superposición de audios
- 🎨 **Diseño responsivo** - Se adapta a todas las pantallas
- ⚡ **Animaciones fluidas** - Efectos visuales modernos
- 🌐 **Funciona offline** - Service Worker incluido
- 🔧 **TypeScript** - Código tipado y robusto

## 🚀 Demo en vivo

> **Nota:** Para usar Google Cast, la aplicación debe estar desplegada en HTTPS

- **Desarrollo local:** `http://localhost:4001`
- **Producción:** Despliega en Netlify, Vercel o GitHub Pages

## 📁 Estructura del proyecto

```
voice-communicator/
├── src/
│   ├── app.ts              # Aplicación principal TypeScript
│   ├── cast-manager.ts     # Gestor de Google Cast
│   ├── cast-types.ts       # Tipos TypeScript para Cast
│   ├── styles.scss         # Estilos SCSS con variables y mixins
│   └── index.html          # Template HTML
├── sound/                  # Archivos de audio MP3
│   ├── Cris.mp3
│   ├── Ivan.mp3
│   ├── Josefina.mp3
│   ├── Mimi.mp3
│   ├── Rita.mp3
│   └── Valentina.mp3
├── dist/                   # Build de producción
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── webpack.config.js       # Configuración Webpack
├── tsconfig.json          # Configuración TypeScript
└── package.json           # Dependencias y scripts
```

## 🛠️ Instalación y desarrollo

### Prerrequisitos

- **Node.js** v18+ (recomendado v22.18.0)
- **npm** v9+ (incluido con Node.js)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd voice-communicator

# Instalar dependencias
npm install
```

### Scripts disponibles

```bash
# Desarrollo con hot reload
npm run dev
# Servidor en http://localhost:4001

# Build de producción
npm run build
# Genera archivos optimizados en dist/

# Verificar tipos TypeScript
npm run type-check
```

## 🎮 Uso de la aplicación

### Reproducción de sonidos

1. **Toca cualquier botón de sonido** para reproducir el audio
2. **Los demás botones se bloquean** durante la reproducción
3. **Espera a que termine** o toca el mismo botón para detener

### Google Cast

1. **Conectar dispositivo:**
   - Toca el botón 📡 en la esquina superior derecha
   - Selecciona tu Google Mini/Hub de la lista
   - El botón se pondrá verde 🟢 cuando esté conectado

2. **Reproducir en Cast:**
   - Con Cast conectado, los sonidos se reproducen en el altavoz
   - Sin Cast, los sonidos se reproducen localmente
   - Cambio automático y transparente

3. **Desconectar:**
   - Toca el botón 📡 verde para desconectar
   - Vuelve al modo de reproducción local

### Estados del botón Cast

- 📡 **Gris** - No conectado
- 🔄 **Azul pulsante** - Conectando...
- 📡 **Verde brillante** - Conectado

## 📱 Instalación como PWA en Android

### Método 1: Desde el navegador

1. **Abre la aplicación** en Chrome Android
2. **Menú del navegador** (⋮) → "Instalar aplicación"
3. **Confirma la instalación**
4. ¡La app aparece en tu pantalla de inicio!

### Método 2: Prompt automático

La aplicación mostrará automáticamente un prompt de instalación cuando:
- Se carga en un navegador compatible
- Cumple los requisitos de PWA
- El usuario ha interactuado con la página

### Características de la PWA instalada

- ✅ **Icono en pantalla de inicio**
- ✅ **Pantalla completa** (sin barra del navegador)
- ✅ **Funciona offline** gracias al Service Worker
- ✅ **Acceso a hardware** (micrófono, altavoces)
- ✅ **Rendimiento nativo**

## 🔧 Tecnologías utilizadas

### Frontend
- **TypeScript 5.x** - Lenguaje tipado
- **SCSS** - Preprocesador CSS con variables y mixins
- **Webpack 5** - Bundler y servidor de desarrollo
- **Google Cast SDK** - Integración con dispositivos Cast

### PWA
- **Web App Manifest** - Configuración de instalación
- **Service Worker** - Cache offline y actualizaciones
- **Responsive Design** - Adaptable a todas las pantallas

### Herramientas de desarrollo
- **ts-loader** - Compilador TypeScript para Webpack
- **sass-loader** - Compilador SCSS para Webpack
- **HtmlWebpackPlugin** - Generación automática de HTML
- **CopyWebpackPlugin** - Copia de assets estáticos

## 🎨 Personalización

### Añadir nuevos sonidos

1. **Añade archivos MP3** a la carpeta `sound/`
2. **Actualiza la configuración** en `src/app.ts`:

```typescript
const soundFiles: SoundFile[] = [
    { name: 'Nuevo', filename: 'nuevo.mp3', color: '#FF5722' },
    // ... otros sonidos
];
```

3. **Recompila** con `npm run build`

### Cambiar colores

Edita las variables SCSS en `src/styles.scss`:

```scss
$primary-color: #4CAF50;
$secondary-color: #2196F3;
$accent-color: #FF9800;
```

### Modificar animaciones

Las animaciones están definidas en `src/styles.scss` con mixins reutilizables:

```scss
@mixin pulse-animation {
  animation: pulse 0.6s ease-in-out;
}
```

## 🐛 Solución de problemas

### Google Cast no funciona

**Problema:** "Google Cast SDK no disponible"

**Soluciones:**
1. **Verificar HTTPS:** Google Cast requiere HTTPS o localhost
2. **Verificar red:** Dispositivo y Cast en la misma WiFi
3. **Verificar navegador:** Usar Chrome o Edge
4. **Verificar dispositivos:** Asegurar que Google Mini/Hub esté encendido

### Audio no reproduce

**Problema:** "Error al reproducir el sonido"

**Soluciones:**
1. **Interacción del usuario:** Toca la pantalla primero
2. **Formato de audio:** Verificar que sean archivos MP3 válidos
3. **Permisos:** Permitir reproducción automática en el navegador

### PWA no se instala

**Problema:** No aparece opción "Instalar aplicación"

**Soluciones:**
1. **HTTPS requerido:** Desplegar en servidor HTTPS
2. **Manifest válido:** Verificar `manifest.json`
3. **Service Worker:** Verificar que `sw.js` se cargue correctamente
4. **Navegador compatible:** Usar Chrome, Edge o Firefox

## 📊 Rendimiento

### Métricas de build

- **Bundle principal:** ~20 KB (minificado + gzipped)
- **Archivos de audio:** ~525 KB total (6 archivos MP3)
- **Assets PWA:** ~3 KB (manifest, service worker, iconos)
- **Total:** ~548 KB

### Optimizaciones incluidas

- ✅ **Tree shaking** - Solo código usado
- ✅ **Minificación** - JavaScript y CSS comprimidos
- ✅ **Cache busting** - Hash en nombres de archivos
- ✅ **Lazy loading** - Carga bajo demanda
- ✅ **Service Worker** - Cache inteligente

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre un Pull Request**

### Guías de contribución

- Usar **TypeScript** con tipos estrictos
- Seguir el **estilo de código** existente
- Añadir **tests** para nuevas funcionalidades
- Actualizar **documentación** cuando sea necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Desarrollador Principal** - Implementación completa de la aplicación
- **Diseño UX/UI** - Interfaz moderna y responsiva
- **Integración Google Cast** - Funcionalidad de casting

## 🙏 Agradecimientos

- **Google Cast SDK** - Por la integración con dispositivos Cast
- **TypeScript Team** - Por el excelente sistema de tipos
- **Webpack Team** - Por las herramientas de build
- **SCSS/Sass** - Por el preprocesador CSS

## 📞 Soporte

Si tienes problemas o preguntas:

1. **Revisa la documentación** en este README
2. **Busca en Issues** existentes
3. **Crea un nuevo Issue** con detalles del problema
4. **Incluye logs** de la consola del navegador

---

**¡Disfruta usando Voice Communicator!** 🎵📱✨