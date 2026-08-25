/**
 * @fileoverview Unit tests for speculative income type module
 * TAX-010: Speculative and F&O trading income support
 */
import { describe, it, expect } from 'vitest';
import {
  createSpeculativeIncome,
  createFnoIncome,
  createTradingIncome,
  getNetSpeculativeIncome,
  getNetFnoIncome,
  getTotalNetTradingIncome,
  isValidSpeculativeIncome,
  isValidFnoIncome,
} from '../../../../../src/domain/tax/types/speculative-income.js';

describe('Speculative Income Type', () => {
  describe('createSpeculativeIncome', () => {
    it('should create speculative income with default values', () => {
      const spec = createSpeculativeIncome();

      expect(spec).toEqual({
        gains: 0,
        losses: 0,
      });
    });

    it('should create speculative income with provided values', () => {
      const spec = createSpeculativeIncome({
        gains: 50000,
        losses: 20000,
      });

      expect(spec.gains).toBe(50000);
      expect(spec.losses).toBe(20000);
    });

    it('should handle partial input', () => {
      const spec = createSpeculativeIncome({ gains: 50000 });

      expect(spec.gains).toBe(50000);
      expect(spec.losses).toBe(0);
    });

    it('should throw error for non-finite gains', () => {
      expect(() => createSpeculativeIncome({ gains: NaN })).toThrow();
    });

    it('should throw error for non-finite losses', () => {
      expect(() => createSpeculativeIncome({ losses: Infinity })).toThrow();
    });

    it('should throw error for negative gains', () => {
      expect(() => createSpeculativeIncome({ gains: -5000 })).toThrow();
    });

    it('should throw error for negative losses', () => {
      expect(() => createSpeculativeIncome({ losses: -5000 })).toThrow();
    });

    it('should return frozen object', () => {
      const spec = createSpeculativeIncome({ gains: 50000 });
      expect(Object.isFrozen(spec)).toBe(true);
    });
  });

  describe('createFnoIncome', () => {
    it('should create F&O income with default values', () => {
      const fno = createFnoIncome();

      expect(fno).toEqual({
        gains: 0,
        losses: 0,
      });
    });

    it('should create F&O income with provided values', () => {
      const fno = createFnoIncome({
        gains: 100000,
        losses: 30000,
      });

      expect(fno.gains).toBe(100000);
      expect(fno.losses).toBe(30000);
    });

    it('should handle partial input', () => {
      const fno = createFnoIncome({ losses: 30000 });

      expect(fno.gains).toBe(0);
      expect(fno.losses).toBe(30000);
    });

    it('should throw error for non-finite values', () => {
      expect(() => createFnoIncome({ gains: NaN })).toThrow();
    });

    it('should throw error for negative values', () => {
      expect(() => createFnoIncome({ gains: -5000 })).toThrow();
    });
  });

  describe('createTradingIncome', () => {
    it('should create trading income with default values', () => {
      const trading = createTradingIncome();

      expect(trading.speculative).toEqual({ gains: 0, losses: 0 });
      expect(trading.fno).toEqual({ gains: 0, losses: 0 });
    });

    it('should create trading income with provided values', () => {
      const trading = createTradingIncome({
        speculative: { gains: 50000, losses: 20000 },
        fno: { gains: 100000, losses: 30000 },
      });

      expect(trading.speculative.gains).toBe(50000);
      expect(trading.speculative.losses).toBe(20000);
      expect(trading.fno.gains).toBe(100000);
      expect(trading.fno.losses).toBe(30000);
    });

    it('should handle partial nested input', () => {
      const trading = createTradingIncome({
        speculative: { gains: 50000 },
      });

      expect(trading.speculative.gains).toBe(50000);
      expect(trading.speculative.losses).toBe(0);
      expect(trading.fno.gains).toBe(0);
      expect(trading.fno.losses).toBe(0);
    });
  });

  describe('getNetSpeculativeIncome', () => {
    it('should return gains minus losses', () => {
      const spec = createSpeculativeIncome({
        gains: 50000,
        losses: 20000,
      });

      expect(getNetSpeculativeIncome(spec)).toBe(30000);
    });

    it('should return 0 for default speculative income', () => {
      const spec = createSpeculativeIncome();
      expect(getNetSpeculativeIncome(spec)).toBe(0);
    });

    it('should return negative when losses exceed gains', () => {
      const spec = createSpeculativeIncome({
        gains: 20000,
        losses: 50000,
      });

      expect(getNetSpeculativeIncome(spec)).toBe(-30000);
    });

    it('should return 0 when gains equal losses', () => {
      const spec = createSpeculativeIncome({
        gains: 50000,
        losses: 50000,
      });

      expect(getNetSpeculativeIncome(spec)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getNetSpeculativeIncome(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(getNetSpeculativeIncome(undefined)).toBe(0);
    });
  });

  describe('getNetFnoIncome', () => {
    it('should return gains minus losses', () => {
      const fno = createFnoIncome({
        gains: 100000,
        losses: 30000,
      });

      expect(getNetFnoIncome(fno)).toBe(70000);
    });

    it('should return 0 for default F&O income', () => {
      const fno = createFnoIncome();
      expect(getNetFnoIncome(fno)).toBe(0);
    });

    it('should return negative when losses exceed gains', () => {
      const fno = createFnoIncome({
        gains: 30000,
        losses: 100000,
      });

      expect(getNetFnoIncome(fno)).toBe(-70000);
    });

    it('should return 0 for null input', () => {
      expect(getNetFnoIncome(null)).toBe(0);
    });
  });

  describe('getTotalNetTradingIncome', () => {
    it('should return sum of net speculative and net F&O income', () => {
      const trading = createTradingIncome({
        speculative: { gains: 50000, losses: 20000 },
        fno: { gains: 100000, losses: 30000 },
      });

      // Net speculative: 30000, Net F&O: 70000
      expect(getTotalNetTradingIncome(trading)).toBe(100000);
    });

    it('should return 0 for default trading income', () => {
      const trading = createTradingIncome();
      expect(getTotalNetTradingIncome(trading)).toBe(0);
    });

    it('should handle net losses in one category', () => {
      const trading = createTradingIncome({
        speculative: { gains: 20000, losses: 50000 }, // Net: -30000
        fno: { gains: 100000, losses: 30000 },        // Net: 70000
      });

      expect(getTotalNetTradingIncome(trading)).toBe(40000);
    });

    it('should handle net losses in both categories', () => {
      const trading = createTradingIncome({
        speculative: { gains: 20000, losses: 50000 }, // Net: -30000
        fno: { gains: 30000, losses: 100000 },        // Net: -70000
      });

      expect(getTotalNetTradingIncome(trading)).toBe(-100000);
    });

    it('should return 0 for null input', () => {
      expect(getTotalNetTradingIncome(null)).toBe(0);
    });
  });

  describe('isValidSpeculativeIncome', () => {
    it('should return true for valid speculative income', () => {
      const spec = createSpeculativeIncome({
        gains: 50000,
        losses: 20000,
      });

      expect(isValidSpeculativeIncome(spec)).toBe(true);
    });

    it('should return true for default speculative income', () => {
      const spec = createSpeculativeIncome();
      expect(isValidSpeculativeIncome(spec)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidSpeculativeIncome(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidSpeculativeIncome('invalid')).toBe(false);
    });

    it('should return false for invalid gains', () => {
      expect(isValidSpeculativeIncome({ gains: NaN, losses: 0 })).toBe(false);
    });

    it('should return false for negative values', () => {
      expect(isValidSpeculativeIncome({ gains: -5000, losses: 0 })).toBe(false);
    });
  });

  describe('isValidFnoIncome', () => {
    it('should return true for valid F&O income', () => {
      const fno = createFnoIncome({
        gains: 100000,
        losses: 30000,
      });

      expect(isValidFnoIncome(fno)).toBe(true);
    });

    it('should return true for default F&O income', () => {
      const fno = createFnoIncome();
      expect(isValidFnoIncome(fno)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidFnoIncome(null)).toBe(false);
    });

    it('should return false for invalid values', () => {
      expect(isValidFnoIncome({ gains: 'invalid', losses: 0 })).toBe(false);
    });
  });
});
