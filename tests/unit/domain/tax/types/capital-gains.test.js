/**
 * @fileoverview Unit tests for capital gains type module
 * TAX-010: Granular STCG/LTCG support
 */
import { describe, it, expect } from 'vitest';
import {
  createCapitalGains,
  getTotalSTCG,
  getTotalLTCG,
  getTotalCapitalGains,
  isValidCapitalGains,
  fromLegacyCapitalGains,
} from '../../../../../src/domain/tax/types/capital-gains.js';

describe('Capital Gains Type', () => {
  describe('createCapitalGains', () => {
    it('should create capital gains with default values', () => {
      const cg = createCapitalGains();

      expect(cg).toEqual({
        stcgEquity: 0,
        stcgOther: 0,
        ltcgEquity: 0,
        ltcgOther: 0,
      });
    });

    it('should create capital gains with provided values', () => {
      const cg = createCapitalGains({
        stcgEquity: 50000,
        stcgOther: 30000,
        ltcgEquity: 200000,
        ltcgOther: 100000,
      });

      expect(cg.stcgEquity).toBe(50000);
      expect(cg.stcgOther).toBe(30000);
      expect(cg.ltcgEquity).toBe(200000);
      expect(cg.ltcgOther).toBe(100000);
    });

    it('should handle partial input', () => {
      const cg = createCapitalGains({ stcgEquity: 50000 });

      expect(cg.stcgEquity).toBe(50000);
      expect(cg.stcgOther).toBe(0);
      expect(cg.ltcgEquity).toBe(0);
      expect(cg.ltcgOther).toBe(0);
    });

    it('should throw error for non-finite stcgEquity', () => {
      expect(() => createCapitalGains({ stcgEquity: NaN })).toThrow();
    });

    it('should throw error for non-finite stcgOther', () => {
      expect(() => createCapitalGains({ stcgOther: Infinity })).toThrow();
    });

    it('should throw error for non-finite ltcgEquity', () => {
      expect(() => createCapitalGains({ ltcgEquity: -Infinity })).toThrow();
    });

    it('should throw error for non-finite ltcgOther', () => {
      expect(() => createCapitalGains({ ltcgOther: NaN })).toThrow();
    });

    it('should throw error for negative stcgEquity', () => {
      expect(() => createCapitalGains({ stcgEquity: -10000 })).toThrow();
    });

    it('should throw error for negative ltcgEquity', () => {
      expect(() => createCapitalGains({ ltcgEquity: -50000 })).toThrow();
    });

    it('should return frozen object', () => {
      const cg = createCapitalGains({ stcgEquity: 50000 });
      expect(Object.isFrozen(cg)).toBe(true);
    });
  });

  describe('getTotalSTCG', () => {
    it('should return sum of STCG equity and STCG other', () => {
      const cg = createCapitalGains({
        stcgEquity: 50000,
        stcgOther: 30000,
      });

      expect(getTotalSTCG(cg)).toBe(80000);
    });

    it('should return 0 for default capital gains', () => {
      const cg = createCapitalGains();
      expect(getTotalSTCG(cg)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getTotalSTCG(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(getTotalSTCG(undefined)).toBe(0);
    });
  });

  describe('getTotalLTCG', () => {
    it('should return sum of LTCG equity and LTCG other', () => {
      const cg = createCapitalGains({
        ltcgEquity: 200000,
        ltcgOther: 100000,
      });

      expect(getTotalLTCG(cg)).toBe(300000);
    });

    it('should return 0 for default capital gains', () => {
      const cg = createCapitalGains();
      expect(getTotalLTCG(cg)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getTotalLTCG(null)).toBe(0);
    });
  });

  describe('getTotalCapitalGains', () => {
    it('should return sum of all capital gains', () => {
      const cg = createCapitalGains({
        stcgEquity: 50000,
        stcgOther: 30000,
        ltcgEquity: 200000,
        ltcgOther: 100000,
      });

      expect(getTotalCapitalGains(cg)).toBe(380000);
    });

    it('should return 0 for default capital gains', () => {
      const cg = createCapitalGains();
      expect(getTotalCapitalGains(cg)).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(getTotalCapitalGains(null)).toBe(0);
    });
  });

  describe('isValidCapitalGains', () => {
    it('should return true for correct capital gains', () => {
      const cg = createCapitalGains({
        stcgEquity: 50000,
        ltcgEquity: 200000,
      });

      expect(isValidCapitalGains(cg)).toBe(true);
    });

    it('should return true for default capital gains', () => {
      const cg = createCapitalGains();
      expect(isValidCapitalGains(cg)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidCapitalGains(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidCapitalGains('invalid')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(isValidCapitalGains({
        stcgEquity: 'invalid',
        stcgOther: 0,
        ltcgEquity: 0,
        ltcgOther: 0,
      })).toBe(false);
    });

    it('should return false for negative values', () => {
      expect(isValidCapitalGains({
        stcgEquity: -50000,
        stcgOther: 0,
        ltcgEquity: 0,
        ltcgOther: 0,
      })).toBe(false);
    });
  });

  describe('fromLegacyCapitalGains', () => {
    it('should convert legacy single value to stcgOther', () => {
      const cg = fromLegacyCapitalGains(100000);

      expect(cg.stcgEquity).toBe(0);
      expect(cg.stcgOther).toBe(100000);
      expect(cg.ltcgEquity).toBe(0);
      expect(cg.ltcgOther).toBe(0);
    });

    it('should convert legacy 0 value', () => {
      const cg = fromLegacyCapitalGains(0);

      expect(getTotalCapitalGains(cg)).toBe(0);
    });

    it('should default negative value to 0', () => {
      const cg = fromLegacyCapitalGains(-50000);

      expect(cg.stcgOther).toBe(0);
    });

    it('should default NaN to 0', () => {
      const cg = fromLegacyCapitalGains(NaN);

      expect(cg.stcgOther).toBe(0);
    });

    it('should default undefined to 0', () => {
      const cg = fromLegacyCapitalGains(undefined);

      expect(getTotalCapitalGains(cg)).toBe(0);
    });

    it('should default null to 0', () => {
      const cg = fromLegacyCapitalGains(null);

      expect(getTotalCapitalGains(cg)).toBe(0);
    });
  });
});
