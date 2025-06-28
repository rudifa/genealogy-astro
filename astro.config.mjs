// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
