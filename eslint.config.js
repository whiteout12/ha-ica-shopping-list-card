import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        crypto: "readonly",
        CustomEvent: "readonly",
        Event: "readonly",
        KeyboardEvent: "readonly",
        HTMLInputElement: "readonly",
        HTMLFormElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLElement: "readonly",
        customElements: "readonly",
        FormData: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: { ...tseslint.configs.recommended.rules },
  },
  prettier,
  { ignores: ["dist/", "node_modules/"] },
];
