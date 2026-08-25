/**
 * Export Handler (TAX-022)
 * Handles exporting tax calculation results to PDF or text format
 *
 * Features:
 * - Export user information (name, PAN)
 * - Export all income inputs
 * - Export deductions
 * - Export calculated tax results
 * - Support for PDF (if jsPDF available) or Text format
 */

import { appState } from '../../app/state/appState.js';

/**
 * Sanitizes filename to remove special characters
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50); // Max 50 chars
}

/**
 * Formats currency value for display
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
  if (value === undefined || value === null || value === '') {
    return '₹0';
  }
  const numValue = parseFloat(value) || 0;
  return `₹${numValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

/**
 * Formats date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generates text-based tax report
 * @param {Object} state - Application state with calculation results
 * @returns {string} Formatted text report
 */
function generateTextReport(state) {
  const formData = state.formData || {};
  const oldResult = state.oldRegimeResult || {};
  const newResult = state.newRegimeResult || {};

  const lines = [];
  const separator = '='.repeat(70);
  const subSeparator = '-'.repeat(70);

  // Header
  lines.push(separator);
  lines.push('                    INDIAN INCOME TAX CALCULATION REPORT');
  lines.push(separator);
  lines.push('');
  lines.push(`Generated on: ${formatDate()}`);
  lines.push(`Financial Year: ${formData.financialYear || 'N/A'}`);
  lines.push('');

  // User Information Section
  lines.push(subSeparator);
  lines.push('USER INFORMATION');
  lines.push(subSeparator);
  lines.push(`Full Name: ${formData.fullName || 'Not provided'}`);
  lines.push(`PAN: ${formData.pan || 'Not provided'}`);
  lines.push('');

  // Income Section
  lines.push(subSeparator);
  lines.push('INCOME DETAILS');
  lines.push(subSeparator);

  const incomeItems = [
    { label: 'Salary Income', value: formData.salary },
    { label: 'House Property Income', value: formData.houseProperty },
    { label: 'Business/Professional Income', value: formData.business },
    { label: 'STCG - Equity', value: formData.stcgEquity },
    { label: 'STCG - Other', value: formData.stcgOther },
    { label: 'LTCG - Equity', value: formData.ltcgEquity },
    { label: 'LTCG - Other', value: formData.ltcgOther },
    { label: 'Speculative Gains', value: formData.speculativeGains },
    { label: 'F&O Gains', value: formData.fnoGains },
    { label: 'Interest Income', value: formData.interestIncome },
    { label: 'Dividend Income', value: formData.dividendIncome },
    { label: 'Other Income', value: formData.otherTaxable },
  ];

  incomeItems.forEach((item) => {
    const value = parseFloat(item.value) || 0;
    if (value !== 0) {
      lines.push(`${item.label.padEnd(35)}: ${formatCurrency(value)}`);
    }
  });
  lines.push('');

  // Deductions Section
  const deductions = formData.deductions || {};
  const hasDeductions = Object.values(deductions).some((v) => parseFloat(v) > 0);

  if (hasDeductions) {
    lines.push(subSeparator);
    lines.push('DEDUCTIONS');
    lines.push(subSeparator);

    const deductionItems = [
      { label: 'Standard Deduction', value: deductions.standardDeduction },
      { label: 'Section 80C', value: deductions.section80C },
      { label: 'Section 80CCD (1B)', value: deductions.section80CCD1B },
      { label: 'Section 80D (Health Insurance)', value: deductions.section80D },
      { label: 'Section 80E (Education Loan)', value: deductions.section80E },
      { label: 'Section 80G (Donations)', value: deductions.section80G },
      { label: 'Section 80TTA (Savings A/c Interest)', value: deductions.section80TTA },
      { label: 'Section 80TTB (Senior Citizen Int.)', value: deductions.section80TTB },
      { label: 'HRA (House Rent Allowance)', value: deductions.hra },
      { label: 'LTA (Leave Travel Allowance)', value: deductions.lta },
      { label: 'Home Loan Interest', value: deductions.homeLoanInterest },
      { label: 'Other Deductions', value: deductions.otherDeductions },
    ];

    deductionItems.forEach((item) => {
      const value = parseFloat(item.value) || 0;
      if (value !== 0) {
        lines.push(`${item.label.padEnd(35)}: ${formatCurrency(value)}`);
      }
    });
    lines.push('');
  }

  // Tax Results Section
  lines.push(separator);
  lines.push('TAX CALCULATION RESULTS');
  lines.push(separator);
  lines.push('');

  // Old Regime Results
  if (oldResult.grossIncome !== undefined) {
    lines.push('OLD TAX REGIME');
    lines.push(subSeparator);
    lines.push(`Gross Income....................: ${formatCurrency(oldResult.grossIncome)}`);
    lines.push(`Total Deductions................: ${formatCurrency(oldResult.totalDeductions)}`);
    lines.push(`Taxable Income..................: ${formatCurrency(oldResult.taxableIncome)}`);
    lines.push(`Income Tax.......................: ${formatCurrency(oldResult.incomeTax)}`);

    if (oldResult.rebate && oldResult.rebate > 0) {
      lines.push(`Rebate u/s 87A...................: ${formatCurrency(oldResult.rebate)}`);
    }
    if (oldResult.surcharge && oldResult.surcharge > 0) {
      lines.push(`Surcharge........................: ${formatCurrency(oldResult.surcharge)}`);
    }
    if (oldResult.cess && oldResult.cess > 0) {
      lines.push(`Health & Education Cess (4%)...: ${formatCurrency(oldResult.cess)}`);
    }

    lines.push('');
    lines.push(`TOTAL TAX LIABILITY (OLD REGIME): ${formatCurrency(oldResult.totalTax)}`);
    lines.push('');
  }

  // New Regime Results
  if (newResult.grossIncome !== undefined) {
    lines.push('NEW TAX REGIME');
    lines.push(subSeparator);
    lines.push(`Gross Income....................: ${formatCurrency(newResult.grossIncome)}`);
    lines.push(`Standard Deduction..............: ${formatCurrency(newResult.totalDeductions)}`);
    lines.push(`Taxable Income..................: ${formatCurrency(newResult.taxableIncome)}`);
    lines.push(`Income Tax.......................: ${formatCurrency(newResult.incomeTax)}`);

    if (newResult.rebate && newResult.rebate > 0) {
      lines.push(`Rebate u/s 87A...................: ${formatCurrency(newResult.rebate)}`);
    }
    if (newResult.surcharge && newResult.surcharge > 0) {
      lines.push(`Surcharge........................: ${formatCurrency(newResult.surcharge)}`);
    }
    if (newResult.cess && newResult.cess > 0) {
      lines.push(`Health & Education Cess (4%)...: ${formatCurrency(newResult.cess)}`);
    }

    lines.push('');
    lines.push(`TOTAL TAX LIABILITY (NEW REGIME): ${formatCurrency(newResult.totalTax)}`);
    lines.push('');
  }

  // Comparison
  if (oldResult.totalTax !== undefined && newResult.totalTax !== undefined) {
     const difference = oldResult.totalTax - newResult.totalTax;
     const benefitRegime = difference > 0 ? 'NEW REGIME' : 'OLD REGIME';

    lines.push('REGIME COMPARISON');
    lines.push(subSeparator);
    lines.push(`Tax Difference...................: ${formatCurrency(Math.abs(difference))}`);
    lines.push(`Better Regime....................: ${benefitRegime}`);
    lines.push(`You can save ₹${Math.abs(difference).toLocaleString('en-IN', { maximumFractionDigits: 2 })} by choosing ${benefitRegime}`);
  }

  lines.push('');
  lines.push(separator);
  lines.push('DISCLAIMER:');
  lines.push('This report is generated for information purposes only. Please consult a');
  lines.push('tax professional before filing your income tax return.');
  lines.push(separator);

  return lines.join('\n');
}

