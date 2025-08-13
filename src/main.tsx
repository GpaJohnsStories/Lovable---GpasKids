import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SuperAVProvider } from './contexts/SuperAVContext'
import { iconCacheService } from './services/IconCacheService'

// Clear the cache for !ICA-PL1.jpg to load the new cropped version
iconCacheService.refreshIcon('!ICA-PL1.jpg');

createRoot(document.getElementById("root")!).render(
  <SuperAVProvider>
    <App />
  </SuperAVProvider>
);
