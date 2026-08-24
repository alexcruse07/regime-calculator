/**
 * Form Handler
 * Manages form submission and input handling
 *
 * Income Inputs (TAX-004 through TAX-008, TAX-010):
 * - salary: Salary income (TAX-004)
 * - houseProperty: House property income/loss (TAX-005)
 * - business: Business/professional income (TAX-006)
 * - capitalGains: Capital gains (TAX-007/TAX-010 - granular)
 * - otherIncome: Other income (TAX-008/TAX-010 - expanded)
 * - tradingIncome: Speculative and F&O (TAX-010)
 * - deductions: All Chapter VI-A deductions (TAX-010)
 *
 * User Information (TAX-022):
 * - fullName: User's full name (mandatory)
 * - pan: Permanent Account Number (optional)
 *
 * Regime Selection (TAX-009):
 * - taxRegime: 'old' | 'new' | 'compare'
 */

import { orchestrateCalculation, resetCalculation } from '../../app/tax-orchestration/coordinator.js';
import { getSelectedRegime } from './regime-selector.js';
import { DEFAULT_REGIME } from '../../shared/constants/regimes.js';

/**
 * Validates Full Name (TAX-022.1)
 * @param {string} name - Full name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
function validateFullName(name) {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Full Name is required',
    };
  }
  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: 'Full Name must be 100 characters or less',
    };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates PAN format (TAX-022.1)
 * PAN format: AAAAA1234A (5 letters, 4 digits, 1 letter)
 * @param {string} pan - PAN to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
function validatePAN(pan) {
  if (!pan || pan.trim() === '') {
    // PAN is optional
    return { isValid: true, error: '' };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return {
      isValid: false,
      error: 'PAN format should be AAAAA1234A (5 letters, 4 digits, 1 letter)',
    };
  }
  return { isValid: true, error: '' };
}

/**
 * Clears validation error messages from form
 * @param {HTMLElement} errorContainer - The container to clear errors from
 * @returns {void}
 */
function clearFieldErrors() {
  // Clear individual field errors
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((msg) => {
    msg.textContent = '';
  });
}

/**
 * Displays validation error for a field
 * @param {string} fieldId - ID of the field with error
 * @param {string} errorMessage - Error message to display
 * @returns {void}
 */
function showFieldError(fieldId, errorMessage) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
}

/**
 * Handles tax form submission (TAX-010 extended, TAX-022)
 * @param {Event} event - Form submit event
 * @returns {Promise<void>}
 */
export async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Clear previous errors
  clearFormErrors(document.getElementById('validation-errors'));
  clearFieldErrors();

  // TAX-022: Get and validate user information
  const fullName = form.elements['full-name']?.value || '';
  const pan = form.elements['pan']?.value || '';

  const nameValidation = validateFullName(fullName);
  const panValidation = validatePAN(pan);

  if (!nameValidation.isValid) {
    showFieldError('full-name', nameValidation.error);
    return;
  }

  if (!panValidation.isValid) {
    showFieldError('pan', panValidation.error);
    // Don't return here - PAN validation is a warning, not blocking
    // But we could show a warning instead of blocking
  }

  // Debug: Log form and financial year field
  console.log('📋 Form submit triggered');
  console.log('Form element:', form);
  console.log('Form.elements keys:', Object.keys(form.elements));
  const fyField = form.elements['financial-year'];
  console.log('Financial Year field:', fyField);
  console.log('Financial Year value:', fyField?.value);

  // Collect form data including all income types, deductions, regime, and user info
  const formData = {
    // TAX-022: User Information
    fullName: fullName.trim(),
    pan: pan.toUpperCase().trim(),

    // Basic income (TAX-004 to TAX-008)
    salary: form.elements['salary']?.value || '',
    houseProperty: form.elements['house-property']?.value || '',
    business: form.elements['business-income']?.value || '',
    capitalGains: form.elements['capital-gains']?.value || '',
    otherIncome: form.elements['other-income']?.value || '',

    // TAX-010: Granular capital gains
    stcgEquity: form.elements['stcg-equity']?.value || '',
    stcgOther: form.elements['stcg-other']?.value || '',
    ltcgEquity: form.elements['ltcg-equity']?.value || '',
    ltcgOther: form.elements['ltcg-other']?.value || '',

    // TAX-010: Trading income
    speculativeGains: form.elements['speculative-gains']?.value || '',
    speculativeLosses: form.elements['speculative-losses']?.value || '',
    fnoGains: form.elements['fno-gains']?.value || '',
    fnoLosses: form.elements['fno-losses']?.value || '',

    // TAX-010: Expanded other income
    interestIncome: form.elements['interest-income']?.value || '',
    dividendIncome: form.elements['dividend-income']?.value || '',
    otherTaxable: form.elements['other-taxable']?.value || '',

    // TAX-010: Deductions
    deductions: {
      standardDeduction: form.elements['standard-deduction']?.value || '',
      section80C: form.elements['section-80c']?.value || '',
      section80CCD1B: form.elements['section-80ccd1b']?.value || '',
      section80D: form.elements['section-80d']?.value || '',
      section80E: form.elements['section-80e']?.value || '',
      section80G: form.elements['section-80g']?.value || '',
      section80TTA: form.elements['section-80tta']?.value || '',
      section80TTB: form.elements['section-80ttb']?.value || '',
      hra: form.elements['hra']?.value || '',
      lta: form.elements['lta']?.value || '',
      homeLoanInterest: form.elements['home-loan-interest']?.value || '',
      otherDeductions: form.elements['other-deductions']?.value || '',
    },

    financialYear: form.elements['financial-year']?.value || document.getElementById('financial-year')?.value || '',
    taxRegime: getSelectedRegime() || DEFAULT_REGIME,  // TAX-009: Include regime
  };

  // Orchestrate calculation
  const result = await orchestrateCalculation(formData);

  if (!result.success) {
    // Errors are handled by coordinator and state is updated
    // UI layer will read from state and update display
  } else {
    // Enable export button after successful calculation (TAX-022)
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
      exportButton.disabled = false;
    }
  }
}

