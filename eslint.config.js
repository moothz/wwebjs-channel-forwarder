import globals from "globals";
import js from "@eslint/js";
import promise from "eslint-plugin-promise";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      promise,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...promise.configs.recommended.rules,
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];