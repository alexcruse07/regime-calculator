/**
 * Calculation Result Type Definition
 * JSDoc type definitions for tax calculation results
 */

/**
 * @typedef {Object} TaxCalculationResult
 * Represents the result of a tax calculation for one regime
 *
 * @property {number} grossIncome - Total gross income
 * @property {number} taxableIncome - Taxable income after deductions
 * @property {number} incomeTax - Income tax calculated
 * @property {number} surcharge - Surcharge applicable
 * @property {number} cess - Health and Education Cess
 * @property {number} totalTax - Total tax payable (income tax + surcharge + cess)
 * @property {string} regime - Tax regime used ('old' or 'new')
 * @property {string} financialYear - Financial year (e.g., '2024-25')
 *
 * @example
 * const result = {
 *   grossIncome: 550000,
 *   taxableIncome: 500000,
 *   incomeTax: 10000,
 *   surcharge: 0,
 *   cess: 1200,
 *   totalTax: 11200,
 *   regime: 'new',
 *   financialYear: '2024-25'
 * };
 */

/**
 * @typedef {Object} TaxComparisonResult
 * Represents a comparison between old and new regime calculations
 *
 * @property {TaxCalculationResult} oldRegime - Old regime calculation result
 * @property {TaxCalculationResult} newRegime - New regime calculation result
 * @property {number} taxDifference - Difference in total tax (oldRegime - newRegime)
 *                                    Positive = new regime saves tax
 * @property {string} beneficialRegime - Which regime is more beneficial ('old', 'new', or 'same')
 * @property {number} savingsPercentage - Savings as percentage of old regime tax
 *
 * @example
 * const comparison = {
 *   oldRegime: { ... },
 *   newRegime: { ... },
 *   taxDifference: 5000,
 *   beneficialRegime: 'new',
 *   savingsPercentage: 31.25
 * };
 */

/**
 * Creates a validation calculation result object
 * @param {number} grossIncome - Total gross income
 * @param {number} taxableIncome - Taxable income
 * @param {number} incomeTax - Income tax
 * @param {number} surcharge - Surcharge
 * @param {number} cess - Cess
 * @param {string} regime - Tax regime ('old' or 'new')
 * @param {string} financialYear - Financial year
 * @returns {TaxCalculationResult} Validated result object
 * @throws {Error} If values are invalid
 */
export function createCalculationResult(
  grossIncome,
  taxableIncome,
  incomeTax,
  surcharge,
  cess,
  regime,
  financialYear,
) {
  const requiredValues = [grossIncome, taxableIncome, incomeTax, surcharge, cess];

  if (!requiredValues.every(v => Number.isFinite(v) && v >= 0)) {
    throw new Error('All tax amounts must be non-negative finite numbers');
  }

  if (!['old', 'new'].includes(regime)) {
    throw new Error('Regime must be "old" or "new"');
  }

  if (typeof financialYear !== 'string' || !financialYear.match(/^\d{4}-\d{2}$/)) {
    throw new Error('Financial year must be in format YYYY-YY');
  }

  const totalTax = incomeTax + surcharge + cess;

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    surcharge,
    cess,
    totalTax,
    regime,
    financialYear,
  };
}

/**
 * Validates a calculation result object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid TaxCalculationResult
 */
export function isValidCalculationResult(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Number.isFinite(value.grossIncome) &&
    Number.isFinite(value.taxableIncome) &&
    Number.isFinite(value.incomeTax) &&
    Number.isFinite(value.surcharge) &&
    Number.isFinite(value.cess) &&
    Number.isFinite(value.totalTax) &&
    ['old', 'new'].includes(value.regime) &&
    typeof value.financialYear === 'string'
  );
}

/**
 * Creates a comparison result object
 * @param {TaxCalculationResult} oldResult - Old regime result
 * @param {TaxCalculationResult} newResult - New regime result
 * @returns {TaxComparisonResult} Comparison result
 * @throws {Error} If results are invalid
 */
export function createComparisonResult(oldResult, newResult) {
  if (!isValidCalculationResult(oldResult)) {
    throw new Error('Invalid old regime result');
  }

  if (!isValidCalculationResult(newResult)) {
    throw new Error('Invalid new regime result');
  }

  const taxDifference = oldResult.totalTax - newResult.totalTax;
  let beneficialRegime = 'same';
  let savingsPercentage = 0;

  if (taxDifference > 0.01) {
    beneficialRegime = 'new';
    savingsPercentage = (taxDifference / oldResult.totalTax) * 100;
  } else if (taxDifference < -0.01) {
    beneficialRegime = 'old';
    savingsPercentage = Math.abs((taxDifference / newResult.totalTax) * 100);
  }

  return {
    oldRegime: oldResult,
    newRegime: newResult,
    taxDifference,
    beneficialRegime,
    savingsPercentage,
  };
}

/**
 * Validates a comparison result object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid TaxComparisonResult
 */
export function isValidComparisonResult(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    isValidCalculationResult(value.oldRegime) &&
    isValidCalculationResult(value.newRegime) &&
    Number.isFinite(value.taxDifference) &&
    ['old', 'new', 'same'].includes(value.beneficialRegime) &&
    Number.isFinite(value.savingsPercentage)
  );
}

/**
 * @typedef {Object} DetailedTaxResult
 * Extended tax calculation result with full breakdown
 *
 * @property {number} grossIncome - Total gross income
 * @property {number} totalDeductions - Total deductions applied
 * @property {Object} deductionBreakdown - Breakdown of each deduction type
 * @property {number} taxableIncome - Taxable income after deductions
 * @property {number} incomeTax - Income tax calculated on slabs
 * @property {number} rebate - Rebate under Section 87A
 * @property {number} taxAfterRebate - Tax after rebate
 * @property {number} surcharge - Surcharge applicable
 * @property {number} cess - Health and Education Cess
 * @property {number} totalTax - Total tax payable
 * @property {string} regime - Tax regime used ('old' or 'new')
 * @property {string} financialYear - Financial year
 */

/**
 * Creates a detailed tax calculation result with full breakdown
 * @param {Object} params - Calculation parameters
 * @returns {DetailedTaxResult} Detailed result object
 */
export function createDetailedResult({
  grossIncome,
  totalDeductions,
  deductionBreakdown,
  taxableIncome,
  incomeTax,
  rebate,
  taxAfterRebate,
  surcharge,
  cess,
  totalTax,
  regime,
  financialYear,
}) {
  // Validate numeric values
  const numericValues = [
    grossIncome, totalDeductions, taxableIncome, incomeTax,
    rebate, taxAfterRebate, surcharge, cess, totalTax,
  ];

  if (!numericValues.every(v => Number.isFinite(v) && v >= 0)) {
    throw new Error('All tax amounts must be non-negative finite numbers');
  }

  if (!['old', 'new'].includes(regime)) {
    throw new Error('Regime must be "old" or "new"');
  }

  return {
    grossIncome,
    totalDeductions,
    deductionBreakdown: deductionBreakdown || {},
    taxableIncome,
    incomeTax,
    rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    regime,
    financialYear,
  };
}

/**
 * Validates a detailed result object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid DetailedTaxResult
 */
export function isValidDetailedResult(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Number.isFinite(value.grossIncome) &&
    Number.isFinite(value.totalDeductions) &&
    Number.isFinite(value.taxableIncome) &&
    Number.isFinite(value.incomeTax) &&
    Number.isFinite(value.rebate) &&
    Number.isFinite(value.surcharge) &&
    Number.isFinite(value.cess) &&
    Number.isFinite(value.totalTax) &&
    ['old', 'new'].includes(value.regime)
  );
}
