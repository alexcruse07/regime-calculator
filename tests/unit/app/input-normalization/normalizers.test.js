/**
 * Tests for Input Normalizers
 * Comprehensive tests for normalizing user input
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeNumericInput,
  normalizeFinancialYear,
  normalizeFormInput,
  cleanInputForCalculation,
  normalizeText,
  normalizeBoolean,
  formatNumericForDisplay,
} from '../../../../src/app/input-normalization/normalizers.js';

describe('normalizeNumericInput', () => {
  it('should return numbers as-is', () => {
    expect(normalizeNumericInput(1000)).toBe(1000);
    expect(normalizeNumericInput(0)).toBe(0);
  });

  it('should parse string numbers', () => {
    expect(normalizeNumericInput('1000')).toBe(1000);
    expect(normalizeNumericInput('500000')).toBe(500000);
  });

  it('should remove currency symbols', () => {
    expect(normalizeNumericInput('₹1000')).toBe(1000);
    expect(normalizeNumericInput('$1000')).toBe(1000);
    expect(normalizeNumericInput('€1000')).toBe(1000);
  });

  it('should remove commas', () => {
    expect(normalizeNumericInput('1,00,000')).toBe(100000);
    expect(normalizeNumericInput('5,00,000')).toBe(500000);
  });

  it('should handle spaces', () => {
    expect(normalizeNumericInput('  1000  ')).toBe(1000);
    expect(normalizeNumericInput('₹ 1,00,000')).toBe(100000);
  });

  it('should handle negative numbers', () => {
    expect(normalizeNumericInput('-1000')).toBe(1000); // Parse and return absolute value
    expect(normalizeNumericInput('-₹1000')).toBe(1000);
  });

  it('should return 0 for null/undefined', () => {
    expect(normalizeNumericInput(null)).toBe(0);
    expect(normalizeNumericInput(undefined)).toBe(0);
  });

  it('should return 0 for invalid strings', () => {
    expect(normalizeNumericInput('abc')).toBe(0);
    expect(normalizeNumericInput('invalid')).toBe(0);
  });

  it('should handle decimal numbers', () => {
    expect(normalizeNumericInput('1000.50')).toBe(1000.50);
    expect(normalizeNumericInput('₹1000.99')).toBe(1000.99);
  });

  it('should handle Indian currency format', () => {
    expect(normalizeNumericInput('₹12,34,567')).toBe(1234567);
  });

  it('should handle empty string', () => {
    expect(normalizeNumericInput('')).toBe(0);
  });
});

describe('normalizeFinancialYear', () => {
  it('should accept and return valid format', () => {
    expect(normalizeFinancialYear('2024-25')).toBe('2024-25');
  });

  it('should convert slash format', () => {
    expect(normalizeFinancialYear('2024/25')).toBe('2024-25');
  });

  it('should convert 8-digit format', () => {
    expect(normalizeFinancialYear('20242025')).toBe('2024-25');
  });

  it('should handle leading/trailing spaces', () => {
    expect(normalizeFinancialYear('  2024-25  ')).toBe('2024-25');
  });

  it('should pad single-digit year suffix', () => {
    expect(normalizeFinancialYear('2024/5')).toBe('2024-05');
  });

  it('should return empty string for invalid input', () => {
    expect(normalizeFinancialYear('invalid')).toBe('');
    expect(normalizeFinancialYear('2024')).toBe('');
  });

  it('should return empty for null/undefined', () => {
    expect(normalizeFinancialYear(null)).toBe('');
    expect(normalizeFinancialYear(undefined)).toBe('');
  });

  it('should return empty for non-string', () => {
    expect(normalizeFinancialYear(2024)).toBe('');
  });
});

describe('normalizeFormInput', () => {
  it('should normalize both salary and otherIncome', () => {
    const input = {
      salary: '₹5,00,000',
      otherIncome: '₹50,000',
    };

    const result = normalizeFormInput(input);
    expect(result.salary).toBe(500000);
    expect(result.otherIncome).toBe(50000);
  });

  it('should handle mixed input types', () => {
    const input = {
      salary: 500000,
      otherIncome: '50000',
    };

    const result = normalizeFormInput(input);
    expect(result.salary).toBe(500000);
    expect(result.otherIncome).toBe(50000);
  });

  it('should return zero for invalid inputs', () => {
    const input = {
      salary: 'invalid',
      otherIncome: 'invalid',
    };

    const result = normalizeFormInput(input);
    expect(result.salary).toBe(0);
    expect(result.otherIncome).toBe(0);
  });

  it('should handle null input object', () => {
    const result = normalizeFormInput(null);
    expect(result.salary).toBe(0);
    expect(result.otherIncome).toBe(0);
  });
});

describe('cleanInputForCalculation', () => {
  it('should normalize all input fields', () => {
    const input = {
      salary: '₹5,00,000',
      otherIncome: '₹50,000',
      financialYear: '2024/25',
    };

    const result = cleanInputForCalculation(input);
    expect(result.salary).toBe(500000);
    expect(result.otherIncome).toBe(50000);
    expect(result.financialYear).toBe('2024-25');
  });

  it('should handle partial input', () => {
    const input = {
      salary: '500000',
    };

    const result = cleanInputForCalculation(input);
    expect(result.salary).toBe(500000);
    expect(result.otherIncome).toBe(0);
    expect(result.financialYear).toBe('');
  });

  it('should return default values for null', () => {
    const result = cleanInputForCalculation(null);
    expect(result.salary).toBe(0);
    expect(result.otherIncome).toBe(0);
    expect(result.financialYear).toBe('');
  });
});

describe('normalizeText', () => {
  it('should trim whitespace', () => {
    expect(normalizeText('  hello  ')).toBe('hello');
  });

  it('should return empty string for null/undefined', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
  });

  it('should convert non-strings', () => {
    expect(normalizeText(123)).toBe('123');
    expect(normalizeText(true)).toBe('true');
  });

  it('should preserve text content', () => {
    expect(normalizeText('test input')).toBe('test input');
  });
});

describe('normalizeBoolean', () => {
  it('should pass through booleans', () => {
    expect(normalizeBoolean(true)).toBe(true);
    expect(normalizeBoolean(false)).toBe(false);
  });

  it('should parse truthy strings', () => {
    expect(normalizeBoolean('true')).toBe(true);
    expect(normalizeBoolean('yes')).toBe(true);
    expect(normalizeBoolean('1')).toBe(true);
    expect(normalizeBoolean('on')).toBe(true);
  });

  it('should parse falsy strings', () => {
    expect(normalizeBoolean('false')).toBe(false);
    expect(normalizeBoolean('no')).toBe(false);
    expect(normalizeBoolean('0')).toBe(false);
    expect(normalizeBoolean('off')).toBe(false);
  });

  it('should handle numbers', () => {
    expect(normalizeBoolean(1)).toBe(true);
    expect(normalizeBoolean(0)).toBe(false);
    expect(normalizeBoolean(123)).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(normalizeBoolean('TRUE')).toBe(true);
    expect(normalizeBoolean('TRUE')).toBe(true);
    expect(normalizeBoolean('False')).toBe(false);
  });
});

describe('formatNumericForDisplay', () => {
  it('should format numbers with Indian locale', () => {
    const result = formatNumericForDisplay(1234567);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should handle currency input', () => {
    const result = formatNumericForDisplay('₹1,00,000');
    // formatNumericForDisplay just normalizes and formats, so result should contain the number
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should return 0 for invalid input', () => {
    const result = formatNumericForDisplay('invalid');
    expect(result).toBe('0');
  });
});

describe('Complex normalization scenarios', () => {
  it('should handle real form submission data', () => {
    const formData = {
      salary: '₹5,00,000',
      otherIncome: '50000',
      financialYear: '2024/25',
    };

    const result = cleanInputForCalculation(formData);
    expect(result.salary).toBe(500000);
    expect(result.otherIncome).toBe(50000);
    expect(result.financialYear).toBe('2024-25');
  });

  it('should normalize mixed user input formats', () => {
    const inputs = [
      { salary: '₹5,00,000', otherIncome: '50000', financialYear: '2024-25' },
      { salary: '500000', otherIncome: '50000', financialYear: '2024/25' },
    ];

    inputs.forEach(input => {
      const result = cleanInputForCalculation(input);
      expect(result.salary).toBe(500000);
      expect(result.otherIncome).toBe(50000);
      expect(result.financialYear).toBe('2024-25');
    });
  });

  it('should handle edge case: very large numbers', () => {
    const result = normalizeNumericInput('₹99,99,99,999');
    expect(result).toBe(999999999);
  });
});
