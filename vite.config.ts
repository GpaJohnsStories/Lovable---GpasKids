
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Generate compile-time build ID from UTC datetime
const buildDate = new Date();
const year = buildDate.getUTCFullYear();
const month = String(buildDate.getUTCMonth() + 1).padStart(2, '0');
const day = String(buildDate.getUTCDate()).padStart(2, '0');
const hours = String(buildDate.getUTCHours()).padStart(2, '0');
const minutes = String(buildDate.getUTCMinutes()).padStart(2, '0');
const BUILD_ID = `${year}${month}${day}-${hours}${minutes}`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
}));
