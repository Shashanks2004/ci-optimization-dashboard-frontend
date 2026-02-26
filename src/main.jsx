import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="334469091048-rjd5htv9q6qnvpkiemaf65t5v64aahi7.apps.googleusercontent.com">
       <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
