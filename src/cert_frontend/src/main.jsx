import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

console.log('main.jsx executing...');  // Debug log

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);  // Debug log

if (!rootElement) {
  console.error('Root element not found!');  // Debug log
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('App rendered');  // Debug log
}