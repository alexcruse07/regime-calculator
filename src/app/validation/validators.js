/**
 * Input Validators
 * Functions to validate user input before processing
 *
 * Income Sources (TAX-004 through TAX-008):
 * - salary: Salary income (TAX-004) - must be non-negative
 * - houseProperty: House property income/loss (TAX-005) - can be negative
 * - business: Business/professional income (TAX-006) - must be non-negative
 * - capitalGains: Capital gains (TAX-007) - must be non-negative
 * - otherIncome: Other income (TAX-008) - must be non-negative
 */

import { isSupportedYear } from '../../shared/constants/financial-years.js';
import { normalizeFinancialYear } from '../input-normalization/normalizers.js';

/**
 * Validates a numeric income value
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowNegative=false] - Whether to allow negative values
 * @param {boolean} [options.allowEmpty=false] - Whether to allow empty values (treated as 0)
 * @returns {Object} Validation result { isValid: boolean, error: string|null }
 */
export function validateNumericIncome(value, fieldName = 'Income', options = {}) {
  const { allowNegative = false, allowEmpty = false } = options;

  // Check if value exists
  if (value === null || value === undefined || value === '') {
    if (allowEmpty) {
      return { isValid: true, error: null };
    }
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  // Try to parse as number
  const numValue = parseFloat(value);

  if (Number.isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (!Number.isFinite(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be a finite number`,
    };
  }

  if (!allowNegative && numValue < 0) {
    return {
      isValid: false,
      error: `${fieldName} must be non-negative`,
    };
  }

  // Reasonable upper/lower limit checks
  if (numValue > 1000000000) {
    return {
      isValid: false,
      error: `${fieldName} exceeds maximum allowed value`,
    };
  }

  if (numValue < -1000000000) {
    return {
      isValid: false,
      error: `${fieldName} is below minimum allowed value`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validates financial year selection
 * @param {*} year - Value to validate
 * @returns {Object} Validation result { isValid: boolean, error: string|null }
 */
export function validateFinancialYear(year) {
  if (!year || typeof year !== 'string') {
    return {
      isValid: false,
      error: 'Financial year is required',
    };
  }

  // Normalize the year format before checking
  const normalizedYear = normalizeFinancialYear(year);

  if (!normalizedYear || !isSupportedYear(normalizedYear)) {
    return {
      isValid: false,
      error: `Financial year ${year} is not supported`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validates complete income input with all income types
 * @param {Object} input - Input object with all income fields
 * @returns {Object} Validation result { isValid: boolean, errors: string[] }
 */
export function validateIncomeInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid input object'],
    };
  }

  // Validate salary (TAX-004) - non-negative, allow empty
  const salaryValidation = validateNumericIncome(input.salary, 'Salary', { allowNegative: false, allowEmpty: true });
  if (!salaryValidation.isValid) {
    errors.push(salaryValidation.error);
  }

  // Validate house property (TAX-005) - can be negative (loss), allow empty
  const housePropertyValidation = validateNumericIncome(input.houseProperty, 'House property income', { allowNegative: true, allowEmpty: true });
  if (!housePropertyValidation.isValid) {
    errors.push(housePropertyValidation.error);
  }

  // Validate business income (TAX-006) - non-negative, allow empty
  const businessValidation = validateNumericIncome(input.business, 'Business income', { allowNegative: false, allowEmpty: true });
  if (!businessValidation.isValid) {
    errors.push(businessValidation.error);
  }

  // Validate capital gains (TAX-007) - non-negative, allow empty
  const capitalGainsValidation = validateNumericIncome(input.capitalGains, 'Capital gains', { allowNegative: false, allowEmpty: true });
  if (!capitalGainsValidation.isValid) {
    errors.push(capitalGainsValidation.error);
  }

  // Validate other income (TAX-008) - non-negative, allow empty
  const otherIncomeValidation = validateNumericIncome(input.otherIncome, 'Other income', { allowNegative: false, allowEmpty: true });
  if (!otherIncomeValidation.isValid) {
    errors.push(otherIncomeValidation.error);
  }

  // Validate financial year
  const yearValidation = validateFinancialYear(input.financialYear);
  if (!yearValidation.isValid) {
    errors.push(yearValidation.error);
  }

  // Check if at least one income value is provided (excluding house property loss)
  const salary = parseFloat(input.salary) || 0;
  const houseProperty = parseFloat(input.houseProperty) || 0;
  const business = parseFloat(input.business) || 0;
  const capitalGains = parseFloat(input.capitalGains) || 0;
  const otherIncome = parseFloat(input.otherIncome) || 0;

  const totalPositiveIncome = salary + Math.max(0, houseProperty) + business + capitalGains + otherIncome;

  if (totalPositiveIncome === 0 && houseProperty >= 0) {
    errors.push('At least one income value must be greater than zero');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single income field
 * @param {string} fieldName - Name of the field
 * @param {*} value - Value to validate
 * @returns {Object} Validation result { isValid: boolean, error: string|null }
 */
export function validateIncomeField(fieldName, value) {
  const fieldConfig = {
    salary: { displayName: 'Salary', allowNegative: false },
    houseProperty: { displayName: 'House property income', allowNegative: true },
    business: { displayName: 'Business income', allowNegative: false },
    capitalGains: { displayName: 'Capital gains', allowNegative: false },
    otherIncome: { displayName: 'Other income', allowNegative: false },
  };

  const config = fieldConfig[fieldName] || { displayName: fieldName, allowNegative: false };

  return validateNumericIncome(value, config.displayName, { allowNegative: config.allowNegative, allowEmpty: true });
}

/**
 * Validates user form submission with all income types
 * @param {Object} formData - Form data object
 * @returns {Object} Complete validation result with organized errors
 */
export function validateFormSubmission(formData) {
  const errors = {
    salary: null,
    houseProperty: null,
    business: null,
    capitalGains: null,
    otherIncome: null,
    financialYear: null,
    general: [],
  };

  if (!formData || typeof formData !== 'object') {
    errors.general.push('Invalid form data');
    return {
      isValid: false,
      errors,
    };
  }

  // Validate individual fields
  const salaryVal = validateIncomeField('salary', formData.salary);
  if (!salaryVal.isValid) {
    errors.salary = salaryVal.error;
  }

  const housePropertyVal = validateIncomeField('houseProperty', formData.houseProperty);
  if (!housePropertyVal.isValid) {
    errors.houseProperty = housePropertyVal.error;
  }

  const businessVal = validateIncomeField('business', formData.business);
  if (!businessVal.isValid) {
    errors.business = businessVal.error;
  }

  const capitalGainsVal = validateIncomeField('capitalGains', formData.capitalGains);
  if (!capitalGainsVal.isValid) {
    errors.capitalGains = capitalGainsVal.error;
  }

  const otherIncomeVal = validateIncomeField('otherIncome', formData.otherIncome);
  if (!otherIncomeVal.isValid) {
    errors.otherIncome = otherIncomeVal.error;
  }

  const yearVal = validateFinancialYear(formData.financialYear);
  if (!yearVal.isValid) {
    errors.financialYear = yearVal.error;
  }

  // Check overall constraints - at least one positive income required
  const salary = parseFloat(formData.salary) || 0;
  const houseProperty = parseFloat(formData.houseProperty) || 0;
  const business = parseFloat(formData.business) || 0;
  const capitalGains = parseFloat(formData.capitalGains) || 0;
  const otherIncome = parseFloat(formData.otherIncome) || 0;

  const allFieldsValid = salaryVal.isValid && housePropertyVal.isValid && businessVal.isValid &&
                         capitalGainsVal.isValid && otherIncomeVal.isValid;

  const totalPositiveIncome = salary + Math.max(0, houseProperty) + business + capitalGains + otherIncome;

  if (allFieldsValid && totalPositiveIncome === 0 && houseProperty >= 0) {
    errors.general.push('At least one income value must be greater than zero');
  }

  const hasErrors =
    errors.salary ||
    errors.houseProperty ||
    errors.business ||
    errors.capitalGains ||
    errors.otherIncome ||
    errors.financialYear ||
    errors.general.length > 0;

  return {
    isValid: !hasErrors,
    errors,
  };
}
