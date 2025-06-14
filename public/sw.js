
const CACHE_NAME = 'bolao-pwa-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Fazendo cache dos arquivos estáticos');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch(error => {
        console.error('Erro no cache durante instalação:', error);
      })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker ativo e controlando páginas');
      return self.clients.claim();
    })
  );
});

// Fetch - estratégia Network First com fallback melhorado
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Ignora APIs do Supabase e outros serviços externos
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('google.com')) {
    return;
  }

  // Para navegação (HTML) - sempre tenta rede primeiro
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Se a resposta for válida, faz cache
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Em caso de erro de rede, retorna index.html do cache
          console.log('Usando fallback para:', event.request.url);
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Para outros recursos - Cache First com Network Fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Só faz cache se for uma resposta válida
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
      .catch(error => {
        console.error('Erro no fetch:', error);
        // Para requests de imagens, retorna uma imagem placeholder se necessário
        if (event.request.destination === 'image') {
          return new Response('', {
            status: 404,
            statusText: 'Imagem não encontrada'
          });
        }
        throw error;
      })
  );
});
