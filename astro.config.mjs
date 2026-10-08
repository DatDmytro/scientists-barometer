// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Скрипти сторінок — окремими файлами, а не інлайном: тоді CSP обходиться script-src 'self'
    // без sha256-хешів, які треба було перегенеровувати після кожної зміни скрипта.
    build: { assetsInlineLimit: 0 },
  },
});
