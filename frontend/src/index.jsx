import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// provide minimal process fallback for browser builds where process is missing
if (typeof process === 'undefined') {
  // keep this minimal — avoid leaking secrets; env vars for CRA should use REACT_APP_ prefixed vars
  window.process = { env: {} };
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);