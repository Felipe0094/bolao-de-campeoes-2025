
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Função principal para renderizar o app
const renderApp = () => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
};

// Renderizar o app imediatamente
renderApp();

// Registrar o Service Worker apenas após o app estar carregado
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then(registration => {
      console.log('SW registered successfully:', registration.scope);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  }
});
