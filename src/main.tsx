import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { iconCacheService } from './services/IconCacheService'

// Clear the entire cache to load the renamed priority icons
iconCacheService.clearCache();

// Production safety net: Handle chunk loading failures
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    // Check if it's a chunk loading error
    if (event.message?.includes('Loading chunk') || 
        event.message?.includes('Failed to import') ||
        (event.error?.name === 'ChunkLoadError')) {
      console.warn('Chunk loading failed, reloading page...');
      window.location.reload();
    }
  });
  
  // Handle unhandled promise rejections for dynamic imports
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Loading chunk') ||
        event.reason?.message?.includes('Failed to import')) {
      console.warn('Dynamic import failed, reloading page...');
      event.preventDefault();
      window.location.reload();
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <App />
);
