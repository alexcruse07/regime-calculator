/**
 * Income Type Definition
 * JSDoc type definitions for income data structures
 *
 * TAX-004: Salary Income
 * TAX-005: House Property Income (can be negative for loss)
 * TAX-006: Business/Professional Income
 * TAX-007: Capital Gains (kept separate for future special treatment)
 * TAX-008: Other Income
 * TAX-010: Granular capital gains and special income types
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
 * @property {number} stcgEquity - Short-term capital gains from equity (≥ 0, taxed at 20%)
 * @property {number} stcgOther - Short-term capital gains from other assets (≥ 0, taxed at 20%)
 * @property {number} ltcgEquity - Long-term capital gains from equity (≥ 0, taxed at 12.5% with exemption)
 * @property {number} ltcgOther - Long-term capital gains from real estate (≥ 0, taxed at 12.5%)
 * @property {number} speculativeGains - Speculative income from derivatives (≥ 0, taxed at 30%)
 * @property {number} speculativeLosses - Speculative losses from derivatives
 * @property {number} fnoGains - F&O gains (≥ 0, taxed as business income)
 * @property {number} fnoLosses - F&O losses
 * @property {number} interestIncome - Interest income (≥ 0)
 * @property {number} dividendIncome - Dividend income (≥ 0)
 * @property {number} otherTaxable - Other taxable income (≥ 0)
 *
 * @example
 * const income = {
 *   salary: 500000,
 *   houseProperty: -150000,
 *   business: 100000,
 *   capitalGains: 0,
 *   otherIncome: 0,
 *   stcgEquity: 100000,
 *   ltcgEquity: 200000,
 *   speculativeGains: 50000,
 *   fnoGains: 25000,
 *   interestIncome: 10000,
 * };
 */

/**
 * Creates and validates an Income object with support for all income types
 * @param {Object} params - Income parameters
 * @param {number} [params.salary=0] - Salary income
 * @param {number} [params.houseProperty=0] - House property income (can be negative)
 * @param {number} [params.business=0] - Business/professional income
 * @param {number} [params.capitalGains=0] - Capital gains
 * @param {number} [params.otherIncome=0] - Other income
 * @param {number} [params.stcgEquity=0] - Short-term capital gains from equity (20% tax)
 * @param {number} [params.stcgOther=0] - Short-term capital gains from other assets (20% tax)
 * @param {number} [params.ltcgEquity=0] - Long-term capital gains from equity (12.5% tax + exemption)
 * @param {number} [params.ltcgOther=0] - Long-term capital gains from real estate (12.5% tax)
 * @param {number} [params.speculativeGains=0] - Speculative gains (30% tax)
 * @param {number} [params.speculativeLosses=0] - Speculative losses
 * @param {number} [params.fnoGains=0] - F&O gains (slab rate)
 * @param {number} [params.fnoLosses=0] - F&O losses
 * @param {number} [params.interestIncome=0] - Interest income
 * @param {number} [params.dividendIncome=0] - Dividend income
 * @param {number} [params.otherTaxable=0] - Other taxable income
 * @returns {Income} Validated income object
 * @throws {Error} If income values are invalid
 */
