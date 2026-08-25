import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'MenuPrincipal.html'),
        jogo: resolve(__dirname, 'Jogo.html'),
        lore: resolve(__dirname, 'Lore.html')
      }
    }
  },
  server: {
    port: 3000,
    watch: {
      ignored: ['**/src-tauri/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
