/**
 * TAX-021: Tab Navigation Component
 * Handles switching between Income and Deductions tabs
 */

/**
 * Initialize tab navigation functionality
 */
export function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  if (!tabButtons.length || !tabPanels.length) {
    console.warn('Tab navigation elements not found');
    return;
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      switchTab(targetTab);
    });
    
    // Keyboard navigation
    button.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const tabs = Array.from(tabButtons);
        const currentIndex = tabs.indexOf(e.target);
        const nextIndex = e.key === 'ArrowRight' 
          ? (currentIndex + 1) % tabs.length 
          : (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    });
  });
}

/**
 * Switch to a specific tab
 * @param {string} tabName - The tab to switch to ('income' or 'deductions')
 */
export function switchTab(tabName) {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  
  tabPanels.forEach(panel => {
    const isActive = panel.id === `${tabName}-panel`;
    panel.classList.toggle('active', isActive);
    panel.style.display = isActive ? 'block' : 'none';
  });
}

/**
 * Update the deductions tab based on selected regime
 * Shows notice for New Regime about limited deductions
 * @param {string} regime - The selected regime ('old' or 'new')
 */
export function updateDeductionsTabForRegime(regime) {
  const notice = document.getElementById('new-regime-notice');
  const deductionFields = document.querySelectorAll('#deductions-panel .form-group:not([data-field="standardDeduction"])');
  
  if (!notice) return;
  
  if (regime === 'new') {
    notice.style.display = 'block';
    // Visually indicate limited deductions in new regime
    deductionFields.forEach(field => {
      field.style.opacity = '0.6';
      const input = field.querySelector('input');
      if (input) {
        input.setAttribute('title', 'This deduction is not available in the New Tax Regime');
      }
    });
  } else {
    notice.style.display = 'none';
    deductionFields.forEach(field => {
      field.style.opacity = '1';
      const input = field.querySelector('input');
      if (input) {
        input.removeAttribute('title');
      }
    });
  }
}
