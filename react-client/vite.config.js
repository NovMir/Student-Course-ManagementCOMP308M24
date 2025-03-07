import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  define: {
    'process.env': {}
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Assuming your server runs on port 8000
        changeOrigin: true,
        secure: false
      }
    }
  }
});
