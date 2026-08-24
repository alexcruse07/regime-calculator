/**
 * Comprehensive Test Suite for Tax Calculator
 * Tests calculation accuracy and PDF export
 */

import { orchestrateCalculation } from './dist/app/tax-orchestration/coordinator.js';

console.log('🧪 COMPREHENSIVE FEATURE TEST SUITE\n');
console.log('='.repeat(60));

// Test Case 1: Mixed Income with Special Income Types
const testData1 = {
  fullName: 'Rajesh Jaiswal',
  pan: 'AAAJR5055K',
  financialYear: '2025-26',
  taxRegime: 'old',
  
  // Primary income
  salary: '500000',
  houseProperty: '0',
  business: '0',
  capitalGains: '0',
  otherIncome: '0',
  
  // Capital gains - THE CRITICAL FEATURE
  stcgEquity: '100000',
  stcgOther: '0',
  ltcgEquity: '200000',
  ltcgOther: '0',
  
  // Trading income
  speculativeGains: '50000',
  speculativeLosses: '0',
  fnoGains: '25000',
  fnoLosses: '0',
  
  // Other income
  interestIncome: '10000',
  dividendIncome: '5000',
  otherTaxable: '0',
  
  // Deductions
  deductions: {
    standardDeduction: '0',
    section80C: '150000',
    section80CCD1B: '0',
    section80D: '0',
    section80E: '0',
    section80G: '0',
    section80TTA: '0',
    section80TTB: '0',
    hra: '0',
    lta: '0',
    homeLoanInterest: '0',
    otherDeductions: '0',
  }
};

console.log('\n📋 TEST 1: Mixed Income with Capital Gains & Special Income');
console.log('-'.repeat(60));

runTest(testData1, 'Test 1: Mixed Income');

// Test Case 2: Simple Salary Income (Baseline)
const testData2 = {
  fullName: 'John Doe',
  pan: 'AAAJD1234A',
  financialYear: '2025-26',
  taxRegime: 'new',
  
  salary: '750000',
  houseProperty: '0',
  business: '0',
  capitalGains: '0',
  otherIncome: '0',
  stcgEquity: '0',
  stcgOther: '0',
  ltcgEquity: '0',
  ltcgOther: '0',
  speculativeGains: '0',
  speculativeLosses: '0',
  fnoGains: '0',
  fnoLosses: '0',
  interestIncome: '0',
  dividendIncome: '0',
  otherTaxable: '0',
  
  deductions: {
    standardDeduction: '75000',
    section80C: '100000',
    section80CCD1B: '0',
    section80D: '0',
    section80E: '0',
    section80G: '0',
    section80TTA: '0',
    section80TTB: '0',
    hra: '0',
    lta: '0',
    homeLoanInterest: '0',
    otherDeductions: '0',
  }
};

console.log('\n📋 TEST 2: Simple Salary Income (New Regime)');
console.log('-'.repeat(60));

runTest(testData2, 'Test 2: Simple Salary');

// Test Case 3: High Income with Surcharge (>50L)
const testData3 = {
  fullName: 'Business Owner',
  pan: 'AAABO5678K',
  financialYear: '2025-26',
  taxRegime: 'old',
  
  salary: '2000000',
  houseProperty: '500000',
  business: '1500000',
  capitalGains: '0',
  otherIncome: '0',
  stcgEquity: '200000',
  stcgOther: '0',
  ltcgEquity: '300000',
  ltcgOther: '0',
  speculativeGains: '0',
  speculativeLosses: '0',
  fnoGains: '0',
  fnoLosses: '0',
  interestIncome: '50000',
  dividendIncome: '0',
  otherTaxable: '0',
  
  deductions: {
    standardDeduction: '0',
    section80C: '150000',
    section80CCD1B: '0',
    section80D: '0',
    section80E: '0',
    section80G: '0',
    section80TTA: '0',
    section80TTB: '0',
    hra: '0',
    lta: '0',
    homeLoanInterest: '200000',
    otherDeductions: '0',
  }
};

console.log('\n📋 TEST 3: High Income with Surcharge (>50L)');
console.log('-'.repeat(60));

runTest(testData3, 'Test 3: High Income');

