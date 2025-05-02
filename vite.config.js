import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    // Required for testing Svelte components
    svelte({ hot: !process.env.VITEST })
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    hmr: {
      clientPort: 443
    },
    allowedHosts: ['localhost', '0.0.0.0']
  },
  test: {
    // Enable the JSdom environment for testing Svelte components
    environment: 'jsdom',
    globals: true,
    includeSource: ['src/**/*.{js,ts,svelte}'],
    exclude: ['node_modules', '.git', '.astro', 'dist'],
    // Mock these files using identity proxies
    deps: {
      // Don't inline external dependencies
      inline: false
    },
    setupFiles: ['./tests/setup.js']
  }
});
