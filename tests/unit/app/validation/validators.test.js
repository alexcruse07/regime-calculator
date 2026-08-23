/**
 * Tests for Input Validators
 * Comprehensive tests for validating user input
 */

import { describe, it, expect } from 'vitest';
import {
  validateNumericIncome,
  validateFinancialYear,
  validateIncomeInput,
  validateIncomeField,
  validateFormSubmission,
} from '../../../../src/app/validation/validators.js';

describe('validateNumericIncome', () => {
  it('should accept valid positive numbers', () => {
    const result = validateNumericIncome(1000, 'Income');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should accept zero', () => {
    const result = validateNumericIncome(0, 'Income');
    expect(result.isValid).toBe(true);
  });

  it('should accept string numbers', () => {
    const result = validateNumericIncome('1000', 'Income');
    expect(result.isValid).toBe(true);
  });

  it('should reject negative numbers', () => {
    const result = validateNumericIncome(-100, 'Income');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('non-negative');
  });

  it('should reject non-numeric strings', () => {
    const result = validateNumericIncome('abc', 'Income');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  it('should reject empty/null/undefined', () => {
    expect(validateNumericIncome('', 'Income').isValid).toBe(false);
    expect(validateNumericIncome(null, 'Income').isValid).toBe(false);
    expect(validateNumericIncome(undefined, 'Income').isValid).toBe(false);
  });

  it('should reject infinity', () => {
    const result = validateNumericIncome(Infinity, 'Income');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('finite');
  });

  it('should reject very large numbers', () => {
    const result = validateNumericIncome(2000000000, 'Income');
    expect(result.isValid).toBe(false);
  });

  it('should include field name in error message', () => {
    const result = validateNumericIncome('invalid', 'Salary');
    expect(result.error).toContain('Salary');
  });
});

describe('validateFinancialYear', () => {
  it('should accept supported years', () => {
    const result = validateFinancialYear('2024-25');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should reject unsupported years', () => {
    const result = validateFinancialYear('2020-21');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('not supported');
  });

  it('should reject null/undefined', () => {
    expect(validateFinancialYear(null).isValid).toBe(false);
    expect(validateFinancialYear(undefined).isValid).toBe(false);
  });

  it('should reject non-string values', () => {
    expect(validateFinancialYear(2024).isValid).toBe(false);
  });

  it('should reject empty string', () => {
    const result = validateFinancialYear('');
    expect(result.isValid).toBe(false);
  });
});

describe('validateIncomeInput', () => {
  it('should accept valid complete input', () => {
    const input = {
      salary: 500000,
      otherIncome: 50000,
      financialYear: '2024-25',
    };

    const result = validateIncomeInput(input);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject zero income from both sources', () => {
    const input = {
      salary: 0,
      otherIncome: 0,
      financialYear: '2024-25',
    };

    const result = validateIncomeInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should accept non-zero salary with zero other income', () => {
    const input = {
      salary: 100000,
      otherIncome: 0,
      financialYear: '2024-25',
    };

    const result = validateIncomeInput(input);
    expect(result.isValid).toBe(true);
  });

  it('should accept non-zero other income with zero salary', () => {
    const input = {
      salary: 0,
      otherIncome: 100000,
      financialYear: '2024-25',
    };

    const result = validateIncomeInput(input);
    expect(result.isValid).toBe(true);
  });

  it('should collect all errors', () => {
    const input = {
      salary: -100,
      otherIncome: 'invalid',
      financialYear: 'invalid-year',
    };

    const result = validateIncomeInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should reject invalid input objects', () => {
    const result = validateIncomeInput(null);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid input object');
  });
});

describe('validateIncomeField', () => {
  it('should validate salary field', () => {
    const result = validateIncomeField('salary', 100000);
    expect(result.isValid).toBe(true);
  });

  it('should validate otherIncome field', () => {
    const result = validateIncomeField('otherIncome', 50000);
    expect(result.isValid).toBe(true);
  });

  it('should reject negative salary', () => {
    const result = validateIncomeField('salary', -100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Salary');
  });

  it('should reject negative other income', () => {
    const result = validateIncomeField('otherIncome', -100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Other income');
  });
});

describe('validateFormSubmission', () => {
  it('should accept valid form data', () => {
    const formData = {
      salary: '500000',
      otherIncome: '50000',
      financialYear: '2024-25',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(true);
    expect(result.errors.salary).toBeNull();
    expect(result.errors.otherIncome).toBeNull();
    expect(result.errors.financialYear).toBeNull();
  });

  it('should organize errors by field', () => {
    const formData = {
      salary: '-100',
      otherIncome: 'invalid',
      financialYear: '2020-21',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.salary).toBeTruthy();
    expect(result.errors.otherIncome).toBeTruthy();
    expect(result.errors.financialYear).toBeTruthy();
  });

  it('should add general errors array', () => {
    const formData = {
      salary: '0',
      otherIncome: '0',
      financialYear: '2024-25',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.general).toContain('At least one income value must be greater than zero');
  });

  it('should handle string and numeric inputs', () => {
    const formData = {
      salary: '500000',
      otherIncome: 50000,
      financialYear: '2024-25',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid form data object', () => {
    const result = validateFormSubmission(null);
    expect(result.isValid).toBe(false);
  });

  it('should handle boundary values', () => {
    const formData = {
      salary: '250000',
      otherIncome: '0',
      financialYear: '2024-25',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(true);
  });

  it('should handle high income values', () => {
    const formData = {
      salary: '5000000',
      otherIncome: '1000000',
      financialYear: '2024-25',
    };

    const result = validateFormSubmission(formData);
    expect(result.isValid).toBe(true);
  });
});

describe('Comprehensive income validation scenarios', () => {
  it('should validate no tax scenario (below exemption)', () => {
    const input = {
      salary: 200000,
      otherIncome: 0,
      financialYear: '2024-25',
    };

    expect(validateIncomeInput(input).isValid).toBe(true);
  });

  it('should validate at tax slab boundary', () => {
    const input = {
      salary: 500000,
      otherIncome: 0,
      financialYear: '2024-25',
    };

    expect(validateIncomeInput(input).isValid).toBe(true);
  });

  it('should validate high income with surcharge', () => {
    const input = {
      salary: 5000000,
      otherIncome: 1000000,
      financialYear: '2024-25',
    };

    expect(validateIncomeInput(input).isValid).toBe(true);
  });

  it('should validate mixed income sources', () => {
    const input = {
      salary: 800000,
      otherIncome: 200000,
      financialYear: '2024-25',
    };

    expect(validateIncomeInput(input).isValid).toBe(true);
  });
});
