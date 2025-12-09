import React from 'react'; // <--- THIS WAS MISSING
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // (Keep this if you have it, otherwise delete this line)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);