import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@data': path.resolve(__dirname, 'data/config'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
});
