import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect if we’re in dev mode
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  base: isDev ? '/' : '/raaswallet-ui/', // ✅ Root for dev, subpath for production
  optimizeDeps: {
    include: ['qrcode.react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          wallet: ['ethers', 'qrcode.react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
