/**
 * Tests for Field Applicability Rules
 * Unit tests for src/domain/rules/field-applicability.js
 */

import { describe, it, expect } from 'vitest';
import {
  getFieldApplicabilityConfig,
  isFieldVisibleForRegime,
  getFieldVisibility,
  getAllFields,
  getFieldsForRegime,
  isFieldApplicableToRegime,
} from '../../../../src/domain/rules/field-applicability.js';

describe('Field Applicability Rules', () => {
  describe('getFieldApplicabilityConfig', () => {
    it('should return config for FY 2024-25', () => {
      const config = getFieldApplicabilityConfig('2024-25');
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('should return default config for unknown financial year', () => {
      const config = getFieldApplicabilityConfig('unknown');
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('should include income fields in config', () => {
      const config = getFieldApplicabilityConfig('2024-25');
      expect(config.salary).toBeDefined();
      expect(config.houseProperty).toBeDefined();
      expect(config.business).toBeDefined();
      expect(config.capitalGains).toBeDefined();
      expect(config.otherIncome).toBeDefined();
    });

    it('should mark all income fields as applicable to both regimes', () => {
      const config = getFieldApplicabilityConfig('2024-25');

      expect(config.salary.old).toBe(true);
      expect(config.salary.new).toBe(true);

      expect(config.houseProperty.old).toBe(true);
      expect(config.houseProperty.new).toBe(true);

      expect(config.business.old).toBe(true);
      expect(config.business.new).toBe(true);

      expect(config.capitalGains.old).toBe(true);
      expect(config.capitalGains.new).toBe(true);

      expect(config.otherIncome.old).toBe(true);
      expect(config.otherIncome.new).toBe(true);
    });
  });

  describe('isFieldVisibleForRegime', () => {
    describe('compare mode', () => {
      it('should show all income fields in compare mode', () => {
        expect(isFieldVisibleForRegime('salary', 'compare', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('houseProperty', 'compare', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('business', 'compare', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('capitalGains', 'compare', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('otherIncome', 'compare', '2024-25')).toBe(true);
      });
    });

    describe('old regime', () => {
      it('should show all income fields in old regime', () => {
        expect(isFieldVisibleForRegime('salary', 'old', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('houseProperty', 'old', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('business', 'old', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('capitalGains', 'old', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('otherIncome', 'old', '2024-25')).toBe(true);
      });
    });

    describe('new regime', () => {
      it('should show all income fields in new regime', () => {
        expect(isFieldVisibleForRegime('salary', 'new', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('houseProperty', 'new', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('business', 'new', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('capitalGains', 'new', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('otherIncome', 'new', '2024-25')).toBe(true);
      });
    });

    describe('unknown fields', () => {
      it('should default to visible for unknown fields', () => {
        expect(isFieldVisibleForRegime('unknownField', 'old', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('unknownField', 'new', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('unknownField', 'compare', '2024-25')).toBe(true);
      });
    });

    describe('unknown regimes', () => {
      it('should default to visible for unknown regimes', () => {
        expect(isFieldVisibleForRegime('salary', 'unknown', '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('salary', null, '2024-25')).toBe(true);
        expect(isFieldVisibleForRegime('salary', undefined, '2024-25')).toBe(true);
      });
    });
  });

  describe('getFieldVisibility', () => {
    it('should return visibility map for compare mode', () => {
      const visibility = getFieldVisibility('compare', '2024-25');

      // Basic income fields
      expect(visibility.salary).toBe(true);
      expect(visibility.houseProperty).toBe(true);
      expect(visibility.business).toBe(true);
      expect(visibility.capitalGains).toBe(true);
      expect(visibility.otherIncome).toBe(true);

      // TAX-010: New fields should also be visible in compare mode
      expect(visibility.stcgEquity).toBe(true);
      expect(visibility.standardDeduction).toBe(true);
      expect(visibility.section80C).toBe(true); // Old-regime only but visible in compare
    });

    it('should return visibility map for old regime', () => {
      const visibility = getFieldVisibility('old', '2024-25');

      // Basic income fields
      expect(visibility.salary).toBe(true);
      expect(visibility.houseProperty).toBe(true);
      expect(visibility.business).toBe(true);
      expect(visibility.capitalGains).toBe(true);
      expect(visibility.otherIncome).toBe(true);

      // TAX-010: Deductions should be visible in old regime
      expect(visibility.standardDeduction).toBe(true);
      expect(visibility.section80C).toBe(true);
      expect(visibility.section80D).toBe(true);
      expect(visibility.hra).toBe(true);
    });

    it('should return visibility map for new regime', () => {
      const visibility = getFieldVisibility('new', '2024-25');

      // Basic income fields visible
      expect(visibility.salary).toBe(true);
      expect(visibility.houseProperty).toBe(true);
      expect(visibility.business).toBe(true);
      expect(visibility.capitalGains).toBe(true);
      expect(visibility.otherIncome).toBe(true);

      // TAX-010: Most deductions hidden in new regime
      expect(visibility.standardDeduction).toBe(true);  // Standard deduction applies to both
      expect(visibility.section80C).toBe(false);
      expect(visibility.section80D).toBe(false);
      expect(visibility.hra).toBe(false);
    });
  });

  describe('getAllFields', () => {
    it('should return all field names for FY 2024-25', () => {
      const fields = getAllFields('2024-25');

      // Basic income fields
      expect(fields).toContain('salary');
      expect(fields).toContain('houseProperty');
      expect(fields).toContain('business');
      expect(fields).toContain('capitalGains');
      expect(fields).toContain('otherIncome');

      // TAX-010: New fields
      expect(fields).toContain('stcgEquity');
      expect(fields).toContain('standardDeduction');
      expect(fields).toContain('section80C');
    });

    it('should return 28 total fields (5 basic + 23 TAX-010)', () => {
      const fields = getAllFields('2024-25');
      expect(fields.length).toBe(28);
    });

    it('should return array for unknown financial year', () => {
      const fields = getAllFields('unknown');
      expect(Array.isArray(fields)).toBe(true);
    });
  });

  describe('getFieldsForRegime', () => {
    it('should return all income fields for old regime', () => {
      const fields = getFieldsForRegime('old', '2024-25');

      expect(fields).toContain('salary');
      expect(fields).toContain('houseProperty');
      expect(fields).toContain('business');
      expect(fields).toContain('capitalGains');
      expect(fields).toContain('otherIncome');
    });

    it('should return all income fields for new regime', () => {
      const fields = getFieldsForRegime('new', '2024-25');

      expect(fields).toContain('salary');
      expect(fields).toContain('houseProperty');
      expect(fields).toContain('business');
      expect(fields).toContain('capitalGains');
      expect(fields).toContain('otherIncome');
    });

    it('should return all income fields for compare mode', () => {
      const fields = getFieldsForRegime('compare', '2024-25');

      expect(fields).toContain('salary');
      expect(fields).toContain('houseProperty');
      expect(fields).toContain('business');
      expect(fields).toContain('capitalGains');
      expect(fields).toContain('otherIncome');
    });
  });

  describe('isFieldApplicableToRegime', () => {
    describe('old regime applicability', () => {
      it('should return true for income fields in old regime', () => {
        expect(isFieldApplicableToRegime('salary', 'old', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('houseProperty', 'old', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('business', 'old', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('capitalGains', 'old', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('otherIncome', 'old', '2024-25')).toBe(true);
      });
    });

    describe('new regime applicability', () => {
      it('should return true for income fields in new regime', () => {
        expect(isFieldApplicableToRegime('salary', 'new', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('houseProperty', 'new', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('business', 'new', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('capitalGains', 'new', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('otherIncome', 'new', '2024-25')).toBe(true);
      });
    });

    describe('unknown fields', () => {
      it('should default to applicable for unknown fields', () => {
        expect(isFieldApplicableToRegime('unknownField', 'old', '2024-25')).toBe(true);
        expect(isFieldApplicableToRegime('unknownField', 'new', '2024-25')).toBe(true);
      });
    });
  });
});
