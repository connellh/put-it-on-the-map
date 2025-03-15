import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',       // Output to dist for production
    emptyOutDir: true,
  },
  server: {
    watch: {
      interval: 20,
    },
    hmr: {
      overlay: true,      // Show errors in browser
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.json']
  }
});
