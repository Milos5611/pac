import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  envPrefix: 'SVELTE_APP_',
  server: {port: 5173, strictPort: true},
  preview: {port: 4173, strictPort: true},
});
