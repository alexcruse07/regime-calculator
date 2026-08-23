/**
 * FY 2024-25 Tax Rules (India)
 * This file defines tax slabs, rates, deductions, and surcharge rules for FY 2024-25
 * Based on Indian Income Tax Act provisions
 *
 * NOTE: These are approximate rules for demonstration.
 * Always verify against current CBDT guidelines for actual use.
 */

/**
 * Old Regime tax rules for FY 2024-25
 * Residents below 60 years of age
 */
export const oldRegimeRules = {
  financialYear: '2024-25',
  regime: 'old',
  standardDeduction: 0, // Old regime uses specific deductions per income type

  // Tax slabs (in rupees)
  taxSlabs: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 },
  ],

  // Surcharge thresholds (for individuals)
  surcharge: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000001, max: 10000000, rate: 15 },
    { min: 10000001, max: 20000000, rate: 25 },
    { min: 20000001, max: Infinity, rate: 37 },
  ],

  // Health and Education Cess
  cess: {
    rate: 4, // 4% of income tax
  },

  // Rebates under Section 87A (for individuals with taxable income up to ₹5 lakh)
  rebates: [
    {
      condition: 'taxableIncome <= 250000',
      rebateAmount: 0,
      description: 'No tax for income up to ₹2.5 lakh',
    },
    {
      condition: 'taxableIncome <= 500000',
      rebateAmount: 'fullTax',
      description: 'Full tax relief for income up to ₹5 lakh under Section 87A',
    },
  ],

  notes: [
    'Tax on long-term capital gains exempt on first ₹1 lakh',
    'Deduction available for life insurance premium, tuition fees, donations, etc.',
    'Applicable only if eligible for old regime',
  ],
};

/**
 * New Regime tax rules for FY 2024-25
 * Residents below 60 years of age
 */
export const newRegimeRules = {
  financialYear: '2024-25',
  regime: 'new',
  standardDeduction: 75000, // Standard deduction of ₹75,000

  // Tax slabs (in rupees) - simplified, more favorable rates
  taxSlabs: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300001, max: 600000, rate: 5 },
    { min: 600001, max: 900000, rate: 10 },
    { min: 900001, max: 1200000, rate: 15 },
    { min: 1200001, max: 1500000, rate: 20 },
    { min: 1500001, max: Infinity, rate: 30 },
  ],

  // Surcharge thresholds (same as old regime)
  surcharge: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000001, max: 10000000, rate: 15 },
    { min: 10000001, max: 20000000, rate: 25 },
    { min: 20000001, max: Infinity, rate: 37 },
  ],

  // Health and Education Cess
  cess: {
    rate: 4, // 4% of income tax
  },

  // Rebates under Section 87A
  rebates: [
    {
      condition: 'taxableIncome <= 300000',
      rebateAmount: 0,
      description: 'No tax for income up to ₹3 lakh',
    },
    {
      condition: 'taxableIncome <= 700000',
      rebateAmount: 'fullTax',
      description: 'Full tax relief for income up to ₹7 lakh under Section 87A',
    },
  ],

  notes: [
    'No deductions except standard deduction',
    'Most other deductions not available',
    'Section 80C, 80D, 80E, etc. not applicable',
    'LTCG tax exemption not applicable',
    'From AY 2023-24, default regime for new assessees',
  ],
};

/**
 * Senior citizen (60+ years) rules for FY 2024-25
 * Limited implementation for future
 */
export const seniorCitizenRules = {
  financialYear: '2024-25',
  regime: 'old-senior',
  standardDeduction: 0,

  // Simplified for now - different exemption limit for seniors
  taxSlabs: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 },
  ],

  surcharge: oldRegimeRules.surcharge,
  cess: oldRegimeRules.cess,

  notes: [
    'Higher exemption limit of ₹3 lakh for seniors (60+ years)',
    'Interest on savings account partially exempt',
  ],
};

/**
 * Calculates income tax based on taxable income and tax slabs
 * @param {number} taxableIncome - The taxable income in rupees
 * @param {Array} taxSlabs - Array of tax slab objects
 * @returns {number} Total income tax (before surcharge and cess)
 */
export function calculateIncomeTax(taxableIncome, taxSlabs) {
  if (!Number.isFinite(taxableIncome) || taxableIncome < 0) {
    throw new Error('Taxable income must be a non-negative finite number');
  }

  if (!Array.isArray(taxSlabs)) {
    throw new Error('Tax slabs must be an array');
  }

  let tax = 0;

  for (const slab of taxSlabs) {
    if (taxableIncome <= slab.min) {
      break;
    }

    const incomeInThisSlab = Math.min(taxableIncome, slab.max) - slab.min;
    tax += (incomeInThisSlab * slab.rate) / 100;
  }

  return tax;
}

/**
 * Calculates surcharge based on total income
 * @param {number} totalIncome - The total income in rupees
 * @param {number} incomeTax - The calculated income tax
 * @param {Array} surchargeSlabs - Array of surcharge slab objects
 * @returns {number} Surcharge amount
 */
export function calculateSurcharge(totalIncome, incomeTax, surchargeSlabs) {
  if (!Number.isFinite(totalIncome) || totalIncome < 0) {
    throw new Error('Total income must be a non-negative finite number');
  }

  if (!Number.isFinite(incomeTax) || incomeTax < 0) {
    throw new Error('Income tax must be a non-negative finite number');
  }

  if (!Array.isArray(surchargeSlabs)) {
    throw new Error('Surcharge slabs must be an array');
  }

  for (const slab of surchargeSlabs) {
    if (totalIncome >= slab.min && totalIncome <= slab.max) {
      return (incomeTax * slab.rate) / 100;
    }
  }

  return 0;
}

/**
 * Calculates health and education cess
 * @param {number} incomeTax - The calculated income tax
 * @param {number} cessRate - Cess rate as percentage
 * @returns {number} Cess amount
 */
export function calculateCess(incomeTax, cessRate = 4) {
  if (!Number.isFinite(incomeTax) || incomeTax < 0) {
    throw new Error('Income tax must be a non-negative finite number');
  }

  if (!Number.isFinite(cessRate) || cessRate < 0) {
    throw new Error('Cess rate must be a non-negative number');
  }

  return (incomeTax * cessRate) / 100;
}
