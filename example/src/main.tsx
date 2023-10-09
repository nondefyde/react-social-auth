import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { FacebookProvider } from '../../package/src/lib/Facebook'
import GoogleOAuthProvider from '../../package/src/lib/Google/components/GoogleOAuthProvider/GoogleOAuthProvider'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LinkedInCallback } from '../../package/src/lib/LinkedIn'
import { SnapChatCallback } from '../../package/src/lib/Snapchat'
import { TwitterCallback } from '../../package/src/lib/Twitter'

const router = createBrowserRouter([
  {
    path: "/",
  },
  {
    path: "/callback/linkedin",
    element: <LinkedInCallback />,
  },
  {
    path: "/callback/snapchat",
    element: <SnapChatCallback />,
  },
  {
    path: "/callback/twitter",
    element: <TwitterCallback />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
    <GoogleOAuthProvider clientId={process.env.RS_GOOGLE_CLIENT_KEY as string}>
      <App />
      </GoogleOAuthProvider>
    </FacebookProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
