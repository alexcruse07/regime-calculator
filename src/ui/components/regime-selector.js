/**
 * Regime Selector Component
 * UI component for selecting tax regime (Old, New, or Compare)
 *
 * This component handles:
 * - Initialization of regime radio button listeners
 * - Getting/setting the selected regime value
 * - Updating available regimes based on financial year
 *
 * @module ui/components/regime-selector
 */

import { REGIMES, DEFAULT_REGIME, isValidRegime } from '../../shared/constants/regimes.js';

/**
 * Selector for the regime radio inputs
 * @type {string}
 */
const REGIME_INPUT_SELECTOR = 'input[name="tax-regime"]';

/**
 * Selector for the regime selection container
 * @type {string}
 */
const REGIME_GROUP_SELECTOR = '#regime-selection-group';

/**
 * Gets the currently selected regime from the DOM
 * @returns {string} The selected regime value ('old' | 'new' | 'compare')
 */
export function getSelectedRegime() {
  const selectedInput = document.querySelector(`${REGIME_INPUT_SELECTOR}:checked`);

  if (selectedInput && isValidRegime(selectedInput.value)) {
    return selectedInput.value;
  }

  return DEFAULT_REGIME;
}

/**
 * Sets the selected regime in the DOM
 * @param {string} regime - The regime to select ('old' | 'new' | 'compare')
 * @returns {boolean} True if successfully set, false otherwise
 */
export function setSelectedRegime(regime) {
  if (!isValidRegime(regime)) {
    console.warn(`Invalid regime value: ${regime}`);
    return false;
  }

  const input = document.getElementById(`regime-${regime}`);

  if (input) {
    input.checked = true;
    return true;
  }

  console.warn(`Regime input element not found: regime-${regime}`);
  return false;
}

/**
 * Initializes regime selector event listeners
 * @param {Function} onRegimeChange - Callback function when regime changes
 *   Called with (newRegime: string) parameter
 * @returns {Function} Cleanup function to remove event listeners
 */
export function initializeRegimeSelector(onRegimeChange) {
  const regimeInputs = document.querySelectorAll(REGIME_INPUT_SELECTOR);

  if (regimeInputs.length === 0) {
    console.warn('No regime selector inputs found in DOM');
    return () => {}; // Return no-op cleanup
  }

  /**
   * Handler for regime change events
   * @param {Event} event - Change event
   */
  function handleRegimeChange(event) {
    const newRegime = event.target.value;

    if (isValidRegime(newRegime)) {
      if (typeof onRegimeChange === 'function') {
        onRegimeChange(newRegime);
      }
    }
  }

  // Add change listeners to all regime radio inputs
  regimeInputs.forEach(input => {
    input.addEventListener('change', handleRegimeChange);
  });

  // Return cleanup function
  return () => {
    regimeInputs.forEach(input => {
      input.removeEventListener('change', handleRegimeChange);
    });
  };
}

/**
 * Updates the regime selector to reflect available regimes for a financial year
 * Some financial years may only support specific regimes
 *
 * @param {string[]} availableRegimes - Array of available regime identifiers
 */
export function updateAvailableRegimes(availableRegimes) {
  const regimeGroup = document.querySelector(REGIME_GROUP_SELECTOR);

  if (!regimeGroup) {
    return;
  }

  // Get all regime options
  const regimeOptions = regimeGroup.querySelectorAll('.regime-option');

  regimeOptions.forEach(option => {
    const input = option.querySelector('input[type="radio"]');

    if (input) {
      const regime = input.value;
      const isAvailable = availableRegimes.includes(regime);

      // Disable/enable based on availability
      input.disabled = !isAvailable;
      option.style.opacity = isAvailable ? '1' : '0.5';
      option.setAttribute('aria-disabled', !isAvailable);

      // If current selection is disabled, switch to first available
      if (input.checked && !isAvailable) {
        const firstAvailable = availableRegimes[0];
        if (firstAvailable) {
          setSelectedRegime(firstAvailable);
        }
      }
    }
  });
}

/**
 * Resets the regime selector to default state
 */
export function resetRegimeSelector() {
  setSelectedRegime(DEFAULT_REGIME);

  // Re-enable all options
  updateAvailableRegimes([REGIMES.OLD, REGIMES.NEW, REGIMES.COMPARE]);
}

/**
 * Gets the regime selector container element
 * @returns {HTMLElement|null} The regime selector container element
 */
export function getRegimeSelectorElement() {
  return document.querySelector(REGIME_GROUP_SELECTOR);
}

/**
 * Shows or hides the regime selector
 * @param {boolean} visible - Whether to show the selector
 */
export function setRegimeSelectorVisible(visible) {
  const container = getRegimeSelectorElement();

  if (container) {
    container.style.display = visible ? '' : 'none';
    container.setAttribute('aria-hidden', !visible);
  }
}
