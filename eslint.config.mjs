import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, "@stylistic": stylistic },
    extends: ["js/recommended"],
    rules: {
      eqeqeq: "error",
      curly: "error",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/no-tabs": "error",
      "@stylistic/semi": ["error", "always"],
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
        },
      ],
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
