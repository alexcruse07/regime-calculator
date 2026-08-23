/**
 * Field Applicability Rules
 * Defines which form fields are applicable to which tax regime
 *
 * This module contains pure domain logic with no UI dependencies.
 * It maps form fields to their applicability in each tax regime.
 *
 * @module domain/rules/field-applicability
 */

import { REGIMES } from '../../shared/constants/regimes.js';

/**
 * Field applicability configuration for FY 2024-25
 *
 * Income fields (TAX-004 to TAX-008) are applicable to BOTH regimes.
 * Deduction fields will be added in TAX-010 with regime-specific applicability.
 *
 * @type {Object}
 */
const FIELD_APPLICABILITY_FY_2024_25 = Object.freeze({
  // Income fields - applicable to both regimes
  salary: { old: true, new: true },
  houseProperty: { old: true, new: true },
  business: { old: true, new: true },
  capitalGains: { old: true, new: true },
  otherIncome: { old: true, new: true },

  // Future deduction fields (TAX-010) will be added here with regime-specific applicability
  // section80C: { old: true, new: false },
  // section80D: { old: true, new: false },
  // hra: { old: true, new: false },
  // standardDeduction: { old: true, new: true },
});

/**
 * Registry of field applicability by financial year
 * @type {Object}
 */
const FIELD_APPLICABILITY_BY_YEAR = Object.freeze({
  '2024-25': FIELD_APPLICABILITY_FY_2024_25,
});

/**
 * Default field applicability (fallback)
 * @type {Object}
 */
const DEFAULT_FIELD_APPLICABILITY = FIELD_APPLICABILITY_FY_2024_25;

/**
 * Gets the field applicability configuration for a financial year
 * @param {string} financialYear - The financial year (e.g., '2024-25')
 * @returns {Object} Field applicability configuration
 */
export function getFieldApplicabilityConfig(financialYear) {
  return FIELD_APPLICABILITY_BY_YEAR[financialYear] || DEFAULT_FIELD_APPLICABILITY;
}

/**
 * Determines if a field is visible for a given regime
 *
 * Rules:
 * - If regime is 'compare', show all fields (union of both regimes)
 * - If regime is 'old', show only old-regime applicable fields
 * - If regime is 'new', show only new-regime applicable fields
 *
 * @param {string} fieldName - The field name
 * @param {string} regime - The selected regime ('old' | 'new' | 'compare')
 * @param {string} financialYear - The financial year
 * @returns {boolean} True if the field should be visible
 */
export function isFieldVisibleForRegime(fieldName, regime, financialYear) {
  const config = getFieldApplicabilityConfig(financialYear);
  const fieldConfig = config[fieldName];

  // If field not in config, default to visible (safe default)
  if (!fieldConfig) {
    return true;
  }

  // Compare mode: show if applicable to either regime
  if (regime === REGIMES.COMPARE) {
    return fieldConfig.old || fieldConfig.new;
  }

  // Old regime: show only old-applicable fields
  if (regime === REGIMES.OLD) {
    return fieldConfig.old === true;
  }

  // New regime: show only new-applicable fields
  if (regime === REGIMES.NEW) {
    return fieldConfig.new === true;
  }

  // Unknown regime, default to visible
  return true;
}

/**
 * Gets field visibility map for all fields based on selected regime
 *
 * @param {string} regime - The selected regime ('old' | 'new' | 'compare')
 * @param {string} financialYear - The financial year
 * @returns {Object} Map of fieldName → isVisible boolean
 */
export function getFieldVisibility(regime, financialYear) {
  const config = getFieldApplicabilityConfig(financialYear);
  const visibility = {};

  Object.keys(config).forEach(fieldName => {
    visibility[fieldName] = isFieldVisibleForRegime(fieldName, regime, financialYear);
  });

  return visibility;
}

/**
 * Gets all field names for a financial year
 * @param {string} financialYear - The financial year
 * @returns {string[]} Array of field names
 */
export function getAllFields(financialYear) {
  const config = getFieldApplicabilityConfig(financialYear);
  return Object.keys(config);
}

/**
 * Gets fields applicable to a specific regime
 * @param {string} regime - The regime ('old' | 'new')
 * @param {string} financialYear - The financial year
 * @returns {string[]} Array of field names applicable to the regime
 */
export function getFieldsForRegime(regime, financialYear) {
  const config = getFieldApplicabilityConfig(financialYear);

  return Object.entries(config)
    .filter(([_, applicability]) => {
      if (regime === REGIMES.OLD) {
        return applicability.old;
      }
      if (regime === REGIMES.NEW) {
        return applicability.new;
      }
      return true; // compare mode gets all
    })
    .map(([fieldName]) => fieldName);
}

/**
 * Checks if a field is applicable to a specific regime (not 'compare')
 * @param {string} fieldName - The field name
 * @param {string} regime - The regime ('old' | 'new')
 * @param {string} financialYear - The financial year
 * @returns {boolean} True if the field is applicable
 */
export function isFieldApplicableToRegime(fieldName, regime, financialYear) {
  const config = getFieldApplicabilityConfig(financialYear);
  const fieldConfig = config[fieldName];

  if (!fieldConfig) {
    return true; // Unknown fields default to applicable
  }

  if (regime === REGIMES.OLD) {
    return fieldConfig.old === true;
  }

  if (regime === REGIMES.NEW) {
    return fieldConfig.new === true;
  }

  return true;
}
