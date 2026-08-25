/**
 * @fileoverview Unit tests for deductions type module
 * TAX-010: All 12 deduction fields with regime-aware helpers
 */
import { describe, it, expect } from 'vitest';
import {
  createDeductions,
  getTotalChapterVIA,
  getTotalExemptions,
  getTotalDeductions,
  getOldRegimeDeductions,
  getNewRegimeDeductions,
  isValidDeductions,
} from '../../../../../src/domain/tax/types/deductions.js';

describe('Deductions Type', () => {
  describe('createDeductions', () => {
    it('should create deductions with default values', () => {
      const ded = createDeductions();

      expect(ded).toEqual({
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
    });

    it('should create deductions with provided values', () => {
      const ded = createDeductions({
        standardDeduction: 50000,
        section80C: 150000,
        section80D: 25000,
        hra: 100000,
      });

      expect(ded.standardDeduction).toBe(50000);
      expect(ded.section80C).toBe(150000);
      expect(ded.section80D).toBe(25000);
      expect(ded.hra).toBe(100000);
    });

    it('should handle partial input', () => {
      const ded = createDeductions({ section80C: 150000 });

      expect(ded.section80C).toBe(150000);
      expect(ded.standardDeduction).toBe(0);
      expect(ded.hra).toBe(0);
    });

    it('should throw error for non-finite values', () => {
      expect(() => createDeductions({ section80C: NaN })).toThrow();
    });

    it('should throw error for infinite values', () => {
      expect(() => createDeductions({ section80D: Infinity })).toThrow();
    });

    it('should throw error for negative values', () => {
      expect(() => createDeductions({ section80C: -50000 })).toThrow();
    });

    it('should return frozen object', () => {
      const ded = createDeductions({ section80C: 150000 });
      expect(Object.isFrozen(ded)).toBe(true);
    });
  });

  describe('getTotalChapterVIA', () => {
    it('should return sum of all Chapter VI-A deductions', () => {
      const ded = createDeductions({
        section80C: 150000,
        section80CCD1B: 50000,
        section80D: 25000,
        section80E: 40000,
        section80G: 10000,
        section80TTA: 10000,
        section80TTB: 0, // Mutually exclusive with 80TTA
      });

      // 150000 + 50000 + 25000 + 40000 + 10000 + 10000 + 0 = 285000
      expect(getTotalChapterVIA(ded)).toBe(285000);
    });

    it('should return 0 for default deductions', () => {
      const ded = createDeductions();
      expect(getTotalChapterVIA(ded)).toBe(0);
    });

    it('should only include Chapter VI-A sections', () => {
      const ded = createDeductions({
        standardDeduction: 50000, // Not Chapter VI-A
        section80C: 150000,       // Chapter VI-A
        hra: 100000,              // Not Chapter VI-A
        homeLoanInterest: 200000, // Not Chapter VI-A
      });

      expect(getTotalChapterVIA(ded)).toBe(150000);
    });

    it('should return 0 for null input', () => {
      expect(getTotalChapterVIA(null)).toBe(0);
    });
  });

  describe('getTotalExemptions', () => {
    it('should return sum of HRA and LTA', () => {
      const ded = createDeductions({
        hra: 100000,
        lta: 30000,
      });

      expect(getTotalExemptions(ded)).toBe(130000);
    });

    it('should return 0 for default deductions', () => {
      const ded = createDeductions();
      expect(getTotalExemptions(ded)).toBe(0);
    });

    it('should only include exemption fields', () => {
      const ded = createDeductions({
        standardDeduction: 50000,  // Not exemption
        section80C: 150000,        // Not exemption
        hra: 100000,               // Exemption
        lta: 30000,                // Exemption
      });

      expect(getTotalExemptions(ded)).toBe(130000);
    });

    it('should return 0 for null input', () => {
      expect(getTotalExemptions(null)).toBe(0);
    });
  });

  describe('getTotalDeductions', () => {
    it('should return sum of all deductions', () => {
      const ded = createDeductions({
        standardDeduction: 50000,
        section80C: 150000,
        section80CCD1B: 50000,
        section80D: 25000,
        section80E: 40000,
        section80G: 10000,
        section80TTA: 10000,
        section80TTB: 0,
        hra: 100000,
        lta: 30000,
        homeLoanInterest: 200000,
        otherDeductions: 15000,
      });

      const expected = 50000 + 150000 + 50000 + 25000 + 40000 + 10000 + 10000 + 0 + 100000 + 30000 + 200000 + 15000;
      expect(getTotalDeductions(ded)).toBe(expected);
    });

    it('should return 0 for default deductions', () => {
      const ded = createDeductions();
      expect(getTotalDeductions(ded)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getTotalDeductions(null)).toBe(0);
    });
  });

  describe('getOldRegimeDeductions', () => {
    it('should return Chapter VI-A + exemptions + home loan + other (excluding standard deduction)', () => {
      const ded = createDeductions({
        standardDeduction: 50000,  // Excluded (handled separately)
        section80C: 150000,
        section80D: 25000,
        hra: 100000,
        homeLoanInterest: 200000,
        otherDeductions: 10000,
      });

      // Chapter VI-A (150000 + 25000) + Exemptions (100000) + Home Loan (200000) + Other (10000) = 485000
      expect(getOldRegimeDeductions(ded)).toBe(485000);
    });

    it('should return 0 for null input', () => {
      expect(getOldRegimeDeductions(null)).toBe(0);
    });
  });

  describe('getNewRegimeDeductions', () => {
    it('should return only standard deduction for new regime', () => {
      const ded = createDeductions({
        standardDeduction: 75000,
        section80C: 150000,     // Not applicable in new regime
        section80D: 25000,      // Not applicable in new regime
        hra: 100000,            // Not applicable in new regime
        homeLoanInterest: 200000, // Not applicable in new regime
      });

      expect(getNewRegimeDeductions(ded)).toBe(75000);
    });

    it('should return 0 when no standard deduction', () => {
      const ded = createDeductions({
        section80C: 150000,
        section80D: 25000,
      });

      expect(getNewRegimeDeductions(ded)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getNewRegimeDeductions(null)).toBe(0);
    });
  });

  describe('isValidDeductions', () => {
    it('should return true for valid deductions', () => {
      const ded = createDeductions({
        standardDeduction: 50000,
        section80C: 150000,
        section80D: 25000,
      });

      expect(isValidDeductions(ded)).toBe(true);
    });

    it('should return true for default deductions', () => {
      const ded = createDeductions();
      expect(isValidDeductions(ded)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidDeductions(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidDeductions('invalid')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(isValidDeductions({
        standardDeduction: 'invalid',
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
      })).toBe(false);
    });

    it('should return false for negative values', () => {
      expect(isValidDeductions({
        standardDeduction: -50000,
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
      })).toBe(false);
    });

    it('should return false for missing properties', () => {
      expect(isValidDeductions({
        standardDeduction: 50000,
        // missing other fields
      })).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large deduction values', () => {
      const ded = createDeductions({
        section80C: 150000,
        section80D: 100000,
        hra: 500000,
        homeLoanInterest: 200000,
      });

      expect(getTotalDeductions(ded)).toBe(950000);
    });

    it('should handle all zeros', () => {
      const ded = createDeductions({
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

      expect(getTotalDeductions(ded)).toBe(0);
      expect(getTotalChapterVIA(ded)).toBe(0);
      expect(getTotalExemptions(ded)).toBe(0);
    });

    it('should handle floating point values', () => {
      const ded = createDeductions({
        section80C: 150000.50,
        section80D: 25000.25,
      });

      // Should work with floating point values
      expect(typeof getTotalDeductions(ded)).toBe('number');
      expect(getTotalChapterVIA(ded)).toBeCloseTo(175000.75);
    });
  });
});