/**
 * Handles form reset
 * Refreshes the page to clear all state
 * @param {Event} event - Form reset event
 * @returns {void}
 */
export function handleFormReset(event) {
  event.preventDefault();
  
  // Refresh the page to clear all state
  window.location.reload();
}

  // Reset tax regime to new (default)
  const regimeNew = document.getElementById('regime-new');
  const regimeOld = document.getElementById('regime-old');
  if (regimeNew) {
    regimeNew.checked = true;
  }
  if (regimeOld) {
    regimeOld.checked = false;
  }

  // Hide results section
  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }

  // Disable export button (TAX-022)
  const exportButton = document.getElementById('export-button');
  if (exportButton) {
    exportButton.disabled = true;
  }

  // Clear validation errors
  const errorContainer = document.getElementById('validation-errors');
  clearFormErrors(errorContainer);
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
 * Gets form data from form elements (TAX-010 extended)
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data object with all income types, deductions, and regime
 */
export function getFormData(form) {
  if (!form) {
    return {
      salary: '',
      houseProperty: '',
      business: '',
      capitalGains: '',
      otherIncome: '',
      stcgEquity: '',
      stcgOther: '',
      ltcgEquity: '',
      ltcgOther: '',
      speculativeGains: '',
      speculativeLosses: '',
      fnoGains: '',
      fnoLosses: '',
      interestIncome: '',
      dividendIncome: '',
      otherTaxable: '',
      deductions: {},
      financialYear: '',
      taxRegime: DEFAULT_REGIME,
    };
  }

  return {
    // Basic income
    salary: form.elements['salary']?.value || '',
    houseProperty: form.elements['house-property']?.value || '',
    business: form.elements['business-income']?.value || '',
    capitalGains: form.elements['capital-gains']?.value || '',
    otherIncome: form.elements['other-income']?.value || '',

    // TAX-010: Granular capital gains
    stcgEquity: form.elements['stcg-equity']?.value || '',
    stcgOther: form.elements['stcg-other']?.value || '',
    ltcgEquity: form.elements['ltcg-equity']?.value || '',
    ltcgOther: form.elements['ltcg-other']?.value || '',

    // TAX-010: Trading income
    speculativeGains: form.elements['speculative-gains']?.value || '',
    speculativeLosses: form.elements['speculative-losses']?.value || '',
    fnoGains: form.elements['fno-gains']?.value || '',
    fnoLosses: form.elements['fno-losses']?.value || '',

    // TAX-010: Expanded other income
    interestIncome: form.elements['interest-income']?.value || '',
    dividendIncome: form.elements['dividend-income']?.value || '',
    otherTaxable: form.elements['other-taxable']?.value || '',

    // TAX-010: Deductions
    deductions: {
      standardDeduction: form.elements['standard-deduction']?.value || '',
      section80C: form.elements['section-80c']?.value || '',
      section80CCD1B: form.elements['section-80ccd1b']?.value || '',
      section80D: form.elements['section-80d']?.value || '',
      section80E: form.elements['section-80e']?.value || '',
      section80G: form.elements['section-80g']?.value || '',
      section80TTA: form.elements['section-80tta']?.value || '',
      section80TTB: form.elements['section-80ttb']?.value || '',
      hra: form.elements['hra']?.value || '',
      lta: form.elements['lta']?.value || '',
      homeLoanInterest: form.elements['home-loan-interest']?.value || '',
      otherDeductions: form.elements['other-deductions']?.value || '',
    },

    financialYear: form.elements['financial-year']?.value || '',
    taxRegime: getSelectedRegime() || DEFAULT_REGIME,  // TAX-009
  };
}

