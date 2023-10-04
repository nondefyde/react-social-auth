import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { FacebookProvider } from '../../package/src/lib/Facebook'
import GoogleOAuthProvider from '../../package/src/lib/Google/components/GoogleOAuthProvider/GoogleOAuthProvider'

ReactDOM.render(
  <React.StrictMode>
    <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
    <GoogleOAuthProvider clientId={process.env.RS_GOOGLE_CLIENT_KEY as string}>
      <App />
      </GoogleOAuthProvider>
    </FacebookProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
