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
 *
 * TAX-012: Enhanced calculation with deductions support
 */

import { appState } from '../state/appState.js';
import { validateFormSubmission } from '../validation/validators.js';
import { cleanInputForCalculation } from '../input-normalization/normalizers.js';
import { compareRegimes } from '../../domain/tax/calculations/calculation-engine.js';
import { getRegimeRulesForYear } from '../../domain/rules/financial-years/index.js';
import { createIncome } from '../../domain/tax/types/income.js';
import { createDeductions } from '../../domain/tax/types/deductions.js';

/**
 * Orchestrates the complete tax calculation workflow
 * @param {Object} formInput - User form input with all income types
 * @returns {Object} Result { success: boolean, errors?: string[], result?: Object }
 */
export async function orchestrateCalculation(formInput) {
  try {
    console.log('🔍 COORDINATOR: Step 1 - Input Received');
    console.log('Form Input:', formInput);

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

    console.log('🔍 COORDINATOR: Step 2 - Normalized Input');
    console.log('STCG Equity:', normalizedInput.stcgEquity);
    console.log('LTCG Equity:', normalizedInput.ltcgEquity);
    console.log('LTCG Other (Real Estate):', normalizedInput.ltcgOther);
    console.log('Speculative Gains:', normalizedInput.speculativeGains);
    console.log('F&O Gains:', normalizedInput.fnoGains);
    console.log('Interest Income:', normalizedInput.interestIncome);
    console.log('Dividend Income:', normalizedInput.dividendIncome);
    console.log('Other Taxable:', normalizedInput.otherTaxable);

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
      
      // TAX-010: Granular capital gains
      stcgEquity: normalizedInput.stcgEquity,
      stcgOther: normalizedInput.stcgOther,
      ltcgEquity: normalizedInput.ltcgEquity,
      ltcgOther: normalizedInput.ltcgOther,
      
      // TAX-010: Trading income
      speculativeGains: normalizedInput.speculativeGains,
      speculativeLosses: normalizedInput.speculativeLosses,
      fnoGains: normalizedInput.fnoGains,
      fnoLosses: normalizedInput.fnoLosses,
      
      // TAX-010: Expanded other income
      interestIncome: normalizedInput.interestIncome,
      dividendIncome: normalizedInput.dividendIncome,
      otherTaxable: normalizedInput.otherTaxable,
    });

    console.log('🔍 COORDINATOR: Step 4 - Income Object Created');
    console.log('Income Object:', income);

    // Step 5: Create deductions object (extract from form input)
    const deductions = createDeductions({
      standardDeduction: normalizedInput.deductions?.standardDeduction || 0,
      section80C: normalizedInput.deductions?.section80C || 0,
      section80CCD1B: normalizedInput.deductions?.section80CCD1B || 0,
      section80D: normalizedInput.deductions?.section80D || 0,
      section80E: normalizedInput.deductions?.section80E || 0,
      section80G: normalizedInput.deductions?.section80G || 0,
      section80TTA: normalizedInput.deductions?.section80TTA || 0,
      section80TTB: normalizedInput.deductions?.section80TTB || 0,
      hra: normalizedInput.deductions?.hra || 0,
      lta: normalizedInput.deductions?.lta || 0,
      homeLoanInterest: normalizedInput.deductions?.homeLoanInterest || 0,
      otherDeductions: normalizedInput.deductions?.otherDeductions || 0,
    });

    // Step 6: Get rules for the financial year
    const rules = getRegimeRulesForYear(normalizedInput.financialYear);

    // Step 7: Calculate tax for both regimes with deductions
    const calculationResult = compareRegimes(
      income,
      deductions,
      rules.oldRegime,
      rules.newRegime,
    );

    console.log('🔍 COORDINATOR: Step 7 - Calculation Complete');
    console.log('Old Regime Gross Income:', calculationResult.oldRegime?.grossIncome);
    console.log('Old Regime Total Tax:', calculationResult.oldRegime?.totalTax);
    console.log('Special Income Taxes (Old):', {
      ordinaryIncomeTax: calculationResult.oldRegime?.ordinaryIncomeTax,
      stcgTax: calculationResult.oldRegime?.stcgTax,
      ltcgEquityTax: calculationResult.oldRegime?.ltcgEquityTax,
      speculativeTax: calculationResult.oldRegime?.speculativeTax,
      fnoTax: calculationResult.oldRegime?.fnoTax,
    });

    // Step 8: Update app state with results
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
