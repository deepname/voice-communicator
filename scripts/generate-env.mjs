import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

// --- Configuración centralizada para facilitar cambios ---
const config = {
  soundDir: 'sound',
  envFile: '.env',
  swFile: 'sw.js',
  swCacheName: 'voice-communicator-v2', // Versión del caché principal
  swAudioCacheName: 'voice-communicator-audio-v2', // Versión del caché de audio
  essentialFiles: [
    './',
    './index.html',
    './manifest.json'
  ],
  allowedAudioExtensions: ['.mp3', '.aac'],
};

const paths = {
  soundDir: join(process.cwd(), config.soundDir),
  envFile: join(process.cwd(), config.envFile),
  swFile: join(process.cwd(), config.swFile),
};

// --- Funciones principales ---

/**
 * Genera el archivo .env y el Service Worker.
 */
async function generateConfigFiles() {
  try {
    const soundFiles = await getSoundFiles(paths.soundDir);

    await generateEnvFile(paths.envFile, soundFiles);
    await generateServiceWorkerFile(paths.swFile, soundFiles);

    console.log(`✅ Archivos generados correctamente para ${soundFiles.length} sonidos.`);
  } catch (error) {
    console.error('❌ Error al generar los archivos:', error);
    process.exit(1); // Salir con código de error
  }
}

/**
 * Lee el directorio de sonidos y filtra los archivos de audio.
 * @param {string} dirPath - Ruta al directorio de sonidos.
 * @returns {Promise<string[]>} - Un array con los nombres de los archivos de sonido.
 */
async function getSoundFiles(dirPath) {
  try {
    const files = await readdir(dirPath);
    return files.filter(file => 
      config.allowedAudioExtensions.some(ext => file.endsWith(ext))
    );
  } catch (error) {
    console.error(`❌ No se pudo leer el directorio de sonidos en: ${dirPath}`, error);
    throw error;
  }
}

/**
 * Genera y escribe el archivo .env.
 * @param {string} filePath - Ruta del archivo .env.
 * @param {string[]} soundFiles - Nombres de los archivos de sonido.
 */
async function generateEnvFile(filePath, soundFiles) {
  const envContent = `SOUND_FILES="${soundFiles.join(',')}"\n`;
  await writeFile(filePath, envContent);
  console.log(`- Creado ${filePath} con ${soundFiles.length} sonidos.`);
}

/**
 * Genera el contenido del Service Worker y lo escribe en un archivo.
 * @param {string} filePath - Ruta del archivo sw.js.
 * @param {string[]} soundFiles - Nombres de los archivos de sonido.
 */
async function generateServiceWorkerFile(filePath, soundFiles) {
  const swContent = `
const CACHE_NAME = '${config.swCacheName}';
const AUDIO_CACHE_NAME = '${config.swAudioCacheName}';
const ESSENTIAL_FILES = JSON.parse('${JSON.stringify(config.essentialFiles)}');
const DYNAMIC_AUDIO_FILES = JSON.parse('${JSON.stringify(soundFiles.map(f => `./sound/${f}`))}');

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cacheando archivos esenciales');
      return cache.addAll(ESSENTIAL_FILES);
    }).then(() => {
      // Opcionalmente, precargar los archivos de audio
      // caches.open(AUDIO_CACHE_NAME).then(audioCache => audioCache.addAll(DYNAMIC_AUDIO_FILES));
      console.log('Service Worker: Instalación completa');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => ![CACHE_NAME, AUDIO_CACHE_NAME].includes(cacheName))
          .map(cacheName => {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Manejar audio de forma especial
  if (url.pathname.startsWith('/${config.soundDir}/') && config.allowedAudioExtensions.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(handleAudioRequest(event.request));
    return;
  }
  
  // Estrategia de cache-first para el resto de archivos
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        
        return response;
      });
    }).catch(() => {
      // Si falla la red, devolver una página offline si la petición es un documento
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});

async function handleAudioRequest(request) {
  try {
    const audioCache = await caches.open(AUDIO_CACHE_NAME);
    const cachedResponse = await audioCache.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Sirviendo audio desde caché:', request.url);
      return cachedResponse;
    }
    
    console.log('Service Worker: Descargando y cacheando audio:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      audioCache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Service Worker: Error al cargar audio:', request.url, error);
    return new Response('Audio no disponible', { status: 404 });
  }
}
`;

  await writeFile(filePath, swContent);
  console.log(`- Creado ${filePath} con la lógica del Service Worker.`);
}

// --- Iniciar la ejecución ---
generateConfigFiles();