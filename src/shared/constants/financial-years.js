/**
 * Financial Years Constants
 * Defines supported financial years for tax calculations
 */

/**
 * List of supported financial years
 * @type {string[]}
 */
export const SUPPORTED_YEARS = [
  '2024-25',
  // Future years will be added here as rules are defined
];

/**
 * Checks if a financial year is supported
 * @param {string} year - The financial year to check (e.g., '2024-25')
 * @returns {boolean} True if the year is supported
 */
export function isSupportedYear(year) {
  return SUPPORTED_YEARS.includes(year);
}

/**
 * Gets all supported years for display
 * @returns {string[]} Array of supported years
 */
export function getSupportedYears() {
  return [...SUPPORTED_YEARS];
}
