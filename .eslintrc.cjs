/**
 * ESLint Configuration
 * Defines coding standards for the Indian Income Tax Calculator
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '.DS_Store',
  ],
  rules: {
    // Error prevention
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-const-assign': 'error',
    'no-var': 'error',
    'prefer-const': 'error',

    // Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error',
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-spacing': 'error',
    'key-spacing': 'error',

    // Best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-with': 'error',
    'prefer-arrow-callback': 'error',
    'no-use-before-define': ['error', { functions: false }],
  },
};
