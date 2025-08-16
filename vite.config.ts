
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group admin components into separate chunk
          if (id.includes("/src/components/admin/") || id.includes("/src/pages/admin/")) {
            return "admin";
          }
          // Group heavy charting library separately
          if (id.includes("recharts")) {
            return "recharts";
          }
          // Group other heavy libraries
          if (id.includes("@tanstack/react-query") || id.includes("react-hook-form")) {
            return "vendor-heavy";
          }
          return undefined;
        }
      }
    }
  }
}));
