import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ntvu19.github.io',
  server: {
    host: '127.0.0.1',
  },
  output: 'static',
  integrations: [react(), mdx(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler', quietDeps: true },
      },
    },
  },
});
