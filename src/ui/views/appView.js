/**
 * Application View
 * Handles DOM updates and rendering based on application state
 */

import { formatIndianCurrency } from '../../shared/formatting/formatters.js';
import { displayFormErrors, clearFormErrors } from '../components/form-handler.js';
import { updateHeaderFinancialYear } from '../components/headerComponent.js';

/**
 * Updates header display based on application state
 * Called when state changes to sync header with current financial year
 * @param {Object} state - Current application state
 */
function updateHeader(state) {
  if (state && state.financialYear) {
    updateHeaderFinancialYear(state.financialYear);
  }
}

/**
 * Updates validation error display
 * @param {Object} state - Current application state
 */
export function updateValidationErrors(state) {
  const errorContainer = document.getElementById('validation-errors');

  if (!errorContainer) {
    return;
  }

  if (!state.validationErrors || state.validationErrors.length === 0) {
    clearFormErrors(errorContainer);

    // Clear input error states
    clearInputErrors();
  } else {
    displayFormErrors(errorContainer, state.validationErrors);

    // Highlight error inputs based on validation errors
    updateInputErrorStates(state.validationErrors);
  }
}

/**
 * Clears all input error states
 */
function clearInputErrors() {
  const salaryInput = document.getElementById('salary');
  const otherIncomeInput = document.getElementById('other-income');
  const yearInput = document.getElementById('financial-year');

  [salaryInput, otherIncomeInput, yearInput].forEach(input => {
    if (input) {
      input.classList.remove('input-error');
    }
  });
}

/**
 * Updates input error highlighting based on validation errors
 * @param {string[]} errors - Array of error messages
 */
function updateInputErrorStates(errors) {
  clearInputErrors();

  errors.forEach(error => {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('salary')) {
      const input = document.getElementById('salary');
      if (input) {
        input.classList.add('input-error');
      }
    } else if (errorLower.includes('other income')) {
      const input = document.getElementById('other-income');
      if (input) {
        input.classList.add('input-error');
      }
    } else if (errorLower.includes('financial year')) {
      const input = document.getElementById('financial-year');
      if (input) {
        input.classList.add('input-error');
      }
    }
  });
}

/**
 * Updates calculation results display
 * @param {Object} state - Current application state
 */
export function updateCalculationResults(state) {
  if (!state.calculations) {
    // Hide results section if no calculations
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.style.display = 'none';
    }
    return;
  }

  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    resultsSection.style.display = 'block';
  }

  const { oldRegime, newRegime, taxDifference, beneficialRegime } = state.calculations;

  // Update old regime values
  updateRegimeDisplay('old', oldRegime);

  // Update new regime values
  updateRegimeDisplay('new', newRegime);

  // Update comparison summary
  updateComparisonSummary(taxDifference, beneficialRegime);
}

/**
 * Updates a regime column display
 * TAX-013: Enhanced to show detailed breakdown including deductions and rebate
 * @param {string} regime - 'old' or 'new'
 * @param {Object} result - Calculation result object
 */
function updateRegimeDisplay(regime, result) {
  const prefix = regime === 'old' ? 'old' : 'new';

  const elements = {
    grossIncome: document.getElementById(`${prefix}-gross-income`),
    totalDeductions: document.getElementById(`${prefix}-total-deductions`),
    taxableIncome: document.getElementById(`${prefix}-taxable-income`),
    incomeTax: document.getElementById(`${prefix}-income-tax`),
    rebate: document.getElementById(`${prefix}-rebate`),
    surcharge: document.getElementById(`${prefix}-surcharge`),
    cess: document.getElementById(`${prefix}-cess`),
    totalTax: document.getElementById(`${prefix}-total-tax`),
  };

  if (elements.grossIncome) {
    elements.grossIncome.textContent = formatIndianCurrency(result.grossIncome);
  }

  if (elements.totalDeductions) {
    elements.totalDeductions.textContent = formatIndianCurrency(result.totalDeductions || 0);
  }

  if (elements.taxableIncome) {
    elements.taxableIncome.textContent = formatIndianCurrency(result.taxableIncome);
  }

  if (elements.incomeTax) {
    elements.incomeTax.textContent = formatIndianCurrency(result.incomeTax);
  }

  if (elements.rebate) {
    const rebateValue = result.rebate || 0;
    elements.rebate.textContent = rebateValue > 0
      ? `- ${formatIndianCurrency(rebateValue)}`
      : formatIndianCurrency(0);
  }

  if (elements.surcharge) {
    elements.surcharge.textContent = formatIndianCurrency(result.surcharge);
  }

  if (elements.cess) {
    elements.cess.textContent = formatIndianCurrency(result.cess);
  }

  if (elements.totalTax) {
    elements.totalTax.textContent = formatIndianCurrency(result.totalTax);
  }
}

