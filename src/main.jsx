import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeSync } from './components/ThemeSync.jsx';
import App from './App.jsx';
import './index.css';
import './styles/design-system.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeSync />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
