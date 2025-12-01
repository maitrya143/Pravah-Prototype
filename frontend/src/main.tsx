import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start({
        serviceWorker: { url: '/mockServiceWorker.js' },
        onUnhandledRequest: 'bypass',
      });
      console.log('%c[MSW] Mock API Enabled', 'color: green; font-weight: bold;');
    } catch (err) {
      console.error('[MSW] Failed to start worker:', err);
    }
  }
}

enableMocking().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
