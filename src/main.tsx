import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

import './styles/index.css';

// React 18의 createRoot API를 사용하여 애플리케이션 마운트
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
