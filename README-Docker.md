# Docker Configuration for Voice Communicator

## 🐳 Configuración Docker

Este proyecto incluye una configuración completa de Docker para desarrollo y producción.

### Archivos Docker

- `Dockerfile` - Imagen de producción con nginx
- `Dockerfile.dev` - Imagen de desarrollo con hot reload
- `docker-compose.yml` - Orquestación de servicios
- `nginx.conf` - Configuración optimizada para PWA
- `.dockerignore` - Archivos excluidos de la imagen

### Comandos disponibles

```bash
# Desarrollo
npm run docker:dev          # Ejecutar en modo desarrollo
npm run docker:build-dev    # Construir imagen de desarrollo

# Producción
npm run docker:prod         # Ejecutar en modo producción
npm run docker:build       # Construir imagen de producción

# Gestión
npm run docker:stop         # Detener todos los contenedores
```

### Puertos

- **Desarrollo**: http://localhost:4001
- **Producción**: http://localhost:8080
- **Nginx (opcional)**: http://localhost:3000

### Uso rápido

```bash
# Desarrollo con hot reload
docker-compose up voice-communicator-dev

# Producción optimizada
docker-compose up voice-communicator-prod

# Detener servicios
docker-compose down
```

### Características

✅ **Multi-stage build** para optimización de tamaño
✅ **Hot reload** en desarrollo
✅ **Nginx** optimizado para PWA
✅ **Cache** de dependencias de Node.js
✅ **Compresión gzip** habilitada
✅ **Headers** correctos para PWA y Service Worker

### Volúmenes

En desarrollo, el código fuente se monta como volumen para hot reload:
- `./:/app` - Código fuente
- `/app/node_modules` - Dependencias (volumen anónimo)

### Variables de entorno

- `NODE_ENV=development` - Modo desarrollo
- `NODE_ENV=production` - Modo producción
