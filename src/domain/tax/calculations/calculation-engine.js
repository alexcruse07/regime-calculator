/**
 * Tax Calculation Engine
 * Core tax calculation logic that uses rules to compute tax liability
 *
 * TAX-012: Enhanced calculation engine supporting:
 * - All income types (salary, house property, business, capital gains, other)
 * - All deductions (80C, 80D, etc.)
 * - Section 87A rebate
 * - Surcharge with marginal relief
 * - Health & Education Cess
 * - Detailed breakdown
 */

import { createComparisonResult, createDetailedResult } from '../types/calculation-result.js';
import {
  calculateIncomeTax,
  calculateSurcharge,
  calculateCess,
  calculateRebate87A,
} from '../../rules/financial-years/fy-2024-25.js';
import { getStandardDeductionAmount, applyAllDeductionCaps } from '../../rules/deduction-limits.js';

/**
 * Calculates gross total income from all sources
 * @param {Object} income - Income object with all income types
 * @returns {number} Gross total income
 */
export function calculateGrossIncome(income) {
  if (!income || typeof income !== 'object') {
    return 0;
  }

  const salary = parseFloat(income.salary) || 0;
  const houseProperty = parseFloat(income.houseProperty) || 0;
  const business = parseFloat(income.business) || 0;
  const stcgEquity = parseFloat(income.stcgEquity) || 0;
  const stcgOther = parseFloat(income.stcgOther) || 0;
  const ltcgEquity = parseFloat(income.ltcgEquity) || 0;
  const ltcgOther = parseFloat(income.ltcgOther) || 0;
  const speculativeGains = parseFloat(income.speculativeGains) || 0;
  const speculativeLosses = parseFloat(income.speculativeLosses) || 0;
  const fnoGains = parseFloat(income.fnoGains) || 0;
  const fnoLosses = parseFloat(income.fnoLosses) || 0;
  const interestIncome = parseFloat(income.interestIncome) || 0;
  const dividendIncome = parseFloat(income.dividendIncome) || 0;
  const otherTaxable = parseFloat(income.otherTaxable) || 0;
  // Legacy support
  const capitalGains = parseFloat(income.capitalGains) || 0;
  const otherIncome = parseFloat(income.otherIncome) || 0;

  // Net speculative income (can't set off speculative loss against other income)
  const netSpeculative = Math.max(0, speculativeGains - speculativeLosses);
  // F&O is business income - can set off loss against other business income
  const netFnO = fnoGains - fnoLosses;

  // Gross total income
  return Math.max(0,
    salary +
    houseProperty +  // Can be negative for loss
    business +
    netFnO +
    stcgEquity +
    stcgOther +
    ltcgEquity +
    ltcgOther +
    netSpeculative +
    interestIncome +
    dividendIncome +
    otherTaxable +
    capitalGains +
    otherIncome,
  );
}

/**
 * Calculates total deductions applicable based on regime
 * @param {Object} deductions - Deductions object
 * @param {string} regime - 'old' or 'new'
 * @param {string} financialYear - Financial year
 * @param {number} salary - Salary income (for standard deduction)
 * @returns {Object} Deduction breakdown
 */
export function calculateDeductions(deductions, regime, financialYear, salary) {
  const cappedDeductions = applyAllDeductionCaps(deductions || {}, financialYear);

  // Standard deduction applies only if there's salary income
  const standardDeduction = salary > 0 ? getStandardDeductionAmount(regime, financialYear) : 0;

  if (regime === 'new') {
    // New regime: Only standard deduction allowed
    return {
      standardDeduction,
      section80C: 0,
      section80CCD1B: 0,
      section80D: 0,
      section80E: 0,
      section80G: 0,
      section80TTA: 0,
      section80TTB: 0,
      hra: 0,
      lta: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      totalDeductions: standardDeduction,
    };
  }

  // Old regime: All deductions allowed
  const totalChapterVIA =
    (cappedDeductions.section80C || 0) +
    (cappedDeductions.section80CCD1B || 0) +
    (cappedDeductions.section80D || 0) +
    (cappedDeductions.section80E || 0) +
    (cappedDeductions.section80G || 0) +
    (cappedDeductions.section80TTA || 0) +
    (cappedDeductions.section80TTB || 0);

  const totalExemptions =
    (cappedDeductions.hra || 0) +
    (cappedDeductions.lta || 0);

  const homeLoanInterest = cappedDeductions.homeLoanInterest || 0;
  const otherDeductions = cappedDeductions.otherDeductions || 0;

  const totalDeductions = standardDeduction + totalChapterVIA + totalExemptions + homeLoanInterest + otherDeductions;

  return {
    standardDeduction,
    section80C: cappedDeductions.section80C || 0,
    section80CCD1B: cappedDeductions.section80CCD1B || 0,
    section80D: cappedDeductions.section80D || 0,
    section80E: cappedDeductions.section80E || 0,
    section80G: cappedDeductions.section80G || 0,
    section80TTA: cappedDeductions.section80TTA || 0,
    section80TTB: cappedDeductions.section80TTB || 0,
    hra: cappedDeductions.hra || 0,
    lta: cappedDeductions.lta || 0,
    homeLoanInterest,
    otherDeductions,
    totalChapterVIA,
    totalExemptions,
    totalDeductions,
  };
}

/**
 * Calculates tax with proper treatment of special income types
 * STCG: 20% flat
 * LTCG Equity: 12.5% flat + 1.25L exemption
 * LTCG Real Estate: 12.5% flat
 * Speculative: 30% flat
 * F&O: Standard slab
 * Interest/Dividend: Standard slab
 * 
 * @param {Object} income - Income object with all income types
 * @param {Object} deductions - Deductions object
 * @param {Object} rules - Tax rules object with slabs, surcharge, etc.
 * @returns {Object} Detailed calculation result with all tax components
 * @throws {Error} If inputs are invalid
 */
