/**
 * Application State Management
 * Manages the application state in an immutable way
 *
 * Income Sources (TAX-004 through TAX-008, TAX-010):
 * - salary: Salary income (TAX-004)
 * - houseProperty: House property income/loss (TAX-005)
 * - business: Business/professional income (TAX-006)
 * - capitalGains: Granular capital gains (TAX-010)
 * - tradingIncome: Speculative and F&O income (TAX-010)
 * - otherIncome: Expanded other income (TAX-010)
 *
 * Deductions (TAX-010):
 * - All Chapter VI-A deductions and exemptions
 *
 * Regime Selection (TAX-009):
 * - selectedRegime: 'old' | 'new' | 'compare'
 */

import { DEFAULT_REGIME, isValidRegime } from '../../shared/constants/regimes.js';

/**
 * Creates the initial application state
 * @returns {Object} Initial state object
 */
function createInitialState() {
  return {
    income: {
      // Basic income (TAX-004 to TAX-006)
      salary: 0,
      houseProperty: 0,
      business: 0,

      // Legacy fields (backward compatibility)
      capitalGains: 0,
      otherIncome: 0,

      // TAX-010: Granular capital gains
      capitalGainsDetailed: {
        stcgEquity: 0,
        stcgOther: 0,
        ltcgEquity: 0,
        ltcgOther: 0,
      },

      // TAX-010: Trading income
      tradingIncome: {
        speculative: {
          gains: 0,
          losses: 0,
        },
        fno: {
          gains: 0,
          losses: 0,
        },
      },

      // TAX-010: Expanded other income
      otherIncomeDetailed: {
        interestIncome: 0,
        dividendIncome: 0,
        otherTaxable: 0,
      },
    },

    // TAX-010: Deductions
    deductions: {
      standardDeduction: 0,
      section80C: 0,
      section80CCD1B: 0,
      section80D: 0,
      section80E: 0,
      section80G: 0,
      section80TTA: 0,
      section80TTB: 0,
      hra: 0,
      lta: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
    },

    financialYear: '2024-25',
    selectedRegime: DEFAULT_REGIME,  // TAX-009: 'old' | 'new' | 'compare'
    validationErrors: [],
    calculations: null,
    isCalculating: false,
    lastCalculatedAt: null,
  };
}

/**
 * Application State Manager
 * Provides immutable state management with getters and setters
 */
export class AppState {
  constructor() {
    this.state = createInitialState();
    this.listeners = [];
  }

  /**
   * Gets a frozen copy of the current state
   * @returns {Object} Frozen state object
   */
  getState() {
    return Object.freeze(JSON.parse(JSON.stringify(this.state)));
  }

  /**
   * Sets all income values at once (TAX-010 extended)
   * @param {Object} income - Income object with all income sources
   * @param {number} [income.salary=0] - Salary income
   * @param {number} [income.houseProperty=0] - House property income/loss
   * @param {number} [income.business=0] - Business income
   * @param {number} [income.capitalGains=0] - Capital gains (legacy)
   * @param {number} [income.otherIncome=0] - Other income (legacy)
   * @param {Object} [income.capitalGainsDetailed] - Granular capital gains
   * @param {Object} [income.tradingIncome] - Trading income
   * @param {Object} [income.otherIncomeDetailed] - Expanded other income
   */
  setIncome(income) {
    const currentIncome = this.state.income;

    this.state = {
      ...this.state,
      income: {
        // Basic income fields
        salary: Math.max(0, income.salary || 0),
        houseProperty: income.houseProperty || 0, // Can be negative (loss)
        business: Math.max(0, income.business || 0),

        // Legacy fields (backward compatibility)
        capitalGains: Math.max(0, income.capitalGains || 0),
        otherIncome: Math.max(0, income.otherIncome || 0),

        // TAX-010: Granular capital gains
        capitalGainsDetailed: {
          stcgEquity: Math.max(0, income.capitalGainsDetailed?.stcgEquity || currentIncome.capitalGainsDetailed?.stcgEquity || 0),
          stcgOther: Math.max(0, income.capitalGainsDetailed?.stcgOther || currentIncome.capitalGainsDetailed?.stcgOther || 0),
          ltcgEquity: Math.max(0, income.capitalGainsDetailed?.ltcgEquity || currentIncome.capitalGainsDetailed?.ltcgEquity || 0),
          ltcgOther: Math.max(0, income.capitalGainsDetailed?.ltcgOther || currentIncome.capitalGainsDetailed?.ltcgOther || 0),
        },

        // TAX-010: Trading income
        tradingIncome: {
          speculative: {
            gains: Math.max(0, income.tradingIncome?.speculative?.gains || currentIncome.tradingIncome?.speculative?.gains || 0),
            losses: Math.max(0, income.tradingIncome?.speculative?.losses || currentIncome.tradingIncome?.speculative?.losses || 0),
          },
          fno: {
            gains: Math.max(0, income.tradingIncome?.fno?.gains || currentIncome.tradingIncome?.fno?.gains || 0),
            losses: Math.max(0, income.tradingIncome?.fno?.losses || currentIncome.tradingIncome?.fno?.losses || 0),
          },
        },

        // TAX-010: Expanded other income
        otherIncomeDetailed: {
          interestIncome: Math.max(0, income.otherIncomeDetailed?.interestIncome || currentIncome.otherIncomeDetailed?.interestIncome || 0),
          dividendIncome: Math.max(0, income.otherIncomeDetailed?.dividendIncome || currentIncome.otherIncomeDetailed?.dividendIncome || 0),
          otherTaxable: Math.max(0, income.otherIncomeDetailed?.otherTaxable || currentIncome.otherIncomeDetailed?.otherTaxable || 0),
        },
      },
    };
    this.notifyListeners();
  }

