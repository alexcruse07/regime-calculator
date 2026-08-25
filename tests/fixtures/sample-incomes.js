/**
 * Sample Income Fixtures
 * Reusable test data for income scenarios
 */

/**
 * Sample income scenarios for testing
 * Each scenario represents a realistic income situation
 */
export const sampleIncomes = {
  // Zero income scenario
  zero: {
    salary: 0,
    otherIncome: 0,
    description: 'Zero income',
  },

  // Small income (below tax slab)
  small: {
    salary: 250000,
    otherIncome: 0,
    description: 'Small salary income',
  },

  // Medium income (in tax slab)
  medium: {
    salary: 500000,
    otherIncome: 50000,
    description: 'Medium income with other income',
  },

  // Slab boundary: Just below ₹5 lakh
  belowFiveLakh: {
    salary: 499999,
    otherIncome: 0,
    description: 'Just below ₹5 lakh',
  },

  // Slab boundary: Exactly at ₹5 lakh
  exactlyFiveLakh: {
    salary: 500000,
    otherIncome: 0,
    description: 'Exactly at ₹5 lakh',
  },

  // Slab boundary: Just above ₹5 lakh
  aboveFiveLakh: {
    salary: 500001,
    otherIncome: 0,
    description: 'Just above ₹5 lakh',
  },

  // High income
  high: {
    salary: 1000000,
    otherIncome: 200000,
    description: 'High income',
  },

  // Very high income (with surcharge)
  veryHigh: {
    salary: 5000000,
    otherIncome: 1000000,
    description: 'Very high income',
  },

  // Income with significant other income
  otherIncomeHeavy: {
    salary: 250000,
    otherIncome: 300000,
    description: 'Other income-heavy scenario',
  },

  // Edge case: Large other income, small salary
  edgeCaseOtherIncomeOnly: {
    salary: 100000,
    otherIncome: 2000000,
    description: 'Mostly other income',
  },

  // Typical middle class income
  typicalMiddleClass: {
    salary: 800000,
    otherIncome: 100000,
    description: 'Typical middle class income',
  },

  // Typical high earner
  typicalHighEarner: {
    salary: 2500000,
    otherIncome: 500000,
    description: 'Typical high earner income',
  },

  // Fringe benefit scenario
  withFringeBenefits: {
    salary: 600000,
    otherIncome: 50000,
    description: 'Income with fringe benefits consideration',
  },

  // Professional income
  professionalIncome: {
    salary: 0,
    otherIncome: 1000000,
    description: 'Professional/business income',
  },
};

/**
 * Gets a sample income by key
 * @param {string} key - The key of the sample income
 * @returns {Object} The sample income object
 * @throws {Error} If key not found
 */
export function getSampleIncome(key) {
  if (!(key in sampleIncomes)) {
    throw new Error(`Sample income "${key}" not found`);
  }

  return { ...sampleIncomes[key] };
}

/**
 * Gets all sample income keys
 * @returns {string[]} Array of all available keys
 */
export function getAllSampleIncomeKeys() {
  return Object.keys(sampleIncomes);
}

/**
 * Creates a custom income object
 * @param {number} salary - Salary income
 * @param {number} otherIncome - Other income
 * @param {string} description - Optional description
 * @returns {Object} Income object
 */
export function createIncome(salary, otherIncome, description = '') {
  return {
    salary: Math.max(0, salary),
    otherIncome: Math.max(0, otherIncome),
    description,
  };
}

/**
 * Creates an income object from a gross total
 * @param {number} total - Total gross income
 * @param {number} salaryPercentage - Percentage of total that is salary (0-100)
 * @param {string} description - Optional description
 * @returns {Object} Income object
 */
export function createIncomeFromTotal(total, salaryPercentage = 80, description = '') {
  const salary = (total * salaryPercentage) / 100;
  const otherIncome = total - salary;

  return {
    salary,
    otherIncome,
    description,
  };
}

/**
 * Test data for boundary conditions
 */
export const boundaryIncomes = {
  // Old Regime boundaries (FY 2024-25)
  oldRegime: {
    noTax: 250000,
    slabStart1: 250001,
    slabBoundary1: 500000,
    slabStart2: 500001,
    slabBoundary2: 1000000,
    slabStart3: 1000001,
    slabBoundary3: 1500000,
  },

  // New Regime boundaries (FY 2024-25)
  newRegime: {
    noTax: 300000,
    slabStart1: 300001,
    slabBoundary1: 600000,
    slabStart2: 600001,
    slabBoundary2: 900000,
    slabStart3: 900001,
    slabBoundary3: 1200000,
    slabStart4: 1200001,
    slabBoundary4: 1500000,
  },
};

/**
 * Generates test cases around a boundary
 * @param {number} boundary - The boundary value
 * @returns {Object} Object with below, at, and above boundary values
 */
export function generateBoundaryCases(boundary) {
  return {
    below: boundary - 1,
    at: boundary,
    above: boundary + 1,
  };
}
