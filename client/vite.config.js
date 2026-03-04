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
})