export function createIncome({
  salary = 0,
  houseProperty = 0,
  business = 0,
  capitalGains = 0,
  otherIncome = 0,
  stcgEquity = 0,
  stcgOther = 0,
  ltcgEquity = 0,
  ltcgOther = 0,
  speculativeGains = 0,
  speculativeLosses = 0,
  fnoGains = 0,
  fnoLosses = 0,
  interestIncome = 0,
  dividendIncome = 0,
  otherTaxable = 0,
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
  if (!Number.isFinite(stcgEquity)) {
    throw new Error('STCG Equity must be a finite number');
  }
  if (!Number.isFinite(stcgOther)) {
    throw new Error('STCG Other must be a finite number');
  }
  if (!Number.isFinite(ltcgEquity)) {
    throw new Error('LTCG Equity must be a finite number');
  }
  if (!Number.isFinite(ltcgOther)) {
    throw new Error('LTCG Other must be a finite number');
  }
  if (!Number.isFinite(speculativeGains)) {
    throw new Error('Speculative gains must be a finite number');
  }
  if (!Number.isFinite(speculativeLosses)) {
    throw new Error('Speculative losses must be a finite number');
  }
  if (!Number.isFinite(fnoGains)) {
    throw new Error('F&O gains must be a finite number');
  }
  if (!Number.isFinite(fnoLosses)) {
    throw new Error('F&O losses must be a finite number');
  }
  if (!Number.isFinite(interestIncome)) {
    throw new Error('Interest income must be a finite number');
  }
  if (!Number.isFinite(dividendIncome)) {
    throw new Error('Dividend income must be a finite number');
  }
  if (!Number.isFinite(otherTaxable)) {
    throw new Error('Other taxable income must be a finite number');
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
  if (stcgEquity < 0) {
    throw new Error('STCG Equity must be non-negative');
  }
  if (stcgOther < 0) {
    throw new Error('STCG Other must be non-negative');
  }
  if (ltcgEquity < 0) {
    throw new Error('LTCG Equity must be non-negative');
  }
  if (ltcgOther < 0) {
    throw new Error('LTCG Other must be non-negative');
  }
  if (speculativeGains < 0) {
    throw new Error('Speculative gains must be non-negative');
  }
  if (interestIncome < 0) {
    throw new Error('Interest income must be non-negative');
  }
  if (dividendIncome < 0) {
    throw new Error('Dividend income must be non-negative');
  }
  if (otherTaxable < 0) {
    throw new Error('Other taxable income must be non-negative');
  }

  return {
    salary,
    houseProperty,
    business,
    capitalGains,
    otherIncome,
    stcgEquity,
    stcgOther,
    ltcgEquity,
    ltcgOther,
    speculativeGains,
    speculativeLosses,
    fnoGains,
    fnoLosses,
    interestIncome,
    dividendIncome,
    otherTaxable,
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
  const stcgEquity = income.stcgEquity || 0;
  const stcgOther = income.stcgOther || 0;
  const ltcgEquity = income.ltcgEquity || 0;
  const ltcgOther = income.ltcgOther || 0;
  const speculativeGains = income.speculativeGains || 0;
  const fnoGains = income.fnoGains || 0;
  const interestIncome = income.interestIncome || 0;
  const dividendIncome = income.dividendIncome || 0;
  const otherTaxable = income.otherTaxable || 0;

  return salary + houseProperty + business + capitalGains + otherIncome +
    stcgEquity + stcgOther + ltcgEquity + ltcgOther + speculativeGains +
    fnoGains + interestIncome + dividendIncome + otherTaxable;
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

  const { salary, houseProperty, business, capitalGains, otherIncome,
    stcgEquity, stcgOther, ltcgEquity, ltcgOther, speculativeGains,
    fnoGains, interestIncome, dividendIncome, otherTaxable } = value;

  // All fields must be finite numbers
  if (!Number.isFinite(salary) || !Number.isFinite(houseProperty) ||
      !Number.isFinite(business) || !Number.isFinite(capitalGains) ||
      !Number.isFinite(otherIncome) || !Number.isFinite(stcgEquity) ||
      !Number.isFinite(stcgOther) || !Number.isFinite(ltcgEquity) ||
      !Number.isFinite(ltcgOther) || !Number.isFinite(speculativeGains) ||
      !Number.isFinite(fnoGains) || !Number.isFinite(interestIncome) ||
      !Number.isFinite(dividendIncome) || !Number.isFinite(otherTaxable)) {
    return false;
  }

  // All fields except houseProperty must be non-negative
  if (salary < 0 || business < 0 || capitalGains < 0 || otherIncome < 0 ||
      stcgEquity < 0 || stcgOther < 0 || ltcgEquity < 0 || ltcgOther < 0 ||
      speculativeGains < 0 || fnoGains < 0 || interestIncome < 0 ||
      dividendIncome < 0 || otherTaxable < 0) {
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
    stcgEquity: 0,
    stcgOther: 0,
    ltcgEquity: 0,
    ltcgOther: 0,
    speculativeGains: 0,
    speculativeLosses: 0,
    fnoGains: 0,
    fnoLosses: 0,
    interestIncome: 0,
    dividendIncome: 0,
    otherTaxable: 0,
  };
}
