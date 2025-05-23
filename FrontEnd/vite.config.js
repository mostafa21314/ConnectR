import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5300,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://connectr-backend-1:8000',  // Your Django server URL
        changeOrigin: true,
        secure: true,
      }
    }
  },
});
