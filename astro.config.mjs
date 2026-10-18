// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = (env.SITE_URL || process.env.SITE_URL || 'https://www.eduvia.app').replace(
  /\/$/,
  '',
);

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false,
    },
  },
  redirects: {
    '/pricing': '/contact',
    '/product': '/platform',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') && !page.includes('/pricing') && !page.includes('/product'),
    }),
  ],
});
