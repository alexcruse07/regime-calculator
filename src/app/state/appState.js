/**
 * Application State Management
 * Manages the application state in an immutable way
 *
 * Income Sources (TAX-004 through TAX-008):
 * - salary: Salary income (TAX-004)
 * - houseProperty: House property income/loss (TAX-005)
 * - business: Business/professional income (TAX-006)
 * - capitalGains: Capital gains (TAX-007) - kept separate for special treatment
 * - otherIncome: Other income (TAX-008)
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
      salary: 0,
      houseProperty: 0,
      business: 0,
      capitalGains: 0,
      otherIncome: 0,
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
   * Sets all income values at once
   * @param {Object} income - Income object with all income sources
   * @param {number} [income.salary=0] - Salary income
   * @param {number} [income.houseProperty=0] - House property income/loss
   * @param {number} [income.business=0] - Business income
   * @param {number} [income.capitalGains=0] - Capital gains
   * @param {number} [income.otherIncome=0] - Other income
   */
  setIncome(income) {
    this.state = {
      ...this.state,
      income: {
        salary: Math.max(0, income.salary || 0),
        houseProperty: income.houseProperty || 0, // Can be negative (loss)
        business: Math.max(0, income.business || 0),
        capitalGains: Math.max(0, income.capitalGains || 0),
        otherIncome: Math.max(0, income.otherIncome || 0),
      },
    };
    this.notifyListeners();
  }

  /**
   * Sets a single income field
   * @param {string} field - Income field name
   * @param {number} value - Income value
   */
  setIncomeField(field, value) {
    const validFields = ['salary', 'houseProperty', 'business', 'capitalGains', 'otherIncome'];
    if (!validFields.includes(field)) {
      console.warn(`Invalid income field: ${field}`);
      return;
    }

    // House property can be negative (loss), others must be non-negative
    const normalizedValue = field === 'houseProperty' ? value : Math.max(0, value);

    this.state = {
      ...this.state,
      income: {
        ...this.state.income,
        [field]: normalizedValue,
      },
    };
    this.notifyListeners();
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
