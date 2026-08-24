import { calculateTax, compareRegimes } from './src/domain/tax/calculations/calculation-engine.js';
import { oldRegimeRules, newRegimeRules } from './src/domain/rules/financial-years/fy-2025-26.js';

const testIncome = {
  salary: 500000,
  houseProperty: 0,
  business: 0,
  capitalGains: 0,
  otherIncome: 0,
  stcgEquity: 100000,
  stcgOther: 0,
  ltcgEquity: 200000,
  ltcgOther: 0,
  speculativeGains: 50000,
  speculativeLosses: 0,
  fnoGains: 25000,
  fnoLosses: 0,
  interestIncome: 0,
  dividendIncome: 0,
  otherTaxable: 0,
};

const testDeductions = {
  standardDeduction: 50000,
  section80C: 150000,
  section80CCD1B: 0,
  section80D: 0,
  section80E: 0,
  section80G: 0,
  section80TTA: 0,
  section80TTB: 0,
  hra: 0,
  lta: 0,
  homeLoanInterest: 0,
  otherDeductions: 0,
};

console.log('🧪 END-TO-END CALCULATION TEST');
console.log('==============================\n');

console.log('INPUT DATA:');
console.log('-----------');
console.log('Salary:', testIncome.salary);
console.log('STCG (Equity):', testIncome.stcgEquity);
console.log('LTCG (Equity):', testIncome.ltcgEquity);
console.log('Speculative:', testIncome.speculativeGains);
console.log('F&O:', testIncome.fnoGains);
console.log('Deductions:', testDeductions.standardDeduction + testDeductions.section80C);
console.log('');

try {
  const result = compareRegimes(testIncome, testDeductions, oldRegimeRules, newRegimeRules);

  console.log('✅ CALCULATION SUCCESSFUL\n');

  console.log('OLD REGIME RESULTS:');
  console.log('------------------');
  console.log('Gross Income:', result.oldRegime?.grossIncome);
  console.log('Total Deductions:', result.oldRegime?.totalDeductions);
  console.log('Taxable Income:', result.oldRegime?.taxableIncome);
  console.log('Income Tax:', result.oldRegime?.incomeTax);
  console.log('Rebate:', result.oldRegime?.rebate);
  console.log('Surcharge:', result.oldRegime?.surcharge);
  console.log('Cess:', result.oldRegime?.cess);
  console.log('TOTAL TAX:', result.oldRegime?.totalTax);
  console.log('');

  console.log('NEW REGIME RESULTS:');
  console.log('------------------');
  console.log('Gross Income:', result.newRegime?.grossIncome);
  console.log('Total Deductions:', result.newRegime?.totalDeductions);
  console.log('Taxable Income:', result.newRegime?.taxableIncome);
  console.log('Income Tax:', result.newRegime?.incomeTax);
  console.log('Rebate:', result.newRegime?.rebate);
  console.log('Surcharge:', result.newRegime?.surcharge);
  console.log('Cess:', result.newRegime?.cess);
  console.log('TOTAL TAX:', result.newRegime?.totalTax);
  console.log('');

  console.log('SPECIAL INCOME BREAKDOWN (OLD):');
  console.log('-------------------------------');
  console.log('Ordinary Income Tax:', result.oldRegime?.ordinaryIncomeTax);
  console.log('STCG Tax (@ 20%):', result.oldRegime?.stcgTax);
  console.log('LTCG Tax (@ 12.5%):', result.oldRegime?.ltcgEquityTax);
  console.log('Speculative Tax (@ 30%):', result.oldRegime?.speculativeTax);
  console.log('F&O Tax:', result.oldRegime?.fnoTax);
  console.log('Total:', (result.oldRegime?.ordinaryIncomeTax || 0) + 
                         (result.oldRegime?.stcgTax || 0) + 
                         (result.oldRegime?.ltcgEquityTax || 0) + 
                         (result.oldRegime?.speculativeTax || 0) + 
                         (result.oldRegime?.fnoTax || 0));
  console.log('');

  console.log('✅ GROSS INCOME VERIFICATION:');
  console.log('------------------------------');
  const expectedGrossIncome = testIncome.salary + testIncome.stcgEquity + 
                              testIncome.ltcgEquity + testIncome.speculativeGains + 
                              testIncome.fnoGains;
  console.log('Expected:', expectedGrossIncome);
  console.log('Old Regime:', result.oldRegime?.grossIncome);
  console.log('New Regime:', result.newRegime?.grossIncome);
  console.log('Match:', expectedGrossIncome === result.oldRegime?.grossIncome ? '✓ YES' : '✗ NO');
  console.log('');

} catch (error) {
  console.error('❌ CALCULATION FAILED:');
  console.error(error.message);
  console.error(error.stack);
}
