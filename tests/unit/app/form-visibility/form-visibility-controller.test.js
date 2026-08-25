/**
 * Tests for Form Visibility Controller
 * Unit tests for src/app/form-visibility/form-visibility-controller.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  updateFieldVisibility,
  getStoredFieldValue,
  clearStoredFieldValue,
  clearAllStoredFieldValues,
  isFieldVisible,
  getVisibleFields,
  getVisibleFieldValues,
  resetFieldVisibility,
  initializeFieldVisibility,
} from '../../../../src/app/form-visibility/form-visibility-controller.js';

/**
 * Test Helper: Set up DOM with form fields
 */
function setupFormDOM() {
  document.body.innerHTML = `
    <form id="tax-form">
      <div class="form-group" data-field="salary">
        <label for="salary">Salary Income (₹):</label>
        <input type="number" id="salary" name="salary" value="500000">
      </div>
      <div class="form-group" data-field="houseProperty">
        <label for="house-property">House Property Income (₹):</label>
        <input type="number" id="house-property" name="house-property" value="-100000">
      </div>
      <div class="form-group" data-field="business">
        <label for="business-income">Business Income (₹):</label>
        <input type="number" id="business-income" name="business-income" value="200000">
      </div>
      <div class="form-group" data-field="capitalGains">
        <label for="capital-gains">Capital Gains (₹):</label>
        <input type="number" id="capital-gains" name="capital-gains" value="">
      </div>
      <div class="form-group" data-field="otherIncome">
        <label for="other-income">Other Income (₹):</label>
        <input type="number" id="other-income" name="other-income" value="50000">
      </div>
    </form>
  `;
}

/**
 * Test Helper: Clean up DOM
 */
function cleanupDOM() {
  document.body.innerHTML = '';
  clearAllStoredFieldValues();
}

describe('Form Visibility Controller', () => {
  describe('updateFieldVisibility', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should show all fields in compare mode', () => {
      updateFieldVisibility('compare', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
      expect(isFieldVisible('business')).toBe(true);
      expect(isFieldVisible('capitalGains')).toBe(true);
      expect(isFieldVisible('otherIncome')).toBe(true);
    });

    it('should show all income fields in old regime', () => {
      updateFieldVisibility('old', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
      expect(isFieldVisible('business')).toBe(true);
      expect(isFieldVisible('capitalGains')).toBe(true);
      expect(isFieldVisible('otherIncome')).toBe(true);
    });

    it('should show all income fields in new regime', () => {
      updateFieldVisibility('new', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
      expect(isFieldVisible('business')).toBe(true);
      expect(isFieldVisible('capitalGains')).toBe(true);
      expect(isFieldVisible('otherIncome')).toBe(true);
    });

    it('should not throw for missing field containers', () => {
      expect(() => updateFieldVisibility('compare', '2024-25')).not.toThrow();
    });
  });

  describe('isFieldVisible', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should return true for visible fields', () => {
      expect(isFieldVisible('salary')).toBe(true);
    });

    it('should return true for unknown fields (no container)', () => {
      expect(isFieldVisible('unknownField')).toBe(true);
    });

    it('should return false for hidden fields', () => {
      const container = document.querySelector('[data-field="salary"]');
      if (container) {
        container.style.display = 'none';
        container.classList.add('field-hidden');
      }

      expect(isFieldVisible('salary')).toBe(false);
    });
  });

  describe('getVisibleFields', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should return all visible field names', () => {
      const fields = getVisibleFields();

      expect(fields).toContain('salary');
      expect(fields).toContain('houseProperty');
      expect(fields).toContain('business');
      expect(fields).toContain('capitalGains');
      expect(fields).toContain('otherIncome');
    });

    it('should return 5 fields', () => {
      const fields = getVisibleFields();
      expect(fields.length).toBe(5);
    });

    it('should exclude hidden fields', () => {
      const container = document.querySelector('[data-field="salary"]');
      if (container) {
        container.style.display = 'none';
        container.classList.add('field-hidden');
      }

      const fields = getVisibleFields();
      expect(fields).not.toContain('salary');
      expect(fields.length).toBe(4);
    });
  });

  describe('Field Value Storage', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should return undefined for non-stored values', () => {
      expect(getStoredFieldValue('salary')).toBeUndefined();
    });

    it('should clear stored field value', () => {
      // This would require internal access to store, so we test via the hide/show mechanism
      clearStoredFieldValue('salary');
      expect(getStoredFieldValue('salary')).toBeUndefined();
    });

    it('should clear all stored values', () => {
      clearAllStoredFieldValues();
      expect(getStoredFieldValue('salary')).toBeUndefined();
      expect(getStoredFieldValue('houseProperty')).toBeUndefined();
    });
  });

  describe('getVisibleFieldValues', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should return values for visible fields', () => {
      const form = document.getElementById('tax-form');
      const values = getVisibleFieldValues(form);

      expect(values.salary).toBe('500000');
      expect(values.houseProperty).toBe('-100000');
      expect(values.business).toBe('200000');
      expect(values.otherIncome).toBe('50000');
    });

    it('should return empty object for null form', () => {
      const values = getVisibleFieldValues(null);
      expect(values).toEqual({});
    });

    it('should return empty string for empty input values', () => {
      const form = document.getElementById('tax-form');
      const values = getVisibleFieldValues(form);

      expect(values.capitalGains).toBe('');
    });

    it('should exclude hidden fields', () => {
      const container = document.querySelector('[data-field="salary"]');
      if (container) {
        container.style.display = 'none';
        container.classList.add('field-hidden');
      }

      const form = document.getElementById('tax-form');
      const values = getVisibleFieldValues(form);

      expect(values.salary).toBeUndefined();
      expect(values.houseProperty).toBe('-100000');
    });
  });

  describe('resetFieldVisibility', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should show all fields after reset', () => {
      // First hide some fields manually
      const container = document.querySelector('[data-field="salary"]');
      if (container) {
        container.style.display = 'none';
        container.classList.add('field-hidden');
      }

      resetFieldVisibility('2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
      expect(isFieldVisible('business')).toBe(true);
    });
  });

  describe('initializeFieldVisibility', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should initialize with compare mode', () => {
      initializeFieldVisibility('compare', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
      expect(isFieldVisible('business')).toBe(true);
    });

    it('should initialize with old regime', () => {
      initializeFieldVisibility('old', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
    });

    it('should initialize with new regime', () => {
      initializeFieldVisibility('new', '2024-25');

      expect(isFieldVisible('salary')).toBe(true);
      expect(isFieldVisible('houseProperty')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(setupFormDOM);
    afterEach(cleanupDOM);

    it('should handle empty DOM gracefully', () => {
      cleanupDOM();
      expect(() => updateFieldVisibility('compare', '2024-25')).not.toThrow();
    });

    it('should handle unknown financial year', () => {
      expect(() => updateFieldVisibility('compare', 'unknown')).not.toThrow();
    });

    it('should handle unknown regime', () => {
      expect(() => updateFieldVisibility('unknown', '2024-25')).not.toThrow();
    });

    it('should handle null regime', () => {
      expect(() => updateFieldVisibility(null, '2024-25')).not.toThrow();
    });

    it('should handle undefined regime', () => {
      expect(() => updateFieldVisibility(undefined, '2024-25')).not.toThrow();
    });
  });
});
