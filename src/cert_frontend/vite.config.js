import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Get the DFX network from environment variable or default to 'local'
const network = process.env.DFX_NETWORK || 'local';

// Get canister IDs from environment variables
const canisterIds = {
  cert_backend: process.env.CANISTER_ID_CERT_BACKEND,
  cert_frontend: process.env.CANISTER_ID_CERT_FRONTEND,
};

// Host configuration
const LOCAL_HOST = "http://localhost:8000";
const IC_HOST = "https://ic0.app";
const host = network === "ic" ? IC_HOST : LOCAL_HOST;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: host,
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK),
    'process.env.CERT_BACKEND_CANISTER_ID': JSON.stringify(canisterIds.cert_backend),
    global: 'window',
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
});