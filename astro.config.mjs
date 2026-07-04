// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://chipsettleineu.vercel.app',
  integrations: [
    react(),
    sitemap({
      // /results carries a company's profile in the query string — keep it
      // out of the sitemap the same way robots.txt keeps it out of crawling.
      filter: (page) => !page.includes('/results'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
