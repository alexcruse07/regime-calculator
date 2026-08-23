/**
 * Form Visibility Controller
 * Controls dynamic show/hide of form fields based on selected regime
 *
 * This module sits in the application layer and bridges:
 * - Domain logic (field-applicability.js) - which fields apply to which regime
 * - UI layer (DOM manipulation) - showing/hiding form elements
 *
 * @module app/form-visibility/form-visibility-controller
 */

import { getFieldVisibility } from '../../domain/rules/field-applicability.js';
import { DEFAULT_REGIME } from '../../shared/constants/regimes.js';

/**
 * Attribute name used to identify field containers
 * @type {string}
 */
const DATA_FIELD_ATTRIBUTE = 'data-field';

/**
 * CSS class applied to hidden fields
 * @type {string}
 */
const HIDDEN_CLASS = 'field-hidden';

/**
 * Storage for field values when they are hidden
 * Used to restore values when fields become visible again
 * @type {Map<string, string>}
 */
const hiddenFieldValues = new Map();

/**
 * Updates form field visibility based on selected regime and financial year
 *
 * @param {string} regime - Selected regime ('old' | 'new' | 'compare')
 * @param {string} financialYear - Selected financial year
 */
export function updateFieldVisibility(regime, financialYear) {
  const visibility = getFieldVisibility(regime, financialYear);

  Object.entries(visibility).forEach(([fieldName, isVisible]) => {
    const container = document.querySelector(`[${DATA_FIELD_ATTRIBUTE}="${fieldName}"]`);

    if (!container) {
      // Field container not found - may not exist yet (e.g., deduction fields)
      return;
    }

    if (isVisible) {
      showField(container, fieldName);
    } else {
      hideField(container, fieldName);
    }
  });
}

/**
 * Shows a form field and restores its previous value
 *
 * @param {HTMLElement} container - The field container element
 * @param {string} fieldName - The field identifier
 */
function showField(container, fieldName) {
  // Remove hidden class
  container.classList.remove(HIDDEN_CLASS);
  container.style.display = '';
  container.setAttribute('aria-hidden', 'false');

  // Find and enable the input
  const input = container.querySelector('input, select');

  if (input) {
    input.disabled = false;
    input.removeAttribute('aria-disabled');
    input.setAttribute('tabindex', '0');

    // Restore previous value if we have one stored
    const storedValue = hiddenFieldValues.get(fieldName);
    if (storedValue !== undefined) {
      input.value = storedValue;
      hiddenFieldValues.delete(fieldName);
    }
  }
}

/**
 * Hides a form field and stores its current value
 *
 * @param {HTMLElement} container - The field container element
 * @param {string} fieldName - The field identifier
 */
function hideField(container, fieldName) {
  const input = container.querySelector('input, select');

  if (input) {
    // Store current value before hiding (only if non-empty)
    const currentValue = input.value;
    if (currentValue && currentValue !== '0' && currentValue !== '') {
      hiddenFieldValues.set(fieldName, currentValue);
    }

    // Clear the input value so it doesn't contribute to calculations
    input.value = '';

    // Disable the input
    input.disabled = true;
    input.setAttribute('aria-disabled', 'true');
    input.setAttribute('tabindex', '-1');
  }

  // Hide the container
  container.classList.add(HIDDEN_CLASS);
  container.style.display = 'none';
  container.setAttribute('aria-hidden', 'true');
}

/**
 * Gets a stored hidden field value
 * @param {string} fieldName - The field identifier
 * @returns {string|undefined} The stored value, or undefined if not stored
 */
export function getStoredFieldValue(fieldName) {
  return hiddenFieldValues.get(fieldName);
}

/**
 * Clears a stored hidden field value
 * @param {string} fieldName - The field identifier
 */
export function clearStoredFieldValue(fieldName) {
  hiddenFieldValues.delete(fieldName);
}

/**
 * Clears all stored hidden field values
 */
