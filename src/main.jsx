import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { warmVoices } from './lib/tts'
import { registerSW } from 'virtual:pwa-register'

warmVoices()
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)