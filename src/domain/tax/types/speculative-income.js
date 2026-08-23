/**
 * Speculative and F&O Income Type Definitions
 * For TAX-010: Trading income (speculative business + Futures & Options)
 *
 * Speculative income: Intraday trading gains/losses
 * F&O income: Futures and Options trading gains/losses
 */

/**
 * @typedef {Object} SpeculativeIncome
 * Represents speculative (intraday) trading income
 *
 * @property {number} gains - Speculative gains (₹, ≥ 0)
 * @property {number} losses - Speculative losses (₹, ≥ 0)
 */

/**
 * @typedef {Object} FnoIncome
 * Represents Futures & Options trading income
 *
 * @property {number} gains - F&O gains (₹, ≥ 0)
 * @property {number} losses - F&O losses (₹, ≥ 0)
 */

/**
 * @typedef {Object} TradingIncome
 * Combined trading income for speculative and F&O
 *
 * @property {SpeculativeIncome} speculative - Speculative income
 * @property {FnoIncome} fno - F&O income
 */

/**
 * Creates and validates a SpeculativeIncome object
 * @param {Object} params - Speculative income parameters
 * @param {number} [params.gains=0] - Speculative gains
 * @param {number} [params.losses=0] - Speculative losses
 * @returns {SpeculativeIncome} Validated speculative income object
 * @throws {Error} If values are invalid
 */
export function createSpeculativeIncome({ gains = 0, losses = 0 } = {}) {
  if (!Number.isFinite(gains)) {
    throw new Error('Speculative gains must be a finite number');
  }
  if (!Number.isFinite(losses)) {
    throw new Error('Speculative losses must be a finite number');
  }
  if (gains < 0) {
    throw new Error('Speculative gains must be non-negative');
  }
  if (losses < 0) {
    throw new Error('Speculative losses must be non-negative');
  }

  return Object.freeze({ gains, losses });
}

/**
 * Creates and validates an FnoIncome object
 * @param {Object} params - F&O income parameters
 * @param {number} [params.gains=0] - F&O gains
 * @param {number} [params.losses=0] - F&O losses
 * @returns {FnoIncome} Validated F&O income object
 * @throws {Error} If values are invalid
 */
export function createFnoIncome({ gains = 0, losses = 0 } = {}) {
  if (!Number.isFinite(gains)) {
    throw new Error('F&O gains must be a finite number');
  }
  if (!Number.isFinite(losses)) {
    throw new Error('F&O losses must be a finite number');
  }
  if (gains < 0) {
    throw new Error('F&O gains must be non-negative');
  }
  if (losses < 0) {
    throw new Error('F&O losses must be non-negative');
  }

  return Object.freeze({ gains, losses });
}

/**
 * Creates and validates a TradingIncome object
 * @param {Object} params - Trading income parameters
 * @param {Object} [params.speculative] - Speculative income
 * @param {Object} [params.fno] - F&O income
 * @returns {TradingIncome} Validated trading income object
 */
export function createTradingIncome({ speculative = {}, fno = {} } = {}) {
  return Object.freeze({
    speculative: createSpeculativeIncome(speculative),
    fno: createFnoIncome(fno),
  });
}

/**
 * Calculates net speculative income (gains - losses)
 * @param {SpeculativeIncome} speculative - Speculative income object
 * @returns {number} Net speculative income (can be negative)
 */
export function getNetSpeculativeIncome(speculative) {
  if (!speculative || typeof speculative !== 'object') {
    return 0;
  }
  return (speculative.gains || 0) - (speculative.losses || 0);
}

/**
 * Calculates net F&O income (gains - losses)
 * @param {FnoIncome} fno - F&O income object
 * @returns {number} Net F&O income (can be negative)
 */
export function getNetFnoIncome(fno) {
  if (!fno || typeof fno !== 'object') {
    return 0;
  }
  return (fno.gains || 0) - (fno.losses || 0);
}

/**
 * Calculates total net trading income
 * @param {TradingIncome} trading - Trading income object
 * @returns {number} Total net trading income
 */
export function getTotalNetTradingIncome(trading) {
  if (!trading || typeof trading !== 'object') {
    return 0;
  }
  return getNetSpeculativeIncome(trading.speculative) + getNetFnoIncome(trading.fno);
}

/**
 * Validates a SpeculativeIncome object
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isValidSpeculativeIncome(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const { gains, losses } = value;
  return Number.isFinite(gains) && gains >= 0 &&
         Number.isFinite(losses) && losses >= 0;
}

/**
 * Validates an FnoIncome object
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isValidFnoIncome(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const { gains, losses } = value;
  return Number.isFinite(gains) && gains >= 0 &&
         Number.isFinite(losses) && losses >= 0;
}

/**
 * Creates empty speculative income
 * @returns {SpeculativeIncome} Empty speculative income
 */
export function createEmptySpeculativeIncome() {
  return Object.freeze({ gains: 0, losses: 0 });
}

/**
 * Creates empty F&O income
 * @returns {FnoIncome} Empty F&O income
 */
export function createEmptyFnoIncome() {
  return Object.freeze({ gains: 0, losses: 0 });
}

/**
 * Creates empty trading income
 * @returns {TradingIncome} Empty trading income
 */
export function createEmptyTradingIncome() {
  return Object.freeze({
    speculative: createEmptySpeculativeIncome(),
    fno: createEmptyFnoIncome(),
  });
}
