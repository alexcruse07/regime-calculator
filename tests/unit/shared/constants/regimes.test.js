/**
 * Tests for Regime Constants
 * Unit tests for src/shared/constants/regimes.js
 * TAX-017: Updated to reflect removal of Compare Both option
 */

import { describe, it, expect } from 'vitest';
import {
  REGIMES,
  VALID_REGIMES,
  DEFAULT_REGIME,
  REGIME_LABELS,
  REGIME_HINTS,
  isValidRegime,
  getRegimeLabel,
  getRegimeHint,
} from '../../../../src/shared/constants/regimes.js';

describe('Regime Constants', () => {
  describe('REGIMES object', () => {
    it('should have OLD regime defined', () => {
      expect(REGIMES.OLD).toBe('old');
    });

    it('should have NEW regime defined', () => {
      expect(REGIMES.NEW).toBe('new');
    });

    // TAX-017: Compare Both removed
    it('should NOT have COMPARE regime defined', () => {
      expect(REGIMES.COMPARE).toBeUndefined();
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(REGIMES)).toBe(true);
    });

    // TAX-017: Only 2 regimes now
    it('should have exactly 2 regimes', () => {
      expect(Object.keys(REGIMES).length).toBe(2);
    });
  });

  describe('VALID_REGIMES array', () => {
    // TAX-017: Only old and new regimes
    it('should contain only old and new regimes', () => {
      expect(VALID_REGIMES).toContain('old');
      expect(VALID_REGIMES).toContain('new');
      expect(VALID_REGIMES).not.toContain('compare');
    });

    it('should have exactly 2 values', () => {
      expect(VALID_REGIMES.length).toBe(2);
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(VALID_REGIMES)).toBe(true);
    });
  });

  describe('DEFAULT_REGIME', () => {
    // TAX-017: Default changed to 'new'
    it('should default to new', () => {
      expect(DEFAULT_REGIME).toBe('new');
    });

    it('should be a valid regime', () => {
      expect(VALID_REGIMES).toContain(DEFAULT_REGIME);
    });
  });

  describe('REGIME_LABELS', () => {
    it('should have label for old regime', () => {
      expect(REGIME_LABELS.old).toBe('Old Regime');
    });

    it('should have label for new regime', () => {
      expect(REGIME_LABELS.new).toBe('New Regime');
    });

    // TAX-017: Compare removed
    it('should NOT have label for compare regime', () => {
      expect(REGIME_LABELS.compare).toBeUndefined();
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(REGIME_LABELS)).toBe(true);
    });
  });

  describe('REGIME_HINTS', () => {
    it('should have hint for old regime', () => {
      expect(REGIME_HINTS.old).toBe('With deductions & exemptions');
    });

    it('should have hint for new regime', () => {
      expect(REGIME_HINTS.new).toBe('Lower rates, standard deduction only');
    });

    // TAX-017: Compare removed
    it('should NOT have hint for compare regime', () => {
      expect(REGIME_HINTS.compare).toBeUndefined();
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(REGIME_HINTS)).toBe(true);
    });
  });
});

describe('isValidRegime function', () => {
  describe('valid regimes', () => {
    it('should return true for "old"', () => {
      expect(isValidRegime('old')).toBe(true);
    });

    it('should return true for "new"', () => {
      expect(isValidRegime('new')).toBe(true);
    });

    // TAX-017: compare is no longer valid
    it('should return false for "compare"', () => {
      expect(isValidRegime('compare')).toBe(false);
    });
  });

  describe('invalid regimes', () => {
    it('should return false for empty string', () => {
      expect(isValidRegime('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidRegime(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidRegime(undefined)).toBe(false);
    });

    it('should return false for invalid string', () => {
      expect(isValidRegime('invalid')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isValidRegime(123)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isValidRegime(true)).toBe(false);
    });

    it('should return false for uppercase variant', () => {
      expect(isValidRegime('OLD')).toBe(false);
    });

    it('should return false for mixed case', () => {
      expect(isValidRegime('Old')).toBe(false);
    });

    it('should return false for similar but invalid strings', () => {
      expect(isValidRegime('old ')).toBe(false);
      expect(isValidRegime(' new')).toBe(false);
      expect(isValidRegime('compare!')).toBe(false);
    });
  });
});

describe('getRegimeLabel function', () => {
  it('should return "Old Regime" for old', () => {
    expect(getRegimeLabel('old')).toBe('Old Regime');
  });

  it('should return "New Regime" for new', () => {
    expect(getRegimeLabel('new')).toBe('New Regime');
  });

  // TAX-017: compare returns Unknown now
  it('should return "Unknown" for compare (removed)', () => {
    expect(getRegimeLabel('compare')).toBe('Unknown');
  });

  it('should return "Unknown" for invalid regime', () => {
    expect(getRegimeLabel('invalid')).toBe('Unknown');
  });

  it('should return "Unknown" for null', () => {
    expect(getRegimeLabel(null)).toBe('Unknown');
  });

  it('should return "Unknown" for undefined', () => {
    expect(getRegimeLabel(undefined)).toBe('Unknown');
  });
});

describe('getRegimeHint function', () => {
  it('should return hint for old regime', () => {
    expect(getRegimeHint('old')).toBe('With deductions & exemptions');
  });

  it('should return hint for new regime', () => {
    expect(getRegimeHint('new')).toBe('Lower rates, standard deduction only');
  });

  // TAX-017: compare returns empty now
  it('should return empty string for compare (removed)', () => {
    expect(getRegimeHint('compare')).toBe('');
  });

  it('should return empty string for invalid regime', () => {
    expect(getRegimeHint('invalid')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(getRegimeHint(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(getRegimeHint(undefined)).toBe('');
  });
});
