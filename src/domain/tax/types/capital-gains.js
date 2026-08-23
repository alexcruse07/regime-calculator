/**
 * Capital Gains Type Definition
 * Granular capital gains breakdown for TAX-010
 *
 * Replaces generic capitalGains with:
 * - STCG on listed equity (15% rate)
 * - STCG on other assets (slab rates)
 * - LTCG on listed equity (10% > ₹1L)
 * - LTCG on other assets (20% with indexation)
 */

/**
 * @typedef {Object} CapitalGains
 * Represents capital gains breakdown
 *
 * @property {number} stcgEquity - Short-term capital gains on listed equity (₹, ≥ 0)
 * @property {number} stcgOther - Short-term capital gains on other assets (₹, ≥ 0)
 * @property {number} ltcgEquity - Long-term capital gains on listed equity (₹, ≥ 0)
 * @property {number} ltcgOther - Long-term capital gains on other assets (₹, ≥ 0)
 *
 * @example
 * const capitalGains = {
 *   stcgEquity: 50000,   // 15% flat rate
 *   stcgOther: 25000,    // Taxed at slab rates
 *   ltcgEquity: 150000,  // 10% above ₹1L exemption
 *   ltcgOther: 100000,   // 20% with indexation benefit
 * };
 */

/**
 * Creates and validates a CapitalGains object
 * @param {Object} params - Capital gains parameters
 * @param {number} [params.stcgEquity=0] - STCG on listed equity
 * @param {number} [params.stcgOther=0] - STCG on other assets
 * @param {number} [params.ltcgEquity=0] - LTCG on listed equity
 * @param {number} [params.ltcgOther=0] - LTCG on other assets
 * @returns {CapitalGains} Validated capital gains object
 * @throws {Error} If values are invalid
 */
export function createCapitalGains({
  stcgEquity = 0,
  stcgOther = 0,
  ltcgEquity = 0,
  ltcgOther = 0,
} = {}) {
  // Validate all values are finite numbers
  if (!Number.isFinite(stcgEquity)) {
    throw new Error('STCG Equity must be a finite number');
  }
  if (!Number.isFinite(stcgOther)) {
    throw new Error('STCG Other must be a finite number');
  }
  if (!Number.isFinite(ltcgEquity)) {
    throw new Error('LTCG Equity must be a finite number');
  }
  if (!Number.isFinite(ltcgOther)) {
    throw new Error('LTCG Other must be a finite number');
  }

  // Validate non-negativity
  if (stcgEquity < 0) {
    throw new Error('STCG Equity must be non-negative');
  }
  if (stcgOther < 0) {
    throw new Error('STCG Other must be non-negative');
  }
  if (ltcgEquity < 0) {
    throw new Error('LTCG Equity must be non-negative');
  }
  if (ltcgOther < 0) {
    throw new Error('LTCG Other must be non-negative');
  }

  return Object.freeze({
    stcgEquity,
    stcgOther,
    ltcgEquity,
    ltcgOther,
  });
}

/**
 * Calculates total short-term capital gains
 * @param {CapitalGains} capitalGains - Capital gains object
 * @returns {number} Total STCG
 */
export function getTotalSTCG(capitalGains) {
  if (!capitalGains || typeof capitalGains !== 'object') {
    return 0;
  }
  return (capitalGains.stcgEquity || 0) + (capitalGains.stcgOther || 0);
}

/**
 * Calculates total long-term capital gains
 * @param {CapitalGains} capitalGains - Capital gains object
 * @returns {number} Total LTCG
 */
export function getTotalLTCG(capitalGains) {
  if (!capitalGains || typeof capitalGains !== 'object') {
    return 0;
  }
  return (capitalGains.ltcgEquity || 0) + (capitalGains.ltcgOther || 0);
}

/**
 * Calculates total capital gains (STCG + LTCG)
 * @param {CapitalGains} capitalGains - Capital gains object
 * @returns {number} Total capital gains
 */
export function getTotalCapitalGains(capitalGains) {
  return getTotalSTCG(capitalGains) + getTotalLTCG(capitalGains);
}

/**
 * Validates a capital gains object
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid CapitalGains object
 */
export function isValidCapitalGains(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const { stcgEquity, stcgOther, ltcgEquity, ltcgOther } = value;

  // All fields must be finite numbers
  if (!Number.isFinite(stcgEquity) || !Number.isFinite(stcgOther) ||
      !Number.isFinite(ltcgEquity) || !Number.isFinite(ltcgOther)) {
    return false;
  }

  // All fields must be non-negative
  if (stcgEquity < 0 || stcgOther < 0 || ltcgEquity < 0 || ltcgOther < 0) {
    return false;
  }

  return true;
}

/**
 * Creates an empty capital gains object with all zeros
 * @returns {CapitalGains} Empty capital gains object
 */
export function createEmptyCapitalGains() {
  return Object.freeze({
    stcgEquity: 0,
    stcgOther: 0,
    ltcgEquity: 0,
    ltcgOther: 0,
  });
}

/**
 * Converts legacy flat capital gains to granular structure
 * Places entire amount in stcgOther as a safe default
 * @param {number} legacyCapitalGains - Legacy single capital gains value
 * @returns {CapitalGains} Granular capital gains object
 */
export function fromLegacyCapitalGains(legacyCapitalGains) {
  const amount = Number.isFinite(legacyCapitalGains) && legacyCapitalGains >= 0
    ? legacyCapitalGains
    : 0;

  return createCapitalGains({
    stcgEquity: 0,
    stcgOther: amount,  // Default to STCG Other (slab rates) for backward compatibility
    ltcgEquity: 0,
    ltcgOther: 0,
  });
}
