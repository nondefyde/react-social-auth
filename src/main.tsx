import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FacebookProvider } from './lib'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FacebookProvider appId="1898832260512807">
      <App />
    </FacebookProvider>
  </React.StrictMode>,
)
