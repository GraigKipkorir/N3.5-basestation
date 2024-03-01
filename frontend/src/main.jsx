import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Settings from './components/settings';
import './index.css'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Settings/>
  </React.StrictMode>,
)
