
const CACHE_NAME = 'bolao-cache-v3';

// Lista de recursos essenciais para cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files...');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache failed:', error);
      })
  );
  // Força a ativação imediata
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Toma controle imediato
      self.clients.claim()
    ])
  );
});

// Estratégia de fetch
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Ignora APIs externas
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('/api/')) {
    return;
  }

  // Para navegação, tenta rede primeiro, depois cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se sucesso, clona e cacheia
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tenta cache, depois index.html
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Para outros recursos, tenta cache primeiro
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        // Se não está no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Se sucesso, cacheia para próxima vez
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          });
      })
  );
});

// Responde a mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
