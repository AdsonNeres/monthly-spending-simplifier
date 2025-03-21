
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from "sonner";

// Renderiza a aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)

// Lógica de PWA: notifica o usuário quando a aplicação está pronta para ser instalada
window.addEventListener('beforeinstallprompt', (e) => {
  // Impede que o Chrome mostre o prompt automaticamente
  e.preventDefault();
  // Salva o evento para que possa ser acionado mais tarde
  const deferredPrompt = e;
  
  // Após algum tempo ou interação do usuário, mostra um toast
  setTimeout(() => {
    toast.message("Instalar aplicativo", {
      description: "Este app pode ser instalado para uso offline",
      action: {
        label: "Instalar",
        onClick: () => {
          // Mostra o prompt de instalação
          deferredPrompt.prompt();
          // Espera pelo resultado
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('Usuário aceitou a instalação');
              toast.success("Aplicativo instalado com sucesso!");
            } else {
              console.log('Usuário recusou a instalação');
            }
          });
        },
      },
      duration: 10000,
    });
  }, 15000);
});

// Notifica o usuário quando o app está online/offline
window.addEventListener('online', () => {
  toast.success("Você está online novamente!");
  
  // Aciona a sincronização de dados quando volta a ficar online
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.sync.register('sync-expenses').catch(error => {
        console.error('Falha ao registrar sincronização em segundo plano:', error);
      });
    });
  }
});

window.addEventListener('offline', () => {
  toast.warning("Você está offline. Algumas funcionalidades podem estar limitadas.", {
    duration: 5000,
  });
});

// Notifica quando uma nova versão está disponível
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    toast.info("Nova versão disponível!", {
      description: "Recarregue a página para atualizar.",
      action: {
        label: "Atualizar",
        onClick: () => window.location.reload(),
      },
      duration: Infinity,
    });
  });
}
