import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  vite: {
    server: {
      hmr: {
        clientPort: 443,
      },
      host: '0.0.0.0',
      watch: {
        usePolling: true,
      },
      strictPort: false,
      cors: true,
      allowedHosts: ['localhost', '0.0.0.0'],
    },
  },
});
