/**
 * Application Entry Point
 * Initializes the entire application when the page loads
 */

import { initializeFormHandlers } from '../ui/components/form-handler.js';
import { initializeViewListeners, resetView } from '../ui/views/appView.js';
import { subscribeToState } from '../app/tax-orchestration/coordinator.js';
import { initializeRegimeSelector } from '../ui/components/regime-selector.js';
import { appState } from './state/appState.js';
import { updateFieldVisibility } from './form-visibility/form-visibility-controller.js';

/**
 * Initializes the application
 * Sets up all event listeners and state subscriptions
 */
function initializeApp() {
  // Log initialization start
  console.log('Initializing Indian Income Tax Calculator...');

  try {
    // Step 1: Get DOM elements
    const form = document.getElementById('tax-form');

    if (!form) {
      throw new Error('Form element (#tax-form) not found in DOM');
    }

    // Step 2: Initialize form handlers
    console.log('Setting up form handlers...');
    const unsubscribeFormHandlers = initializeFormHandlers(form);

    // Step 3: Initialize regime selector (TAX-009)
    console.log('Setting up regime selector...');
    const unsubscribeRegimeSelector = initializeRegimeSelector(handleRegimeChange);

    // Step 4: Initialize FY listener for header badge sync
    console.log('Setting up FY listener...');
    initializeFYListener();
    initializeNewRegimeNotice();

    // Step 5: Initialize view listeners (state → UI updates)
    console.log('Setting up view listeners...');
    const unsubscribeViewListeners = initializeViewListeners(subscribeToState);

    // Step 6: Initialize field visibility based on default regime
    const initialState = appState.getState();
    updateFieldVisibility(initialState.selectedRegime, initialState.financialYear);
    updateNewRegimeNotice(initialState.selectedRegime);

    // Step 7: Reset view to initial state
    console.log('Resetting view to initial state...');
    resetView();

    // Step 8: Log successful initialization
    console.log('✓ Application initialized successfully');

    // Return cleanup function for testing/teardown
    return () => {
      unsubscribeFormHandlers();
      unsubscribeRegimeSelector();
      unsubscribeViewListeners();
      console.log('Application cleaned up');
    };
  } catch (error) {
    console.error('✗ Failed to initialize application:', error);
    displayErrorMessage(error.message);
    throw error;
  }
}

/**
 * Handles regime change from the regime selector
 * Updates state and field visibility
 * @param {string} newRegime - The newly selected regime
 */
function handleRegimeChange(newRegime) {
  // Update state
  appState.setSelectedRegime(newRegime);

  // Get current financial year from state
  const state = appState.getState();

  // Update field visibility based on new regime
  updateFieldVisibility(newRegime, state.financialYear);

  // Update new regime notice
  updateNewRegimeNotice(newRegime);

  // Clear any previous calculation results since regime changed
  appState.clearCalculations();
}

/**
 * Initialize FY listener for header badge sync
 */
function initializeFYListener() {
  const fySelect = document.getElementById('financial-year');
  const fyBadge = document.getElementById('current-fy');
  
  if (fySelect && fyBadge) {
    // Set initial value
    fyBadge.textContent = fySelect.value;
    
    fySelect.addEventListener('change', (e) => {
      fyBadge.textContent = e.target.value;
      // Also update app state
      appState.setFinancialYear(e.target.value);
    });
  }
}

/**
 * Initialize new regime notice visibility handler
 */
function initializeNewRegimeNotice() {
  const notice = document.getElementById('new-regime-notice');
  if (notice) {
    const state = appState.getState();
    notice.style.display = state.selectedRegime === 'new' ? 'block' : 'none';
  }
}

/**
 * Update new regime notice visibility
 * @param {string} regime - Current regime
 */
function updateNewRegimeNotice(regime) {
  const notice = document.getElementById('new-regime-notice');
  if (notice) {
    notice.style.display = regime === 'new' ? 'block' : 'none';
  }
}

/**
 * Displays an error message to the user
 * Used for initialization errors
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
  const app = document.getElementById('app');
  if (!app) {
    return;
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.style.cssText = 'padding: 1rem; margin: 1rem 0; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;';
  errorDiv.textContent = `Error: ${message}`;

  app.insertBefore(errorDiv, app.firstChild);
}

/**
 * Waits for DOM to be fully loaded
 * Returns a promise that resolves when ready
 * @returns {Promise<void>}
 */
function waitForDOMReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Main application entry point
 * Waits for DOM to load, then initializes the app
 */
async function main() {
  try {
    // Wait for DOM to be ready
    await waitForDOMReady();

    // Initialize application
    const cleanup = initializeApp();

    // Make cleanup available globally for testing
    if (typeof window !== 'undefined') {
      window.__appCleanup = cleanup;
    }
  } catch (error) {
    console.error('Fatal error during application startup:', error);
  }
}

// Start the application
main();

// Export for testing
export { initializeApp, main };
