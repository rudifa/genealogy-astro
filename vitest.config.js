import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['vitest/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // ... any other test configurations
  },
})
