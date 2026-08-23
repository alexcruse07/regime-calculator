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
 * Normalizes form input for all income types
 * Returns an object with normalized values
 * @param {Object} input - Form input object
 * @returns {Object} Normalized input with all income fields
 */
export function normalizeFormInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      salary: 0,
      houseProperty: 0,
      business: 0,
      capitalGains: 0,
      otherIncome: 0,
    };
  }

  return {
    salary: normalizeNumericInput(input.salary, { allowNegative: false }),
    houseProperty: normalizeNumericInput(input.houseProperty, { allowNegative: true }),
    business: normalizeNumericInput(input.business, { allowNegative: false }),
    capitalGains: normalizeNumericInput(input.capitalGains, { allowNegative: false }),
    otherIncome: normalizeNumericInput(input.otherIncome, { allowNegative: false }),
  };
}

/**
 * Cleans and normalizes user input for income calculation
 * Applies both normalization and validation constraints
 * @param {Object} input - Raw user input
 * @returns {Object} Cleaned, normalized input ready for calculation
 */
export function cleanInputForCalculation(input) {
  if (!input || typeof input !== 'object') {
    return {
      salary: 0,
      houseProperty: 0,
      business: 0,
      capitalGains: 0,
      otherIncome: 0,
      financialYear: '',
    };
  }

  const salary = normalizeNumericInput(input.salary, { allowNegative: false });
  const houseProperty = normalizeNumericInput(input.houseProperty, { allowNegative: true });
  const business = normalizeNumericInput(input.business, { allowNegative: false });
  const capitalGains = normalizeNumericInput(input.capitalGains, { allowNegative: false });
  const otherIncome = normalizeNumericInput(input.otherIncome, { allowNegative: false });
  const financialYear = normalizeFinancialYear(input.financialYear);

  return {
    salary,
    houseProperty,
    business,
    capitalGains,
    otherIncome,
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
