import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SuperAVProvider } from './contexts/SuperAVContext'

createRoot(document.getElementById("root")!).render(
  <SuperAVProvider>
    <App />
  </SuperAVProvider>
);