  /**
   * Sets a single income field (TAX-010 extended)
   * @param {string} field - Income field name
   * @param {number} value - Income value
   */
  setIncomeField(field, value) {
    // Basic income fields
    const basicFields = ['salary', 'houseProperty', 'business', 'capitalGains', 'otherIncome'];

    // Granular capital gains fields
    const capitalGainsFields = ['stcgEquity', 'stcgOther', 'ltcgEquity', 'ltcgOther'];

    // Trading income fields
    const tradingFields = ['speculativeGains', 'speculativeLosses', 'fnoGains', 'fnoLosses'];

    // Expanded other income fields
    const otherIncomeFields = ['interestIncome', 'dividendIncome', 'otherTaxable'];

    if (basicFields.includes(field)) {
      // House property can be negative (loss), others must be non-negative
      const normalizedValue = field === 'houseProperty' ? value : Math.max(0, value);

      this.state = {
        ...this.state,
        income: {
          ...this.state.income,
          [field]: normalizedValue,
        },
      };
    } else if (capitalGainsFields.includes(field)) {
      this.state = {
        ...this.state,
        income: {
          ...this.state.income,
          capitalGainsDetailed: {
            ...this.state.income.capitalGainsDetailed,
            [field]: Math.max(0, value),
          },
        },
      };
    } else if (tradingFields.includes(field)) {
      const fieldMap = {
        speculativeGains: ['speculative', 'gains'],
        speculativeLosses: ['speculative', 'losses'],
        fnoGains: ['fno', 'gains'],
        fnoLosses: ['fno', 'losses'],
      };
      const [category, subField] = fieldMap[field];

      this.state = {
        ...this.state,
        income: {
          ...this.state.income,
          tradingIncome: {
            ...this.state.income.tradingIncome,
            [category]: {
              ...this.state.income.tradingIncome[category],
              [subField]: Math.max(0, value),
            },
          },
        },
      };
    } else if (otherIncomeFields.includes(field)) {
      this.state = {
        ...this.state,
        income: {
          ...this.state.income,
          otherIncomeDetailed: {
            ...this.state.income.otherIncomeDetailed,
            [field]: Math.max(0, value),
          },
        },
      };
    } else {
      console.warn(`Invalid income field: ${field}`);
      return;
    }

    this.notifyListeners();
  }

