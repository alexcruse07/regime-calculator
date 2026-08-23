/**
 * Tax Calculation Engine
 * Core tax calculation logic that uses rules to compute tax liability
 */

import { createCalculationResult, createComparisonResult } from '../types/calculation-result.js';
import { calculateGrossIncome, isValidIncome } from '../types/income.js';
import {
  calculateIncomeTax,
  calculateSurcharge,
  calculateCess,
} from '../../rules/financial-years/fy-2024-25.js';

/**
 * Calculates tax for a given income and regime
 * @param {Object} income - Income object with salary and otherIncome
 * @param {Object} rules - Tax rules object with slabs, surcharge, etc.
 * @returns {Object} Calculation result with all tax components
 * @throws {Error} If inputs are invalid
 */
export function calculateTax(income, rules) {
  if (!isValidIncome(income)) {
    throw new Error('Invalid income object');
  }

  if (!rules || typeof rules !== 'object') {
    throw new Error('Invalid tax rules object');
  }

  // Calculate gross income
  const grossIncome = calculateGrossIncome(income);

  // Apply standard deduction
  const standardDeduction = rules.standardDeduction || 0;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  // Calculate income tax using applicable slabs
  const incomeTax = calculateIncomeTax(taxableIncome, rules.taxSlabs);

  // Calculate surcharge based on gross income
  const surcharge = calculateSurcharge(grossIncome, incomeTax, rules.surcharge);

  // Calculate cess on income tax + surcharge
  const taxBeforeCess = incomeTax + surcharge;
  const cess = calculateCess(taxBeforeCess, rules.cess.rate);

  // Create and return result
  return createCalculationResult(
    grossIncome,
    taxableIncome,
    incomeTax,
    surcharge,
    cess,
    rules.regime,
    rules.financialYear,
  );
}

/**
 * Compares tax liability between old and new regime
 * @param {Object} income - Income object with salary and otherIncome
 * @param {Object} oldRegimeRules - Tax rules for old regime
 * @param {Object} newRegimeRules - Tax rules for new regime
 * @returns {Object} Comparison result showing tax in both regimes
 * @throws {Error} If inputs are invalid
 */
export function compareRegimes(income, oldRegimeRules, newRegimeRules) {
  if (!isValidIncome(income)) {
    throw new Error('Invalid income object');
  }

  // Calculate for both regimes
  const oldResult = calculateTax(income, oldRegimeRules);
  const newResult = calculateTax(income, newRegimeRules);

  // Create comparison
  return createComparisonResult(oldResult, newResult);
}

/**
 * Calculates marginal tax rate at current income level
 * @param {number} grossIncome - Gross income
 * @param {Array} taxSlabs - Tax slab array
 * @returns {number} Marginal rate as percentage
 */
export function calculateMarginalTaxRate(grossIncome, taxSlabs) {
  if (!Number.isFinite(grossIncome) || grossIncome < 0) {
    throw new Error('Gross income must be a non-negative finite number');
  }

  if (!Array.isArray(taxSlabs)) {
    throw new Error('Tax slabs must be an array');
  }

  for (const slab of taxSlabs) {
    if (grossIncome >= slab.min && grossIncome <= slab.max) {
      return slab.rate;
    }
  }

  return 0;
}

/**
 * Calculates average tax rate
 * @param {number} totalTax - Total tax payable
 * @param {number} grossIncome - Gross income
 * @returns {number} Average tax rate as percentage
 */
export function calculateAverageTaxRate(totalTax, grossIncome) {
  if (!Number.isFinite(totalTax) || totalTax < 0) {
    throw new Error('Total tax must be a non-negative finite number');
  }

  if (!Number.isFinite(grossIncome) || grossIncome <= 0) {
    throw new Error('Gross income must be a positive finite number');
  }

  return (totalTax / grossIncome) * 100;
}

/**
 * Calculates effective tax rate (total tax + surcharge + cess as percentage of income)
 * @param {Object} calculationResult - Result from calculateTax
 * @returns {number} Effective tax rate as percentage
 */
export function calculateEffectiveTaxRate(calculationResult) {
  if (!calculationResult || typeof calculationResult !== 'object') {
    throw new Error('Invalid calculation result');
  }

  const { grossIncome, totalTax } = calculationResult;

  if (grossIncome === 0) {
    return 0;
  }

  return (totalTax / grossIncome) * 100;
}

/**
 * Finds the income level at which no tax is payable
 * @param {Array} taxSlabs - Tax slab array
 * @returns {number} Tax exemption limit
 */
export function findTaxExemptionLimit(taxSlabs) {
  if (!Array.isArray(taxSlabs) || taxSlabs.length === 0) {
    throw new Error('Tax slabs must be a non-empty array');
  }

  // Find the last slab with 0% rate
  for (const slab of taxSlabs) {
    if (slab.rate === 0) {
      return slab.max;
    }
  }

  return 0;
}

/**
 * Calculates additional income needed to move to next tax slab
 * @param {number} currentIncome - Current income
 * @param {Array} taxSlabs - Tax slab array
 * @returns {number} Income needed to reach next slab boundary
 */
export function incomeToNextSlab(currentIncome, taxSlabs) {
  if (!Number.isFinite(currentIncome) || currentIncome < 0) {
    throw new Error('Current income must be a non-negative finite number');
  }

  if (!Array.isArray(taxSlabs) || taxSlabs.length === 0) {
    throw new Error('Tax slabs must be a non-empty array');
  }

  for (const slab of taxSlabs) {
    if (currentIncome < slab.max) {
      return Math.max(0, slab.max - currentIncome + 1);
    }
  }

  return Infinity; // Already in the highest slab
}
