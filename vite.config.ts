import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

const ReactCompilerConfig = {
  mode: 'automatic',
  runtime: 'automatic',
  importSource: 'react',
};

export default defineConfig({
  base: '/',
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-typescript'],
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
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
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'zustand': ['zustand'],
          'lucide-react': ['lucide-react'],
          'tailwind-merge': ['tailwind-merge'],
          'clsx': ['clsx'],
          'date-fns': ['date-fns'],
          'formik': ['formik'],
          'mdxeditor': ['@mdxeditor/editor'],
          'uuid': ['uuid'],
          'yup': ['yup'],
          'codemirror-langs': [
            '@codemirror/lang-python',
            '@codemirror/lang-javascript',
            '@codemirror/lang-sql',
          ],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
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
    cors: true,
  },
});