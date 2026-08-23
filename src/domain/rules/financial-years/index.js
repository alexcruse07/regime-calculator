/**
 * Financial Years Rules Index
 * Exports tax rules for all supported financial years
 */

import { oldRegimeRules, newRegimeRules, seniorCitizenRules } from './fy-2024-25.js';

/**
 * Map of financial year to rules
 * Each financial year contains old regime, new regime, and other regime rules
 */
const rulesMap = {
  '2024-25': {
    oldRegime: oldRegimeRules,
    newRegime: newRegimeRules,
    seniorCitizen: seniorCitizenRules,
  },
  // Future financial years will be added here
};

/**
 * Gets rules for a specific financial year and regime
 * @param {string} financialYear - The financial year (e.g., '2024-25')
 * @param {string} regime - The regime ('old', 'new', 'senior')
 * @returns {Object} Tax rules object
 * @throws {Error} If financial year or regime not found
 */
export function getRulesForYear(financialYear, regime) {
  if (!rulesMap[financialYear]) {
    throw new Error(`No rules found for financial year ${financialYear}`);
  }

  const yearRules = rulesMap[financialYear];

  let key;
  switch (regime) {
  case 'old':
    key = 'oldRegime';
    break;
  case 'new':
    key = 'newRegime';
    break;
  case 'senior':
    key = 'seniorCitizen';
    break;
  default:
    throw new Error(`Unknown regime: ${regime}`);
  }

  if (!yearRules[key]) {
    throw new Error(`No ${regime} regime rules found for financial year ${financialYear}`);
  }

  return yearRules[key];
}

/**
 * Gets all available regimes for a financial year
 * @param {string} financialYear - The financial year
 * @returns {string[]} Array of available regime names
 * @throws {Error} If financial year not found
 */
export function getAvailableRegimes(financialYear) {
  if (!rulesMap[financialYear]) {
    throw new Error(`No rules found for financial year ${financialYear}`);
  }

  const regimes = [];
  const yearRules = rulesMap[financialYear];

  if (yearRules.oldRegime) {
    regimes.push('old');
  }
  if (yearRules.newRegime) {
    regimes.push('new');
  }
  if (yearRules.seniorCitizen) {
    regimes.push('senior');
  }

  return regimes;
}

/**
 * Gets all supported financial years
 * @returns {string[]} Array of financial years
 */
export function getSupportedFinancialYears() {
  return Object.keys(rulesMap).sort().reverse(); // Most recent first
}

/**
 * Checks if a financial year is supported
 * @param {string} financialYear - The financial year to check
 * @returns {boolean} True if supported
 */
export function isFinancialYearSupported(financialYear) {
  return financialYear in rulesMap;
}

/**
 * Gets both old and new regime rules for a financial year
 * @param {string} financialYear - The financial year
 * @returns {Object} Object with oldRegime and newRegime properties
 * @throws {Error} If financial year not found
 */
export function getRegimeRulesForYear(financialYear) {
  if (!rulesMap[financialYear]) {
    throw new Error(`No rules found for financial year ${financialYear}`);
  }

  return {
    oldRegime: getRulesForYear(financialYear, 'old'),
    newRegime: getRulesForYear(financialYear, 'new'),
  };
}
