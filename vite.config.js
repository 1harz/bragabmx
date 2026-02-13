import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Importante para caminhos relativos
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: 3000
  }
});