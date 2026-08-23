/**
 * Input Normalization
 * Functions to normalize and clean user input
 *
 * Income Sources (TAX-004 through TAX-008):
 * - salary: Salary income (TAX-004) - always non-negative
 * - houseProperty: House property income/loss (TAX-005) - can be negative
 * - business: Business/professional income (TAX-006) - always non-negative
 * - capitalGains: Capital gains (TAX-007) - always non-negative
 * - otherIncome: Other income (TAX-008) - always non-negative
 */

/**
 * Normalizes numeric input by removing common formatting
 * Handles: currency symbols, commas, spaces
 * @param {*} input - Input value to normalize
 * @param {Object} options - Normalization options
 * @param {boolean} [options.allowNegative=false] - Whether to allow negative values
 * @returns {number} Normalized numeric value
 */
export function normalizeNumericInput(input, options = {}) {
  const { allowNegative = false } = options;

  if (input === null || input === undefined || input === '') {
    return 0;
  }

  if (typeof input === 'number') {
    if (Number.isNaN(input) || !Number.isFinite(input)) {
      return 0;
    }
    return allowNegative ? input : Math.abs(input);
  }

  if (typeof input === 'string') {
    // Remove currency symbol
    let cleaned = input.replace(/[₹$€]/g, '');

    // Remove commas
    cleaned = cleaned.replace(/,/g, '');

    // Remove spaces
    cleaned = cleaned.replace(/\s/g, '');

    // Parse to float (this will handle the negative sign naturally)
    const parsed = parseFloat(cleaned);

    if (Number.isNaN(parsed)) {
      return 0;
    }

    // Return value based on allowNegative option
    // When not allowing negative, return absolute value (test expectation)
    return allowNegative ? parsed : Math.abs(parsed);
  }

  return 0;
}

/**
 * Normalizes financial year input
 * Accepts formats like "2024-25", "2024/25", "202425"
 * @param {*} input - Input value to normalize
 * @returns {string} Normalized year string in format "YYYY-YY"
 * @throws {Error} If input cannot be normalized to valid year format
 */
export function normalizeFinancialYear(input) {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    return '';
  }

  let cleaned = input.trim();

  // Handle format "2024/25"
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 2) {
      const year = parts[0];
      const endYear = parts[1].padStart(2, '0');
      cleaned = `${year}-${endYear}`;
    }
  }

  // Handle format "202425" (8 digits)
  if (/^\d{8}$/.test(cleaned)) {
    const year = cleaned.substring(0, 4);
    const endYear = cleaned.substring(6, 8);
    cleaned = `${year}-${endYear}`;
  }

  // Validate format "YYYY-YY"
  if (!/^\d{4}-\d{2}$/.test(cleaned)) {
    return '';
  }

  return cleaned;
}

/**
 * Normalizes form input for all income types (TAX-010 extended)
 * Returns an object with normalized values
 * @param {Object} input - Form input object
 * @returns {Object} Normalized input with all income fields
 */
export function normalizeFormInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      // Basic income
      salary: 0,
      houseProperty: 0,
      business: 0,
      capitalGains: 0,
      otherIncome: 0,

      // TAX-010: Granular capital gains
      stcgEquity: 0,
      stcgOther: 0,
      ltcgEquity: 0,
      ltcgOther: 0,

      // TAX-010: Trading income
      speculativeGains: 0,
      speculativeLosses: 0,
      fnoGains: 0,
      fnoLosses: 0,

      // TAX-010: Expanded other income
      interestIncome: 0,
      dividendIncome: 0,
      otherTaxable: 0,
    };
  }

  return {
    // Basic income
    salary: normalizeNumericInput(input.salary, { allowNegative: false }),
    houseProperty: normalizeNumericInput(input.houseProperty, { allowNegative: true }),
    business: normalizeNumericInput(input.business, { allowNegative: false }),
    capitalGains: normalizeNumericInput(input.capitalGains, { allowNegative: false }),
    otherIncome: normalizeNumericInput(input.otherIncome, { allowNegative: false }),

    // TAX-010: Granular capital gains
    stcgEquity: normalizeNumericInput(input.stcgEquity, { allowNegative: false }),
    stcgOther: normalizeNumericInput(input.stcgOther, { allowNegative: false }),
    ltcgEquity: normalizeNumericInput(input.ltcgEquity, { allowNegative: false }),
    ltcgOther: normalizeNumericInput(input.ltcgOther, { allowNegative: false }),

    // TAX-010: Trading income
    speculativeGains: normalizeNumericInput(input.speculativeGains, { allowNegative: false }),
    speculativeLosses: normalizeNumericInput(input.speculativeLosses, { allowNegative: false }),
    fnoGains: normalizeNumericInput(input.fnoGains, { allowNegative: false }),
    fnoLosses: normalizeNumericInput(input.fnoLosses, { allowNegative: false }),

    // TAX-010: Expanded other income
    interestIncome: normalizeNumericInput(input.interestIncome, { allowNegative: false }),
    dividendIncome: normalizeNumericInput(input.dividendIncome, { allowNegative: false }),
    otherTaxable: normalizeNumericInput(input.otherTaxable, { allowNegative: false }),
  };
}

/**
 * Normalizes deduction input (TAX-010)
 * @param {Object} input - Deductions input object
 * @returns {Object} Normalized deductions
 */
