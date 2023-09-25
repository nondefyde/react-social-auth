import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { FacebookProvider } from '../../package/src/lib/Facebook'

ReactDOM.render(
  <React.StrictMode>
    <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
      <App />
    </FacebookProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