  /**
   * Sets all deductions at once (TAX-010)
   * @param {Object} deductions - Deductions object
   */
  setDeductions(deductions) {
    if (!deductions || typeof deductions !== 'object') {
      return;
    }

    this.state = {
      ...this.state,
      deductions: {
        standardDeduction: Math.max(0, deductions.standardDeduction || 0),
        section80C: Math.max(0, deductions.section80C || 0),
        section80CCD1B: Math.max(0, deductions.section80CCD1B || 0),
        section80D: Math.max(0, deductions.section80D || 0),
        section80E: Math.max(0, deductions.section80E || 0),
        section80G: Math.max(0, deductions.section80G || 0),
        section80TTA: Math.max(0, deductions.section80TTA || 0),
        section80TTB: Math.max(0, deductions.section80TTB || 0),
        hra: Math.max(0, deductions.hra || 0),
        lta: Math.max(0, deductions.lta || 0),
        homeLoanInterest: Math.max(0, deductions.homeLoanInterest || 0),
        otherDeductions: Math.max(0, deductions.otherDeductions || 0),
      },
    };
    this.notifyListeners();
  }

  /**
   * Sets a single deduction field (TAX-010)
   * @param {string} field - Deduction field name
   * @param {number} value - Deduction value
   */
  setDeductionField(field, value) {
    const validFields = [
      'standardDeduction', 'section80C', 'section80CCD1B', 'section80D',
      'section80E', 'section80G', 'section80TTA', 'section80TTB',
      'hra', 'lta', 'homeLoanInterest', 'otherDeductions',
    ];

    if (!validFields.includes(field)) {
      console.warn(`Invalid deduction field: ${field}`);
      return;
    }

    this.state = {
      ...this.state,
      deductions: {
        ...this.state.deductions,
        [field]: Math.max(0, value),
      },
    };
    this.notifyListeners();
  }

  /**
   * Gets the current deductions (TAX-010)
   * @returns {Object} Deductions object
   */
  getDeductions() {
    return { ...this.state.deductions };
  }

  /**
   * Sets the financial year
   * @param {string} year - Financial year (e.g., '2024-25')
   */
  setFinancialYear(year) {
    this.state = {
      ...this.state,
      financialYear: year,
    };
    this.notifyListeners();
  }

  /**
   * Sets the selected tax regime (TAX-009)
   * @param {string} regime - Tax regime ('old' | 'new' | 'compare')
   */
  setSelectedRegime(regime) {
    if (!isValidRegime(regime)) {
      console.warn(`Invalid regime: ${regime}`);
      return;
    }

    this.state = {
      ...this.state,
      selectedRegime: regime,
    };
    this.notifyListeners();
  }

  /**
   * Gets the currently selected regime (TAX-009)
   * @returns {string} The selected regime
   */
  getSelectedRegime() {
    return this.state.selectedRegime;
  }

  /**
   * Sets validation errors
   * @param {string[]} errors - Array of error messages
   */
  setValidationErrors(errors) {
    this.state = {
      ...this.state,
      validationErrors: errors || [],
    };
    this.notifyListeners();
  }

  /**
   * Adds a validation error
   * @param {string} error - Error message
   */
  addValidationError(error) {
    if (!this.state.validationErrors.includes(error)) {
      this.state = {
        ...this.state,
        validationErrors: [...this.state.validationErrors, error],
      };
      this.notifyListeners();
    }
  }

  /**
   * Clears validation errors
   */
  clearValidationErrors() {
    this.state = {
      ...this.state,
      validationErrors: [],
    };
    this.notifyListeners();
  }

  /**
   * Sets calculation results
   * @param {Object} calculations - Calculation result object
   */
  setCalculations(calculations) {
    this.state = {
      ...this.state,
      calculations,
      lastCalculatedAt: new Date().toISOString(),
    };
    this.notifyListeners();
  }

  /**
   * Clears calculation results
   */
  clearCalculations() {
    this.state = {
      ...this.state,
      calculations: null,
    };
    this.notifyListeners();
  }

  /**
   * Sets calculation loading state
   * @param {boolean} isCalculating - Whether calculation is in progress
   */
  setIsCalculating(isCalculating) {
    this.state = {
      ...this.state,
      isCalculating,
    };
    this.notifyListeners();
  }

  /**
   * Resets state to initial values
   */
  reset() {
    this.state = createInitialState();
    this.notifyListeners();
  }

  /**
   * Registers a listener for state changes
   * @param {Function} listener - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifies all listeners of state changes
   */
  notifyListeners() {
    const currentState = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }
}

/**
 * Creates and exports a singleton app state instance
 */
export const appState = new AppState();
