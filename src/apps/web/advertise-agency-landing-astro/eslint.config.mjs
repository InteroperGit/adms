// Flat config keeps browser, Node and typed source environments explicit.
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      '.astro/**',
      'dist/**',
      'output/**',
      'coverage/**',
      '.playwright-cli/**',
      '.tmp/**',
      '.pnpm-store/**',
      'data/content*/**',
      'src/env.d.ts',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.{ts,tsx,astro}', 'tests/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      'scripts/verify-*-browser.js',
      'scripts/verify-task-*.js',
      'scripts/verify-visual-blocks.js',
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      // CLI files intentionally export a bare callback for run-code.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    processor: 'astro/client-side-ts',
    languageOptions: { parserOptions: { parser: ts.parser } },
    rules: {
      // Template expressions are rendered rather than called as statements.
      '@typescript-eslint/no-unused-expressions': 'off',
      // TypeScript checks global type names in frontmatter.
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.astro/*.js'],
    languageOptions: { parser: ts.parser, globals: globals.browser },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  prettier,
);