export function clearAllStoredFieldValues() {
  hiddenFieldValues.clear();
}

/**
 * Checks if a field container is currently visible
 * @param {string} fieldName - The field identifier
 * @returns {boolean} True if visible, false otherwise
 */
export function isFieldVisible(fieldName) {
  const container = document.querySelector(`[${DATA_FIELD_ATTRIBUTE}="${fieldName}"]`);

  if (!container) {
    return true; // If container doesn't exist, consider it "visible" (not hidden)
  }

  return container.style.display !== 'none' && !container.classList.contains(HIDDEN_CLASS);
}

/**
 * Gets all currently visible fields
 * @returns {string[]} Array of visible field names
 */
export function getVisibleFields() {
  const fieldContainers = document.querySelectorAll(`[${DATA_FIELD_ATTRIBUTE}]`);
  const visibleFields = [];

  fieldContainers.forEach(container => {
    const fieldName = container.getAttribute(DATA_FIELD_ATTRIBUTE);
    if (fieldName && isFieldVisible(fieldName)) {
      visibleFields.push(fieldName);
    }
  });

  return visibleFields;
}

/**
 * Gets values only from visible fields (TAX-010 extended)
 * Hidden fields are excluded from the returned object
 *
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Object with field values from visible fields only
 */
export function getVisibleFieldValues(form) {
  if (!form) {
    return {};
  }

  const values = {};
  const visibleFields = getVisibleFields();

  // Map of form element names to field names (TAX-010 extended)
  const fieldNameMap = {
    // Basic income
    'salary': 'salary',
    'house-property': 'houseProperty',
    'business-income': 'business',
    'capital-gains': 'capitalGains',
    'other-income': 'otherIncome',

    // TAX-010: Granular capital gains
    'stcg-equity': 'stcgEquity',
    'stcg-other': 'stcgOther',
    'ltcg-equity': 'ltcgEquity',
    'ltcg-other': 'ltcgOther',

    // TAX-010: Trading income
    'speculative-gains': 'speculativeGains',
    'speculative-losses': 'speculativeLosses',
    'fno-gains': 'fnoGains',
    'fno-losses': 'fnoLosses',

    // TAX-010: Expanded other income
    'interest-income': 'interestIncome',
    'dividend-income': 'dividendIncome',
    'other-taxable': 'otherTaxable',

    // TAX-010: Deductions
    'standard-deduction': 'standardDeduction',
    'section-80c': 'section80C',
    'section-80ccd1b': 'section80CCD1B',
    'section-80d': 'section80D',
    'section-80e': 'section80E',
    'section-80g': 'section80G',
    'section-80tta': 'section80TTA',
    'section-80ttb': 'section80TTB',
    'hra': 'hra',
    'lta': 'lta',
    'home-loan-interest': 'homeLoanInterest',
    'other-deductions': 'otherDeductions',
  };

  visibleFields.forEach(fieldName => {
    // Find the corresponding form element name
    const formElementName = Object.entries(fieldNameMap)
      .find(([_, fName]) => fName === fieldName)?.[0] || fieldName;

    const element = form.elements[formElementName];

    if (element) {
      values[fieldName] = element.value || '';
    }
  });

  return values;
}

/**
 * Resets form visibility to show all fields
 * Used when resetting the form or switching to 'compare' mode
 *
 * @param {string} financialYear - The financial year
 */
export function resetFieldVisibility(financialYear) {
  // Show all fields by setting to compare mode
  updateFieldVisibility(DEFAULT_REGIME, financialYear);

  // Clear any stored values
  clearAllStoredFieldValues();
}

/**
 * Initializes form visibility based on current regime and financial year
 * Should be called during app initialization
 *
 * @param {string} regime - Current selected regime
 * @param {string} financialYear - Current financial year
 */
export function initializeFieldVisibility(regime, financialYear) {
  updateFieldVisibility(regime, financialYear);
}
