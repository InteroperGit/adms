// Formatting owns whitespace; ESLint and Astro check own correctness.
export default {
  plugins: ['prettier-plugin-astro'],
  printWidth: 80,
  singleQuote: true,
  proseWrap: 'always',
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
