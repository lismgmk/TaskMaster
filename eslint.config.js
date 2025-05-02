import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.svelte'],
    plugins: { svelte: sveltePlugin },
    languageOptions: {
      parser: await import('svelte-eslint-parser'),
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {}
  },
  prettier,
  {
    ignores: ['dist/', 'node_modules/', '*.astro', '*.d.ts', 'eslint.config.js']
  }
];
