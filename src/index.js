import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep or remove based on whether we create a new index.css
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
