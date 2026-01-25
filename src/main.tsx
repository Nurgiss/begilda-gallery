import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import './styles/index.css';

function App() {
  return useRoutes(routes);
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
  