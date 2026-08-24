/**
 * Financial Years Constants
 * Defines supported financial years for tax calculations
 * TAX-020: Added FY 2025-26 and 2026-27
 */

/**
 * List of supported financial years (most recent first)
 * @type {string[]}
 */
export const SUPPORTED_YEARS = [
  '2026-27',
  '2025-26',
  '2024-25',
];

/**
 * Default financial year for new calculations
 * @type {string}
 */
export const DEFAULT_FINANCIAL_YEAR = '2025-26';

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
