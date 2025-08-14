import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

const soundDir = join(process.cwd(), 'sound');
const envFile = join(process.cwd(), '.env');
const swFile = join(process.cwd(), 'sw.js');

async function generateEnv() {
  try {
    const files = await readdir(soundDir);
    const soundFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.aac'));
    
    // Generate .env file
    const envContent = `SOUND_FILES="${soundFiles.join(',')}"`;
    await writeFile(envFile, envContent);
    
    // Generate Service Worker with dynamic sound files
    await generateServiceWorker(soundFiles);
    
    console.log(`Successfully generated .env file and service worker with ${soundFiles.length} sounds.`);
  } catch (error) {
    console.error('Error generating files:', error);
  }
}

async function generateServiceWorker(soundFiles) {
  const soundFilesList = soundFiles.map(file => `  './sound/${file}'`).join(',\n');
  
  const swContent = `const CACHE_NAME = 'voice-communicator-v2.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Audio files - dynamically generated
${soundFilesList}
];

// Instalar service worker y cachear recursos
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Instalación completa');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error durante instalación', error);
      })
  );
});

// Activar service worker y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activación completa');
      return self.clients.claim();
    })
  );
});

// Interceptar requests y servir desde caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer fetch y cachear
        return fetch(event.request).then((response) => {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Si falla todo, devolver página offline básica
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});
`;

  await writeFile(swFile, swContent);
}

generateEnv();