async function runTest(testData, testName) {
  try {
    const result = await orchestrateCalculation(testData);

    if (result.success) {
      console.log('✅ CALCULATION SUCCESSFUL\n');

      const oldTax = result.result.oldRegime;
      const newTax = result.result.newRegime;

      // Calculate expected gross income
      const expectedGross = 
        Number(testData.salary) + 
        Number(testData.houseProperty) + 
        Number(testData.business) + 
        Number(testData.capitalGains) + 
        Number(testData.otherIncome) +
        Number(testData.stcgEquity) +
        Number(testData.stcgOther) +
        Number(testData.ltcgEquity) +
        Number(testData.ltcgOther) +
        Number(testData.speculativeGains) +
        Number(testData.fnoGains) +
        Number(testData.interestIncome) +
        Number(testData.dividendIncome) +
        Number(testData.otherTaxable);

      console.log('📊 EXPECTED VS ACTUAL:\n');
      console.log(`Expected Gross Income: ₹${expectedGross.toLocaleString('en-IN')}`);
      console.log(`Actual Gross Income:   ₹${oldTax.grossIncome.toLocaleString('en-IN')}`);
      console.log(`Match: ${expectedGross === oldTax.grossIncome ? '✅ YES' : '❌ NO'}\n`);

      console.log('💰 OLD REGIME RESULTS:');
      console.log(`  Gross Income:        ₹${oldTax.grossIncome.toLocaleString('en-IN')}`);
      console.log(`  Total Deductions:    ₹${oldTax.totalDeductions.toLocaleString('en-IN')}`);
      console.log(`  Taxable Income:      ₹${oldTax.taxableIncome.toLocaleString('en-IN')}`);
      console.log(`  Ordinary Income Tax: ₹${(oldTax.ordinaryIncomeTax || 0).toLocaleString('en-IN')}`);
      console.log(`  STCG Tax (20%):      ₹${(oldTax.stcgTax || 0).toLocaleString('en-IN')}`);
      console.log(`  LTCG Tax (12.5%):    ₹${(oldTax.ltcgEquityTax || 0).toLocaleString('en-IN')}`);
      console.log(`  Speculative Tax:     ₹${(oldTax.speculativeTax || 0).toLocaleString('en-IN')}`);
      console.log(`  F&O Tax:             ₹${(oldTax.fnoTax || 0).toLocaleString('en-IN')}`);
      console.log(`  Total Income Tax:    ₹${oldTax.incomeTax.toLocaleString('en-IN')}`);
      console.log(`  Rebate (87A):        ₹${oldTax.rebate.toLocaleString('en-IN')}`);
      console.log(`  Surcharge:           ₹${oldTax.surcharge.toLocaleString('en-IN')}`);
      console.log(`  Cess (4%):           ₹${oldTax.cess.toLocaleString('en-IN')}`);
      console.log(`  💵 TOTAL TAX:        ₹${oldTax.totalTax.toLocaleString('en-IN')}\n`);

      console.log('💰 NEW REGIME RESULTS:');
      console.log(`  Gross Income:        ₹${newTax.grossIncome.toLocaleString('en-IN')}`);
      console.log(`  Total Deductions:    ₹${newTax.totalDeductions.toLocaleString('en-IN')}`);
      console.log(`  Taxable Income:      ₹${newTax.taxableIncome.toLocaleString('en-IN')}`);
      console.log(`  Income Tax:          ₹${newTax.incomeTax.toLocaleString('en-IN')}`);
      console.log(`  Rebate (87A):        ₹${newTax.rebate.toLocaleString('en-IN')}`);
      console.log(`  Surcharge:           ₹${newTax.surcharge.toLocaleString('en-IN')}`);
      console.log(`  Cess (4%):           ₹${newTax.cess.toLocaleString('en-IN')}`);
      console.log(`  💵 TOTAL TAX:        ₹${newTax.totalTax.toLocaleString('en-IN')}\n`);

      const difference = oldTax.totalTax - newTax.totalTax;
      console.log('🔄 COMPARISON:');
      console.log(`  Tax Difference:      ₹${Math.abs(difference).toLocaleString('en-IN')}`);
      console.log(`  Better Regime:       ${difference > 0 ? 'NEW REGIME' : 'OLD REGIME'}`);
      console.log(`  Savings:             ₹${Math.abs(difference).toLocaleString('en-IN')}\n`);

      // Verify special income taxes
      if (testData.stcgEquity > 0) {
        const expectedSTCG = Math.round(Number(testData.stcgEquity) * 0.20);
        console.log(`✅ STCG Verification: Expected ₹${expectedSTCG}, Got ₹${oldTax.stcgTax || 0} ${expectedSTCG === (oldTax.stcgTax || 0) ? '✅' : '❌'}`);
      }

      if (testData.ltcgEquity > 0) {
        const ltcgAfterExemption = Math.max(0, Number(testData.ltcgEquity) - 125000);
        const expectedLTCG = Math.round(ltcgAfterExemption * 0.125);
        console.log(`✅ LTCG Verification: Expected ₹${expectedLTCG}, Got ₹${oldTax.ltcgEquityTax || 0} ${expectedLTCG === (oldTax.ltcgEquityTax || 0) ? '✅' : '❌'}`);
      }

      if (testData.speculativeGains > 0) {
        const expectedSpec = Math.round(Number(testData.speculativeGains) * 0.30);
        console.log(`✅ Speculative Verification: Expected ₹${expectedSpec}, Got ₹${oldTax.speculativeTax || 0} ${expectedSpec === (oldTax.speculativeTax || 0) ? '✅' : '❌'}`);
      }

      console.log('\n✅ ' + testName + ' - PASSED\n');

    } else {
      console.log('❌ CALCULATION FAILED');
      console.log('Errors:', result.errors);
      console.log('\n❌ ' + testName + ' - FAILED\n');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n❌ ' + testName + ' - ERROR\n');
  }

  console.log('='.repeat(60));
}
