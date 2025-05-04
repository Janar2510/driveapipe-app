import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { CRMProvider } from './context/CRMContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CRMProvider>
      <Router>
        <App />
      </Router>
    </CRMProvider>
  </StrictMode>
);