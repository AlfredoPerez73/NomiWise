import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Importa tu Service Worker personalizado
import { generateSW } from 'workbox-build'

const manifestForPlugin = {
  registerType: 'autoUpdate',
  manifest: {
    "theme_color": "#000000",
    "background_color": "#ad0000",
    "icons":
      [{
        "purpose": "maskable",
        "sizes": "512x512",
        "src": "icon512_maskable.png",
        "type": "image/png"
      },
      {
        "purpose": "any",
        "sizes": "512x512",
        "src": "icon512_rounded.png",
        "type": "image/png"
      }],
    "orientation": "any",
    "display": "standalone",
    "dir": "auto",
    "lang": "en-US",
    "name": "Gabriela",
    "short_name": "l.gab",
    "description": "Sistema de nomina PWA"
  },

}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
})
