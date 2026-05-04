import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from './routes';
import './styles/index.css';

function App() {
  return useRoutes(routes);
}

function Root() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
  