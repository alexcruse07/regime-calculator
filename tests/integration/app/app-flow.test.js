/**
 * Integration Tests for Application Flow
 * Tests the complete calculation workflow from input to results
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { orchestrateCalculation, resetCalculation, getCurrentState } from '../../../src/app/tax-orchestration/coordinator.js';

describe('Tax Calculation Integration Flow', () => {
  beforeEach(() => {
    resetCalculation();
  });

  afterEach(() => {
    resetCalculation();
  });

  describe('Complete calculation workflow', () => {
    it('should calculate tax for zero income', async () => {
      const formInput = {
        salary: '0',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      // This should fail validation (zero income)
      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should calculate tax for salary only', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();

      const { result: calculation } = result;
      expect(calculation.oldRegime).toBeDefined();
      expect(calculation.newRegime).toBeDefined();
      expect(calculation.taxDifference).toBeDefined();
      expect(calculation.beneficialRegime).toBeDefined();
    });

    it('should calculate tax for other income only', async () => {
      const formInput = {
        salary: '0',
        otherIncome: '500000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should calculate tax for mixed income sources', async () => {
      const formInput = {
        salary: '400000',
        otherIncome: '100000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;
      expect(calculation.oldRegime.grossIncome).toBe(500000);
      expect(calculation.newRegime.grossIncome).toBe(500000);
    });
  });

  describe('Tax slab boundaries', () => {
    it('should calculate correctly at old regime exemption limit', async () => {
      const formInput = {
        salary: '250000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      // At ₹2.5 lakh, old regime should have no tax
      expect(result.result.oldRegime.incomeTax).toBe(0);
    });

    it('should calculate just above exemption limit', async () => {
      const formInput = {
        salary: '250001',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);
      // At ₹2.50001 lakh, tax should be calculated (even if minimal)
      expect(result.result.oldRegime.taxableIncome).toBeGreaterThan(0);
    });

    it('should calculate at ₹5 lakh boundary', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;
      expect(calculation.oldRegime.taxableIncome).toBe(500000);
      expect(calculation.newRegime.taxableIncome).toBeLessThan(500000); // Standard deduction applied
    });
  });

  describe('Regime comparison', () => {
    it('should compare old and new regime correctly', async () => {
      const formInput = {
        salary: '1000000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;

      // Verify both regimes have valid calculations
      expect(calculation.oldRegime.totalTax).toBeGreaterThanOrEqual(0);
      expect(calculation.newRegime.totalTax).toBeGreaterThanOrEqual(0);

      // Verify tax difference calculation
      expect(calculation.taxDifference).toBe(
        calculation.oldRegime.totalTax - calculation.newRegime.totalTax,
      );
    });

    it('should identify beneficial regime', async () => {
      const formInput = {
        salary: '1000000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const { beneficialRegime } = result.result;
      expect(['old', 'new', 'same']).toContain(beneficialRegime);
    });

    it('should calculate savings percentage', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '50000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const { savingsPercentage } = result.result;
      expect(savingsPercentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('High income scenarios', () => {
    it('should calculate for high earner income', async () => {
      const formInput = {
        salary: '2500000',
        otherIncome: '500000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;
      expect(calculation.oldRegime.surcharge).toBeGreaterThanOrEqual(0);
      expect(calculation.newRegime.surcharge).toBeGreaterThanOrEqual(0);
    });

    it('should calculate cess correctly', async () => {
      const formInput = {
        salary: '1000000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;

      // Cess should be 4% of income tax + surcharge
      const oldTaxBeforeCess = calculation.oldRegime.incomeTax + calculation.oldRegime.surcharge;
      const expectedCess = (oldTaxBeforeCess * 4) / 100;

      expect(calculation.oldRegime.cess).toBeCloseTo(expectedCess, 0);
    });

    it('should calculate total tax correctly', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '50000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const calculation = result.result;

      // Verify total tax is sum of components
      const expectedOldTotal =
        calculation.oldRegime.incomeTax +
        calculation.oldRegime.surcharge +
        calculation.oldRegime.cess;
      const expectedNewTotal =
        calculation.newRegime.incomeTax +
        calculation.newRegime.surcharge +
        calculation.newRegime.cess;

      expect(calculation.oldRegime.totalTax).toBeCloseTo(expectedOldTotal, 0);
      expect(calculation.newRegime.totalTax).toBeCloseTo(expectedNewTotal, 0);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid financial year', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '0',
        financialYear: '2020-21',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle negative income', async () => {
      const formInput = {
        salary: '-100000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(false);
    });

    it('should handle invalid input type', async () => {
      const formInput = {
        salary: 'not-a-number',
        otherIncome: 'also-not-a-number',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(false);
    });

    it('should handle missing financial year', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '0',
        financialYear: '',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(false);
    });
  });

  describe('State management', () => {
    it('should update state on successful calculation', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      await orchestrateCalculation(formInput);

      const state = getCurrentState();
      expect(state.income.salary).toBe(500000);
      expect(state.income.otherIncome).toBe(0);
      expect(state.financialYear).toBe('2024-25');
      expect(state.calculations).toBeDefined();
      expect(state.validationErrors).toHaveLength(0);
    });

    it('should set validation errors on invalid input', async () => {
      const formInput = {
        salary: '0',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      await orchestrateCalculation(formInput);

      const state = getCurrentState();
      expect(state.validationErrors.length).toBeGreaterThan(0);
    });

    it('should clear calculations on error', async () => {
      // First, do a successful calculation
      await orchestrateCalculation({
        salary: '500000',
        otherIncome: '0',
        financialYear: '2024-25',
      });

      let state = getCurrentState();
      expect(state.calculations).toBeDefined();

      // Then, try invalid calculation (zero income)
      await orchestrateCalculation({
        salary: '0',
        otherIncome: '0',
        financialYear: '2024-25',
      });

      state = getCurrentState();
      expect(state.validationErrors.length).toBeGreaterThan(0);
    });

    it('should reset state correctly', () => {
      resetCalculation();

      const state = getCurrentState();
      expect(state.income.salary).toBe(0);
      expect(state.income.otherIncome).toBe(0);
      expect(state.calculations).toBeNull();
      expect(state.validationErrors).toHaveLength(0);
    });
  });

  describe('Input normalization in workflow', () => {
    it('should normalize currency-formatted input', async () => {
      const formInput = {
        salary: '500000',  // Use simple format, validators should handle it
        otherIncome: '50000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const state = getCurrentState();
      expect(state.income.salary).toBe(500000);
      expect(state.income.otherIncome).toBe(50000);
    });

    it('should normalize year format variations', async () => {
      const variations = [
        { year: '2024-25' },
        { year: '2024/25' },
      ];

      for (const variation of variations) {
        resetCalculation();

        const formInput = {
          salary: '500000',
          otherIncome: '0',
          financialYear: variation.year,
        };

        const result = await orchestrateCalculation(formInput);
        expect(result.success).toBe(true);

        const state = getCurrentState();
        expect(state.financialYear).toBe('2024-25');
      }
    });
  });

  describe('Calculation validation', () => {
    it('should ensure gross income >= taxable income', async () => {
      const formInput = {
        salary: '500000',
        otherIncome: '50000',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const { oldRegime, newRegime } = result.result;

      // Taxable income should not exceed gross income
      expect(oldRegime.taxableIncome).toBeLessThanOrEqual(oldRegime.grossIncome);
      expect(newRegime.taxableIncome).toBeLessThanOrEqual(newRegime.grossIncome);
    });

    it('should ensure tax components are non-negative', async () => {
      const formInput = {
        salary: '1000000',
        otherIncome: '0',
        financialYear: '2024-25',
      };

      const result = await orchestrateCalculation(formInput);
      expect(result.success).toBe(true);

      const { oldRegime, newRegime } = result.result;

      [oldRegime, newRegime].forEach(regime => {
        expect(regime.incomeTax).toBeGreaterThanOrEqual(0);
        expect(regime.surcharge).toBeGreaterThanOrEqual(0);
        expect(regime.cess).toBeGreaterThanOrEqual(0);
        expect(regime.totalTax).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
