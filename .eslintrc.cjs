/**
 * Base monorepo ESLint config (TypeScript-first)
 * - Keeps rules minimal; focuses on TS recommended
 * - TSX parsing enabled so RN/React files lint without extra plugins
 */
module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.expo/',
    '**/*.d.ts',
  ],
  env: { es2021: true, node: true, jest: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // Keep defaults minimal; teams can extend locally per workspace
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        // Allow JSX without explicit React import (new JSX transform)
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
};

