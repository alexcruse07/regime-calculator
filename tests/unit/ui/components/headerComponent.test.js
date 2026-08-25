/**
 * Tests for Header Component
 * Comprehensive unit and integration tests for header functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  updateHeaderFinancialYear,
  initializeHeader,
  getHeaderFinancialYear,
  isValidFinancialYearFormat,
  getHeaderElement,
  getHeaderTitle,
  getHeaderDescription,
} from '../../../../src/ui/components/headerComponent.js';

/**
 * Test Helper: Set up DOM with header
 */
function setupHeaderDOM() {
  document.body.innerHTML = `
    <header class="header" role="banner" aria-label="Application header">
      <div class="header__container">
        <div class="header__content">
          <h1 class="header__title">Indian Income Tax Calculator</h1>
          <p class="header__description">Compare Old vs New Tax Regimes for FY 2024-25</p>
          <p class="header__context" id="header-fy-context">
            Financial Year: 
            <span id="current-fy" role="status" aria-live="polite">2024-25</span>
          </p>
        </div>
      </div>
    </header>
  `;
}

/**
 * Test Helper: Clean up DOM
 */
function cleanupDOM() {
  document.body.innerHTML = '';
}

describe('Header Component - Rendering Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should render header element with correct class', () => {
    const header = getHeaderElement();
    expect(header).toBeDefined();
    expect(header).not.toBeNull();
    expect(header.classList.contains('header')).toBe(true);
  });

  it('should render header with role="banner"', () => {
    const header = getHeaderElement();
    expect(header.getAttribute('role')).toBe('banner');
  });

  it('should render header with aria-label', () => {
    const header = getHeaderElement();
    expect(header.getAttribute('aria-label')).toBe('Application header');
  });

  it('should render correct title text', () => {
    const title = getHeaderTitle();
    expect(title).toBe('Indian Income Tax Calculator');
  });

  it('should render correct description text', () => {
    const description = getHeaderDescription();
    expect(description).toContain('Compare Old vs New Tax Regimes for FY 2024-25');
  });

  it('should render initial financial year as 2024-25', () => {
    const fy = getHeaderFinancialYear();
    expect(fy).toBe('2024-25');
  });

  it('should have header__container element', () => {
    const container = document.querySelector('.header__container');
    expect(container).toBeDefined();
  });

  it('should have header__content element', () => {
    const content = document.querySelector('.header__content');
    expect(content).toBeDefined();
  });

  it('should have header__title element with correct class', () => {
    const title = document.querySelector('.header__title');
    expect(title).toBeDefined();
    expect(title?.tagName).toBe('H1');
  });

  it('should have header__description element with correct class', () => {
    const description = document.querySelector('.header__description');
    expect(description).toBeDefined();
    expect(description?.tagName).toBe('P');
  });

  it('should have header__context element with correct class', () => {
    const context = document.querySelector('.header__context');
    expect(context).toBeDefined();
    expect(context?.tagName).toBe('P');
  });

  it('should have current-fy span element', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan).toBeDefined();
    expect(fySpan?.tagName).toBe('SPAN');
  });

  it('should have aria-live="polite" on financial year span', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
  });

  it('should have role="status" on financial year span', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('role')).toBe('status');
  });
});

describe('Header Component - Initialization Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should initialize header successfully when all elements present', () => {
    const result = initializeHeader();
    expect(result).toBe(true);
  });

  it('should return false when header element missing', () => {
    document.body.innerHTML = '';
    const result = initializeHeader();
    expect(result).toBe(false);
  });

  it('should return false when title element missing', () => {
    const header = document.querySelector('.header');
    const title = header?.querySelector('.header__title');
    if (title) {
      title.remove();
    }
    const result = initializeHeader();
    expect(result).toBe(false);
  });

  it('should return false when description element missing', () => {
    const header = document.querySelector('.header');
    const description = header?.querySelector('.header__description');
    if (description) {
      description.remove();
    }
    const result = initializeHeader();
    expect(result).toBe(false);
  });

  it('should return false when financial year span missing', () => {
    const fySpan = document.getElementById('current-fy');
    if (fySpan) {
      fySpan.remove();
    }
    const result = initializeHeader();
    expect(result).toBe(false);
  });
});

