/**
 * Application Entry Point
 * Initializes the entire application when the page loads
 */

import { initializeFormHandlers } from '../ui/components/form-handler.js';
import { initializeViewListeners, resetView } from '../ui/views/appView.js';
import { subscribeToState } from '../app/tax-orchestration/coordinator.js';

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

    // Step 3: Initialize view listeners (state → UI updates)
    console.log('Setting up view listeners...');
    const unsubscribeViewListeners = initializeViewListeners(subscribeToState);

    // Step 4: Reset view to initial state
    console.log('Resetting view to initial state...');
    resetView();

    // Step 5: Log successful initialization
    console.log('✓ Application initialized successfully');

    // Return cleanup function for testing/teardown
    return () => {
      unsubscribeFormHandlers();
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
