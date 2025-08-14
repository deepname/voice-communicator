
const CACHE_NAME = 'voice-communicator-v2';
const AUDIO_CACHE_NAME = 'voice-communicator-audio-v2';
const ESSENTIAL_FILES = JSON.parse('["./","./index.html","./manifest.json"]');
const DYNAMIC_AUDIO_FILES = JSON.parse('["./sound/Cris.mp3","./sound/Ivan.mp3","./sound/Josefina.mp3","./sound/Mimi.mp3","./sound/Rita.mp3","./sound/Valentina.mp3"]');

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
  if (url.pathname.startsWith('/sound/') && config.allowedAudioExtensions.some(ext => url.pathname.endsWith(ext))) {
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
