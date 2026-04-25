import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
    environmentMatchGlobs: [
      ['tests/theme.test.ts', 'jsdom'],
      ['tests/keyboard.test.ts', 'jsdom'],
    ],
  },
});
