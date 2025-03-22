import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ["src/generate/**/*.ts", "out/", ".*/"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
