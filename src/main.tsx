import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SuperAVProvider } from './contexts/SuperAVContext'
import { iconCacheService } from './services/IconCacheService'
import { BUILD_ID } from './utils/buildInfo'

// Clear the entire cache to load the renamed priority icons
iconCacheService.clearCache();

// Log startup info
console.log(`🚀 GPA's Kids app starting - Build ${BUILD_ID}`);

createRoot(document.getElementById("root")!).render(
  <SuperAVProvider>
    <App />
  </SuperAVProvider>
);
