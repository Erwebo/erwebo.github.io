// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ezplayapp.com',
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/__proxy/games': {
          target: 'https://ezplay-prod.onrender.com',
          changeOrigin: true,
          rewrite: () => '/public/games/active',
        },
        '/__proxy/mvp': {
          target: 'https://ezplay-prod.onrender.com',
          changeOrigin: true,
          rewrite: () => '/public/mvp/weekly',
        },
      },
    },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/app/') &&
        !page.includes('/download/'),
    }),
  ],
});
