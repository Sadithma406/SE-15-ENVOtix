import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Replace with your Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "813041258973-dn6jpf0um4kmategr507vg1up834j4t2.apps.googleusercontent.com"

// Note: StrictMode removed temporarily as it can cause issues with Leaflet maps
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
)