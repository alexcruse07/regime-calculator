/**
 * FY 2026-27 Tax Rules (India)
 * This file defines tax slabs, rates, deductions, and surcharge rules for FY 2026-27
 * Based on continuation of Union Budget 2025 provisions (subject to future budget changes)
 *
 * TAX-020: Updated financial year rules
 * Note: These rules assume no changes from FY 2025-26. Update after Union Budget 2026.
 */

/**
 * Old Regime tax rules for FY 2026-27
 * Residents below 60 years of age
 */
export const oldRegimeRules = {
  financialYear: '2026-27',
  regime: 'old',
  standardDeduction: 50000, // Standard deduction for salaried in old regime

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
    rate: 4, // 4% of income tax + surcharge
  },

  // Rebates under Section 87A
  rebates: [
    {
      minIncome: 0,
      maxIncome: 500000,
      rebateAmount: 'fullTax',
      description: 'Full tax relief for income up to ₹5 lakh under Section 87A',
    },
    {
      minIncome: 500001,
      maxIncome: Infinity,
      rebateAmount: 0,
      description: 'No rebate for income above ₹5 lakh',
    },
  ],

  notes: [
    'Tax on long-term capital gains exempt on first ₹1.25 lakh',
    'Deduction available for life insurance premium, tuition fees, donations, etc.',
    'Section 80C limit remains ₹1,50,000',
    'Subject to changes in Union Budget 2026',
  ],
};

/**
 * New Regime tax rules for FY 2026-27
 * Same as FY 2025-26 (subject to Union Budget 2026 changes)
 */
export const newRegimeRules = {
  financialYear: '2026-27',
  regime: 'new',
  standardDeduction: 75000, // Standard deduction of ₹75,000

  // Tax slabs (in rupees) - same as FY 2025-26
  taxSlabs: [
    { min: 0, max: 400000, rate: 0 },
    { min: 400001, max: 800000, rate: 5 },
    { min: 800001, max: 1200000, rate: 10 },
    { min: 1200001, max: 1600000, rate: 15 },
    { min: 1600001, max: 2000000, rate: 20 },
    { min: 2000001, max: 2400000, rate: 25 },
    { min: 2400001, max: Infinity, rate: 30 },
  ],

  // Surcharge thresholds (capped at 25% for new regime)
  surcharge: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000001, max: 10000000, rate: 15 },
    { min: 10000001, max: 20000000, rate: 25 },
    { min: 20000001, max: Infinity, rate: 25 }, // Capped at 25% for new regime
  ],

  // Health and Education Cess
  cess: {
    rate: 4, // 4% of income tax + surcharge
  },

  // Rebates under Section 87A - enhanced threshold
  rebates: [
    {
      minIncome: 0,
      maxIncome: 1200000,
      rebateAmount: 'fullTax',
      description: 'Full tax relief for income up to ₹12 lakh under Section 87A',
    },
    {
      minIncome: 1200001,
      maxIncome: Infinity,
      rebateAmount: 0,
      description: 'No rebate for income above ₹12 lakh',
    },
  ],

  notes: [
    'NIL tax up to ₹4 lakh (basic exemption)',
    '₹12 lakh rebate threshold for Section 87A',
    'Standard deduction of ₹75,000 for salaried individuals',
    'This is the default regime',
    'Subject to changes in Union Budget 2026',
  ],
};

/**
 * Senior citizen (60+ years) rules for FY 2026-27
 */
export const seniorCitizenRules = {
  financialYear: '2026-27',
  regime: 'old-senior',
  standardDeduction: 50000,

  // Higher exemption limit for seniors
  taxSlabs: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 },
  ],

  surcharge: oldRegimeRules.surcharge,
  cess: oldRegimeRules.cess,

  rebates: [
    {
      minIncome: 0,
      maxIncome: 500000,
      rebateAmount: 'fullTax',
      description: 'Full tax relief for income up to ₹5 lakh under Section 87A',
    },
    {
      minIncome: 500001,
      maxIncome: Infinity,
      rebateAmount: 0,
      description: 'No rebate for income above ₹5 lakh',
    },
  ],

  notes: [
    'Higher exemption limit of ₹3 lakh for seniors (60+ years)',
    'Interest on savings account partially exempt under Section 80TTB',
    'Subject to changes in Union Budget 2026',
  ],
};

// Re-export calculation functions from fy-2024-25 (they remain the same)
export {
  calculateIncomeTax,
  calculateSurcharge,
  calculateCess,
  calculateRebate87A,
} from './fy-2024-25.js';
