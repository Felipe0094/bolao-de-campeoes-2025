const CACHE_NAME = 'bolao-campeoes-2025-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bolao-feph.jpg',
  '/placeholder.svg'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Cache antigo removido:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia de cache: Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para o Supabase e outras APIs
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('team-logos/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for bem sucedida, atualiza o cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Se não encontrar no cache, retorna uma página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Atualização periódica do cache
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return Promise.all(
            urlsToCache.map((url) => {
              return fetch(url)
                .then((response) => {
                  if (response.status === 200) {
                    return cache.put(url, response);
                  }
                })
                .catch(() => {
                  console.log('Falha ao atualizar cache para:', url);
                });
            })
          );
        })
    );
  }
}); 
