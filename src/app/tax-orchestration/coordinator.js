/**
 * Tax Orchestration Coordinator
 * Coordinates the flow of calculation:
 * Input → Validation → Normalization → Calculation → Result
 *
 * Income Sources (TAX-004 through TAX-008):
 * - salary: Salary income (TAX-004)
 * - houseProperty: House property income/loss (TAX-005)
 * - business: Business/professional income (TAX-006)
 * - capitalGains: Capital gains (TAX-007)
 * - otherIncome: Other income (TAX-008)
 */

import { appState } from '../state/appState.js';
import { validateFormSubmission } from '../validation/validators.js';
import { cleanInputForCalculation } from '../input-normalization/normalizers.js';
import { compareRegimes } from '../../domain/tax/calculations/calculation-engine.js';
import { getRegimeRulesForYear } from '../../domain/rules/financial-years/index.js';
import { createIncome } from '../../domain/tax/types/income.js';

/**
 * Orchestrates the complete tax calculation workflow
 * @param {Object} formInput - User form input with all income types
 * @returns {Object} Result { success: boolean, errors?: string[], result?: Object }
 */
export async function orchestrateCalculation(formInput) {
  try {
    // Step 1: Validate input
    const validation = validateFormSubmission(formInput);

    if (!validation.isValid) {
      const errorMessages = [];

      // Collect all income field errors (TAX-004 to TAX-008)
      if (validation.errors.salary) {
        errorMessages.push(validation.errors.salary);
      }
      if (validation.errors.houseProperty) {
        errorMessages.push(validation.errors.houseProperty);
      }
      if (validation.errors.business) {
        errorMessages.push(validation.errors.business);
      }
      if (validation.errors.capitalGains) {
        errorMessages.push(validation.errors.capitalGains);
      }
      if (validation.errors.otherIncome) {
        errorMessages.push(validation.errors.otherIncome);
      }
      if (validation.errors.financialYear) {
        errorMessages.push(validation.errors.financialYear);
      }
      if (validation.errors.general && validation.errors.general.length > 0) {
        errorMessages.push(...validation.errors.general);
      }

      appState.setValidationErrors(errorMessages);

      return {
        success: false,
        errors: errorMessages,
      };
    }

    // Clear any previous errors
    appState.clearValidationErrors();

    // Step 2: Normalize input
    const normalizedInput = cleanInputForCalculation(formInput);

    // Step 3: Update app state with all income values
    appState.setIncome({
      salary: normalizedInput.salary,
      houseProperty: normalizedInput.houseProperty,
      business: normalizedInput.business,
      capitalGains: normalizedInput.capitalGains,
      otherIncome: normalizedInput.otherIncome,
    });
    appState.setFinancialYear(normalizedInput.financialYear);
    appState.setIsCalculating(true);

    // Step 4: Create income object with all income types
    const income = createIncome({
      salary: normalizedInput.salary,
      houseProperty: normalizedInput.houseProperty,
      business: normalizedInput.business,
      capitalGains: normalizedInput.capitalGains,
      otherIncome: normalizedInput.otherIncome,
    });

    // Step 5: Get rules for the financial year
    const rules = getRegimeRulesForYear(normalizedInput.financialYear);

    // Step 6: Calculate tax for both regimes
    const calculationResult = compareRegimes(
      income,
      rules.oldRegime,
      rules.newRegime,
    );

    // Step 7: Update app state with results
    appState.setCalculations(calculationResult);
    appState.setIsCalculating(false);

    return {
      success: true,
      result: calculationResult,
    };
  } catch (error) {
    const errorMessage = error.message || 'An unexpected error occurred during calculation';
    console.error('Calculation error:', error);

    appState.clearCalculations();
    appState.setValidationErrors([errorMessage]);
    appState.setIsCalculating(false);

    return {
      success: false,
      errors: [errorMessage],
    };
  }
}

/**
 * Resets the application to initial state
 */
export function resetCalculation() {
  appState.reset();
}

/**
 * Gets the current application state
 * @returns {Object} Current state
 */
export function getCurrentState() {
  return appState.getState();
}

/**
 * Subscribes to state changes
 * @param {Function} listener - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToState(listener) {
  return appState.subscribe(listener);
}
