/**
 * Utility Helpers
 * Common utility functions for type checking, null-safe access, and data manipulation
 */

/**
 * Checks if a value is a number and is a valid finite number
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a valid number
 */
export function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Checks if a value is a positive number
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a positive number
 */
export function isPositiveNumber(value) {
  return isValidNumber(value) && value >= 0;
}

/**
 * Checks if a value is a non-negative integer
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a non-negative integer
 */
export function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Checks if a value is a string
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a string
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Checks if a value is a non-empty string
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a non-empty string
 */
export function isNonEmptyString(value) {
  return isString(value) && value.trim().length > 0;
}

/**
 * Checks if a value is an object (but not an array or null)
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is an object
 */
export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is an array
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is an array
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Safely accesses a nested property in an object using dot notation
 * Returns undefined if any intermediate property doesn't exist
 * Example: safeGet({ a: { b: { c: 5 } } }, 'a.b.c') → 5
 *
 * @param {*} obj - The object to access
 * @param {string} path - The property path (dot-separated)
 * @param {*} defaultValue - The default value to return if path doesn't exist
 * @returns {*} The value at the path or defaultValue
 */
export function safeGet(obj, path, defaultValue = undefined) {
  if (!isObject(obj) && !isArray(obj)) {
    return defaultValue;
  }

  if (!isNonEmptyString(path)) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Clamps a number between min and max values
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} The clamped value
 */
export function clamp(value, min, max) {
  if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
    throw new TypeError('All arguments must be valid numbers');
  }

  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a specified number of decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - The number of decimal places
 * @returns {number} The rounded value
 */
export function roundToDecimals(value, decimals) {
  if (!isValidNumber(value) || !isNonNegativeInteger(decimals)) {
    throw new TypeError('Value must be a number and decimals must be a non-negative integer');
  }

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Checks if two numbers are approximately equal (within epsilon)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} epsilon - Tolerance (default: 0.01)
 * @returns {boolean} True if numbers are approximately equal
 */
export function approximatelyEqual(a, b, epsilon = 0.01) {
  if (!isValidNumber(a) || !isValidNumber(b)) {
    throw new TypeError('Both values must be numbers');
  }

  return Math.abs(a - b) <= epsilon;
}

/**
 * Creates a deep copy of a value
 * Works with objects and arrays containing primitives and nested structures
 *
 * @param {*} value - The value to copy
 * @returns {*} A deep copy of the value
 */
export function deepCopy(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (isArray(value)) {
    return value.map(item => deepCopy(item));
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const copy = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      copy[key] = deepCopy(value[key]);
    }
  }

  return copy;
}

/**
 * Merges multiple objects into a new object
 * Later properties override earlier ones
 *
 * @param {...Object} objects - Objects to merge
 * @returns {Object} A new merged object
 */
export function mergeObjects(...objects) {
  const result = {};

  for (const obj of objects) {
    if (isObject(obj)) {
      Object.assign(result, obj);
    }
  }

  return result;
}

/**
 * Checks if an object has all required keys
 * @param {Object} obj - The object to check
 * @param {string[]} requiredKeys - Array of required keys
 * @returns {boolean} True if all required keys exist
 */
export function hasAllRequiredKeys(obj, requiredKeys) {
  if (!isObject(obj)) {
    return false;
  }

  if (!isArray(requiredKeys)) {
    return false;
  }

  return requiredKeys.every(key => key in obj);
}
