import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Esto ayuda a que detecte cambios dentro de Docker
    },
    host: true, // Equivalente al --host del comando
    port: 5173,
  },

  envDir: './',
  envPrefix: 'VITE_',
  
  build: {
    sourcemap: true, // Esto genera un archivo .map para facilitar la depuración en producción
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    }// Directorio de salida para los archivos construidos
  }
})