/**
 * Exports calculation results to text file
 * @param {Object} state - Application state
 * @param {string} fullName - User's full name
 * @param {string} financialYear - Financial year (e.g., '2025-26')
 * @returns {void}
 */
function exportToText(state, fullName, financialYear) {
  const textContent = generateTextReport(state);
  const nameSlug = sanitizeFilename(fullName || 'report');
  const fySlug = financialYear.replace('-', '_');
  const filename = `Tax_Report_${nameSlug}_FY${fySlug}.txt`;

  // Create blob and download
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Exports calculation results to CSV file
 * @param {Object} state - Application state
 * @param {string} fullName - User's full name
 * @param {string} financialYear - Financial year (e.g., '2025-26')
 * @returns {void}
 */
function exportToCSV(state, fullName, financialYear) {
  const formData = state.formData || {};
  const oldResult = state.oldRegimeResult || {};
  const newResult = state.newRegimeResult || {};

  const rows = [];

  // Header
  rows.push(['INDIAN INCOME TAX CALCULATION REPORT']);
  rows.push([`Generated on: ${formatDate()}`]);
  rows.push([]);

  // User Information
  rows.push(['USER INFORMATION']);
  rows.push(['Full Name', formData.fullName || 'Not provided']);
  rows.push(['PAN', formData.pan || 'Not provided']);
  rows.push(['Financial Year', financialYear]);
  rows.push([]);

  // Income
  rows.push(['INCOME DETAILS']);
  rows.push(['Income Type', 'Amount (₹)']);
  rows.push(['Salary', formData.salary || 0]);
  rows.push(['House Property', formData.houseProperty || 0]);
  rows.push(['Business Income', formData.business || 0]);
  rows.push(['STCG - Equity', formData.stcgEquity || 0]);
  rows.push(['STCG - Other', formData.stcgOther || 0]);
  rows.push(['LTCG - Equity', formData.ltcgEquity || 0]);
  rows.push(['LTCG - Other', formData.ltcgOther || 0]);
  rows.push(['Speculative Gains', formData.speculativeGains || 0]);
  rows.push(['F&O Gains', formData.fnoGains || 0]);
  rows.push(['Interest Income', formData.interestIncome || 0]);
  rows.push(['Dividend Income', formData.dividendIncome || 0]);
  rows.push(['Other Income', formData.otherTaxable || 0]);
  rows.push([]);

  // Tax Results
  rows.push(['TAX CALCULATION RESULTS']);
  rows.push(['Item', 'Old Regime (₹)', 'New Regime (₹)']);
  rows.push(['Gross Income', oldResult.grossIncome || 0, newResult.grossIncome || 0]);
  rows.push(['Total Deductions', oldResult.totalDeductions || 0, newResult.totalDeductions || 0]);
  rows.push(['Taxable Income', oldResult.taxableIncome || 0, newResult.taxableIncome || 0]);
  rows.push(['Income Tax', oldResult.incomeTax || 0, newResult.incomeTax || 0]);
  rows.push(['Rebate', oldResult.rebate || 0, newResult.rebate || 0]);
  rows.push(['Surcharge', oldResult.surcharge || 0, newResult.surcharge || 0]);
  rows.push(['Cess', oldResult.cess || 0, newResult.cess || 0]);
  rows.push(['TOTAL TAX', oldResult.totalTax || 0, newResult.totalTax || 0]);

  // Convert to CSV
  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const nameSlug = sanitizeFilename(fullName || 'report');
  const fySlug = financialYear.replace('-', '_');
  const filename = `Tax_Report_${nameSlug}_FY${fySlug}.csv`;

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Main export handler - triggers export based on available libraries
 * @param {string} format - Export format: 'text', 'csv', or 'pdf'
 * @returns {Promise<void>}
 */
export async function handleExport(format = 'text') {
  try {
    const state = appState.getState();

    if (!state.formData || !state.oldRegimeResult) {
      alert('No calculation results to export. Please submit the form first.');
      return;
    }

    const fullName = state.formData.fullName || 'Taxpayer';
    const financialYear = state.formData.financialYear || '2025-26';

    // Show loading message
    const exportButton = document.getElementById('export-button');
    const originalText = exportButton.textContent;

    if (exportButton) {
      exportButton.disabled = true;
      exportButton.textContent = '⏳ Exporting...';
    }

    // Export based on format
    if (format === 'csv') {
      exportToCSV(state, fullName, financialYear);
    } else {
      // Default to text export
      exportToText(state, fullName, financialYear);
    }

    // Show success message
    if (exportButton) {
      exportButton.textContent = '✅ Exported!';
      setTimeout(() => {
        exportButton.textContent = originalText;
        exportButton.disabled = false;
      }, 2000);
    }

    console.log(`✅ Report exported successfully as ${format}`);
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert(`Export failed: ${error.message}`);

    // Reset button
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.textContent = '📥 Export Results';
    }
  }
}
