import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data/content'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      exclude: [
        'build/**',
        'dist/**',
        'scripts/**',
        'src/test/**',
        '.react-router/**',
        '*.config.{ts,js}',
        'tests/e2e/**', // Playwright e2e specs — excluded from Vitest coverage
      ],
    },
  },
});
