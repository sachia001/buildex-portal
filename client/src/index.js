import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// Buffer polyfill — @react-pdf/renderer requires it in browser environment
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = { isBuffer: () => false, from: (d) => new Uint8Array(d || []), alloc: (n) => new Uint8Array(n) };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
