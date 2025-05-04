import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: 'static',
  envPrefix: ['PUBLIC_', 'OPENAI_'],

  adapter: node({
    mode: 'standalone'
  }),

  server: {
    host: import.meta.env.PUBLIC_HOST || '0.0.0.0',
    port: parseInt(import.meta.env.PUBLIC_PORT || '5000', 10)
  },

  vite: {
    server: {
      host: import.meta.env.PUBLIC_HOST || '0.0.0.0',
      port: parseInt(import.meta.env.PUBLIC_PORT || '5000', 10),
      strictPort: false,
      cors: true,
      allowedHosts: ['localhost', '0.0.0.0'],
      hmr: {
        clientPort: parseInt(
          import.meta.env.PUBLIC_HMR_CLIENT_PORT || '443',
          10
        )
      },
      watch: {
        usePolling: true
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      includeSource: ['src/**/*.{js,ts,svelte}'],
      exclude: ['node_modules', '.git', '.astro', 'dist'],
      deps: {
        inline: false
      },
      setupFiles: ['./tests/setup.js']
    }
  }
});
