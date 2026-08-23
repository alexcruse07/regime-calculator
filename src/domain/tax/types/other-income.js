/**
 * Other Income Type Definition
 * Expanded other income breakdown for TAX-010
 *
 * Replaces generic otherIncome with:
 * - Interest Income (savings, FD, RD)
 * - Dividend Income (taxable from 2020)
 * - Other Taxable Income (miscellaneous)
 */

/**
 * @typedef {Object} OtherIncome
 * Represents breakdown of other income sources
 *
 * @property {number} interestIncome - Interest income from savings, FD, RD (₹, ≥ 0)
 * @property {number} dividendIncome - Dividend income (₹, ≥ 0)
 * @property {number} otherTaxable - Other taxable income (₹, ≥ 0)
 *
 * @example
 * const otherIncome = {
 *   interestIncome: 25000,   // Savings account, FD interest
 *   dividendIncome: 15000,   // Dividends from stocks/MF
 *   otherTaxable: 10000,     // Gifts, lottery, etc.
 * };
 */

/**
 * Creates and validates an OtherIncome object
 * @param {Object} params - Other income parameters
 * @param {number} [params.interestIncome=0] - Interest income
 * @param {number} [params.dividendIncome=0] - Dividend income
 * @param {number} [params.otherTaxable=0] - Other taxable income
 * @returns {OtherIncome} Validated other income object
 * @throws {Error} If values are invalid
 */
export function createOtherIncome({
  interestIncome = 0,
  dividendIncome = 0,
  otherTaxable = 0,
} = {}) {
  // Validate all values are finite numbers
  if (!Number.isFinite(interestIncome)) {
    throw new Error('Interest income must be a finite number');
  }
  if (!Number.isFinite(dividendIncome)) {
    throw new Error('Dividend income must be a finite number');
  }
  if (!Number.isFinite(otherTaxable)) {
    throw new Error('Other taxable income must be a finite number');
  }

  // Validate non-negativity
  if (interestIncome < 0) {
    throw new Error('Interest income must be non-negative');
  }
  if (dividendIncome < 0) {
    throw new Error('Dividend income must be non-negative');
  }
  if (otherTaxable < 0) {
    throw new Error('Other taxable income must be non-negative');
  }

  return Object.freeze({
    interestIncome,
    dividendIncome,
    otherTaxable,
  });
}

/**
 * Calculates total other income
 * @param {OtherIncome} otherIncome - Other income object
 * @returns {number} Total other income
 */
export function getTotalOtherIncome(otherIncome) {
  if (!otherIncome || typeof otherIncome !== 'object') {
    return 0;
  }
  return (otherIncome.interestIncome || 0) +
         (otherIncome.dividendIncome || 0) +
         (otherIncome.otherTaxable || 0);
}

/**
 * Validates an OtherIncome object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid OtherIncome object
 */
export function isValidOtherIncome(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const { interestIncome, dividendIncome, otherTaxable } = value;

  // All fields must be finite numbers
  if (!Number.isFinite(interestIncome) || !Number.isFinite(dividendIncome) ||
      !Number.isFinite(otherTaxable)) {
    return false;
  }

  // All fields must be non-negative
  if (interestIncome < 0 || dividendIncome < 0 || otherTaxable < 0) {
    return false;
  }

  return true;
}

/**
 * Creates an empty other income object
 * @returns {OtherIncome} Empty other income object
 */
export function createEmptyOtherIncome() {
  return Object.freeze({
    interestIncome: 0,
    dividendIncome: 0,
    otherTaxable: 0,
  });
}

/**
 * Converts legacy flat other income to granular structure
 * Places entire amount in otherTaxable as a safe default
 * @param {number} legacyOtherIncome - Legacy single other income value
 * @returns {OtherIncome} Granular other income object
 */
export function fromLegacyOtherIncome(legacyOtherIncome) {
  const amount = Number.isFinite(legacyOtherIncome) && legacyOtherIncome >= 0
    ? legacyOtherIncome
    : 0;

  return createOtherIncome({
    interestIncome: 0,
    dividendIncome: 0,
    otherTaxable: amount,  // Default to otherTaxable for backward compatibility
  });
}
