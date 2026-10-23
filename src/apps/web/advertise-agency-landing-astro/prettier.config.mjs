// Formatting owns whitespace; ESLint and Astro check own correctness.
export default {
  plugins: ["prettier-plugin-astro"],
  // Keep Prettier's wrap target aligned with the project line limit.
  printWidth: 80,
  // Preserve intentional multiline layouts in complex object literals.
  objectWrap: "preserve",
  singleAttributePerLine: true,
  singleQuote: false,
  proseWrap: "always",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
