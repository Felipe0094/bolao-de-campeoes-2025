import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

// Verificar se o app está sendo aberto em modo standalone (PWA)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone || 
                     document.referrer.includes('android-app://');

// Se estiver em modo standalone, verificar a autenticação antes de renderizar
if (isStandalone) {
  // Importar o cliente Supabase
  import('./integrations/supabase/client').then(({ supabase }) => {
    // Verificar a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Se houver uma sessão válida, redirecionar para o dashboard
        window.location.href = '/dashboard';
      } else {
        // Se não houver sessão, renderizar normalmente
        createRoot(document.getElementById("root")!).render(<App />);
      }
    });
  });
} else {
  // Se não estiver em modo standalone, renderizar normalmente
  createRoot(document.getElementById("root")!).render(<App />);
}
