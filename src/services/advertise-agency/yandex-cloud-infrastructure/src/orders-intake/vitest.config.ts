import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@shared': resolve(__dirname, '../shared/src'),
            '@shared/logger': resolve(__dirname, '../shared/src/logger'),
        },
    },
    test: {
        // ваши настройки тестов
        environment: 'node',
    },
});