/**
 * Updates comparison summary display
 * @param {number} taxDifference - Difference between old and new regime taxes
 * @param {string} beneficialRegime - Which regime is beneficial
 */
function updateComparisonSummary(taxDifference, beneficialRegime) {
  const differenceElement = document.getElementById('tax-difference');
  const beneficialElement = document.getElementById('beneficial-regime');

  if (differenceElement) {
    const displayValue = Math.abs(taxDifference);
    const prefix = taxDifference > 0 ? '+' : '';
    differenceElement.textContent = `${prefix}${formatIndianCurrency(displayValue)}`;

    // Color code the difference
    if (taxDifference > 0.01) {
      differenceElement.style.color = '#28a745'; // Green for savings
    } else if (taxDifference < -0.01) {
      differenceElement.style.color = '#dc3545'; // Red for cost
    } else {
      differenceElement.style.color = '#667eea'; // Blue for equal
    }
  }

  if (beneficialElement) {
    let displayText = '-';
    if (beneficialRegime === 'old') {
      displayText = 'Old Regime';
    } else if (beneficialRegime === 'new') {
      displayText = 'New Regime';
    } else if (beneficialRegime === 'same') {
      displayText = 'Both are Equal';
    }

    beneficialElement.textContent = displayText;
  }
}

/**
 * Updates form disabled state based on calculation loading
 * @param {Object} state - Current application state
 */
export function updateFormState(state) {
  const form = document.getElementById('tax-form');

  if (!form) {
    return;
  }

  if (state.isCalculating) {
    form.classList.add('loading');
    const inputs = form.querySelectorAll('input, select, button[type="submit"]');
    inputs.forEach(input => {
      input.disabled = true;
    });
  } else {
    form.classList.remove('loading');
    const inputs = form.querySelectorAll('input, select, button[type="submit"]');
    inputs.forEach(input => {
      input.disabled = false;
    });
  }
}

/**
 * Handles complete state update
 * Called whenever application state changes
 * @param {Object} state - New application state
 */
export function handleStateUpdate(state) {
  // Update header first (appears before form)
  updateHeader(state);

  // Update validation errors
  updateValidationErrors(state);

  // Update calculation results
  updateCalculationResults(state);

  // Update form state
  updateFormState(state);
}

/**
 * Initializes all view update listeners
 * Connects state changes to view updates
 * @param {Function} subscribeToState - Subscription function from coordinator
 * @returns {Function} Unsubscribe function
 */
export function initializeViewListeners(subscribeToState) {
  // Subscribe to state updates
  return subscribeToState(handleStateUpdate);
}

/**
 * Resets all view elements to initial state
 */
export function resetView() {
  // Clear error display
  const errorContainer = document.getElementById('validation-errors');
  if (errorContainer) {
    clearFormErrors(errorContainer);
  }

  // Clear input error states
  clearInputErrors();

  // Hide results section
  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }

  // Reset form
  const form = document.getElementById('tax-form');
  if (form) {
    form.reset();
  }

  // Clear all result displays
  const resultElements = document.querySelectorAll('[id$="-gross-income"], [id$="-taxable-income"], [id$="-income-tax"], [id$="-surcharge"], [id$="-cess"], [id$="-total-tax"], [id="tax-difference"], [id="beneficial-regime"]');
  resultElements.forEach(el => {
    if (el.id === 'beneficial-regime') {
      el.textContent = '-';
    } else {
      el.textContent = '₹0';
    }
  });
}
