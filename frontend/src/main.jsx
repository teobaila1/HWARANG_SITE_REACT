import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import './styles/mobile_ovverrides.css';

import { AuthProvider } from './auth/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
