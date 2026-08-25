/**
 * Tests for Regime Selector Component
 * Unit tests for src/ui/components/regime-selector.js
 * TAX-017: Updated to reflect removal of Compare Both option
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getSelectedRegime,
  setSelectedRegime,
  initializeRegimeSelector,
  updateAvailableRegimes,
  resetRegimeSelector,
  getRegimeSelectorElement,
  setRegimeSelectorVisible,
} from '../../../../src/ui/components/regime-selector.js';
import { DEFAULT_REGIME } from '../../../../src/shared/constants/regimes.js';

/**
 * Test Helper: Set up DOM with regime selector
 * TAX-017: Only old and new regimes, new is default
 */
function setupRegimeSelectorDOM() {
  document.body.innerHTML = `
    <div class="form-group regime-selection" id="regime-selection-group">
      <fieldset>
        <legend>Select Tax Regime:</legend>
        <div class="regime-options" role="radiogroup" aria-label="Tax regime selection">
          <label class="regime-option">
            <input type="radio" name="tax-regime" value="old" id="regime-old">
            <span class="regime-label">Old Regime</span>
            <span class="regime-hint">With deductions & exemptions</span>
          </label>
          <label class="regime-option">
            <input type="radio" name="tax-regime" value="new" id="regime-new" checked>
            <span class="regime-label">New Regime</span>
            <span class="regime-hint">Lower rates, standard deduction only</span>
          </label>
        </div>
      </fieldset>
    </div>
  `;
}

/**
 * Test Helper: Clean up DOM
 */
function cleanupDOM() {
  document.body.innerHTML = '';
}

describe('Regime Selector Component - Rendering Tests', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should render regime selector element', () => {
    const element = getRegimeSelectorElement();
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
  });

  it('should have correct id', () => {
    const element = getRegimeSelectorElement();
    expect(element?.id).toBe('regime-selection-group');
  });

  // TAX-017: Only 2 radio options now
  it('should have two radio options', () => {
    const radios = document.querySelectorAll('input[name="tax-regime"]');
    expect(radios.length).toBe(2);
  });

  it('should have correct radio values', () => {
    const oldRadio = document.getElementById('regime-old');
    const newRadio = document.getElementById('regime-new');

    expect(oldRadio?.getAttribute('value')).toBe('old');
    expect(newRadio?.getAttribute('value')).toBe('new');
  });

  // TAX-017: New regime is default now
  it('should have new checked by default', () => {
    const newRadio = document.getElementById('regime-new');
    expect(newRadio?.checked).toBe(true);
  });

  it('should have radiogroup role on options container', () => {
    const options = document.querySelector('.regime-options');
    expect(options?.getAttribute('role')).toBe('radiogroup');
  });

  it('should have aria-label on options container', () => {
    const options = document.querySelector('.regime-options');
    expect(options?.getAttribute('aria-label')).toBe('Tax regime selection');
  });
});

describe('Regime Selector Component - getSelectedRegime', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  // TAX-017: Default is now 'new'
  it('should return "new" as default selected regime', () => {
    expect(getSelectedRegime()).toBe('new');
  });

  it('should return "old" when old regime is selected', () => {
    const oldRadio = document.getElementById('regime-old');
    if (oldRadio) {
      oldRadio.checked = true;
    }
    expect(getSelectedRegime()).toBe('old');
  });

  it('should return "new" when new regime is selected', () => {
    const newRadio = document.getElementById('regime-new');
    if (newRadio) {
      newRadio.checked = true;
    }
    expect(getSelectedRegime()).toBe('new');
  });

  it('should return default regime when no DOM element exists', () => {
    cleanupDOM();
    expect(getSelectedRegime()).toBe(DEFAULT_REGIME);
  });
});

describe('Regime Selector Component - setSelectedRegime', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should set old regime', () => {
    const result = setSelectedRegime('old');
    expect(result).toBe(true);
    expect(getSelectedRegime()).toBe('old');
  });

  it('should set new regime', () => {
    setSelectedRegime('old'); // Change from default first
    const result = setSelectedRegime('new');
    expect(result).toBe(true);
    expect(getSelectedRegime()).toBe('new');
  });

  // TAX-017: compare is no longer valid
  it('should return false for compare regime (removed)', () => {
    const result = setSelectedRegime('compare');
    expect(result).toBe(false);
  });

  it('should return false for invalid regime', () => {
    const result = setSelectedRegime('invalid');
    expect(result).toBe(false);
  });

  it('should return false for null', () => {
    const result = setSelectedRegime(null);
    expect(result).toBe(false);
  });

  it('should return false for undefined', () => {
    const result = setSelectedRegime(undefined);
    expect(result).toBe(false);
  });

  it('should not change selection for invalid regime', () => {
    const initialRegime = getSelectedRegime();
    setSelectedRegime('invalid');
    expect(getSelectedRegime()).toBe(initialRegime);
  });

  it('should return false when DOM element missing', () => {
    cleanupDOM();
    const result = setSelectedRegime('old');
    expect(result).toBe(false);
  });
});

