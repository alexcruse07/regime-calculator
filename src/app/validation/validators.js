/**
 * Input Validators
 * Functions to validate user input before processing
 *
 * Income Sources (TAX-004 through TAX-008, TAX-010):
 * - salary: Salary income (TAX-004) - must be non-negative
 * - houseProperty: House property income/loss (TAX-005) - can be negative
 * - business: Business/professional income (TAX-006) - must be non-negative
 * - capitalGains: Capital gains (TAX-007/TAX-010) - granular breakdown
 * - otherIncome: Other income (TAX-008/TAX-010) - expanded breakdown
 * - tradingIncome: Speculative and F&O (TAX-010)
 * - deductions: All Chapter VI-A deductions (TAX-010)
 */

import { isSupportedYear } from '../../shared/constants/financial-years.js';
import { normalizeFinancialYear } from '../input-normalization/normalizers.js';
import { getDeductionLimit, exceedsDeductionLimit } from '../../domain/rules/deduction-limits.js';

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
 * Validates a single income field (TAX-010 extended)
 * @param {string} fieldName - Name of the field
 * @param {*} value - Value to validate
 * @returns {Object} Validation result { isValid: boolean, error: string|null }
 */
export function validateIncomeField(fieldName, value) {
  const fieldConfig = {
    // Basic income fields
    salary: { displayName: 'Salary', allowNegative: false },
    houseProperty: { displayName: 'House property income', allowNegative: true },
    business: { displayName: 'Business income', allowNegative: false },
    capitalGains: { displayName: 'Capital gains', allowNegative: false },
    otherIncome: { displayName: 'Other income', allowNegative: false },

    // TAX-010: Granular capital gains
    stcgEquity: { displayName: 'STCG (Listed Equity)', allowNegative: false },
    stcgOther: { displayName: 'STCG (Other Assets)', allowNegative: false },
    ltcgEquity: { displayName: 'LTCG (Listed Equity)', allowNegative: false },
    ltcgOther: { displayName: 'LTCG (Other Assets)', allowNegative: false },

    // TAX-010: Trading income
    speculativeGains: { displayName: 'Speculative Gains', allowNegative: false },
    speculativeLosses: { displayName: 'Speculative Losses', allowNegative: false },
    fnoGains: { displayName: 'F&O Gains', allowNegative: false },
    fnoLosses: { displayName: 'F&O Losses', allowNegative: false },

    // TAX-010: Expanded other income
    interestIncome: { displayName: 'Interest Income', allowNegative: false },
    dividendIncome: { displayName: 'Dividend Income', allowNegative: false },
    otherTaxable: { displayName: 'Other Taxable Income', allowNegative: false },
  };

  const config = fieldConfig[fieldName] || { displayName: fieldName, allowNegative: false };

  return validateNumericIncome(value, config.displayName, { allowNegative: config.allowNegative, allowEmpty: true });
}

/**
 * Validates a single deduction field (TAX-010)
 * @param {string} fieldName - Name of the deduction field
 * @param {*} value - Value to validate
 * @param {string} financialYear - Financial year for limit checking
 * @returns {Object} Validation result { isValid: boolean, error: string|null, warning: string|null }
 */
export function validateDeductionField(fieldName, value, financialYear = '2024-25') {
  const fieldConfig = {
    standardDeduction: { displayName: 'Standard Deduction' },
    section80C: { displayName: 'Section 80C' },
    section80CCD1B: { displayName: 'Section 80CCD(1B)' },
    section80D: { displayName: 'Section 80D' },
    section80E: { displayName: 'Section 80E' },
    section80G: { displayName: 'Section 80G' },
    section80TTA: { displayName: 'Section 80TTA' },
    section80TTB: { displayName: 'Section 80TTB' },
    hra: { displayName: 'HRA Exemption' },
    lta: { displayName: 'LTA Exemption' },
    homeLoanInterest: { displayName: 'Home Loan Interest' },
    otherDeductions: { displayName: 'Other Deductions' },
  };

  const config = fieldConfig[fieldName] || { displayName: fieldName };

  // First validate it's a valid non-negative number
  const numericValidation = validateNumericIncome(value, config.displayName, { allowNegative: false, allowEmpty: true });

  if (!numericValidation.isValid) {
    return { ...numericValidation, warning: null };
  }

  // Check if value exceeds statutory limit
  const numValue = parseFloat(value) || 0;
  let warning = null;

  if (numValue > 0 && exceedsDeductionLimit(fieldName, numValue, financialYear)) {
    const limit = getDeductionLimit(fieldName, financialYear);
    if (limit !== Infinity) {
      warning = `${config.displayName} exceeds limit of ₹${limit.toLocaleString('en-IN')}. Will be capped.`;
    }
  }

  return {
    isValid: true,
    error: null,
    warning,
  };
}

/**
 * Validates all deduction fields (TAX-010)
 * @param {Object} deductions - Deductions object
 * @param {string} financialYear - Financial year
 * @returns {Object} Validation result with field-specific errors and warnings
 */
