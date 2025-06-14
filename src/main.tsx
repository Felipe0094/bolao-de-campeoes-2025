
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Função principal para renderizar o app
const renderApp = () => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
    console.log('App renderizado com sucesso');
  } else {
    console.error('Elemento root não encontrado');
  }
};

// Renderizar o app imediatamente
renderApp();

// Registrar o Service Worker apenas em produção
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then(registration => {
      console.log('SW registrado com sucesso:', registration.scope);
    }).catch(error => {
      console.log('Falha no registro do SW:', error);
    });
  });
}

// Debug para produção
if (import.meta.env.PROD) {
  console.log('App rodando em produção');
  console.log('URL atual:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
}
