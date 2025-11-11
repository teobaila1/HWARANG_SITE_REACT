import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/theme.css'
import './styles/mobile_ovverrides.css'

// ✅ Import automat pentru PWA (vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'

// înregistrează service worker-ul (autoUpdate)
const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log('✅ Aplicația este gata să funcționeze offline.')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
