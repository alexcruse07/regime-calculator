import { calculateTax } from './src/domain/tax/calculations/calculation-engine.js';
import { getTaxRules } from './src/shared/constants/financial-years.js';

// Test 1: Old Regime calculation
console.log('=== TEST 1: OLD REGIME (FY 2025-26) ===');
const oldRules = getTaxRules('old', '2025-26');
const oldResult = calculateTax({
  salary: 1000000,
  section80C: 150000,
  section80D: 25000
}, 'old', '2025-26', oldRules);
console.log('Salary: ₹10,00,000');
console.log('Deductions: 80C=1.5L, 80D=25K');
console.log('Taxable Income:', oldResult.taxableIncome);
console.log('Total Tax:', oldResult.totalTax);
console.log('');

// Test 2: New Regime calculation  
console.log('=== TEST 2: NEW REGIME (FY 2025-26) ===');
const newRules = getTaxRules('new', '2025-26');
const newResult = calculateTax({
  salary: 1000000
}, 'new', '2025-26', newRules);
console.log('Salary: ₹10,00,000');
console.log('Taxable Income:', newResult.taxableIncome);
console.log('Total Tax:', newResult.totalTax);
console.log('');

// Test 3: New Regime 2026-27
console.log('=== TEST 3: NEW REGIME (FY 2026-27) ===');
const new2627Rules = getTaxRules('new', '2026-27');
const new2627 = calculateTax({
  salary: 1500000
}, 'new', '2026-27', new2627Rules);
console.log('Salary: ₹15,00,000');
console.log('Taxable Income:', new2627.taxableIncome);
console.log('Total Tax:', new2627.totalTax);
console.log('');

// Test 4: Low income with rebate
console.log('=== TEST 4: REBATE TEST (FY 2025-26) ===');
const rebateRules = getTaxRules('new', '2025-26');
const rebateResult = calculateTax({
  salary: 700000
}, 'new', '2025-26', rebateRules);
console.log('Salary: ₹7,00,000');
console.log('Tax before rebate:', rebateResult.incomeTax);
console.log('Rebate:', rebateResult.rebate);
console.log('Total Tax:', rebateResult.totalTax);
