/**
 * Deduction Limits by Financial Year
 * Statutory caps for each deduction section per FY
 *
 * @module domain/rules/deduction-limits
 */

/**
 * Deduction limits for FY 2024-25
 * @type {Object}
 */
const DEDUCTION_LIMITS_FY_2024_25 = Object.freeze({
  // Standard deduction amounts by regime
  standardDeduction: {
    old: 50000,    // ₹50,000 for old regime
    new: 75000,    // ₹75,000 for new regime
  },

  // Section 80C - Investments like PPF, ELSS, LIC premium, etc.
  section80C: {
    maxLimit: 150000,  // ₹1,50,000
    description: 'Investments in PPF, ELSS, LIC, NSC, etc.',
  },

  // Section 80CCD(1B) - Additional NPS contribution
  section80CCD1B: {
    maxLimit: 50000,   // ₹50,000 additional
    description: 'Additional NPS contribution over 80C limit',
  },

  // Section 80D - Medical Insurance Premium
  section80D: {
    self: 25000,           // Self, spouse, children (₹25,000)
    selfSenior: 50000,     // If self is senior citizen (₹50,000)
    parents: 25000,        // For parents (₹25,000)
    parentsSenior: 50000,  // If parents are senior (₹50,000)
    preventiveHealth: 5000, // Preventive health checkup (within above limits)
    maxLimit: 100000,      // Maximum possible (₹1,00,000 if both self and parents are senior)
    description: 'Medical insurance premium for self and family',
  },

  // Section 80E - Education Loan Interest
  section80E: {
    maxLimit: Infinity,  // No upper limit
    duration: 8,         // Available for 8 years from start of repayment
    description: 'Interest on education loan for higher studies',
  },

  // Section 80G - Donations
  section80G: {
    // No fixed max - depends on type of donation and adjusted gross total income
    maxLimit: Infinity,  // Subject to 50%/100% eligibility
    description: 'Donations to eligible charitable institutions',
  },

  // Section 80TTA - Interest on Savings Account (non-senior)
  section80TTA: {
    maxLimit: 10000,   // ₹10,000
    ageLimit: 60,      // For individuals below 60 years
    description: 'Interest on savings account for non-seniors',
  },

  // Section 80TTB - Interest Income for Senior Citizens
  section80TTB: {
    maxLimit: 50000,   // ₹50,000
    minAge: 60,        // For individuals 60 years and above
    description: 'Interest from deposits for senior citizens',
  },

  // HRA Exemption
  hra: {
    maxLimit: Infinity, // Calculated based on formula
    description: 'Minimum of: actual HRA, rent - 10% of salary, 50%/40% of salary',
  },

  // LTA Exemption
  lta: {
    maxLimit: Infinity, // Actual travel expenses (within India)
    description: 'Leave travel allowance for domestic travel',
  },

  // Section 24b - Home Loan Interest
  homeLoanInterest: {
    selfOccupied: 200000,  // ₹2,00,000 for self-occupied property
    letOut: Infinity,      // No limit for let-out property
    maxLimit: 200000,      // Default to self-occupied limit
    description: 'Interest on home loan for self-occupied property',
  },

  // Other deductions - no specific limit
  otherDeductions: {
    maxLimit: Infinity,
    description: 'Other eligible Chapter VI-A deductions',
  },
});

/**
 * Registry of deduction limits by financial year
 * @type {Object}
 */
const DEDUCTION_LIMITS_BY_YEAR = Object.freeze({
  '2024-25': DEDUCTION_LIMITS_FY_2024_25,
});

/**
 * Default deduction limits (fallback)
 */
const DEFAULT_DEDUCTION_LIMITS = DEDUCTION_LIMITS_FY_2024_25;

/**
 * Gets deduction limits for a financial year
 * @param {string} financialYear - The financial year (e.g., '2024-25')
 * @returns {Object} Deduction limits configuration
 */
export function getDeductionLimits(financialYear) {
  return DEDUCTION_LIMITS_BY_YEAR[financialYear] || DEFAULT_DEDUCTION_LIMITS;
}

