import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SuperAVProvider } from './contexts/SuperAVContext'
import { iconCacheService } from './services/IconCacheService'

// Clear the entire cache to load the renamed priority icons
iconCacheService.clearCache();

createRoot(document.getElementById("root")!).render(
  <SuperAVProvider>
    <App />
  </SuperAVProvider>
);
