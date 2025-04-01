import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({}),
    tailwindcss(),
    visualizer({
      template: 'treemap',
      open: true,
      gzipSize: true,
      brotliSize: false,
      filename: 'analyze-bundle.html',
      projectRoot: import.meta.dirname.replaceAll('\\', '/'),
    }),
  ],
  preview:{
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts:true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    allowedHosts:true
  },
});