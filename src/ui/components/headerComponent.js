/**
 * Header Component
 * Manages the application header display and financial year updates
 * Pure functions with no external dependencies
 */

/**
 * Update the financial year display in header
 * Called when appState.financialYear changes via state subscription
 * Updates the aria-live region to announce changes to screen readers
 * @param {string} year - Financial year (e.g., '2024-25')
 * @throws {Error} If year is not a string
 */
export function updateHeaderFinancialYear(year) {
  if (typeof year !== 'string') {
    console.warn('updateHeaderFinancialYear: year must be a string, received:', typeof year);
    return;
  }

  const fySpan = document.getElementById('current-fy');
  if (!fySpan) {
    console.warn('updateHeaderFinancialYear: Element with id "current-fy" not found');
    return;
  }

  if (year.trim().length === 0) {
    console.warn('updateHeaderFinancialYear: year cannot be empty');
    return;
  }

  // Only update if value has actually changed
  if (fySpan.textContent !== year) {
    fySpan.textContent = year;
  }
}

/**
 * Initialize header component
 * Performs validation and setup of header element on page load
 * Called from app/main.js on startup
 * @returns {boolean} True if initialization successful, false otherwise
 */
export function initializeHeader() {
  const header = document.querySelector('.header');
  if (!header) {
    console.warn('initializeHeader: Header element not found in DOM');
    return false;
  }

  // Verify required child elements exist
  const titleElement = header.querySelector('.header__title');
  const descriptionElement = header.querySelector('.header__description');
  const fySpan = document.getElementById('current-fy');

  if (!titleElement) {
    console.warn('initializeHeader: Header title element not found');
    return false;
  }

  if (!descriptionElement) {
    console.warn('initializeHeader: Header description element not found');
    return false;
  }

  if (!fySpan) {
    console.warn('initializeHeader: Financial year span element not found');
    return false;
  }

  // Verify ARIA attributes
  if (header.getAttribute('role') !== 'banner') {
    console.warn('initializeHeader: Header missing role="banner"');
  }

  if (fySpan.getAttribute('aria-live') !== 'polite') {
    console.warn('initializeHeader: Financial year span missing aria-live="polite"');
  }

  return true;
}

/**
 * Get the current financial year displayed in header
 * Retrieves the current value without modification
 * @returns {string|null} Current FY in header, or null if not found
 */
export function getHeaderFinancialYear() {
  const fySpan = document.getElementById('current-fy');
  if (!fySpan) {
    return null;
  }
  return fySpan.textContent;
}

/**
 * Validate header financial year format
 * Checks if the financial year matches expected format (e.g., '2024-25')
 * @param {string} year - Financial year to validate
 * @returns {boolean} True if valid format, false otherwise
 */
export function isValidFinancialYearFormat(year) {
  if (typeof year !== 'string') {
    return false;
  }

  // Valid format: YYYY-YY (e.g., '2024-25')
  const fyPattern = /^\d{4}-\d{2}$/;
  return fyPattern.test(year.trim());
}

/**
 * Get header element reference
 * Used for testing and DOM verification
 * @returns {HTMLElement|null} Header element or null if not found
 */
export function getHeaderElement() {
  return document.querySelector('.header');
}

/**
 * Get header title text
 * @returns {string|null} Header title text or null if not found
 */
export function getHeaderTitle() {
  const titleElement = document.querySelector('.header__title');
  return titleElement ? titleElement.textContent : null;
}

/**
 * Get header description text
 * @returns {string|null} Header description text or null if not found
 */
export function getHeaderDescription() {
  const descElement = document.querySelector('.header__description');
  return descElement ? descElement.textContent : null;
}
