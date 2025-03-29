import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import RollupNodePolyFillPlugin from 'rollup-plugin-polyfill-node';

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router'],
          query: ['@tanstack/react-query'],
          'supabase-core': ['@supabase/supabase-js'],
          'supabase-postgrest': ['@supabase-cache-helpers/postgrest-react-query'],
          forms: ['formik', 'yup'],
          'ui-components': ['lucide-react', 'react-hot-toast'],
        },
      },
      treeshake: {
        manualPureFunctions: ['memo', 'lazy', 'css'],
      },
      plugins: [RollupNodePolyFillPlugin()],
    },
  },

  optimizeDeps: {
    include: [
      'react-router',
      'react-dom',
      'lucide-react',
      'react-hot-toast',
      'formik',
      'yup',
      '@supabase/supabase-js',
      '@supabase-cache-helpers/postgrest-react-query',
      '@tanstack/react-query',
    ],
  },
});
