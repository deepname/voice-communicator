# 🎵 Voice Communicator

> **Soundboard PWA moderno con Google Cast y diseño glassmorphism** - Reproduce sonidos de voz en dispositivos locales o Google Cast con interfaz moderna y optimizada

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)](https://sass-lang.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Google Cast](https://img.shields.io/badge/Google%20Cast-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/cast)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

## 📖 Descripción

**Voice Communicator** es una aplicación web progresiva (PWA) de última generación que funciona como un soundboard interactivo profesional. Diseñada con arquitectura modular en TypeScript, ofrece reproducción de audio tanto local como remota a través de Google Cast, con una interfaz moderna que implementa efectos glassmorphism y animaciones fluidas.

## ✨ Características Principales

### 🎵 **Audio y Reproducción**
- **6 botones de sonido personalizados** con colores únicos y efectos visuales
- **Lazy loading de audio** - Carga diferida para optimizar rendimiento
- **Bloqueo inteligente** - Previene superposición de audios
- **Gestión de estado avanzada** - Control preciso de reproducción

### 📡 **Google Cast Integration**
- **Cast SDK completo** - Integración nativa con Google Cast
- **Detección automática** de dispositivos disponibles
- **Reproducción remota** en Google Mini, Google Hub, Chromecast
- **Fallback inteligente** - Cambio automático entre local y Cast

### 🎨 **Diseño y UX**
- **Glassmorphism moderno** - Efectos de cristal y blur
- **Animaciones CSS avanzadas** - Transiciones suaves y naturales
- **Diseño completamente responsivo** - Optimizado para móvil y desktop
- **Accesibilidad mejorada** - ARIA labels y navegación por teclado

### ⚡ **Rendimiento y Tecnología**
- **PWA completa** - Instalable como app nativa
- **Service Worker optimizado** - Funciona offline
- **TypeScript estricto** - Código tipado y robusto
- **SCSS modular** - Arquitectura de estilos escalable

## 🚀 Demo en Vivo

> **Nota:** Para usar Google Cast, la aplicación debe estar desplegada en HTTPS

- **Desarrollo local:** `http://localhost:4001`
- **Producción:** Despliega en Netlify, Vercel o GitHub Pages

## 🏗️ Arquitectura del Proyecto

### 🎯 Arquitectura por Dominio

El proyecto utiliza una **arquitectura por dominio** (Domain-Driven Architecture) que organiza el código por funcionalidades específicas en lugar de por capas técnicas. Cada dominio es independiente y tiene responsabilidades claras:

- **🎵 Audio**: Gestión de reproducción de sonidos y lazy loading
- **📡 Cast**: Integración completa con Google Cast SDK
- **🎨 UI**: Componentes de interfaz de usuario y eventos DOM
- **📱 PWA**: Funcionalidades de Progressive Web App
- **💾 Data**: Modelos de datos y persistencia en localStorage
- **🏗️ Core**: Lógica central, coordinación y reglas de negocio

### 📁 Estructura de Archivos

```
voice-communicator/
├── src/                          # 🎯 Código fuente principal
│   ├── audio/                    # 🎵 Dominio de Audio
│   │   ├── AudioService.ts       # 🔊 Gestión de reproducción y lazy loading
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── cast/                     # 📡 Dominio de Google Cast
│   │   ├── CastService.ts        # 📡 Servicio principal de Cast
│   │   ├── cast-manager.ts       # 🎛️ Gestor de sesiones Cast
│   │   ├── cast-initializer.ts   # ⚙️ Inicialización de Cast Context
│   │   ├── cast-player.ts        # ▶️ Reproductor para dispositivos Cast
│   │   ├── cast-types.ts         # 📝 Tipos TypeScript para Cast API
│   │   ├── cast-utils.ts         # 🛠️ Utilidades y helpers para Cast
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── ui/                       # 🎨 Dominio de Interfaz de Usuario
│   │   ├── UIComponents.ts       # 🧩 Componentes y gestión de eventos DOM
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── pwa/                      # 📱 Dominio PWA
│   │   ├── PWAService.ts         # 📱 Service Worker y PWA features
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── data/                     # 💾 Dominio de Datos
│   │   ├── DataModels.ts         # 📊 Modelos y persistencia localStorage
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── core/                     # 🏗️ Lógica Central
│   │   ├── ApplicationCoordinator.ts # 🎯 Coordinador principal de la app
│   │   ├── ApplicationLogic.ts   # 🧠 Lógica de negocio y validaciones
│   │   └── index.ts              # 📤 Exportaciones del dominio
│   ├── app.ts                    # 🚀 Punto de entrada y compatibilidad legacy
│   ├── config.ts                 # ⚙️ Configuración de sonidos y colores
│   ├── index.html                # 🌐 Template HTML con Cast SDK
│   ├── styles/                   # 🎨 Arquitectura SCSS modular
│   │   ├── main.scss            # 📄 Punto de entrada principal
│   │   ├── _index.scss          # 🔄 Reexportación con @forward
│   │   ├── _variables.scss      # 📏 Variables, funciones y breakpoints
│   │   ├── _colors.scss         # 🎨 Sistema de colores centralizado
│   │   ├── _base.scss           # 🏗️ Reset y estilos base
│   │   ├── _layout.scss         # 📐 Grid, header y layout
│   │   ├── _components.scss     # 🧩 Botones y componentes UI
│   │   ├── _animations.scss     # ✨ Keyframes y animaciones
│   │   └── _utilities.scss      # 🛠️ Utilidades y responsive
│   └── test/                     # 🧪 Tests unitarios básicos
│       ├── setup.ts             # ⚙️ Configuración de entorno de tests
│       ├── app.test.ts          # 🧪 Tests de aplicación principal
│       ├── audio-manager.test.ts # 🔊 Tests de gestión de audio
│       ├── cast-manager.test.ts # 📡 Tests de Google Cast
│       ├── ui-manager.test.ts   # 🎨 Tests de interfaz de usuario
│       └── pwa-manager.test.ts  # 📱 Tests de PWA features
├── sound/                        # 🎵 Archivos de audio personalizables
│   └── *.mp3                    # 🎤 Archivos de audio (configurables)
├── dist/                         # 📦 Build de producción (generado)
├── scripts/                      # 📜 Scripts de automatización
├── manifest.json                 # 📱 Configuración PWA
├── sw.js                         # 🔧 Service Worker para PWA
├── icon.svg                      # 🎨 Icono de la aplicación
├── webpack.config.js             # ⚙️ Configuración Webpack 5
├── tsconfig.json                 # 📝 Configuración TypeScript
├── vitest.config.ts              # 🧪 Configuración de tests
├── tailwind.config.js            # 🎨 Configuración Tailwind CSS
├── postcss.config.js             # 🔧 Configuración PostCSS
└── package.json                  # 📦 Dependencias y scripts
```

### 🧩 Módulos Principales

#### **VoiceCommunicatorApp** (`app.ts`)
- Orquestador principal que coordina todos los módulos
- Gestión del ciclo de vida de la aplicación
- Manejo de eventos globales y callbacks
- Inicialización diferida esperando Google Cast API

#### **AudioManager** (`audio-manager.ts`)
- Lazy loading de audio - Carga bajo demanda
- Gestión de elementos HTMLAudio con cache inteligente
- Control de reproducción y eventos de audio
- Optimización de memoria y recursos

#### **CastManager** (`cast-manager.ts`)
- Integración completa con Google Cast SDK
- Detección de dispositivos y gestión de sesiones
- Reproducción remota con fallback automático
- Estados de conexión y callbacks de cambio

#### **UIManager** (`ui-manager.ts`)
- Creación dinámica de botones con DocumentFragment
- Delegación de eventos para optimizar rendimiento
- Gestión de estados visuales y accesibilidad
- Notificaciones y feedback al usuario

#### **PWAManager** (`pwa-manager.ts`)
- Registro de Service Worker automático
- Prompt de instalación nativo
- Gestión de eventos PWA y lifecycle

## 🛠️ Instalación y Desarrollo

### 📋 Prerrequisitos

- **Node.js** v18+ (recomendado v22.18.0)
- **npm** v9+ (incluido con Node.js)
- **Navegador moderno** con soporte para PWA
- **HTTPS** para funcionalidades de Cast (en producción)

### ⚡ Instalación Rápida

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd voice-communicator

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### 📜 Scripts Disponibles

```bash
# 🚀 Desarrollo con hot reload
npm run dev
# Servidor en http://localhost:4001 con recarga automática

# 📦 Build de producción
npm run build
# Genera archivos optimizados en dist/ con tree-shaking

# 🔍 Verificar tipos TypeScript
npm run type-check
# Validación estricta sin compilar

# 🧪 Ejecutar tests unitarios
npm test
# Tests básicos con Vitest

# 🧪 Tests en modo watch
npm run test:watch
# Ejecuta tests automáticamente al cambiar archivos
```

## 🎮 Guía de Uso

### 🎵 Reproducción de Sonidos

#### **Interfaz Principal**
- **6 botones de sonido** con colores únicos y efectos glassmorphism
- **Iconos SVG integrados** con nombres descriptivos
- **Animaciones de hover** con transformaciones 3D
- **Estados visuales claros** (normal, activo, deshabilitado)

#### **Flujo de Reproducción**
1. **Toca cualquier botón** para reproducir el audio correspondiente
2. **Bloqueo automático** - Los demás botones se deshabilitan durante la reproducción
3. **Indicador visual** - El botón activo muestra un anillo de color
4. **Finalización** - Los botones se rehabilitan automáticamente al terminar
5. **Interrupción** - Toca el mismo botón para detener la reproducción actual

### 📡 Google Cast Integration

#### **Requisitos para Cast**
- **Dispositivos compatibles:** Google Mini, Google Hub, Chromecast Audio
- **Red:** Mismo WiFi que el dispositivo de destino
- **Protocolo:** HTTPS en producción (HTTP en desarrollo local)
- **Navegador:** Chrome recomendado para mejor compatibilidad

#### **Proceso de Conexión**
1. **Detección automática** - La app detecta dispositivos Cast disponibles
2. **Botón Cast** (📡) aparece en la esquina superior derecha
3. **Toca el botón Cast** para ver dispositivos disponibles
4. **Selecciona tu dispositivo** de la lista
5. **Conexión establecida** - El botón se vuelve verde con animación

#### **Estados del Botón Cast**
- 📡 **Gris/Deshabilitado** - No hay dispositivos disponibles
- 📡 **Azul** - Dispositivos detectados, listo para conectar
- 🔄 **Azul pulsante** - Conectando al dispositivo
- 📡 **Verde brillante** - Conectado y listo para reproducir
- ❌ **Rojo** - Error de conexión

#### **Reproducción en Cast**
- **Automática** - Los sonidos se reproducen automáticamente en el dispositivo Cast
- **Fallback inteligente** - Si falla Cast, reproduce localmente
- **Control unificado** - Misma interfaz para local y remoto
- **Notificaciones** - Feedback visual del estado de reproducción

## 📱 Progressive Web App (PWA)

### 🚀 Instalación como App Nativa

#### **Método 1: Prompt Automático**
La aplicación muestra automáticamente un prompt de instalación elegante cuando:
- ✅ Se carga en un navegador compatible (Chrome, Edge, Firefox)
- ✅ Cumple todos los requisitos de PWA
- ✅ El usuario ha interactuado con la página

#### **Método 2: Instalación Manual**

**En Android (Chrome):**
1. Abre la aplicación en Chrome
2. Menú del navegador (⋮) → "Instalar aplicación"
3. Confirma la instalación en el diálogo
4. ¡Listo! La app aparece en tu pantalla de inicio

**En iOS (Safari):**
1. Abre la aplicación en Safari
2. Botón compartir (📤) → "Añadir a pantalla de inicio"
3. Personaliza el nombre si es necesario
4. Toca "Añadir" para completar la instalación

**En Desktop (Chrome/Edge):**
1. Icono de instalación en la barra de direcciones
2. Click en "Instalar" en el prompt
3. La app se abre en ventana independiente

### ✨ Características de la PWA Instalada

#### **Experiencia Nativa**
- 🎯 **Icono personalizado** en pantalla de inicio
- 🖼️ **Pantalla de splash** con branding
- 📱 **Pantalla completa** sin barras del navegador
- ⚡ **Inicio rápido** desde el icono
- 🔄 **Actualizaciones automáticas** en segundo plano

#### **Funcionalidades Offline**
- 🌐 **Service Worker optimizado** para cache inteligente
- 📦 **Assets críticos** almacenados localmente
- 🎵 **Sonidos precargados** para uso offline
- 🔄 **Sincronización** cuando vuelve la conexión

## 🔧 Stack Tecnológico

### 💻 **Frontend Core**
- **TypeScript 5.x** - Lenguaje tipado con configuración estricta
- **SCSS Modular** - Arquitectura de estilos con @use/@forward
- **Webpack 5** - Bundler moderno con tree-shaking y HMR
- **HTML5 Audio API** - Reproducción nativa optimizada

### 🎨 **Estilos y UI**
- **Glassmorphism Design** - Efectos de cristal y blur modernos
- **CSS Grid & Flexbox** - Layout responsivo avanzado
- **Custom Properties** - Variables CSS dinámicas
- **Keyframe Animations** - Animaciones fluidas y naturales
- **SCSS Functions** - Utilidades como px-to-rem automático

### 📡 **Integración y APIs**
- **Google Cast SDK** - Integración completa con dispositivos Cast
- **Web Audio API** - Control avanzado de audio
- **Service Worker API** - Funcionalidades PWA y cache
- **Intersection Observer** - Optimizaciones de rendimiento

### 🧪 **Testing y Calidad**
- **Vitest** - Framework de testing moderno y rápido
- **TypeScript Strict Mode** - Verificación de tipos exhaustiva
- **Tests básicos** - Verificación de inputs/outputs de funciones

### 📦 **Build y Deployment**
- **Webpack Dev Server** - Desarrollo con HMR
- **Babel** - Transpilación para compatibilidad
- **PostCSS** - Procesamiento avanzado de CSS
- **Source Maps** - Debugging en desarrollo

## ⚙️ Configuración y Personalización

### 🎵 **Personalización de Sonidos**

Para añadir o modificar sonidos:

1. **Añade archivos MP3** a la carpeta `sound/`
2. **Actualiza la configuración** 

```bash
npm run prestart


3. **Los colores soportados** están definidos en `src/styles/_colors.scss`
4. **Reconstruye** con `npm run build`

### 📡 **Configuración de Google Cast**

Para configurar Google Cast en producción:

1. **Registra tu aplicación** en [Google Cast SDK Developer Console](https://cast.google.com/publish/)
2. **Obtén tu Application ID**
3. **Actualiza** `src/cast-initializer.ts` con tu ID

## 🚀 Despliegue en Producción

### **Netlify (Recomendado)**

1. **Conecta tu repositorio** a Netlify
2. **Configuración de build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy automático** en cada push

### **Vercel**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **GitHub Pages**

1. **Build local:** `npm run build`
2. **Sube** la carpeta `dist/` a la rama `gh-pages`
3. **Configura** GitHub Pages en la configuración del repositorio

## 🤝 Contribución

### **Flujo de Desarrollo**

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Haz commit** de tus cambios: `git commit -am 'Añadir nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Crea un Pull Request**

### **Estándares de Código**

- **TypeScript estricto** - Todos los tipos deben estar definidos
- **SCSS modular** - Usa la arquitectura de partials existente
- **Comentarios descriptivos** - Especialmente en funciones complejas
- **Tests unitarios básicos** - Para nuevas funcionalidades importantes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte y Contacto

Si tienes problemas o preguntas:

1. **Revisa la documentación** completa
2. **Busca en Issues** existentes
3. **Crea un nuevo Issue** con detalles del problema
4. **Incluye información** del navegador, dispositivo y pasos para reproducir

---

**¡Disfruta usando Voice Communicator! 🎵✨**
