/**
 * Vitest Configuration
 * Configures testing environment, coverage, and globals
 */

export default {
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup/dom-polyfill.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'tests/setup/',
        'tests/fixtures/',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
};
