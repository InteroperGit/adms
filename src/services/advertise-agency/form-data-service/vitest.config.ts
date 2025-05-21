import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true, // позволяет использовать describe/test без импорта
        environment: 'node', // подойдёт для backend
        include: ['src/**/*.test.ts'], // где искать тесты
    }
})
