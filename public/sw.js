const CACHE_NAME = 'bolao-cache-v2';

// Lista de recursos para cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/dashboard',
  '/matches',
  '/profile',
  '/rules'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Força a ativação imediata do novo Service Worker
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Toma controle imediato de todas as páginas
      self.clients.claim()
    ])
  );
});

// Estratégia de cache: Network First para navegação, Cache First para recursos
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para o Supabase e outras APIs
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('team-logos/')) {
    return;
  }

  // Para requisições de navegação (HTML), usar Network First com fallback para cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a resposta for bem-sucedida, atualiza o cache
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
          // Se a rede falhar, tenta usar o cache
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Se não encontrar no cache, retorna a página inicial
              return caches.match('/');
            });
        })
    );
    return;
  }

  // Para outros recursos (JS, CSS, imagens), usar Cache First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Se encontrou no cache, retorna imediatamente
          return response;
        }
        // Se não encontrou no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Se a resposta for bem-sucedida, atualiza o cache
            if (response.status === 200) {
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

// Intercepta mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 
