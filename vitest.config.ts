import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    environmentMatchGlobs: [
      ['tests/theme.test.ts', 'jsdom'],
      ['tests/keyboard.test.ts', 'jsdom'],
    ],
  },
});
