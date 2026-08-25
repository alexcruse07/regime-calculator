/**
 * Tax Regime Constants
 * Defines supported tax regimes and related constants
 * 
 * TAX-017: Removed Compare Both option - users select Old or New regime only
 *
 * @module shared/constants/regimes
 */

/**
 * Tax regime identifiers
 * @type {Object}
 */
export const REGIMES = Object.freeze({
  OLD: 'old',
  NEW: 'new',
});

/**
 * Array of all valid regime values
 * @type {string[]}
 */
export const VALID_REGIMES = Object.freeze([
  REGIMES.OLD,
  REGIMES.NEW,
]);

/**
 * Default selected regime (New regime is default from FY 2023-24)
 * @type {string}
 */
export const DEFAULT_REGIME = REGIMES.NEW;

/**
 * Human-readable labels for each regime
 * @type {Object}
 */
export const REGIME_LABELS = Object.freeze({
  [REGIMES.OLD]: 'Old Regime',
  [REGIMES.NEW]: 'New Regime',
});

/**
 * Hint text for each regime
 * @type {Object}
 */
export const REGIME_HINTS = Object.freeze({
  [REGIMES.OLD]: 'With deductions & exemptions',
  [REGIMES.NEW]: 'Lower rates, standard deduction only',
});

/**
 * Checks if a regime value is valid
 * @param {string} regime - The regime value to check
 * @returns {boolean} True if the regime is valid
 */
export function isValidRegime(regime) {
  return VALID_REGIMES.includes(regime);
}

/**
 * Gets the display label for a regime
 * @param {string} regime - The regime identifier
 * @returns {string} Human-readable label, or 'Unknown' if invalid
 */
export function getRegimeLabel(regime) {
  return REGIME_LABELS[regime] || 'Unknown';
}

/**
 * Gets the hint text for a regime
 * @param {string} regime - The regime identifier
 * @returns {string} Hint text, or empty string if invalid
 */
export function getRegimeHint(regime) {
  return REGIME_HINTS[regime] || '';
}
