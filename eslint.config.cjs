// eslint.config.cjs
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const importPlugin = require("eslint-plugin-import");
const unicornPlugin = require("eslint-plugin-unicorn");
const promisePlugin = require("eslint-plugin-promise");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // equivalent of env: { browser: true, node: true, es2021: true }
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        module: "readonly",
        __dirname: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      unicorn: unicornPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // General rules
      "no-console": "warn",

      // Import ordering
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],

      // Prettier formatting
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
];