/**
 * Tests for Formatting Utilities
 * Comprehensive tests for Indian currency and number formatting
 */

import { describe, it, expect } from 'vitest';
import {
  formatIndianCurrency,
  parseIndianCurrency,
  formatNumber,
  formatPercentage,
} from '../../../../src/shared/formatting/formatters.js';

describe('formatIndianCurrency', () => {
  it('should format zero correctly', () => {
    expect(formatIndianCurrency(0)).toBe('₹0');
  });

  it('should format small positive numbers', () => {
    expect(formatIndianCurrency(100)).toBe('₹100');
    expect(formatIndianCurrency(999)).toBe('₹999');
  });

  it('should format numbers with Indian comma format', () => {
    expect(formatIndianCurrency(1000)).toBe('₹1,000');
    expect(formatIndianCurrency(10000)).toBe('₹10,000');
    expect(formatIndianCurrency(100000)).toBe('₹1,00,000');
    expect(formatIndianCurrency(1000000)).toBe('₹10,00,000');
    expect(formatIndianCurrency(10000000)).toBe('₹1,00,00,000');
  });

  it('should format exactly 5 lakh correctly', () => {
    expect(formatIndianCurrency(500000)).toBe('₹5,00,000');
  });

  it('should handle numbers just below and above 5 lakh', () => {
    expect(formatIndianCurrency(499999)).toBe('₹4,99,999');
    expect(formatIndianCurrency(500001)).toBe('₹5,00,001');
  });

  it('should handle high income values', () => {
    expect(formatIndianCurrency(12345678)).toBe('₹1,23,45,678');
  });

  it('should format negative numbers', () => {
    expect(formatIndianCurrency(-100000)).toBe('-₹1,00,000');
    expect(formatIndianCurrency(-500000)).toBe('-₹5,00,000');
  });

  it('should format decimal values', () => {
    expect(formatIndianCurrency(1000.5)).toContain('₹1,000.5');
    expect(formatIndianCurrency(100000.99)).toContain('₹1,00,000.99');
  });

  it('should throw error for non-number input', () => {
    expect(() => formatIndianCurrency('string')).toThrow();
    expect(() => formatIndianCurrency(null)).toThrow();
    expect(() => formatIndianCurrency(undefined)).toThrow();
  });

  it('should throw error for non-finite numbers', () => {
    expect(() => formatIndianCurrency(Infinity)).toThrow();
    expect(() => formatIndianCurrency(NaN)).toThrow();
  });
});

describe('parseIndianCurrency', () => {
  it('should parse zero correctly', () => {
    expect(parseIndianCurrency('₹0')).toBe(0);
  });

  it('should parse simple amounts', () => {
    expect(parseIndianCurrency('₹100')).toBe(100);
    expect(parseIndianCurrency('₹1000')).toBe(1000);
  });

  it('should parse amounts with Indian comma format', () => {
    expect(parseIndianCurrency('₹1,00,000')).toBe(100000);
    expect(parseIndianCurrency('₹5,00,000')).toBe(500000);
    expect(parseIndianCurrency('₹10,00,000')).toBe(1000000);
  });

  it('should handle strings without currency symbol', () => {
    expect(parseIndianCurrency('100000')).toBe(100000);
    expect(parseIndianCurrency('5,00,000')).toBe(500000);
  });

  it('should handle negative values', () => {
    expect(parseIndianCurrency('-₹100000')).toBe(-100000);
    expect(parseIndianCurrency('-₹5,00,000')).toBe(-500000);
  });

  it('should handle decimal values', () => {
    expect(parseIndianCurrency('₹1000.50')).toBe(1000.50);
  });

  it('should handle whitespace', () => {
    expect(parseIndianCurrency('  ₹100000  ')).toBe(100000);
    expect(parseIndianCurrency(' ₹5,00,000 ')).toBe(500000);
  });

  it('should throw error for non-string input', () => {
    expect(() => parseIndianCurrency(123)).toThrow();
    expect(() => parseIndianCurrency(null)).toThrow();
    expect(() => parseIndianCurrency(undefined)).toThrow();
  });

  it('should throw error for invalid format', () => {
    expect(() => parseIndianCurrency('not a number')).toThrow();
    expect(() => parseIndianCurrency('₹abc')).toThrow();
  });
});

describe('Round-trip currency conversion', () => {
  it('should format and parse correctly', () => {
    const values = [0, 100, 1000, 100000, 500000, 1000000, 12345678];

    values.forEach(value => {
      const formatted = formatIndianCurrency(value);
      const parsed = parseIndianCurrency(formatted);
      expect(parsed).toBe(value);
    });
  });

  it('should handle round-trip with negative values', () => {
    const value = -500000;
    const formatted = formatIndianCurrency(value);
    const parsed = parseIndianCurrency(formatted);
    expect(parsed).toBe(value);
  });
});

describe('formatNumber', () => {
  it('should format zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should format positive numbers', () => {
    const result = formatNumber(1234567);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should format with decimals', () => {
    const result = formatNumber(1234.567, 2);
    // This uses toLocaleString which adds commas in Indian locale
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should round to specified decimals', () => {
    const result1 = formatNumber(1.234, 2);
    expect(result1).toContain('1.23');
    const result2 = formatNumber(1.567, 1);
    expect(result2).toContain('1.6');
  });

  it('should throw for non-number', () => {
    expect(() => formatNumber('string')).toThrow();
    expect(() => formatNumber(NaN)).toThrow();
  });
});

describe('formatPercentage', () => {
  it('should format zero percent', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('should format positive percentages', () => {
    expect(formatPercentage(50)).toBe('50.00%');
    expect(formatPercentage(100)).toBe('100.00%');
  });

  it('should format with custom decimal places', () => {
    expect(formatPercentage(33.333, 0)).toBe('33%');
    expect(formatPercentage(33.333, 2)).toBe('33.33%');
  });

  it('should throw for non-number input', () => {
    expect(() => formatPercentage('50')).toThrow();
    expect(() => formatPercentage(NaN)).toThrow();
  });
});
