module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: "detect" } },
  ignorePatterns: ["dist", "node_modules", "*.config.js"],
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off", // this codebase doesn't use PropTypes
    "react/react-in-jsx-scope": "off", // React 17+ JSX runtime
    "react/no-unescaped-entities": "off", // apostrophes/quotes in copy are fine as plain text
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
