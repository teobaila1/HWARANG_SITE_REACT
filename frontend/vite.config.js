import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',           // 🔴 spune Vite unde e src-ul acum
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // ✅ Aici e cheia
    port: 5173,
    proxy: {
      '/api': 'http://192.168.100.87:5000',
    },
  },
});