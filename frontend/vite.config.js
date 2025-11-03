// vite.config.js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    plugins: [react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: true,
            workbox: {navigateFallback: '/index.html'}
        })],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
})