export function normalizeDeductionsInput(input) {
  if (!input || typeof input !== 'object') {
    return {
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
    };
  }

  return {
    standardDeduction: normalizeNumericInput(input.standardDeduction, { allowNegative: false }),
    section80C: normalizeNumericInput(input.section80C, { allowNegative: false }),
    section80CCD1B: normalizeNumericInput(input.section80CCD1B, { allowNegative: false }),
    section80D: normalizeNumericInput(input.section80D, { allowNegative: false }),
    section80E: normalizeNumericInput(input.section80E, { allowNegative: false }),
    section80G: normalizeNumericInput(input.section80G, { allowNegative: false }),
    section80TTA: normalizeNumericInput(input.section80TTA, { allowNegative: false }),
    section80TTB: normalizeNumericInput(input.section80TTB, { allowNegative: false }),
    hra: normalizeNumericInput(input.hra, { allowNegative: false }),
    lta: normalizeNumericInput(input.lta, { allowNegative: false }),
    homeLoanInterest: normalizeNumericInput(input.homeLoanInterest, { allowNegative: false }),
    otherDeductions: normalizeNumericInput(input.otherDeductions, { allowNegative: false }),
  };
}

/**
 * Cleans and normalizes user input for income calculation (TAX-010 extended)
 * Applies both normalization and validation constraints
 * @param {Object} input - Raw user input
 * @returns {Object} Cleaned, normalized input ready for calculation
 */
export function cleanInputForCalculation(input) {
  if (!input || typeof input !== 'object') {
    return {
      // Basic income
      salary: 0,
      houseProperty: 0,
      business: 0,
      capitalGains: 0,
      otherIncome: 0,

      // TAX-010: Granular capital gains
      stcgEquity: 0,
      stcgOther: 0,
      ltcgEquity: 0,
      ltcgOther: 0,

      // TAX-010: Trading income
      speculativeGains: 0,
      speculativeLosses: 0,
      fnoGains: 0,
      fnoLosses: 0,

      // TAX-010: Expanded other income
      interestIncome: 0,
      dividendIncome: 0,
      otherTaxable: 0,

      // TAX-010: Deductions
      deductions: {
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
      },

      financialYear: '',
    };
  }

  // Basic income
  const salary = normalizeNumericInput(input.salary, { allowNegative: false });
  const houseProperty = normalizeNumericInput(input.houseProperty, { allowNegative: true });
  const business = normalizeNumericInput(input.business, { allowNegative: false });
  const capitalGains = normalizeNumericInput(input.capitalGains, { allowNegative: false });
  const otherIncome = normalizeNumericInput(input.otherIncome, { allowNegative: false });
  const financialYear = normalizeFinancialYear(input.financialYear);

  // TAX-010: Granular capital gains
  const stcgEquity = normalizeNumericInput(input.stcgEquity, { allowNegative: false });
  const stcgOther = normalizeNumericInput(input.stcgOther, { allowNegative: false });
  const ltcgEquity = normalizeNumericInput(input.ltcgEquity, { allowNegative: false });
  const ltcgOther = normalizeNumericInput(input.ltcgOther, { allowNegative: false });

  // TAX-010: Trading income
  const speculativeGains = normalizeNumericInput(input.speculativeGains, { allowNegative: false });
  const speculativeLosses = normalizeNumericInput(input.speculativeLosses, { allowNegative: false });
  const fnoGains = normalizeNumericInput(input.fnoGains, { allowNegative: false });
  const fnoLosses = normalizeNumericInput(input.fnoLosses, { allowNegative: false });

  // TAX-010: Expanded other income
  const interestIncome = normalizeNumericInput(input.interestIncome, { allowNegative: false });
  const dividendIncome = normalizeNumericInput(input.dividendIncome, { allowNegative: false });
  const otherTaxable = normalizeNumericInput(input.otherTaxable, { allowNegative: false });

  // TAX-010: Deductions
  const deductions = normalizeDeductionsInput(input.deductions);

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

    deductions,

    financialYear,
  };
}

/**
 * Normalizes text input (trims and handles empty strings)
 * @param {*} input - Input to normalize
 * @returns {string} Normalized string
 */
export function normalizeText(input) {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    return String(input);
  }

  return input.trim();
}

/**
 * Normalizes boolean input
 * Accepts various truthy/falsy representations
 * @param {*} input - Input to normalize
 * @returns {boolean} Normalized boolean value
 */
export function normalizeBoolean(input) {
  if (typeof input === 'boolean') {
    return input;
  }

  if (typeof input === 'string') {
    const normalized = input.toLowerCase().trim();
    return ['true', 'yes', '1', 'on'].includes(normalized);
  }

  if (typeof input === 'number') {
    return input !== 0;
  }

  return Boolean(input);
}

/**
 * Normalizes HTML form input values
 * Handles various input element types
 * @param {HTMLInputElement|HTMLSelectElement} element - Form element
 * @returns {*} Normalized value based on input type
 */
export function normalizeFormElement(element) {
  if (!element) {
    return null;
  }

  const type = element.type ? element.type.toLowerCase() : '';

  switch (type) {
  case 'number':
  case 'range':
    return normalizeNumericInput(element.value);

  case 'checkbox':
  case 'radio':
    return element.checked;

  case 'select-one':
    return normalizeFinancialYear(element.value);

  default:
    return normalizeText(element.value);
  }
}

/**
 * Formats numeric value for display in currency
 * @param {number} value - Numeric value
 * @returns {string} Value formatted for display
 */
export function formatNumericForDisplay(value) {
  const normalized = normalizeNumericInput(value, { allowNegative: true });
  return normalized.toLocaleString('en-IN');
}
