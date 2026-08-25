/**
 * @fileoverview Unit tests for deduction limits module
 * TAX-010: Statutory caps per deduction per financial year
 */
import { describe, it, expect } from 'vitest';
import {
  DEDUCTION_LIMITS_FY_2024_25,
  getStandardDeductionAmount,
  getDeductionLimit,
  applyDeductionCap,
  exceedsDeductionLimit,
} from '../../../../src/domain/rules/deduction-limits.js';

describe('Deduction Limits', () => {
  describe('DEDUCTION_LIMITS_FY_2024_25', () => {
    it('should define standard deduction limits by regime', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;

      expect(limits.standardDeduction.old).toBe(50000);
      expect(limits.standardDeduction.new).toBe(75000);
    });

    it('should define correct section 80C limit', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80C.maxLimit).toBe(150000);
    });

    it('should define correct section 80CCD1B limit', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80CCD1B.maxLimit).toBe(50000);
    });

    it('should define correct section 80D limits', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80D.self).toBe(25000);
      expect(limits.section80D.selfSenior).toBe(50000);
      expect(limits.section80D.maxLimit).toBe(100000);
    });

    it('should define correct section 80TTA limit', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80TTA.maxLimit).toBe(10000);
    });

    it('should define correct section 80TTB limit', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80TTB.maxLimit).toBe(50000);
    });

    it('should define correct home loan interest limit', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.homeLoanInterest.selfOccupied).toBe(200000);
      expect(limits.homeLoanInterest.maxLimit).toBe(200000);
    });

    it('should have no limit for education loan (80E)', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80E.maxLimit).toBe(Infinity);
    });

    it('should have no fixed limit for donations (80G)', () => {
      const limits = DEDUCTION_LIMITS_FY_2024_25;
      expect(limits.section80G.maxLimit).toBe(Infinity);
    });
  });

  describe('getStandardDeductionAmount', () => {
    it('should return ₹50,000 for old regime in FY 2024-25', () => {
      const amount = getStandardDeductionAmount('old', '2024-25');
      expect(amount).toBe(50000);
    });

    it('should return ₹75,000 for new regime in FY 2024-25', () => {
      const amount = getStandardDeductionAmount('new', '2024-25');
      expect(amount).toBe(75000);
    });

    it('should return ₹50,000 for compare mode (defaults to old)', () => {
      const amount = getStandardDeductionAmount('compare', '2024-25');
      expect(amount).toBe(50000);
    });

    it('should default to old regime amount for unknown regime', () => {
      const amount = getStandardDeductionAmount('unknown', '2024-25');
      expect(amount).toBe(50000);
    });

    it('should use default limits for unknown financial year', () => {
      const amount = getStandardDeductionAmount('old', 'unknown');
      expect(amount).toBe(50000);
    });
  });

  describe('getDeductionLimit', () => {
    it('should return correct limit for section80C', () => {
      const limit = getDeductionLimit('section80C', '2024-25');
      expect(limit).toBe(150000);
    });

    it('should return correct limit for section80CCD1B', () => {
      const limit = getDeductionLimit('section80CCD1B', '2024-25');
      expect(limit).toBe(50000);
    });

    it('should return correct limit for section80D', () => {
      const limit = getDeductionLimit('section80D', '2024-25');
      expect(limit).toBe(100000); // maxLimit
    });

    it('should return correct limit for section80TTA', () => {
      const limit = getDeductionLimit('section80TTA', '2024-25');
      expect(limit).toBe(10000);
    });

    it('should return correct limit for section80TTB', () => {
      const limit = getDeductionLimit('section80TTB', '2024-25');
      expect(limit).toBe(50000);
    });

    it('should return correct limit for homeLoanInterest', () => {
      const limit = getDeductionLimit('homeLoanInterest', '2024-25');
      expect(limit).toBe(200000);
    });

    it('should return Infinity for unlimited deductions (section80E)', () => {
      const limit = getDeductionLimit('section80E', '2024-25');
      expect(limit).toBe(Infinity);
    });

    it('should return Infinity for unlimited deductions (section80G)', () => {
      const limit = getDeductionLimit('section80G', '2024-25');
      expect(limit).toBe(Infinity);
    });

    it('should return Infinity for HRA (calculated, not fixed)', () => {
      const limit = getDeductionLimit('hra', '2024-25');
      expect(limit).toBe(Infinity);
    });

    it('should return Infinity for LTA (calculated, not fixed)', () => {
      const limit = getDeductionLimit('lta', '2024-25');
      expect(limit).toBe(Infinity);
    });

    it('should return Infinity for unknown deduction field', () => {
      const limit = getDeductionLimit('unknownField', '2024-25');
      expect(limit).toBe(Infinity);
    });
  });

  describe('applyDeductionCap', () => {
    it('should cap section80C at ₹1,50,000', () => {
      const capped = applyDeductionCap('section80C', 200000, '2024-25');
      expect(capped).toBe(150000);
    });

    it('should return original value if under limit', () => {
      const capped = applyDeductionCap('section80C', 100000, '2024-25');
      expect(capped).toBe(100000);
    });

    it('should return original value if at limit', () => {
      const capped = applyDeductionCap('section80C', 150000, '2024-25');
      expect(capped).toBe(150000);
    });

    it('should cap section80CCD1B at ₹50,000', () => {
      const capped = applyDeductionCap('section80CCD1B', 75000, '2024-25');
      expect(capped).toBe(50000);
    });

    it('should cap section80D at max limit (₹1,00,000)', () => {
      const capped = applyDeductionCap('section80D', 150000, '2024-25');
      expect(capped).toBe(100000);
    });

    it('should cap section80TTA at ₹10,000', () => {
      const capped = applyDeductionCap('section80TTA', 20000, '2024-25');
      expect(capped).toBe(10000);
    });

    it('should cap section80TTB at ₹50,000', () => {
      const capped = applyDeductionCap('section80TTB', 75000, '2024-25');
      expect(capped).toBe(50000);
    });

    it('should cap homeLoanInterest at ₹2,00,000', () => {
      const capped = applyDeductionCap('homeLoanInterest', 300000, '2024-25');
      expect(capped).toBe(200000);
    });

    it('should not cap section80E (unlimited)', () => {
      const capped = applyDeductionCap('section80E', 500000, '2024-25');
      expect(capped).toBe(500000);
    });

    it('should not cap section80G (unlimited)', () => {
      const capped = applyDeductionCap('section80G', 1000000, '2024-25');
      expect(capped).toBe(1000000);
    });

    it('should not cap HRA (calculated separately)', () => {
      const capped = applyDeductionCap('hra', 500000, '2024-25');
      expect(capped).toBe(500000);
    });

    it('should handle zero value', () => {
      const capped = applyDeductionCap('section80C', 0, '2024-25');
      expect(capped).toBe(0);
    });

    it('should handle negative value by returning 0', () => {
      const capped = applyDeductionCap('section80C', -50000, '2024-25');
      expect(capped).toBe(0);
    });
  });

  describe('exceedsDeductionLimit', () => {
    it('should return true when section80C exceeds limit', () => {
      const exceeds = exceedsDeductionLimit('section80C', 200000, '2024-25');
      expect(exceeds).toBe(true);
    });

    it('should return false when section80C is under limit', () => {
      const exceeds = exceedsDeductionLimit('section80C', 100000, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return false when section80C equals limit', () => {
      const exceeds = exceedsDeductionLimit('section80C', 150000, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return true when section80D exceeds max limit', () => {
      const exceeds = exceedsDeductionLimit('section80D', 150000, '2024-25');
      expect(exceeds).toBe(true);
    });

    it('should return false for unlimited deductions (section80E)', () => {
      const exceeds = exceedsDeductionLimit('section80E', 1000000, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return false for unlimited deductions (section80G)', () => {
      const exceeds = exceedsDeductionLimit('section80G', 5000000, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return false for calculated deductions (HRA)', () => {
      const exceeds = exceedsDeductionLimit('hra', 1000000, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return false for zero value', () => {
      const exceeds = exceedsDeductionLimit('section80C', 0, '2024-25');
      expect(exceeds).toBe(false);
    });

    it('should return false for unknown deduction field', () => {
      const exceeds = exceedsDeductionLimit('unknownField', 1000000, '2024-25');
      expect(exceeds).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle NaN values', () => {
      const capped = applyDeductionCap('section80C', NaN, '2024-25');
      expect(capped).toBe(0);
    });

    it('should handle null values', () => {
      const capped = applyDeductionCap('section80C', null, '2024-25');
      expect(capped).toBe(0);
    });

    it('should handle undefined values', () => {
      const capped = applyDeductionCap('section80C', undefined, '2024-25');
      expect(capped).toBe(0);
    });

    it('should handle very large values', () => {
      const capped = applyDeductionCap('section80C', 100000000, '2024-25');
      expect(capped).toBe(150000);
    });
  });
});
