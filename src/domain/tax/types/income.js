/**
 * Income Type Definition
 * JSDoc type definitions for income data structures
 *
 * TAX-004: Salary Income
 * TAX-005: House Property Income (can be negative for loss)
 * TAX-006: Business/Professional Income
 * TAX-007: Capital Gains (kept separate for future special treatment)
 * TAX-008: Other Income
 */

/**
 * @typedef {Object} Income
 * Represents a person's income for tax calculation
 *
 * @property {number} salary - Salary income in rupees (≥ 0)
 * @property {number} houseProperty - House property income in rupees (can be negative for loss)
 * @property {number} business - Business/professional income in rupees (≥ 0)
 * @property {number} capitalGains - Capital gains in rupees (≥ 0, taxed separately if applicable)
 * @property {number} otherIncome - Other income in rupees (≥ 0)
 *
 * @example
 * const income = {
 *   salary: 500000,
 *   houseProperty: -150000,  // Loss from house property
 *   business: 100000,
 *   capitalGains: 50000,
 *   otherIncome: 25000
 * };
 */

/**
 * Creates and validates an Income object
 * @param {Object} params - Income parameters
 * @param {number} [params.salary=0] - Salary income
 * @param {number} [params.houseProperty=0] - House property income (can be negative)
 * @param {number} [params.business=0] - Business/professional income
 * @param {number} [params.capitalGains=0] - Capital gains
 * @param {number} [params.otherIncome=0] - Other income
 * @returns {Income} Validated income object
 * @throws {Error} If income values are invalid
 */
export function createIncome({
  salary = 0,
  houseProperty = 0,
  business = 0,
  capitalGains = 0,
  otherIncome = 0,
} = {}) {
  // Validate all values are finite numbers
  if (!Number.isFinite(salary)) {
    throw new Error('Salary must be a finite number');
  }
  if (!Number.isFinite(houseProperty)) {
    throw new Error('House property income must be a finite number');
  }
  if (!Number.isFinite(business)) {
    throw new Error('Business income must be a finite number');
  }
  if (!Number.isFinite(capitalGains)) {
    throw new Error('Capital gains must be a finite number');
  }
  if (!Number.isFinite(otherIncome)) {
    throw new Error('Other income must be a finite number');
  }

  // Validate non-negativity (except house property which can be negative for loss)
  if (salary < 0) {
    throw new Error('Salary must be non-negative');
  }
  if (business < 0) {
    throw new Error('Business income must be non-negative');
  }
  if (capitalGains < 0) {
    throw new Error('Capital gains must be non-negative');
  }
  if (otherIncome < 0) {
    throw new Error('Other income must be non-negative');
  }

  return {
    salary,
    houseProperty,
    business,
    capitalGains,
    otherIncome,
  };
}

/**
 * Calculates gross income from individual components
 * Note: Capital gains are included in gross but may be taxed separately
 * @param {Income} income - Income object
 * @returns {number} Total gross income
 */
export function calculateGrossIncome(income) {
  if (!income || typeof income !== 'object') {
    throw new Error('Income must be a valid object');
  }

  const salary = income.salary || 0;
  const houseProperty = income.houseProperty || 0;
  const business = income.business || 0;
  const capitalGains = income.capitalGains || 0;
  const otherIncome = income.otherIncome || 0;

  return salary + houseProperty + business + capitalGains + otherIncome;
}

/**
 * Calculates ordinary income (excluding capital gains which may have special treatment)
 * @param {Income} income - Income object
 * @returns {number} Total ordinary income
 */
export function calculateOrdinaryIncome(income) {
  if (!income || typeof income !== 'object') {
    throw new Error('Income must be a valid object');
  }

  const salary = income.salary || 0;
  const houseProperty = income.houseProperty || 0;
  const business = income.business || 0;
  const otherIncome = income.otherIncome || 0;

  return salary + houseProperty + business + otherIncome;
}

/**
 * Get capital gains separately (TAX-007 requirement: keep capital gains separate)
 * @param {Income} income - Income object
 * @returns {number} Capital gains amount
 */
export function getCapitalGains(income) {
  if (!income || typeof income !== 'object') {
    return 0;
  }
  return income.capitalGains || 0;
}

/**
 * Validates an income object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid Income object
 */
export function isValidIncome(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const { salary, houseProperty, business, capitalGains, otherIncome } = value;

  // All fields must be finite numbers
  if (!Number.isFinite(salary) || !Number.isFinite(houseProperty) ||
      !Number.isFinite(business) || !Number.isFinite(capitalGains) ||
      !Number.isFinite(otherIncome)) {
    return false;
  }

  // All fields except houseProperty must be non-negative
  if (salary < 0 || business < 0 || capitalGains < 0 || otherIncome < 0) {
    return false;
  }

  return true;
}

/**
 * Creates an empty income object with all zeros
 * @returns {Income} Empty income object
 */
export function createEmptyIncome() {
  return {
    salary: 0,
    houseProperty: 0,
    business: 0,
    capitalGains: 0,
    otherIncome: 0,
  };
}