describe('Header Component - Update Financial Year Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should update financial year text when called with valid year', () => {
    updateHeaderFinancialYear('2025-26');
    expect(getHeaderFinancialYear()).toBe('2025-26');
  });

  it('should update multiple times correctly', () => {
    updateHeaderFinancialYear('2023-24');
    expect(getHeaderFinancialYear()).toBe('2023-24');

    updateHeaderFinancialYear('2025-26');
    expect(getHeaderFinancialYear()).toBe('2025-26');
  });

  it('should handle special financial year formats', () => {
    updateHeaderFinancialYear('2022-23');
    expect(getHeaderFinancialYear()).toBe('2022-23');
  });

  it('should not update if year is null', () => {
    const initialYear = getHeaderFinancialYear();
    updateHeaderFinancialYear(null);
    expect(getHeaderFinancialYear()).toBe(initialYear);
  });

  it('should not update if year is undefined', () => {
    const initialYear = getHeaderFinancialYear();
    updateHeaderFinancialYear(undefined);
    expect(getHeaderFinancialYear()).toBe(initialYear);
  });

  it('should not update if year is empty string', () => {
    const initialYear = getHeaderFinancialYear();
    updateHeaderFinancialYear('');
    expect(getHeaderFinancialYear()).toBe(initialYear);
  });

  it('should not update if year is only whitespace', () => {
    const initialYear = getHeaderFinancialYear();
    updateHeaderFinancialYear('   ');
    expect(getHeaderFinancialYear()).toBe(initialYear);
  });

  it('should handle year with special characters', () => {
    updateHeaderFinancialYear('2024-25!');
    expect(getHeaderFinancialYear()).toBe('2024-25!');
  });

  it('should warn if year is not a string', () => {
    // updateHeaderFinancialYear logs a warning for non-string years
    updateHeaderFinancialYear(12345);
    expect(getHeaderFinancialYear()).not.toBe(12345);
  });

  it('should not update if current-fy element does not exist', () => {
    const fySpan = document.getElementById('current-fy');
    if (fySpan) {
      fySpan.remove();
    }
    updateHeaderFinancialYear('2025-26');
    // Should still exist in DOM from initial render, but element is removed
    expect(document.getElementById('current-fy')).toBeNull();
  });

  it('should update aria-live region for accessibility', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
    updateHeaderFinancialYear('2025-26');
    // aria-live attribute should remain
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
  });
});

describe('Header Component - Get Financial Year Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should return current financial year', () => {
    expect(getHeaderFinancialYear()).toBe('2024-25');
  });

  it('should return null if element does not exist', () => {
    const fySpan = document.getElementById('current-fy');
    if (fySpan) {
      fySpan.remove();
    }
    expect(getHeaderFinancialYear()).toBeNull();
  });

  it('should return updated year after update', () => {
    updateHeaderFinancialYear('2023-24');
    expect(getHeaderFinancialYear()).toBe('2023-24');
  });
});

describe('Header Component - Financial Year Format Validation Tests', () => {
  it('should validate correct format YYYY-YY', () => {
    expect(isValidFinancialYearFormat('2024-25')).toBe(true);
    expect(isValidFinancialYearFormat('2023-24')).toBe(true);
    expect(isValidFinancialYearFormat('2000-01')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(isValidFinancialYearFormat('2024')).toBe(false);
    expect(isValidFinancialYearFormat('202425')).toBe(false);
    expect(isValidFinancialYearFormat('24-25')).toBe(false);
  });

  it('should reject non-string input', () => {
    expect(isValidFinancialYearFormat(2024)).toBe(false);
    expect(isValidFinancialYearFormat(null)).toBe(false);
    expect(isValidFinancialYearFormat(undefined)).toBe(false);
  });

  it('should handle whitespace in string', () => {
    expect(isValidFinancialYearFormat('  2024-25  ')).toBe(true);
    expect(isValidFinancialYearFormat('2024-25 ')).toBe(true);
  });

  it('should reject strings with extra characters', () => {
    expect(isValidFinancialYearFormat('2024-25!')).toBe(false);
    expect(isValidFinancialYearFormat('2024-25 FY')).toBe(false);
  });
});

describe('Header Component - DOM Reference Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should return header element reference', () => {
    const header = getHeaderElement();
    expect(header).toBeDefined();
    expect(header?.classList.contains('header')).toBe(true);
  });

  it('should return null if header not found', () => {
    document.body.innerHTML = '';
    const header = getHeaderElement();
    expect(header).toBeNull();
  });

  it('should return title text content', () => {
    const title = getHeaderTitle();
    expect(title).toBe('Indian Income Tax Calculator');
  });

  it('should return null for title if element missing', () => {
    const title = document.querySelector('.header__title');
    if (title) {
      title.remove();
    }
    expect(getHeaderTitle()).toBeNull();
  });

  it('should return description text content', () => {
    const description = getHeaderDescription();
    expect(description).toContain('Compare Old vs New Tax Regimes for FY 2024-25');
  });

  it('should return null for description if element missing', () => {
    const description = document.querySelector('.header__description');
    if (description) {
      description.remove();
    }
    expect(getHeaderDescription()).toBeNull();
  });
});

