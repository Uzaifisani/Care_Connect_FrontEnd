import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'localhost',
      'calm-carpets-trade.loca.lt',
      '.loca.lt' // This will allow all subdomains of loca.lt
    ],
  },
})