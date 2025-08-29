import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { TranslationProvider } from './context/TranslationContext.tsx';
import { BrowserRouter } from 'react-router-dom';

console.log('main.tsx: App initialization started');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </TranslationProvider>
  </StrictMode>
);

console.log('main.tsx: App initialization completed');
