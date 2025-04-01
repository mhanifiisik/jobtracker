import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import babel from "vite-plugin-babel";

const ReactCompilerConfig = {
  mode: 'automatic',
  runtime: 'automatic',
  importSource: 'react',
};

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
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],

  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },

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