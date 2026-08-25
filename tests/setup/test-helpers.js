/**
 * Test Helpers
 * Utility functions for testing
 */

/**
 * Creates a test double that tracks calls and arguments
 * @param {Function} implementation - Optional implementation function
 * @returns {Object} A test double with tracking capabilities
 */
export function createTestDouble(implementation = () => {}) {
  const double = function (...args) {
    double.calls.push(args);
    return implementation(...args);
  };

  double.calls = [];
  double.callCount = 0;

  Object.defineProperty(double, 'callCount', {
    get() {
      return this.calls.length;
    },
  });

  double.getCall = (index) => double.calls[index];
  double.getLastCall = () => double.calls[double.calls.length - 1];
  double.wasCalledWith = (...args) => {
    return double.calls.some(callArgs =>
      callArgs.length === args.length &&
      callArgs.every((arg, i) => arg === args[i]),
    );
  };
  double.reset = () => {
    double.calls = [];
  };

  return double;
}

/**
 * Asserts that two values are equal
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Optional error message
 * @throws {AssertionError} If values are not equal
 */
export function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

/**
 * Asserts that a condition is true
 * @param {boolean} condition - The condition to check
 * @param {string} message - Optional error message
 * @throws {AssertionError} If condition is false
 */
export function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Asserts that a condition is false
 * @param {boolean} condition - The condition to check
 * @param {string} message - Optional error message
 * @throws {AssertionError} If condition is true
 */
export function assertFalse(condition, message = '') {
  if (condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Asserts that a function throws an error
 * @param {Function} fn - The function to call
 * @param {string} message - Optional error message
 * @throws {AssertionError} If function doesn't throw
 */
export function assertThrows(fn, message = '') {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
  }

  if (!threw) {
    throw new Error(`Assertion failed: Expected function to throw. ${message}`);
  }
}

/**
 * Asserts that a value is truthy
 * @param {*} value - The value to check
 * @param {string} message - Optional error message
 * @throws {AssertionError} If value is falsy
 */
export function assertTruthy(value, message = '') {
  if (!value) {
    throw new Error(`Assertion failed: Expected truthy value. ${message}\nGot: ${value}`);
  }
}

/**
 * Asserts that a value is falsy
 * @param {*} value - The value to check
 * @param {string} message - Optional error message
 * @throws {AssertionError} If value is truthy
 */
export function assertFalsy(value, message = '') {
  if (value) {
    throw new Error(`Assertion failed: Expected falsy value. ${message}\nGot: ${value}`);
  }
}

/**
 * Asserts that two numbers are approximately equal
 * @param {number} actual - The actual value
 * @param {number} expected - The expected value
 * @param {number} delta - The allowed difference
 * @param {string} message - Optional error message
 * @throws {AssertionError} If values differ by more than delta
 */
export function assertApproximatelyEqual(actual, expected, delta = 0.01, message = '') {
  if (Math.abs(actual - expected) > delta) {
    throw new Error(
      `Assertion failed: ${message}\nExpected approximately: ${expected}\nActual: ${actual}\nDelta: ${delta}`,
    );
  }
}

/**
 * Runs a test suite with before/after hooks
 * @param {string} suiteName - Name of the test suite
 * @param {Function} fn - Function containing test definitions
 */
export function describe(suiteName, fn) {
  console.log(`\n${suiteName}`);
  fn();
}

/**
 * Defines a single test case
 * @param {string} testName - Name of the test
 * @param {Function} fn - Test implementation
 */
export function it(testName, fn) {
  try {
    fn();
    console.log(`  ✓ ${testName}`);
  } catch (error) {
    console.error(`  ✗ ${testName}`);
    console.error(`    ${error.message}`);
    throw error;
  }
}

/**
 * Creates a fixture object with cleanup
 * @param {Function} setup - Setup function
 * @param {Function} teardown - Teardown function
 * @returns {Object} Object with setup and teardown
 */
export function createFixture(setup, teardown = () => {}) {
  return {
    setup,
    teardown,
  };
}