export function validateDeductions(deductions, financialYear = '2024-25') {
  const errors = {};
  const warnings = {};

  if (!deductions || typeof deductions !== 'object') {
    return {
      isValid: true, // Empty deductions are valid
      errors: {},
      warnings: {},
    };
  }

  const deductionFields = [
    'standardDeduction', 'section80C', 'section80CCD1B', 'section80D',
    'section80E', 'section80G', 'section80TTA', 'section80TTB',
    'hra', 'lta', 'homeLoanInterest', 'otherDeductions',
  ];

  for (const field of deductionFields) {
    const result = validateDeductionField(field, deductions[field], financialYear);

    if (!result.isValid) {
      errors[field] = result.error;
    }

    if (result.warning) {
      warnings[field] = result.warning;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates user form submission with all income types and deductions (TAX-010 extended)
 * @param {Object} formData - Form data object
 * @returns {Object} Complete validation result with organized errors
 */
export function validateFormSubmission(formData) {
  const errors = {
    // Basic income
    salary: null,
    houseProperty: null,
    business: null,
    capitalGains: null,
    otherIncome: null,

    // TAX-010: Granular capital gains
    stcgEquity: null,
    stcgOther: null,
    ltcgEquity: null,
    ltcgOther: null,

    // TAX-010: Trading income
    speculativeGains: null,
    speculativeLosses: null,
    fnoGains: null,
    fnoLosses: null,

    // TAX-010: Expanded other income
    interestIncome: null,
    dividendIncome: null,
    otherTaxable: null,

    // TAX-010: Deductions
    deductions: {},

    financialYear: null,
    general: [],
  };

  const warnings = {
    deductions: {},
  };

  if (!formData || typeof formData !== 'object') {
    errors.general.push('Invalid form data');
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // Validate basic income fields
  const basicIncomeFields = ['salary', 'houseProperty', 'business', 'capitalGains', 'otherIncome'];
  const basicValidations = {};

  for (const field of basicIncomeFields) {
    const validation = validateIncomeField(field, formData[field]);
    basicValidations[field] = validation;
    if (!validation.isValid) {
      errors[field] = validation.error;
    }
  }

  // Validate granular capital gains (TAX-010)
  const capitalGainsFields = ['stcgEquity', 'stcgOther', 'ltcgEquity', 'ltcgOther'];
  for (const field of capitalGainsFields) {
    const validation = validateIncomeField(field, formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.error;
    }
  }

  // Validate trading income (TAX-010)
  const tradingFields = ['speculativeGains', 'speculativeLosses', 'fnoGains', 'fnoLosses'];
  for (const field of tradingFields) {
    const validation = validateIncomeField(field, formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.error;
    }
  }

  // Validate expanded other income (TAX-010)
  const otherIncomeFields = ['interestIncome', 'dividendIncome', 'otherTaxable'];
  for (const field of otherIncomeFields) {
    const validation = validateIncomeField(field, formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.error;
    }
  }

  // Validate financial year
  const yearVal = validateFinancialYear(formData.financialYear);
  if (!yearVal.isValid) {
    errors.financialYear = yearVal.error;
  }

  // Validate deductions if present (TAX-010)
  if (formData.deductions) {
    const deductionValidation = validateDeductions(formData.deductions, formData.financialYear || '2024-25');
    errors.deductions = deductionValidation.errors;
    warnings.deductions = deductionValidation.warnings;
  }

  // Check overall constraints - at least one positive income required
  const salary = parseFloat(formData.salary) || 0;
  const houseProperty = parseFloat(formData.houseProperty) || 0;
  const business = parseFloat(formData.business) || 0;
  const capitalGains = parseFloat(formData.capitalGains) || 0;
  const otherIncome = parseFloat(formData.otherIncome) || 0;

  // Also check granular fields for positive income
  const stcgEquity = parseFloat(formData.stcgEquity) || 0;
  const stcgOther = parseFloat(formData.stcgOther) || 0;
  const ltcgEquity = parseFloat(formData.ltcgEquity) || 0;
  const ltcgOther = parseFloat(formData.ltcgOther) || 0;
  const speculativeGains = parseFloat(formData.speculativeGains) || 0;
  const fnoGains = parseFloat(formData.fnoGains) || 0;
  const interestIncome = parseFloat(formData.interestIncome) || 0;
  const dividendIncome = parseFloat(formData.dividendIncome) || 0;
  const otherTaxable = parseFloat(formData.otherTaxable) || 0;

  const allBasicFieldsValid = Object.values(basicValidations).every(v => v.isValid);

  const totalPositiveIncome = salary + Math.max(0, houseProperty) + business + capitalGains + otherIncome +
    stcgEquity + stcgOther + ltcgEquity + ltcgOther + speculativeGains + fnoGains +
    interestIncome + dividendIncome + otherTaxable;

  if (allBasicFieldsValid && totalPositiveIncome === 0 && houseProperty >= 0) {
    errors.general.push('At least one income value must be greater than zero');
  }

  const hasErrors =
    errors.salary ||
    errors.houseProperty ||
    errors.business ||
    errors.capitalGains ||
    errors.otherIncome ||
    errors.stcgEquity ||
    errors.stcgOther ||
    errors.ltcgEquity ||
    errors.ltcgOther ||
    errors.speculativeGains ||
    errors.speculativeLosses ||
    errors.fnoGains ||
    errors.fnoLosses ||
    errors.interestIncome ||
    errors.dividendIncome ||
    errors.otherTaxable ||
    errors.financialYear ||
    Object.keys(errors.deductions).length > 0 ||
    errors.general.length > 0;

  return {
    isValid: !hasErrors,
    errors,
    warnings,
  };
}
