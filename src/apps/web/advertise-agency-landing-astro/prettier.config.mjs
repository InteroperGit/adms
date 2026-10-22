// Formatting owns whitespace; ESLint and Astro check own correctness.
export default {
  plugins: ['prettier-plugin-astro'],
  // Keep Prettier's wrap target aligned with the project line limit.
  printWidth: 80,
  singleQuote: true,
  proseWrap: 'always',
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
