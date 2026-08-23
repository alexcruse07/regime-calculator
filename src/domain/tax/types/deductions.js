/**
 * Deductions Type Definition
 * Comprehensive deductions model for TAX-010
 *
 * Supports all Chapter VI-A deductions and exemptions:
 * - Standard Deduction (auto-applied based on regime)
 * - Section 80C (PPF, ELSS, LIC, etc.)
 * - Section 80CCD(1B) (NPS additional)
 * - Section 80D (Medical insurance)
 * - Section 80E (Education loan interest)
 * - Section 80G (Donations)
 * - Section 80TTA (Savings interest for <60y)
 * - Section 80TTB (Interest for seniors)
 * - HRA (House Rent Allowance)
 * - LTA (Leave Travel Allowance)
 * - Home Loan Interest (Section 24b)
 * - Other Deductions
 */

/**
 * @typedef {Object} Deductions
 * Represents all available tax deductions
 *
 * @property {number} standardDeduction - Standard deduction (auto-applied, ₹75,000 new / ₹50,000 old)
 * @property {number} section80C - Section 80C investments (max ₹1,50,000)
 * @property {number} section80CCD1B - NPS contribution (max ₹50,000)
 * @property {number} section80D - Medical insurance premium (max ₹25,000/₹50,000)
 * @property {number} section80E - Education loan interest (no limit)
 * @property {number} section80G - Donations (50%/100% eligible)
 * @property {number} section80TTA - Savings interest deduction <60y (max ₹10,000)
 * @property {number} section80TTB - Interest deduction for seniors (max ₹50,000)
 * @property {number} hra - House Rent Allowance exemption
 * @property {number} lta - Leave Travel Allowance exemption
 * @property {number} homeLoanInterest - Section 24b home loan interest (max ₹2,00,000)
 * @property {number} otherDeductions - Other Chapter VI-A deductions
 */

/**
 * Creates and validates a Deductions object
 * @param {Object} params - Deduction parameters
 * @returns {Deductions} Validated deductions object
 * @throws {Error} If values are invalid
 */
export function createDeductions({
  standardDeduction = 0,
  section80C = 0,
  section80CCD1B = 0,
  section80D = 0,
  section80E = 0,
  section80G = 0,
  section80TTA = 0,
  section80TTB = 0,
  hra = 0,
  lta = 0,
  homeLoanInterest = 0,
  otherDeductions = 0,
} = {}) {
  const fields = {
    standardDeduction,
    section80C,
    section80CCD1B,
    section80D,
    section80E,
    section80G,
    section80TTA,
    section80TTB,
    hra,
    lta,
    homeLoanInterest,
    otherDeductions,
  };

  // Validate all values are finite numbers and non-negative
  for (const [name, value] of Object.entries(fields)) {
    if (!Number.isFinite(value)) {
      throw new Error(`${formatFieldName(name)} must be a finite number`);
    }
    if (value < 0) {
      throw new Error(`${formatFieldName(name)} must be non-negative`);
    }
  }

  return Object.freeze(fields);
}

/**
 * Formats field name for error messages
 * @param {string} fieldName - Camel case field name
 * @returns {string} Human-readable name
 */
function formatFieldName(fieldName) {
  const nameMap = {
    standardDeduction: 'Standard Deduction',
    section80C: 'Section 80C',
    section80CCD1B: 'Section 80CCD(1B)',
    section80D: 'Section 80D',
    section80E: 'Section 80E',
    section80G: 'Section 80G',
    section80TTA: 'Section 80TTA',
    section80TTB: 'Section 80TTB',
    hra: 'HRA',
    lta: 'LTA',
    homeLoanInterest: 'Home Loan Interest',
    otherDeductions: 'Other Deductions',
  };
  return nameMap[fieldName] || fieldName;
}

/**
 * Calculates total Chapter VI-A deductions (80C, 80CCD1B, 80D, 80E, 80G, 80TTA, 80TTB)
 * Does NOT include standard deduction, HRA, LTA, or home loan interest
 * @param {Deductions} deductions - Deductions object
 * @returns {number} Total Chapter VI-A deductions
 */
export function getTotalChapterVIA(deductions) {
  if (!deductions || typeof deductions !== 'object') {
    return 0;
  }
  return (deductions.section80C || 0) +
         (deductions.section80CCD1B || 0) +
         (deductions.section80D || 0) +
         (deductions.section80E || 0) +
         (deductions.section80G || 0) +
         (deductions.section80TTA || 0) +
         (deductions.section80TTB || 0);
}

/**
 * Calculates total exemptions (HRA + LTA)
 * @param {Deductions} deductions - Deductions object
 * @returns {number} Total exemptions
 */
