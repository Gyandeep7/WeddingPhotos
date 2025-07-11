import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/pcloud-proxy': {
        target: 'https://u.pcloud.link',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pcloud-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add headers to bypass some restrictions
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
          });
        }
      }
    },
  },
});
