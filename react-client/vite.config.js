import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],



  server: {
    proxy: {
      
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
     '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false, // if using https, set this to true
        // rewrite: (path) => path.replace(/^\/api/, '')
      }, 
    }
  }
});