export function getTotalExemptions(deductions) {
  if (!deductions || typeof deductions !== 'object') {
    return 0;
  }
  return (deductions.hra || 0) + (deductions.lta || 0);
}

/**
 * Calculates total deductions (all fields)
 * @param {Deductions} deductions - Deductions object
 * @returns {number} Total deductions
 */
export function getTotalDeductions(deductions) {
  if (!deductions || typeof deductions !== 'object') {
    return 0;
  }
  return (deductions.standardDeduction || 0) +
         (deductions.section80C || 0) +
         (deductions.section80CCD1B || 0) +
         (deductions.section80D || 0) +
         (deductions.section80E || 0) +
         (deductions.section80G || 0) +
         (deductions.section80TTA || 0) +
         (deductions.section80TTB || 0) +
         (deductions.hra || 0) +
         (deductions.lta || 0) +
         (deductions.homeLoanInterest || 0) +
         (deductions.otherDeductions || 0);
}

/**
 * Calculates old regime applicable deductions
 * @param {Deductions} deductions - Deductions object
 * @returns {number} Total old regime deductions
 */
export function getOldRegimeDeductions(deductions) {
  // Old regime gets everything except standard deduction (handled separately)
  if (!deductions || typeof deductions !== 'object') {
    return 0;
  }
  return getTotalChapterVIA(deductions) +
         getTotalExemptions(deductions) +
         (deductions.homeLoanInterest || 0) +
         (deductions.otherDeductions || 0);
}

/**
 * Calculates new regime applicable deductions
 * New regime only allows standard deduction (no other deductions)
 * @param {Deductions} deductions - Deductions object
 * @returns {number} Total new regime deductions (standard deduction only)
 */
export function getNewRegimeDeductions(deductions) {
  if (!deductions || typeof deductions !== 'object') {
    return 0;
  }
  // New regime: Only standard deduction is applicable
  return deductions.standardDeduction || 0;
}

/**
 * Validates a Deductions object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid Deductions object
 */
export function isValidDeductions(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const fields = [
    'standardDeduction', 'section80C', 'section80CCD1B', 'section80D',
    'section80E', 'section80G', 'section80TTA', 'section80TTB',
    'hra', 'lta', 'homeLoanInterest', 'otherDeductions',
  ];

  for (const field of fields) {
    const val = value[field];
    if (!Number.isFinite(val) || val < 0) {
      return false;
    }
  }

  return true;
}

/**
 * Creates an empty deductions object
 * @returns {Deductions} Empty deductions object
 */
export function createEmptyDeductions() {
  return Object.freeze({
    standardDeduction: 0,
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
  });
}

/**
 * List of all deduction field names
 * @returns {string[]} Array of deduction field names
 */
export function getDeductionFieldNames() {
  return [
    'standardDeduction',
    'section80C',
    'section80CCD1B',
    'section80D',
    'section80E',
    'section80G',
    'section80TTA',
    'section80TTB',
    'hra',
    'lta',
    'homeLoanInterest',
    'otherDeductions',
  ];
}

/**
 * Gets deduction display info for UI
 * @returns {Object[]} Array of deduction field metadata
 */
export function getDeductionFieldsInfo() {
  return [
    { field: 'standardDeduction', label: 'Standard Deduction', section: 'auto', hint: 'Auto-applied based on regime' },
    { field: 'section80C', label: 'Section 80C', section: '80C', hint: 'PPF, ELSS, LIC, etc. (Max ₹1,50,000)' },
    { field: 'section80CCD1B', label: 'Section 80CCD(1B)', section: '80CCD(1B)', hint: 'NPS additional (Max ₹50,000)' },
    { field: 'section80D', label: 'Section 80D', section: '80D', hint: 'Medical insurance (Max ₹25,000/₹50,000)' },
    { field: 'section80E', label: 'Section 80E', section: '80E', hint: 'Education loan interest (No limit)' },
    { field: 'section80G', label: 'Section 80G', section: '80G', hint: 'Donations (50%/100% eligible)' },
    { field: 'section80TTA', label: 'Section 80TTA', section: '80TTA', hint: 'Savings interest <60y (Max ₹10,000)' },
    { field: 'section80TTB', label: 'Section 80TTB', section: '80TTB', hint: 'Interest for seniors (Max ₹50,000)' },
    { field: 'hra', label: 'HRA Exemption', section: 'exemption', hint: 'House Rent Allowance' },
    { field: 'lta', label: 'LTA Exemption', section: 'exemption', hint: 'Leave Travel Allowance' },
    { field: 'homeLoanInterest', label: 'Home Loan Interest', section: '24b', hint: 'Section 24b (Max ₹2,00,000)' },
    { field: 'otherDeductions', label: 'Other Deductions', section: 'other', hint: 'Any other Chapter VI-A deductions' },
  ];
}
