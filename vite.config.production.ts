import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  build: {
    // Performance optimizations for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-slider'],
          'icons-vendor': ['lucide-react'],
          // Split large components
          'categories': ['./client/src/pages/CategoriesPage.tsx'],
          'components': ['./client/src/components/ProductCard.tsx', './client/src/components/LazyProductCard.tsx'],
        },
      },
    },
    // Reduce bundle size warnings threshold
    chunkSizeWarningLimit: 800,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
});