/**
 * Gets the standard deduction amount for a regime
 * @param {string} regime - Tax regime ('old' | 'new')
 * @param {string} financialYear - Financial year
 * @returns {number} Standard deduction amount
 */
export function getStandardDeductionAmount(regime, financialYear) {
  const limits = getDeductionLimits(financialYear);
  if (regime === 'new') {
    return limits.standardDeduction.new;
  }
  return limits.standardDeduction.old;
}

/**
 * Gets the maximum limit for a deduction field
 * @param {string} fieldName - Deduction field name
 * @param {string} financialYear - Financial year
 * @returns {number} Maximum limit (Infinity if no limit)
 */
export function getDeductionLimit(fieldName, financialYear) {
  const limits = getDeductionLimits(financialYear);
  const fieldLimits = limits[fieldName];

  if (!fieldLimits) {
    return Infinity; // Unknown field, no limit
  }

  return fieldLimits.maxLimit !== undefined ? fieldLimits.maxLimit : Infinity;
}

/**
 * Applies statutory cap to a deduction value
 * @param {string} fieldName - Deduction field name
 * @param {number} value - Input value
 * @param {string} financialYear - Financial year
 * @returns {number} Capped value
 */
export function applyDeductionCap(fieldName, value, financialYear) {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  const limit = getDeductionLimit(fieldName, financialYear);

  if (limit === Infinity) {
    return value;
  }

  return Math.min(value, limit);
}

/**
 * Checks if a deduction value exceeds its limit
 * @param {string} fieldName - Deduction field name
 * @param {number} value - Value to check
 * @param {string} financialYear - Financial year
 * @returns {boolean} True if exceeds limit
 */
export function exceedsDeductionLimit(fieldName, value, financialYear) {
  const limit = getDeductionLimit(fieldName, financialYear);

  if (limit === Infinity) {
    return false;
  }

  return value > limit;
}

/**
 * Gets deduction field info including limit
 * @param {string} fieldName - Deduction field name
 * @param {string} financialYear - Financial year
 * @returns {Object} Field info with limit
 */
export function getDeductionFieldInfo(fieldName, financialYear) {
  const limits = getDeductionLimits(financialYear);
  const fieldLimits = limits[fieldName];

  if (!fieldLimits) {
    return {
      field: fieldName,
      maxLimit: Infinity,
      description: 'Unknown deduction',
      hasLimit: false,
    };
  }

  return {
    field: fieldName,
    maxLimit: fieldLimits.maxLimit,
    description: fieldLimits.description,
    hasLimit: fieldLimits.maxLimit !== Infinity,
    ...fieldLimits,
  };
}

/**
 * Gets all deduction limits formatted for display
 * @param {string} financialYear - Financial year
 * @returns {Object[]} Array of limit info objects
 */
export function getAllDeductionLimitsForDisplay(financialYear) {
  const limits = getDeductionLimits(financialYear);

  return Object.entries(limits).map(([field, config]) => ({
    field,
    maxLimit: config.maxLimit,
    description: config.description,
    displayLimit: config.maxLimit === Infinity
      ? 'No limit'
      : `₹${config.maxLimit.toLocaleString('en-IN')}`,
  }));
}

/**
 * Applies all deduction caps to a deductions object
 * @param {Object} deductions - Deductions object
 * @param {string} financialYear - Financial year
 * @returns {Object} Deductions with caps applied
 */
export function applyAllDeductionCaps(deductions, financialYear) {
  if (!deductions || typeof deductions !== 'object') {
    return {};
  }

  const capped = {};
  const deductionFields = [
    'section80C', 'section80CCD1B', 'section80D', 'section80E',
    'section80G', 'section80TTA', 'section80TTB', 'hra', 'lta',
    'homeLoanInterest', 'otherDeductions',
  ];

  // Standard deduction is handled separately (auto-applied)
  capped.standardDeduction = deductions.standardDeduction || 0;

  for (const field of deductionFields) {
    capped[field] = applyDeductionCap(field, deductions[field] || 0, financialYear);
  }

  return capped;
}

// Export limits constant for direct access if needed
export { DEDUCTION_LIMITS_FY_2024_25 };
