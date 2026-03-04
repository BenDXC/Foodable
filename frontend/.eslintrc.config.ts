export default defineConfig({
  rules: {
    "max-statements": ["error", 25],
    "max-len": ["error", {code: 180, ignoreUrls: true}],
    "max-lines-per-function": ["error", {
      "max": 50,
      "skipBlankLines": true,
      "skipComments": true,
      "IIFEs": true
    }],
    "max-params": ["error", 4],
    "complexity": ["error", 4],
    "no-magic-numbers": ["error", {
      ignore: [0, 1, -1],
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreArrayIndexes: true,
    }],
    "no-var": "error",
    "no-else-return": ["error", 4],
    "no-unused-vars": "error",
    "no-console": ["error"],
    "no-undef": "off",
    "no-empty": "warn",
    "no-extra-semi": "error",
    "unicorn/filename-case": [
      "error", {"case": "kebabCase"},
    ],
    "import/no-named-as-default-member": "off",
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-magic-numbers": ["warn", {
      ignore: [0, 1, -1],
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreArrayIndexes: true,

    }],
    "root": true,
    "env": {
      "browser": true,
      "es2020": true,
      "node": true
    },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "ignorePatterns": ["dist", ".eslintrc.json"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["react-refresh", "@typescript-eslint", "react", "jsx-a11y"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
})