describe('Regime Selector Component - initializeRegimeSelector', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should return cleanup function', () => {
    const cleanup = initializeRegimeSelector(() => {});
    expect(typeof cleanup).toBe('function');
  });

  it('should call callback when regime changes', () => {
    let calledWith = null;
    initializeRegimeSelector((regime) => {
      calledWith = regime;
    });

    const oldRadio = document.getElementById('regime-old');
    if (oldRadio) {
      oldRadio.checked = true;
      const event = document.createEvent('Event');
      event.initEvent('change', true, true);
      oldRadio.dispatchEvent(event);
    }

    expect(calledWith).toBe('old');
  });

  it('should call callback with correct regime value', () => {
    const changes = [];
    initializeRegimeSelector((regime) => {
      changes.push(regime);
    });

    const newRadio = document.getElementById('regime-new');
    if (newRadio) {
      newRadio.checked = true;
      const event = document.createEvent('Event');
      event.initEvent('change', true, true);
      newRadio.dispatchEvent(event);
    }

    expect(changes).toContain('new');
  });

  it('should not call callback for invalid regime', () => {
    let callbackCalled = false;
    initializeRegimeSelector(() => {
      callbackCalled = true;
    });

    // Create a fake radio with invalid value
    const fakeRadio = document.createElement('input');
    fakeRadio.type = 'radio';
    fakeRadio.name = 'tax-regime';
    fakeRadio.value = 'invalid';
    document.body.appendChild(fakeRadio);

    const event = document.createEvent('Event');
    event.initEvent('change', true, true);
    fakeRadio.dispatchEvent(event);
    // The callback should NOT be called for invalid regime values
    // because the component validates before calling the callback
    expect(callbackCalled).toBe(false);
  });

  it('should return no-op cleanup when DOM missing', () => {
    cleanupDOM();
    const cleanup = initializeRegimeSelector(() => {});
    expect(typeof cleanup).toBe('function');
    // Should not throw
    expect(() => cleanup()).not.toThrow();
  });

  it('should remove event listeners on cleanup', () => {
    let callCount = 0;
    const cleanup = initializeRegimeSelector(() => {
      callCount++;
    });

    // Trigger a change
    const oldRadio = document.getElementById('regime-old');
    if (oldRadio) {
      oldRadio.checked = true;
      const event1 = document.createEvent('Event');
      event1.initEvent('change', true, true);
      oldRadio.dispatchEvent(event1);
    }
    expect(callCount).toBe(1);

    // Cleanup
    cleanup();

    // Trigger another change
    const newRadio = document.getElementById('regime-new');
    if (newRadio) {
      newRadio.checked = true;
      const event2 = document.createEvent('Event');
      event2.initEvent('change', true, true);
      newRadio.dispatchEvent(event2);
    }

    // Should still be 1 since listener was removed
    expect(callCount).toBe(1);
  });
});

describe('Regime Selector Component - updateAvailableRegimes', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should disable regimes not in available list', () => {
    updateAvailableRegimes(['old']); // No new

    const newRadio = document.getElementById('regime-new');
    expect(newRadio?.disabled).toBe(true);
  });

  it('should enable regimes in available list', () => {
    updateAvailableRegimes(['old', 'new']);

    const oldRadio = document.getElementById('regime-old');
    const newRadio = document.getElementById('regime-new');

    expect(oldRadio?.disabled).toBe(false);
    expect(newRadio?.disabled).toBe(false);
  });

  it('should set opacity on unavailable regimes', () => {
    updateAvailableRegimes(['old']); // Only old

    const newOption = document.querySelector('label.regime-option:has(#regime-new)');

    expect(newOption?.style.opacity).toBe('0.5');
  });

  it('should set aria-disabled on unavailable regimes', () => {
    updateAvailableRegimes(['old']); // No new

    const newOption = document.querySelector('label.regime-option:has(#regime-new)');
    expect(newOption?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should not throw when DOM missing', () => {
    cleanupDOM();
    expect(() => updateAvailableRegimes(['old'])).not.toThrow();
  });
});

describe('Regime Selector Component - resetRegimeSelector', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should reset to default regime', () => {
    setSelectedRegime('old');
    resetRegimeSelector();
    expect(getSelectedRegime()).toBe(DEFAULT_REGIME);
  });

  // TAX-017: Only old and new options now
  it('should re-enable all options', () => {
    updateAvailableRegimes(['old']); // Disable some
    resetRegimeSelector();

    const oldRadio = document.getElementById('regime-old');
    const newRadio = document.getElementById('regime-new');

    expect(oldRadio?.disabled).toBe(false);
    expect(newRadio?.disabled).toBe(false);
  });
});

describe('Regime Selector Component - Visibility', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should hide regime selector', () => {
    setRegimeSelectorVisible(false);
    const element = getRegimeSelectorElement();
    expect(element?.style.display).toBe('none');
    expect(element?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should show regime selector', () => {
    setRegimeSelectorVisible(false);
    setRegimeSelectorVisible(true);
    const element = getRegimeSelectorElement();
    expect(element?.style.display).toBe('');
    expect(element?.getAttribute('aria-hidden')).toBe('false');
  });

  it('should not throw when DOM missing', () => {
    cleanupDOM();
    expect(() => setRegimeSelectorVisible(false)).not.toThrow();
    expect(() => setRegimeSelectorVisible(true)).not.toThrow();
  });
});

describe('Regime Selector Component - Accessibility', () => {
  beforeEach(setupRegimeSelectorDOM);
  afterEach(cleanupDOM);

  it('should have fieldset and legend for grouping', () => {
    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');

    expect(fieldset).toBeDefined();
    expect(legend).toBeDefined();
    expect(legend?.textContent).toContain('Select Tax Regime');
  });

  it('should have radiogroup role', () => {
    const options = document.querySelector('.regime-options');
    expect(options?.getAttribute('role')).toBe('radiogroup');
  });

  it('should have aria-label on radiogroup', () => {
    const options = document.querySelector('.regime-options');
    expect(options?.getAttribute('aria-label')).toBe('Tax regime selection');
  });

  // TAX-017: Only 2 regime options now
  it('should have associated labels for all radios', () => {
    const labels = document.querySelectorAll('label.regime-option');
    expect(labels.length).toBe(2);

    labels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      expect(radio).toBeDefined();
    });
  });
});