/**
 * Sets form data to form elements (TAX-010 extended)
 * @param {HTMLFormElement} form - The form element
 * @param {Object} data - Data object with all income and deduction fields
 */
export function setFormData(form, data) {
  if (!form || !data) {
    return;
  }

  // Basic income fields
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

  // TAX-010: Granular capital gains
  if (form.elements['stcg-equity']) {
    form.elements['stcg-equity'].value = data.stcgEquity || '';
  }
  if (form.elements['stcg-other']) {
    form.elements['stcg-other'].value = data.stcgOther || '';
  }
  if (form.elements['ltcg-equity']) {
    form.elements['ltcg-equity'].value = data.ltcgEquity || '';
  }
  if (form.elements['ltcg-other']) {
    form.elements['ltcg-other'].value = data.ltcgOther || '';
  }

  // TAX-010: Trading income
  if (form.elements['speculative-gains']) {
    form.elements['speculative-gains'].value = data.speculativeGains || '';
  }
  if (form.elements['speculative-losses']) {
    form.elements['speculative-losses'].value = data.speculativeLosses || '';
  }
  if (form.elements['fno-gains']) {
    form.elements['fno-gains'].value = data.fnoGains || '';
  }
  if (form.elements['fno-losses']) {
    form.elements['fno-losses'].value = data.fnoLosses || '';
  }

  // TAX-010: Expanded other income
  if (form.elements['interest-income']) {
    form.elements['interest-income'].value = data.interestIncome || '';
  }
  if (form.elements['dividend-income']) {
    form.elements['dividend-income'].value = data.dividendIncome || '';
  }
  if (form.elements['other-taxable']) {
    form.elements['other-taxable'].value = data.otherTaxable || '';
  }

  // TAX-010: Deductions
  const deductions = data.deductions || {};
  if (form.elements['standard-deduction']) {
    form.elements['standard-deduction'].value = deductions.standardDeduction || '';
  }
  if (form.elements['section-80c']) {
    form.elements['section-80c'].value = deductions.section80C || '';
  }
  if (form.elements['section-80ccd1b']) {
    form.elements['section-80ccd1b'].value = deductions.section80CCD1B || '';
  }
  if (form.elements['section-80d']) {
    form.elements['section-80d'].value = deductions.section80D || '';
  }
  if (form.elements['section-80e']) {
    form.elements['section-80e'].value = deductions.section80E || '';
  }
  if (form.elements['section-80g']) {
    form.elements['section-80g'].value = deductions.section80G || '';
  }
  if (form.elements['section-80tta']) {
    form.elements['section-80tta'].value = deductions.section80TTA || '';
  }
  if (form.elements['section-80ttb']) {
    form.elements['section-80ttb'].value = deductions.section80TTB || '';
  }
  if (form.elements['hra']) {
    form.elements['hra'].value = deductions.hra || '';
  }
  if (form.elements['lta']) {
    form.elements['lta'].value = deductions.lta || '';
  }
  if (form.elements['home-loan-interest']) {
    form.elements['home-loan-interest'].value = deductions.homeLoanInterest || '';
  }
  if (form.elements['other-deductions']) {
    form.elements['other-deductions'].value = deductions.otherDeductions || '';
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
