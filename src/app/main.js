/**
 * Application Entry Point
 * Initializes the entire application when the page loads
 */

import { initializeFormHandlers } from '../ui/components/form-handler.js';
import { initializeViewListeners, resetView } from '../ui/views/appView.js';
import { subscribeToState } from '../app/tax-orchestration/coordinator.js';
import { initializeRegimeSelector } from '../ui/components/regime-selector.js';
import { initializeTabs, updateDeductionsTabForRegime } from '../ui/components/tab-navigation.js';
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

    // Step 4: Initialize tab navigation (TAX-021)
    console.log('Setting up tab navigation...');
    initializeTabs();
    initializeCollapsibleSections();

    // Step 5: Initialize view listeners (state → UI updates)
    console.log('Setting up view listeners...');
    const unsubscribeViewListeners = initializeViewListeners(subscribeToState);

    // Step 6: Initialize field visibility based on default regime
    const initialState = appState.getState();
    updateFieldVisibility(initialState.selectedRegime, initialState.financialYear);
    updateDeductionsTabForRegime(initialState.selectedRegime);

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

  // Update deductions tab based on regime (TAX-021)
  updateDeductionsTabForRegime(newRegime);

  // Clear any previous calculation results since regime changed
  appState.clearCalculations();
}

/**
 * TAX-018: Initialize collapsible sections
 * Sets up click handlers for section toggles
 */
function initializeCollapsibleSections() {
  const toggles = document.querySelectorAll('.section-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const section = toggle.closest('.collapsible-section');
      const content = section.querySelector('.section-content');
      const icon = toggle.querySelector('.toggle-icon');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle state
      toggle.setAttribute('aria-expanded', !isExpanded);
      section.classList.toggle('collapsed', isExpanded);
      
      // Toggle content visibility with animation
      if (isExpanded) {
        content.style.display = 'none';
        icon.textContent = '▶';
      } else {
        content.style.display = 'grid';
        icon.textContent = '▼';
      }
    });
    
    // Keyboard accessibility
    toggle.setAttribute('tabindex', '0');
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });
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
