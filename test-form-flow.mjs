import { orchestrateCalculation } from './src/app/tax-orchestration/coordinator.js';

// Test data exactly as form would send it
const formInput = {
  fullName: 'Test User',
  pan: '',
  financialYear: '2025-26',
  taxRegime: 'old',
  
  // Basic income
  salary: '500000',
  houseProperty: '0',
  business: '0',
  capitalGains: '0',
  otherIncome: '0',
  
  // Capital gains - THIS IS WHAT USER IS ADDING
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

console.log('🧪 FORM FLOW TEST - SIMULATING ACTUAL FORM SUBMISSION');
console.log('=====================================================\n');

try {
  const result = await orchestrateCalculation(formInput);

  if (result.success) {
    console.log('\n✅ SUCCESS\n');
    
    const expected = {
      salary: 500000,
      stcg: 100000,
      ltcg: 200000,
      speculative: 50000,
      fno: 25000,
      interest: 10000,
      dividend: 5000,
      total: 500000 + 100000 + 200000 + 50000 + 25000 + 10000 + 5000,
    };

    console.log('EXPECTED INCOME CALCULATION:');
    console.log('Salary: ₹' + expected.salary);
    console.log('STCG: ₹' + expected.stcg);
    console.log('LTCG: ₹' + expected.ltcg);
    console.log('Speculative: ₹' + expected.speculative);
    console.log('F&O: ₹' + expected.fno);
    console.log('Interest: ₹' + expected.interest);
    console.log('Dividend: ₹' + expected.dividend);
    console.log('EXPECTED TOTAL: ₹' + expected.total);
    console.log('');

    const old = result.result.oldRegime;
    console.log('OLD REGIME - ACTUAL RESULTS:');
    console.log('Gross Income: ₹' + old.grossIncome);
    console.log('Matches Expected: ' + (old.grossIncome === expected.total ? '✅ YES' : '❌ NO'));
    console.log('');

    console.log('TAX BREAKDOWN:');
    console.log('Ordinary Income (Salary): ₹' + (old.ordinaryIncomeTax || 0));
    console.log('STCG Tax (₹100k @ 20%): ₹' + (old.stcgTax || 0) + ' (expected: 20000)');
    console.log('LTCG Tax (₹75k @ 12.5%): ₹' + (old.ltcgEquityTax || 0) + ' (expected: 9375)');
    console.log('Speculative Tax (₹50k @ 30%): ₹' + (old.speculativeTax || 0) + ' (expected: 15000)');
    console.log('F&O Tax: ₹' + (old.fnoTax || 0));
    console.log('Total Income Tax: ₹' + old.incomeTax);
    console.log('Total Tax Payable: ₹' + old.totalTax);
    console.log('');

    console.log('✅ IF GROSS INCOME IS CORRECT AND SPECIAL TAXES > 0, THE FIX IS WORKING');

  } else {
    console.log('❌ CALCULATION FAILED');
    console.log('Errors:', result.errors);
  }
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error(error.stack);
}