export function calculateTax(income, deductions, rules) {
  if (!rules || typeof rules !== 'object') {
    throw new Error('Invalid tax rules object');
  }

  const regime = rules.regime;
  const financialYear = rules.financialYear;
  const salary = parseFloat(income?.salary) || 0;

  // Extract different income types
  const ordinaryIncome = (parseFloat(income?.salary) || 0) +
                         (parseFloat(income?.houseProperty) || 0) +
                         (parseFloat(income?.business) || 0) +
                         (parseFloat(income?.interestIncome) || 0) +
                         (parseFloat(income?.dividendIncome) || 0) +
                         (parseFloat(income?.otherTaxable) || 0) +
                         (parseFloat(income?.otherIncome) || 0);

  const stcgEquity = parseFloat(income?.stcgEquity) || 0;
  const stcgOther = parseFloat(income?.stcgOther) || 0;
  const ltcgEquity = parseFloat(income?.ltcgEquity) || 0;
  const ltcgOther = parseFloat(income?.ltcgOther) || 0; // Real estate
  const speculativeGains = parseFloat(income?.speculativeGains) || 0;
  const speculativeLosses = parseFloat(income?.speculativeLosses) || 0;
  const fnoGains = parseFloat(income?.fnoGains) || 0;
  const fnoLosses = parseFloat(income?.fnoLosses) || 0;
  const capitalGains = parseFloat(income?.capitalGains) || 0; // Legacy

  // Calculate net special income
  const netSTCG = stcgEquity + stcgOther + capitalGains;
  const netLTCGEquity = ltcgEquity;
  const netLTCGRealEstate = ltcgOther;
  const netSpeculative = Math.max(0, speculativeGains - speculativeLosses);
  const netFnO = fnoGains - fnoLosses;

  // Calculate deductions
  const deductionBreakdown = calculateDeductions(deductions, regime, financialYear, salary);
  const totalDeductions = deductionBreakdown.totalDeductions;

  // Step 1: Calculate ordinary income tax (using standard slabs)
  const taxableOrdinaryIncome = Math.max(0, ordinaryIncome - totalDeductions);
  const ordinaryIncomeTax = calculateIncomeTax(taxableOrdinaryIncome, rules.taxSlabs);

  // Step 2: Calculate special income taxes (flat rates)
  // STCG: 20% flat
  const stcgTax = netSTCG * 0.20;

  // LTCG Equity: 12.5% flat with 1.25L exemption
  const ltcgEquityExemption = Math.min(125000, netLTCGEquity);
  const ltcgEquityTaxable = Math.max(0, netLTCGEquity - ltcgEquityExemption);
  const ltcgEquityTax = ltcgEquityTaxable * 0.125;

  // LTCG Real Estate: 12.5% flat (no exemption)
  const ltcgRealEstateTax = netLTCGRealEstate * 0.125;

  // Speculative: 30% flat
  const speculativeTax = netSpeculative * 0.30;

  // F&O: Standard slab (business income treatment)
  const fnoTaxable = Math.max(0, netFnO);
  const fnoTax = calculateIncomeTax(fnoTaxable, rules.taxSlabs);

  // Total income tax before rebate
  const totalIncomeTax = ordinaryIncomeTax + stcgTax + ltcgEquityTax + ltcgRealEstateTax + speculativeTax + fnoTax;

  // Calculate gross total income for surcharge basis
  const grossIncome = ordinaryIncome + netSTCG + netLTCGEquity + netLTCGRealEstate + netSpeculative + netFnO;

  // Step 3: Apply Section 87A rebate (on ordinary income only)
  const rebate = calculateRebate87A(taxableOrdinaryIncome, ordinaryIncomeTax, rules.rebates);
  const taxAfterRebate = Math.max(0, totalIncomeTax - rebate);

  // Step 4: Calculate surcharge (on total income including special income)
  const surcharge = calculateSurcharge(grossIncome, taxAfterRebate, rules.surcharge);

  // Step 5: Calculate Health & Education Cess
  const taxBeforeCess = taxAfterRebate + surcharge;
  const cess = calculateCess(taxBeforeCess, rules.cess.rate);

  // Step 6: Total tax payable
  const totalTax = taxAfterRebate + surcharge + cess;

  // Recalculate taxable income for display
  const effectiveTaxableIncome = grossIncome - totalDeductions;

  // Create detailed result
  return createDetailedResult({
    grossIncome,
    totalDeductions,
    deductionBreakdown,
    taxableIncome: effectiveTaxableIncome,
    incomeTax: totalIncomeTax,
    rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    regime,
    financialYear,
    // Detailed breakdown
    ordinaryIncome,
    ordinaryIncomeTax,
    stcgTax,
    ltcgEquityTax,
    ltcgRealEstateTax,
    speculativeTax,
    fnoTax,
  });
}

/**
 * Compares tax liability between old and new regime
 * @param {Object} income - Income object with all income types
 * @param {Object} deductions - Deductions object
 * @param {Object} oldRules - Tax rules for old regime
 * @param {Object} newRules - Tax rules for new regime
 * @returns {Object} Comparison result showing tax in both regimes
 */
export function compareRegimes(income, deductions, oldRules, newRules) {
  // Calculate for both regimes with deductions
  const oldResult = calculateTax(income, deductions, oldRules);
  const newResult = calculateTax(income, deductions, newRules);

  // Create enhanced comparison
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
