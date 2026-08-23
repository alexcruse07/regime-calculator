/**
 * Form Handler
 * Manages form submission and input handling
 *
 * Income Inputs (TAX-004 through TAX-008):
 * - salary: Salary income (TAX-004)
 * - houseProperty: House property income/loss (TAX-005)
 * - business: Business/professional income (TAX-006)
 * - capitalGains: Capital gains (TAX-007)
 * - otherIncome: Other income (TAX-008)
 *
 * Regime Selection (TAX-009):
 * - taxRegime: 'old' | 'new' | 'compare'
 */

import { orchestrateCalculation, resetCalculation } from '../../app/tax-orchestration/coordinator.js';
import { getSelectedRegime } from './regime-selector.js';
import { DEFAULT_REGIME } from '../../shared/constants/regimes.js';

/**
 * Handles tax form submission
 * @param {Event} event - Form submit event
 * @returns {Promise<void>}
 */
export async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Collect form data including all income types (TAX-004 to TAX-008) and regime (TAX-009)
  const formData = {
    salary: form.elements['salary']?.value || '',
    houseProperty: form.elements['house-property']?.value || '',
    business: form.elements['business-income']?.value || '',
    capitalGains: form.elements['capital-gains']?.value || '',
    otherIncome: form.elements['other-income']?.value || '',
    financialYear: form.elements['financial-year']?.value || '',
    taxRegime: getSelectedRegime() || DEFAULT_REGIME,  // TAX-009: Include regime
  };

  // Orchestrate calculation
  const result = await orchestrateCalculation(formData);

  if (!result.success) {
    // Errors are handled by coordinator and state is updated
    // UI layer will read from state and update display
  }
}

/**
 * Handles form reset
 * @param {Event} event - Form reset event
 * @returns {void}
 */
export function handleFormReset(event) {
  event.preventDefault();

  // Reset application state
  resetCalculation();

  // Reset form elements
  const form = event.target;
  form.reset();
}

/**
 * Initializes form event listeners
 * @param {HTMLFormElement} form - The form element
 * @returns {Function} Cleanup function to remove listeners
 */
export function initializeFormHandlers(form) {
  if (!form) {
    throw new Error('Form element not found');
  }

  // Add form submit listener
  form.addEventListener('submit', handleFormSubmit);

  // Add form reset listener
  form.addEventListener('reset', handleFormReset);

  // Return cleanup function
  return () => {
    form.removeEventListener('submit', handleFormSubmit);
    form.removeEventListener('reset', handleFormReset);
  };
}

/**
 * Gets form data from form elements
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data object with all income types and regime
 */
export function getFormData(form) {
  if (!form) {
    return {
      salary: '',
      houseProperty: '',
      business: '',
      capitalGains: '',
      otherIncome: '',
      financialYear: '',
      taxRegime: DEFAULT_REGIME,
    };
  }

  return {
    salary: form.elements['salary']?.value || '',
    houseProperty: form.elements['house-property']?.value || '',
    business: form.elements['business-income']?.value || '',
    capitalGains: form.elements['capital-gains']?.value || '',
    otherIncome: form.elements['other-income']?.value || '',
    financialYear: form.elements['financial-year']?.value || '',
    taxRegime: getSelectedRegime() || DEFAULT_REGIME,  // TAX-009
  };
}

/**
 * Sets form data to form elements
 * @param {HTMLFormElement} form - The form element
 * @param {Object} data - Data object with all income fields
 */
export function setFormData(form, data) {
  if (!form || !data) {
    return;
  }

  if (form.elements['salary']) {
    form.elements['salary'].value = data.salary || '';
  }

  if (form.elements['house-property']) {
    form.elements['house-property'].value = data.houseProperty || '';
  }

  if (form.elements['business-income']) {
    form.elements['business-income'].value = data.business || '';
  }

  if (form.elements['capital-gains']) {
    form.elements['capital-gains'].value = data.capitalGains || '';
  }

  if (form.elements['other-income']) {
    form.elements['other-income'].value = data.otherIncome || '';
  }

  if (form.elements['financial-year']) {
    form.elements['financial-year'].value = data.financialYear || '';
  }
}

/**
 * Disables or enables form submission
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} disabled - Whether to disable
 */
export function setFormDisabled(form, disabled) {
  if (!form) {
    return;
  }

  const inputs = form.querySelectorAll('input, select, button');
  inputs.forEach(input => {
    input.disabled = disabled;
  });
}

/**
 * Clears form errors display
 * Uses replaceChildren() for safe DOM manipulation
 * @param {HTMLElement} errorContainer - Error display container
 */
export function clearFormErrors(errorContainer) {
  if (!errorContainer) {
    return;
  }

  errorContainer.replaceChildren();
  errorContainer.style.display = 'none';
}

/**
 * Displays form validation errors
 * @param {HTMLElement} errorContainer - Error display container
 * @param {string[]} errors - Array of error messages
 */
export function displayFormErrors(errorContainer, errors) {
  if (!errorContainer) {
    return;
  }

  if (!errors || errors.length === 0) {
    clearFormErrors(errorContainer);
    return;
  }

  errorContainer.replaceChildren();

  errors.forEach(error => {
    const errorItem = document.createElement('div');
    errorItem.className = 'error-item';
    errorItem.textContent = error;
    errorContainer.appendChild(errorItem);
  });

  errorContainer.style.display = 'block';
}

/**
 * Highlights an input field with error state
 * @param {HTMLInputElement|HTMLSelectElement} element - Form element
 * @param {boolean} hasError - Whether element has error
 */
export function setInputError(element, hasError) {
  if (!element) {
    return;
  }

  if (hasError) {
    element.classList.add('input-error');
    element.setAttribute('aria-invalid', 'true');
  } else {
    element.classList.remove('input-error');
    element.setAttribute('aria-invalid', 'false');
  }
}

/**
 * Gets all form validation errors for individual fields
 * @param {Object} validationErrors - Validation result from validators
 * @returns {Object} Field-specific errors
 */
export function getFieldErrors(validationErrors) {
  return {
    salary: validationErrors?.errors?.salary || null,
    houseProperty: validationErrors?.errors?.houseProperty || null,
    business: validationErrors?.errors?.business || null,
    capitalGains: validationErrors?.errors?.capitalGains || null,
    otherIncome: validationErrors?.errors?.otherIncome || null,
    financialYear: validationErrors?.errors?.financialYear || null,
  };
}
