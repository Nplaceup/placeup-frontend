/**
 * PlaceUp - Main Entry Point
 * 
 * React 애플리케이션의 진입점입니다.
 * 여기서 React 앱을 DOM에 마운트하고 전역 스타일을 불러옵니다.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

// 전역 스타일 임포트
import './styles/index.css';
import './styles/tailwind.css';
import './styles/theme.css';
import './styles/fonts.css';

// React 18의 createRoot API를 사용하여 애플리케이션 마운트
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
