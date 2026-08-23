/**
 * Formatting Utilities
 * Functions for formatting and parsing Indian currency and numbers
 */

/**
 * Formats a number as Indian currency (₹)
 * Uses Indian numbering system with commas (lakhs, crores)
 * Example: 1234567 → "₹12,34,567"
 *
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 * @throws {TypeError} If amount is not a number
 */
export function formatIndianCurrency(amount) {
  if (typeof amount !== 'number') {
    throw new TypeError('Amount must be a number');
  }

  if (!Number.isFinite(amount)) {
    throw new RangeError('Amount must be a finite number');
  }

  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  // Convert to string and split into integer and decimal parts
  const parts = absoluteAmount.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Apply Indian numbering format
  // Format: XX,XX,XX,XXX (rightmost 3 digits, then groups of 2)
  let result = '';
  let count = 0;

  // Process from right to left
  for (let i = integerPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      result = ',' + result;
    }
    result = integerPart[i] + result;
    count++;
  }

  // Add decimal part if present
  if (decimalPart) {
    result += '.' + decimalPart.substring(0, 2).padEnd(2, '0');
  }

  // Add currency symbol and handle negative
  const sign = isNegative ? '-' : '';
  return `${sign}₹${result}`;
}

/**
 * Parses an Indian currency string back to a number
 * Handles formats like "₹12,34,567", "12,34,567", "-₹5,000", etc.
 *
 * @param {string} currencyString - The currency string to parse
 * @returns {number} The parsed number
 * @throws {TypeError} If input is not a string
 * @throws {Error} If the string cannot be parsed as currency
 */
export function parseIndianCurrency(currencyString) {
  if (typeof currencyString !== 'string') {
    throw new TypeError('Currency string must be a string');
  }

  // Remove currency symbol and whitespace
  let cleaned = currencyString.trim().replace('₹', '');

  // Check for negative sign
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1);
  }

  // Remove commas
  cleaned = cleaned.replace(/,/g, '');

  // Parse to number
  const parsed = parseFloat(cleaned);

  if (Number.isNaN(parsed)) {
    throw new Error(`Cannot parse "${currencyString}" as currency`);
  }

  return isNegative ? -parsed : parsed;
}

/**
 * Formats a number with Indian locale
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number
 */
export function formatNumber(num, decimals = 0) {
  if (typeof num !== 'number') {
    throw new TypeError('Input must be a number');
  }

  if (!Number.isFinite(num)) {
    throw new RangeError('Input must be a finite number');
  }

  // Round to specified decimals
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(num * factor) / factor;

  // Format using toLocaleString with Indian locale
  return rounded.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a percentage
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
  if (typeof value !== 'number') {
    throw new TypeError('Value must be a number');
  }

  if (!Number.isFinite(value)) {
    throw new RangeError('Value must be a finite number');
  }

  return `${value.toFixed(decimals)}%`;
}
