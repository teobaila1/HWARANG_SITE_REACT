// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon-180.png', 'icons/*'],
      manifest: {
        name: 'ACS Hwarang Academy Sibiu',
        short_name: 'Hwarang',
        description: 'Platformă pentru program, concursuri și administrare sportivi.',
        theme_color: '#111114',
        background_color: '#111114',
        display: 'standalone',
        start_url: '/acasa',
        scope: '/',
        icons: [
          {
            src: 'icons/hwarang.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/hwarang.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/hwarang.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/images\//, /^\/video\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-resources' }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api', networkTimeoutSeconds: 3 }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
