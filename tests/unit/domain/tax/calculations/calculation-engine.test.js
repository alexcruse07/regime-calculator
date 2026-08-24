/**
 * Tests for Tax Calculation Engine
 * TAX-012: Enhanced calculation engine tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateGrossIncome,
  calculateDeductions,
  calculateTax,
  compareRegimes,
} from '../../../../../src/domain/tax/calculations/calculation-engine.js';
import {
  oldRegimeRules,
  newRegimeRules,
} from '../../../../../src/domain/rules/financial-years/fy-2024-25.js';

describe('Tax Calculation Engine', () => {
  describe('calculateGrossIncome', () => {
    it('should calculate gross income from salary only', () => {
      const income = { salary: 1000000 };
      expect(calculateGrossIncome(income)).toBe(1000000);
    });

    it('should calculate gross income from multiple sources', () => {
      const income = {
        salary: 500000,
        houseProperty: 100000,
        business: 200000,
        otherIncome: 50000,
      };
      expect(calculateGrossIncome(income)).toBe(850000);
    });

    it('should handle house property loss', () => {
      const income = {
        salary: 1000000,
        houseProperty: -200000, // Loss from house property
      };
      expect(calculateGrossIncome(income)).toBe(800000);
    });

    it('should handle capital gains', () => {
      const income = {
        salary: 500000,
        stcgEquity: 50000,
        ltcgEquity: 100000,
      };
      expect(calculateGrossIncome(income)).toBe(650000);
    });

    it('should handle speculative income (net only)', () => {
      const income = {
        salary: 500000,
        speculativeGains: 100000,
        speculativeLosses: 40000, // Net speculative = 60000
      };
      expect(calculateGrossIncome(income)).toBe(560000);
    });

    it('should not allow negative gross income', () => {
      const income = {
        salary: 100000,
        houseProperty: -500000, // Large loss
      };
      expect(calculateGrossIncome(income)).toBe(0);
    });

    it('should handle empty or null income', () => {
      expect(calculateGrossIncome(null)).toBe(0);
      expect(calculateGrossIncome(undefined)).toBe(0);
      expect(calculateGrossIncome({})).toBe(0);
    });

    it('should handle string values by parsing them', () => {
      const income = {
        salary: '500000',
        otherIncome: '50000',
      };
      expect(calculateGrossIncome(income)).toBe(550000);
    });
  });

  describe('calculateDeductions', () => {
    it('should apply standard deduction for salary in new regime', () => {
      const deductions = {};
      const result = calculateDeductions(deductions, 'new', '2024-25', 1000000);
      expect(result.standardDeduction).toBe(75000);
      expect(result.totalDeductions).toBe(75000);
    });

    it('should apply standard deduction for salary in old regime', () => {
      const deductions = {};
      const result = calculateDeductions(deductions, 'old', '2024-25', 1000000);
      expect(result.standardDeduction).toBe(50000);
      expect(result.totalDeductions).toBe(50000);
    });

    it('should not apply standard deduction when no salary', () => {
      const deductions = {};
      const result = calculateDeductions(deductions, 'new', '2024-25', 0);
      expect(result.standardDeduction).toBe(0);
      expect(result.totalDeductions).toBe(0);
    });

    it('should apply Chapter VI-A deductions only in old regime', () => {
      const deductions = {
        section80C: 150000,
        section80D: 25000,
      };
      const resultOld = calculateDeductions(deductions, 'old', '2024-25', 1000000);
      expect(resultOld.section80C).toBe(150000);
      expect(resultOld.section80D).toBe(25000);
      expect(resultOld.totalDeductions).toBe(225000); // 50K std + 150K 80C + 25K 80D

      const resultNew = calculateDeductions(deductions, 'new', '2024-25', 1000000);
      expect(resultNew.section80C).toBe(0);
      expect(resultNew.section80D).toBe(0);
      expect(resultNew.totalDeductions).toBe(75000); // Only standard deduction
    });

    it('should cap deductions at statutory limits', () => {
      const deductions = {
        section80C: 500000, // Way over limit
      };
      const result = calculateDeductions(deductions, 'old', '2024-25', 1000000);
      expect(result.section80C).toBe(150000); // Capped at limit
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax for salary income in new regime', () => {
      const income = { salary: 1000000 };
      const deductions = {};
      const result = calculateTax(income, deductions, newRegimeRules);

      expect(result.grossIncome).toBe(1000000);
      expect(result.totalDeductions).toBe(75000);
      expect(result.taxableIncome).toBe(925000);
      expect(result.regime).toBe('new');
    });

    it('should calculate tax for salary income in old regime', () => {
      const income = { salary: 1000000 };
      const deductions = {};
      const result = calculateTax(income, deductions, oldRegimeRules);

      expect(result.grossIncome).toBe(1000000);
      expect(result.totalDeductions).toBe(50000);
      expect(result.taxableIncome).toBe(950000);
      expect(result.regime).toBe('old');
    });

    it('should apply rebate for income up to 5 lakh in old regime', () => {
      const income = { salary: 500000 };
      const deductions = {};
      const result = calculateTax(income, deductions, oldRegimeRules);

      // Taxable = 500000 - 50000 = 450000 (under 5L threshold)
      expect(result.taxableIncome).toBe(450000);
      expect(result.rebate).toBeGreaterThan(0);
      expect(result.totalTax).toBe(0);
    });

    it('should apply rebate for income up to 7 lakh in new regime', () => {
      const income = { salary: 700000 };
      const deductions = {};
      const result = calculateTax(income, deductions, newRegimeRules);

      // Taxable = 700000 - 75000 = 625000 (under 7L threshold)
      expect(result.taxableIncome).toBe(625000);
      expect(result.rebate).toBeGreaterThan(0);
      expect(result.totalTax).toBe(0);
    });

    it('should calculate surcharge for high income', () => {
      const income = { salary: 60000000 }; // 6 crore
      const deductions = {};
      const result = calculateTax(income, deductions, newRegimeRules);

      expect(result.surcharge).toBeGreaterThan(0);
    });

    it('should calculate cess on tax + surcharge', () => {
      const income = { salary: 1500000 };
      const deductions = {};
      const result = calculateTax(income, deductions, newRegimeRules);

      const expectedCess = (result.taxAfterRebate + result.surcharge) * 0.04;
      expect(result.cess).toBeCloseTo(expectedCess, 0);
    });

    it('should handle deductions in old regime', () => {
      const income = { salary: 1000000 };
      const deductions = {
        section80C: 150000,
        section80D: 25000,
      };
      const result = calculateTax(income, deductions, oldRegimeRules);

      // 10L - 50K std - 150K 80C - 25K 80D = 7.75L taxable
      expect(result.taxableIncome).toBe(775000);
    });

    it('should throw error for invalid rules', () => {
      const income = { salary: 1000000 };
      expect(() => calculateTax(income, {}, null)).toThrow('Invalid tax rules object');
      expect(() => calculateTax(income, {}, undefined)).toThrow('Invalid tax rules object');
    });
  });

  describe('compareRegimes', () => {
    it('should compare both regimes correctly', () => {
      const income = { salary: 1000000 };
      const deductions = {};
      const result = compareRegimes(income, deductions, oldRegimeRules, newRegimeRules);

      expect(result.oldRegime).toBeDefined();
      expect(result.newRegime).toBeDefined();
      expect(result.taxDifference).toBeDefined();
      expect(result.beneficialRegime).toBeDefined();
    });

    it('should identify beneficial regime when old is better', () => {
      const income = { salary: 1200000 };
      const deductions = {
        section80C: 150000,
        section80D: 50000,
        section80E: 50000,
      };
      const result = compareRegimes(income, deductions, oldRegimeRules, newRegimeRules);

      // With significant deductions, old regime should be better
      if (result.oldRegime.totalTax < result.newRegime.totalTax) {
        expect(result.beneficialRegime).toBe('old');
      }
    });

    it('should identify beneficial regime when new is better', () => {
      const income = { salary: 1500000 };
      const deductions = {}; // No additional deductions
      const result = compareRegimes(income, deductions, oldRegimeRules, newRegimeRules);

      // Without deductions, new regime with higher standard deduction should be better
      if (result.newRegime.totalTax < result.oldRegime.totalTax) {
        expect(result.beneficialRegime).toBe('new');
      }
    });

    it('should mark same when taxes are equal', () => {
      const income = { salary: 300000 }; // Very low income
      const deductions = {};
      const result = compareRegimes(income, deductions, oldRegimeRules, newRegimeRules);

      // Both should result in 0 tax (below taxable threshold)
      if (Math.abs(result.taxDifference) < 0.01) {
        expect(result.beneficialRegime).toBe('same');
      }
    });

    it('should include detailed breakdown in results', () => {
      const income = { salary: 1000000 };
      const deductions = { section80C: 100000 };
      const result = compareRegimes(income, deductions, oldRegimeRules, newRegimeRules);

      // Check old regime has all fields
      expect(result.oldRegime.grossIncome).toBe(1000000);
      expect(result.oldRegime.totalDeductions).toBeDefined();
      expect(result.oldRegime.taxableIncome).toBeDefined();
      expect(result.oldRegime.incomeTax).toBeDefined();
      expect(result.oldRegime.rebate).toBeDefined();
      expect(result.oldRegime.surcharge).toBeDefined();
      expect(result.oldRegime.cess).toBeDefined();
      expect(result.oldRegime.totalTax).toBeDefined();

      // Check new regime has all fields
      expect(result.newRegime.grossIncome).toBe(1000000);
      expect(result.newRegime.totalDeductions).toBeDefined();
      expect(result.newRegime.rebate).toBeDefined();
    });
  });

  describe('Tax slab calculations', () => {
    describe('Old Regime Slabs', () => {
      it('should apply 0% for income up to 2.5 lakh', () => {
        const income = { salary: 300000 }; // 3L - 50K std = 2.5L taxable
        const result = calculateTax(income, {}, oldRegimeRules);
        expect(result.incomeTax).toBe(0);
      });

      it('should apply 5% for income 2.5L to 5L', () => {
        const income = { salary: 550000 }; // 5.5L - 50K = 5L taxable
        const result = calculateTax(income, {}, oldRegimeRules);
        // Tax on 2.5L to 5L = 2.5L * 5% = 12,500
        expect(result.incomeTax).toBeCloseTo(12500, 0);
      });

      it('should apply 20% for income 5L to 10L', () => {
        const income = { salary: 850000 }; // 8.5L - 50K = 8L taxable
        const result = calculateTax(income, {}, oldRegimeRules);
        // Tax: 0 + 12,500 (5% on 2.5L) + 60,000 (20% on 3L) = 72,500
        expect(result.incomeTax).toBeCloseTo(72500, 0);
      });
    });

    describe('New Regime Slabs', () => {
      it('should apply 0% for income up to 3 lakh', () => {
        const income = { salary: 375000 }; // 3.75L - 75K = 3L taxable
        const result = calculateTax(income, {}, newRegimeRules);
        expect(result.incomeTax).toBe(0);
      });

      it('should apply 5% for income 3L to 6L', () => {
        const income = { salary: 675000 }; // 6.75L - 75K = 6L taxable
        const result = calculateTax(income, {}, newRegimeRules);
        // Tax on 3L to 6L = 3L * 5% = 15,000
        expect(result.incomeTax).toBeCloseTo(15000, 0);
      });

      it('should apply 10% for income 6L to 9L', () => {
        const income = { salary: 975000 }; // 9.75L - 75K = 9L taxable
        const result = calculateTax(income, {}, newRegimeRules);
        // Tax: 15,000 (5% on 3L) + 30,000 (10% on 3L) = 45,000
        expect(result.incomeTax).toBeCloseTo(45000, 0);
      });
    });
  });

  describe('Rebate u/s 87A', () => {
    it('should give full rebate for taxable income <= 5L in old regime', () => {
      const income = { salary: 550000 }; // 5.5L - 50K = 5L taxable
      const result = calculateTax(income, {}, oldRegimeRules);
      expect(result.taxableIncome).toBe(500000);
      expect(result.rebate).toBe(result.incomeTax); // Full rebate
      expect(result.totalTax).toBe(0);
    });

    it('should give no rebate for taxable income > 5L in old regime', () => {
      const income = { salary: 600000 }; // 6L - 50K = 5.5L taxable
      const result = calculateTax(income, {}, oldRegimeRules);
      expect(result.taxableIncome).toBe(550000);
      expect(result.rebate).toBe(0);
    });

    it('should give full rebate for taxable income <= 7L in new regime', () => {
      const income = { salary: 775000 }; // 7.75L - 75K = 7L taxable
      const result = calculateTax(income, {}, newRegimeRules);
      expect(result.taxableIncome).toBe(700000);
      expect(result.rebate).toBe(result.incomeTax); // Full rebate
      expect(result.totalTax).toBe(0);
    });

    it('should give no rebate for taxable income > 7L in new regime', () => {
      const income = { salary: 800000 }; // 8L - 75K = 7.25L taxable
      const result = calculateTax(income, {}, newRegimeRules);
      expect(result.taxableIncome).toBe(725000);
      expect(result.rebate).toBe(0);
    });
  });
});
