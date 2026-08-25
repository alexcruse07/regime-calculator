# TAX-022 Quick Test Guide

## 🚀 How to Test Locally

### Step 1: Open the Calculator
1. Open `dist/index.html` in your web browser
   - You should see a new blue section at the top with "Full Name" and "PAN" fields

### Step 2: Test Name Validation (Mandatory)
**Test Case 1: Empty Name**
```
1. Leave "Full Name" empty
2. Click Submit (or Calculate)
3. Expected: Red error message "Full Name is required"
4. Form should NOT submit
```

**Test Case 2: Valid Name**
```
1. Enter "Rajesh Kumar" in Full Name field
2. Leave other fields empty
3. Click Submit
4. Expected: Form submits successfully
```

### Step 3: Test PAN Validation (Optional)
**Test Case 3: Skip PAN**
```
1. Enter "Rajesh Kumar" in Full Name
2. Leave PAN empty (don't fill it)
3. Add income: Salary = 750000
4. Click Submit
5. Expected: Form submits successfully, Export button enabled
```

**Test Case 4: Valid PAN**
```
1. Enter "John Doe" in Full Name
2. Enter "AAAPK1234A" in PAN field
3. Add income: Salary = 500000
4. Click Submit
5. Expected: Form submits, "AAAPK1234A" appears in export file
```

**Test Case 5: Invalid PAN Format**
```
1. Enter "Jane Smith" in Full Name
2. Enter "INVALID123" in PAN field (wrong format)
3. Add income: Salary = 750000
4. Click Submit
5. Expected: Form submits anyway (PAN validation is optional)
6. Export file generated successfully
```

### Step 4: Test Export Functionality
**Test Case 6: Export Button State**
```
1. Reload page
2. Look at Export button below results
3. Expected: Export button is DISABLED (greyed out)
4. Fill in Name: "Test User"
5. Fill in Salary: 750000
6. Click Submit
7. Expected: Export button becomes ENABLED (bright blue)
```

**Test Case 7: Export File Download**
```
1. After results are displayed and Export button is enabled
2. Click "Export Results" button
3. Expected: File downloads with name like:
   - Tax_Report_Test_User_FY2025_26.txt
4. File should open in a text editor
```

**Test Case 8: Export File Content**
```
1. Open the downloaded tax report file
2. Verify it contains:
   ✓ "Full Name: Test User"
   ✓ "Financial Year: 2025-26"
   ✓ "Salary Income: ₹750,000.00"
   ✓ "Gross Income: ₹750,000.00"
   ✓ "Income Tax" for both regimes
   ✓ "TOTAL TAX LIABILITY" values
   ✓ "Better Regime" recommendation
   ✓ Professional formatting with separators
```

### Step 5: Test Clear Button
**Test Case 9: Clear Form**
```
1. Fill in Name: "Test User"
2. Fill in Salary: 750000
3. Click Submit
4. Verify Export button is ENABLED
5. Click "Clear" button
6. Expected:
   ✓ Full Name field is empty
   ✓ PAN field is empty
   ✓ Salary field is empty
   ✓ Results are hidden
   ✓ Export button is DISABLED again
```

## 📋 Complete User Journey Test

Follow this complete flow to test everything:

```
1. Load dist/index.html
   ↓
2. Try Submit without Name
   → Verify error: "Full Name is required"
   ↓
3. Fill Name: "Sharma Family Trust"
   ↓
4. Fill PAN: "AABHT1234K"
   ↓
5. Fill Salary: 1000000
   ↓
6. Fill STCG Equity: 200000
   ↓
7. Fill LTCG Equity: 500000
   ↓
8. Fill Section 80C: 150000
   ↓
9. Click Submit
   ↓
10. Verify results displayed
    ↓
11. Verify Export button is ENABLED
    ↓
12. Click Export button
    ↓
13. Verify file downloads:
    Tax_Report_Sharma_Family_Trust_FY2025_26.txt
    ↓
14. Open file and verify content
    ↓
15. Go back to calculator
    ↓
16. Click Clear button
    ↓
17. Verify all fields cleared and Export DISABLED
```

## 🎯 Expected Export File Content

When you export, your file should look like:

```
======================================================================
                    INDIAN INCOME TAX CALCULATION REPORT
======================================================================

Generated on: 24 August 2026, 11:54 PM
Financial Year: 2025-26

----------------------------------------------------------------------
USER INFORMATION
----------------------------------------------------------------------
Full Name: Sharma Family Trust
PAN: AABHT1234K

----------------------------------------------------------------------
INCOME DETAILS
----------------------------------------------------------------------
Salary Income..........................: ₹10,00,000.00
STCG - Equity..........................: ₹2,00,000.00
LTCG - Equity..........................: ₹5,00,000.00

======================================================================
TAX CALCULATION RESULTS
======================================================================

OLD TAX REGIME
----------------------------------------------------------------------
Gross Income....................: ₹17,00,000.00
Total Deductions................: ₹1,50,000.00
Taxable Income..................: ₹15,50,000.00
Income Tax.......................: ₹[Calculated Amount]
Rebate u/s 87A...................: ₹[Amount if applicable]
Surcharge........................: ₹[Amount if applicable]
Health & Education Cess (4%)...: ₹[Amount if applicable]

TOTAL TAX LIABILITY (OLD REGIME): ₹[Total]

... (similar for NEW REGIME)

REGIME COMPARISON
----------------------------------------------------------------------
Tax Difference...................: ₹[Difference]
Better Regime....................: OLD REGIME / NEW REGIME
You can save ₹[Amount] by choosing [Better Regime]

======================================================================
```

## ✅ Checklist to Verify All Features

- [ ] Full Name field appears at top of form
- [ ] PAN field appears below Full Name
- [ ] (Optional) label shown next to PAN
- [ ] Form rejects submission if Name is empty
- [ ] Form accepts submission with Name only (no PAN)
- [ ] Form accepts submission with valid PAN
- [ ] Form accepts submission with invalid PAN (optional)
- [ ] Export button disabled initially
- [ ] Export button enabled after calculation
- [ ] Export button works and downloads file
- [ ] Downloaded file has correct name format
- [ ] Exported file contains user's name
- [ ] Exported file contains all income data
- [ ] Exported file contains all tax calculations
- [ ] Exported file shows regime comparison
- [ ] Clear button resets Name and PAN fields
- [ ] Clear button disables Export button again
- [ ] Professional formatting in exported file
- [ ] Works in both Old and New regimes

## 📞 If Something Doesn't Work

1. Check browser console (F12 → Console tab)
2. Look for error messages
3. Verify dist/index.html was properly updated
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh page (Ctrl+Shift+R)
6. Try in a different browser

## 📧 Report Results

After testing, please report:
1. Which test cases passed ✅
2. Which test cases failed ❌ (if any)
3. Browser used and any error messages
4. Any UX improvements suggested
5. Confirmation that export files work correctly
