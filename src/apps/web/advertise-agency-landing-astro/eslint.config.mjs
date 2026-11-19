// Flat config keeps browser, Node and typed source environments explicit.
import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [
      "node_modules/**",
      ".astro/**",
      "dist/**",
      "output/**",
      "coverage/**",
      ".playwright-cli/**",
      ".tmp/**",
      ".pnpm-store/**",
      "data/content*/**",
      "src/env.d.ts",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.{ts,tsx,astro}", "tests/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.astro"],
    processor: "astro/client-side-ts",
    languageOptions: { parserOptions: { parser: ts.parser } },
    rules: {
      // Template expressions are rendered rather than called as statements.
      "@typescript-eslint/no-unused-expressions": "off",
      // TypeScript checks global type names in frontmatter.
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.astro/*.js"],
    languageOptions: { parser: ts.parser, globals: globals.browser },
  },
  {
    rules: {
      // Keep every conditional branch explicit, even for one statement.
      curly: ["error", "all"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-magic-numbers": "off",
    },
  },
  {
    files: ["src/components/ui/cylinder-carousel/cylinderCarouselRuntime.ts"],
    rules: {
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
    },
  },
  prettier,
);