describe('Header Component - Integration Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should initialize and allow updates', () => {
    const initResult = initializeHeader();
    expect(initResult).toBe(true);

    updateHeaderFinancialYear('2025-26');
    expect(getHeaderFinancialYear()).toBe('2025-26');
  });

  it('should maintain ARIA attributes after updates', () => {
    updateHeaderFinancialYear('2025-26');
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
    expect(fySpan?.getAttribute('role')).toBe('status');
  });

  it('should not break with rapid updates', () => {
    for (let i = 2020; i <= 2025; i++) {
      updateHeaderFinancialYear(`${i}-${(i + 1).toString().slice(-2)}`);
    }
    expect(getHeaderFinancialYear()).toBe('2025-26');
  });

  it('should work with appView integration pattern', () => {
    // Simulate state update pattern
    const state = { financialYear: '2023-24' };
    if (state && state.financialYear) {
      updateHeaderFinancialYear(state.financialYear);
    }
    expect(getHeaderFinancialYear()).toBe('2023-24');
  });
});

describe('Header Component - Accessibility Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should have proper heading hierarchy (h1)', () => {
    const title = document.querySelector('.header__title');
    expect(title?.tagName).toBe('H1');
  });

  it('should have role="banner" on header', () => {
    const header = getHeaderElement();
    expect(header?.getAttribute('role')).toBe('banner');
  });

  it('should have aria-label on header', () => {
    const header = getHeaderElement();
    expect(header?.getAttribute('aria-label')).toBeDefined();
  });

  it('should have aria-live="polite" on dynamic content', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
  });

  it('should have role="status" on status element', () => {
    const fySpan = document.getElementById('current-fy');
    expect(fySpan?.getAttribute('role')).toBe('status');
  });

  it('should announce financial year changes to screen readers', () => {
    const fySpan = document.getElementById('current-fy');
    const initialValue = fySpan?.textContent;

    updateHeaderFinancialYear('2025-26');

    // aria-live="polite" should cause screen readers to announce the change
    expect(fySpan?.textContent).not.toBe(initialValue);
    expect(fySpan?.getAttribute('aria-live')).toBe('polite');
  });
});

describe('Header Component - Edge Cases', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should handle very long financial year strings', () => {
    const longYear = '2024-25' + '0'.repeat(100);
    updateHeaderFinancialYear(longYear);
    expect(getHeaderFinancialYear()).toBe(longYear);
  });

  it('should handle unicode characters in financial year', () => {
    const unicodeYear = '2024-25 🇮🇳';
    updateHeaderFinancialYear(unicodeYear);
    expect(getHeaderFinancialYear()).toBe(unicodeYear);
  });

  it('should handle repeated same year updates', () => {
    for (let i = 0; i < 5; i++) {
      updateHeaderFinancialYear('2024-25');
    }
    expect(getHeaderFinancialYear()).toBe('2024-25');
  });

  it('should not throw on missing optional elements during update', () => {
    const header = getHeaderElement();
    const container = header?.querySelector('.header__container');
    if (container) {
      container.remove();
    }

    expect(() => {
      updateHeaderFinancialYear('2025-26');
    }).not.toThrow();
  });

  it('should handle whitespace-only string gracefully', () => {
    const initialYear = getHeaderFinancialYear();
    updateHeaderFinancialYear('     ');
    // Should not update with whitespace-only value
    expect(getHeaderFinancialYear()).toBe(initialYear);
  });
});

describe('Header Component - CSS Classes Tests', () => {
  beforeEach(setupHeaderDOM);
  afterEach(cleanupDOM);

  it('should have all required CSS classes', () => {
    expect(document.querySelector('.header')).toBeDefined();
    expect(document.querySelector('.header__container')).toBeDefined();
    expect(document.querySelector('.header__content')).toBeDefined();
    expect(document.querySelector('.header__title')).toBeDefined();
    expect(document.querySelector('.header__description')).toBeDefined();
    expect(document.querySelector('.header__context')).toBeDefined();
  });

  it('should preserve CSS classes during updates', () => {
    const header = getHeaderElement();
    const originalClasses = header?.className;

    updateHeaderFinancialYear('2025-26');

    expect(header?.className).toBe(originalClasses);
  });
});
