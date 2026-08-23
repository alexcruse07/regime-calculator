/**
 * @fileoverview Unit tests for other income type module
 * TAX-010: Expanded other income categories
 */
import { describe, it, expect } from 'vitest';
import {
  createOtherIncome,
  getTotalOtherIncome,
  isValidOtherIncome,
  fromLegacyOtherIncome,
} from '../../../../../src/domain/tax/types/other-income.js';

describe('Other Income Type', () => {
  describe('createOtherIncome', () => {
    it('should create other income with default values', () => {
      const oi = createOtherIncome();

      expect(oi).toEqual({
        interestIncome: 0,
        dividendIncome: 0,
        otherTaxable: 0,
      });
    });

    it('should create other income with provided values', () => {
      const oi = createOtherIncome({
        interestIncome: 50000,
        dividendIncome: 30000,
        otherTaxable: 20000,
      });

      expect(oi.interestIncome).toBe(50000);
      expect(oi.dividendIncome).toBe(30000);
      expect(oi.otherTaxable).toBe(20000);
    });

    it('should handle partial input', () => {
      const oi = createOtherIncome({ interestIncome: 50000 });

      expect(oi.interestIncome).toBe(50000);
      expect(oi.dividendIncome).toBe(0);
      expect(oi.otherTaxable).toBe(0);
    });

    it('should throw error for non-finite interestIncome', () => {
      expect(() => createOtherIncome({ interestIncome: NaN })).toThrow();
    });

    it('should throw error for non-finite dividendIncome', () => {
      expect(() => createOtherIncome({ dividendIncome: Infinity })).toThrow();
    });

    it('should throw error for non-finite otherTaxable', () => {
      expect(() => createOtherIncome({ otherTaxable: NaN })).toThrow();
    });

    it('should throw error for negative interestIncome', () => {
      expect(() => createOtherIncome({ interestIncome: -5000 })).toThrow();
    });

    it('should throw error for negative dividendIncome', () => {
      expect(() => createOtherIncome({ dividendIncome: -5000 })).toThrow();
    });

    it('should return frozen object', () => {
      const oi = createOtherIncome({ interestIncome: 50000 });
      expect(Object.isFrozen(oi)).toBe(true);
    });
  });

  describe('getTotalOtherIncome', () => {
    it('should return sum of all other income categories', () => {
      const oi = createOtherIncome({
        interestIncome: 50000,
        dividendIncome: 30000,
        otherTaxable: 20000,
      });

      expect(getTotalOtherIncome(oi)).toBe(100000);
    });

    it('should return 0 for default other income', () => {
      const oi = createOtherIncome();
      expect(getTotalOtherIncome(oi)).toBe(0);
    });

    it('should handle single category', () => {
      const oi = createOtherIncome({ interestIncome: 50000 });
      expect(getTotalOtherIncome(oi)).toBe(50000);
    });

    it('should return 0 for null input', () => {
      expect(getTotalOtherIncome(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(getTotalOtherIncome(undefined)).toBe(0);
    });
  });

  describe('isValidOtherIncome', () => {
    it('should return true for valid other income', () => {
      const oi = createOtherIncome({
        interestIncome: 50000,
        dividendIncome: 30000,
        otherTaxable: 20000,
      });

      expect(isValidOtherIncome(oi)).toBe(true);
    });

    it('should return true for default other income', () => {
      const oi = createOtherIncome();
      expect(isValidOtherIncome(oi)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidOtherIncome(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidOtherIncome('invalid')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(isValidOtherIncome({
        interestIncome: 'invalid',
        dividendIncome: 0,
        otherTaxable: 0,
      })).toBe(false);
    });

    it('should return false for negative values', () => {
      expect(isValidOtherIncome({
        interestIncome: -5000,
        dividendIncome: 0,
        otherTaxable: 0,
      })).toBe(false);
    });

    it('should return false for missing properties', () => {
      expect(isValidOtherIncome({
        interestIncome: 50000,
        // missing dividendIncome and otherTaxable
      })).toBe(false);
    });
  });

  describe('fromLegacyOtherIncome', () => {
    it('should convert legacy single value to otherTaxable', () => {
      const oi = fromLegacyOtherIncome(100000);

      expect(oi.interestIncome).toBe(0);
      expect(oi.dividendIncome).toBe(0);
      expect(oi.otherTaxable).toBe(100000);
    });

    it('should convert legacy 0 value', () => {
      const oi = fromLegacyOtherIncome(0);
      expect(getTotalOtherIncome(oi)).toBe(0);
    });

    it('should default negative value to 0', () => {
      const oi = fromLegacyOtherIncome(-50000);
      expect(oi.otherTaxable).toBe(0);
    });

    it('should default NaN to 0', () => {
      const oi = fromLegacyOtherIncome(NaN);
      expect(oi.otherTaxable).toBe(0);
    });

    it('should default null to 0', () => {
      const oi = fromLegacyOtherIncome(null);
      expect(getTotalOtherIncome(oi)).toBe(0);
    });

    it('should default undefined to 0', () => {
      const oi = fromLegacyOtherIncome(undefined);
      expect(getTotalOtherIncome(oi)).toBe(0);
    });
  });
});
