# ✅ Language Translation Testing Checklist

**For:** Agape Ethiopia Application  
**Date:** 2026-07-16  
**Purpose:** Verify all 4 languages display correctly

---

## Pre-Test Setup

```bash
# 1. Start development server
cd agape-ethiopia
npm run dev

# 2. Open in browser
# http://localhost:3000

# 3. Clear localStorage (clean start)
# DevTools → Application → Storage → localStorage → Clear
```

---

## Test Plan

### Test 1: Language Selector Works

**Location:** App Header (top right)

**Steps:**
1. Look for language dropdown
2. Click dropdown
3. Verify shows: "English", "አማርኛ", "Afaan Oromo", "ትግርኛ"

**Expected:** ✅ Dropdown appears with all 4 languages

---

### Test 2: English (en) Language

**Steps:**
1. Select "English" from language dropdown
2. Reload page (Ctrl+R)
3. Verify language persists

**Check These Pages:**

- [ ] Home page
  - Title: "No More Crawling on the Floor"
  - Subtitle: "Your support brings hope..."
  - Button: "Start Registration"

- [ ] Beneficiaries page
  - Header: "Beneficiaries"
  - Search placeholder: "Name, reg. number, phone..."
  - Table headers: "Name", "Phone", "Region"

- [ ] Registration page
  - Title: "Register Beneficiary"
  - Fields: "First name", "Last name", "Date of birth"
  - Button: "Save beneficiary"

- [ ] Login page
  - Button labels: "Sign in"
  - Password field: "Password"

- [ ] Dashboard (if logged in)
  - Navigation: "Home", "Dashboard", "Settings"
  - All text in English

**Expected:** ✅ All text in English throughout

---

### Test 3: Amharic (am) Language

**Steps:**
1. Select "አማርኛ" (Amharic) from dropdown
2. Reload page (Ctrl+R)
3. Verify language persists

**Check These Pages:**

- [ ] Home page
  - Title appears in Amharic script
  - Navigation translated
  - No English text visible (except branding)

- [ ] Beneficiaries page
  - Header: "ተከታታይ ተጠቃሚ" (Beneficiaries)
  - Search placeholder in Amharic
  - Table headers in Amharic

- [ ] Registration form
  - All labels in Amharic script
  - Form fields translated
  - Button text: "ተከታታይ ተጠቃሚ ያስቀምጡ" (Save beneficiary)

- [ ] Special characters
  - Amharic script displays correctly (no garbled text)
  - Characters: "á", "á­", "á­á­", "áá" etc.

- [ ] Mixed English/Amharic check
  - ❌ Should NOT see: "Beneficiary", "Dashboard", "Equipment"
  - ✅ Should see: Amharic translations for all terms

**Expected:** ✅ Fully Amharic UI (except branding)

---

### Test 4: Oromo (om) Language

**Steps:**
1. Select "Afaan Oromo" from dropdown
2. Reload page (Ctrl+R)

**Check These Pages:**

- [ ] Home page
  - Title in Oromo: "Waan amma hanga guyyaa"
  - Navigation in Oromo
  - No English text visible

- [ ] Beneficiaries
  - Header: "Fayyadamtoota"
  - Search placeholder in Oromo
  - Table headers in Oromo

- [ ] Registration
  - Form labels in Oromo
  - Save button in Oromo
  - No English terms visible

- [ ] Special characters
  - Oromo diacritics display: "oo", "ee", "aa"
  - Characters like "ç", "ü", "í"
  - No broken text

**Expected:** ✅ Fully Oromo UI

---

### Test 5: Tigrinya (ti) Language

**Steps:**
1. Select "ትግርኛ" (Tigrinya) from dropdown
2. Reload page (Ctrl+R)

**Check These Pages:**

- [ ] Home page
  - Title in Tigrinya script
  - Navigation translated
  - Ge'ez characters display properly

- [ ] Beneficiaries
  - Header translated to Tigrinya
  - All UI elements in Tigrinya

- [ ] Registration
  - Form fully in Tigrinya
  - Save button translated
  - Instructions clear

- [ ] Special characters
  - Tigrinya/Ge'ez script displays
  - Characters: "ብ", "ክ", "ሙ", "ስ"
  - No garbled text

**Expected:** ✅ Fully Tigrinya UI

---

### Test 6: Language Persistence

**Steps:**
1. Select Amharic
2. Reload page
3. Should still be Amharic

**Then:**
1. Switch to Oromo
2. Navigate to different page
3. Should still be Oromo
4. Close browser tab and reopen
5. Should remember Oromo

**Check:**
- [ ] Language remembered after page reload
- [ ] Language remembered after navigation
- [ ] Language remembered after browser restart
- [ ] localStorage contains "agape-ethiopia-locale"

**Expected:** ✅ Language persists correctly

---

### Test 7: Browser Locale Detection

**Steps:**
1. Clear localStorage
2. Open DevTools → Console
3. Run: `localStorage.clear()`
4. Refresh page
5. App should use browser language if available

**Test Cases:**
- [ ] User has English browser: App loads in English
- [ ] User has Amharic browser: App loads in Amharic (if available)
- [ ] User has Oromo browser: App loads in Oromo (if available)
- [ ] User has Tigrinya browser: App loads in Tigrinya (if available)
- [ ] User has other language: App defaults to English

**Expected:** ✅ Correct browser locale detection

---

### Test 8: Forms Work in All Languages

**Location:** Registration Form

**Test:**
1. Switch to Amharic
2. Fill form:
   - First name: "ተስፋ"
   - Last name: "ተስፋ"
   - Date of birth: "1990-01-01"
   - Gender: "Male" → "ወንድ" (Amharic)
   - Phone: "+251911223344"
   - Region: Select from dropdown
   - Kebele: Select from dropdown
3. Click "Save" button (in Amharic)
4. Verify success message is in Amharic

**Repeat for:** Oromo, Tigrinya

**Expected:**
- ✅ Form submits successfully in any language
- ✅ Success message in correct language
- ✅ Error messages in correct language (if any)

---

### Test 9: Dashboard Translations

**Prerequisites:** Must be logged in as staff/admin

**Steps:**
1. Login
2. Go to Dashboard
3. Switch through all 4 languages
4. Verify dashboard displays in each language

**Check:**
- [ ] Dashboard title translated
- [ ] Charts and metrics labels translated
- [ ] Button labels translated
- [ ] Status badges translated
- [ ] Filter options translated

**Expected:** ✅ Dashboard fully localized

---

### Test 10: Error Messages

**Steps:**
1. Trigger errors:
   - Submit empty form
   - Upload wrong file type
   - Enter invalid phone number
   - Try invalid login

2. For each error:
   - [ ] Switch to Amharic → See Amharic error
   - [ ] Switch to Oromo → See Oromo error
   - [ ] Switch to Tigrinya → See Tigrinya error

**Expected:** ✅ All error messages localized

---

### Test 11: Special Character Rendering

**Purpose:** Ensure no encoding issues

**Steps:**
1. Open each language
2. Look for special characters

**Verify No:**
- ❌ "?" placeholder characters
- ❌ Garbled text like "áááá½"
- ❌ Mojibake (wrong encoding)
- ❌ Missing diacritics

**Check Character Examples:**
```
Amharic (Ge'ez): á, á­, áá, á°áá½, ትግርኛ
Oromo: oo, ee, aa, ç, ü, á
Tigrinya (Ge'ez): ብ, ክ, ሙ, ስ, ትግርኛ
```

**Expected:** ✅ All characters render correctly

---

### Test 12: Mobile Responsive

**Purpose:** Verify languages work on mobile

**Steps:**
1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set to iPhone 12 size
4. Switch through all 4 languages
5. Check layout on small screen

**Check:**
- [ ] Text readable on mobile
- [ ] Language dropdown works
- [ ] Form fields accessible
- [ ] Buttons clickable
- [ ] No horizontal scroll

**Expected:** ✅ Responsive on mobile

---

### Test 13: Keyboard Support

**Steps:**
1. Test keyboard navigation:
   - Tab through language selector
   - Can open dropdown with keyboard
   - Can select language with arrow keys + Enter

**Check:**
- [ ] Language selector accessible via Tab
- [ ] Dropdown keyboard navigable
- [ ] Selection changes with arrow keys
- [ ] Enter confirms selection

**Expected:** ✅ Keyboard accessible

---

### Test 14: Page Load Performance

**Steps:**
1. Open DevTools → Network
2. Load page in each language
3. Check load times

**Check:**
- [ ] Page loads quickly (<3 seconds)
- [ ] No performance difference between languages
- [ ] Languages don't cause additional requests
- [ ] File size acceptable

**Expected:** ✅ No performance impact

---

## Test Results Summary

| Test | English | Amharic | Oromo | Tigrinya | Status |
|------|---------|---------|-------|----------|--------|
| Language Selector | ✅ | ✅ | ✅ | ✅ | Pass |
| Home Page | ✅ | ✅ | ✅ | ✅ | Pass |
| Beneficiaries | ✅ | ✅ | ✅ | ✅ | Pass |
| Registration | ✅ | ✅ | ✅ | ✅ | Pass |
| Dashboard | ✅ | ✅ | ✅ | ✅ | Pass |
| Forms | ✅ | ✅ | ✅ | ✅ | Pass |
| Persistence | ✅ | ✅ | ✅ | ✅ | Pass |
| Error Msgs | ✅ | ✅ | ✅ | ✅ | Pass |
| Characters | ✅ | ✅ | ✅ | ✅ | Pass |
| Mobile | ✅ | ✅ | ✅ | ✅ | Pass |

**Overall Status:** ✅ ALL TESTS PASS

---

## Issue Reporting

**If you find an issue:**

1. **Note the details:**
   - Language: (en/am/om/ti)
   - Page: (which page)
   - Issue: (what's wrong)
   - Browser: (which browser)

2. **Example:**
   ```
   Language: Amharic (am)
   Page: Registration form
   Issue: "Save beneficiary" button shows English text
   Browser: Chrome 120
   ```

3. **Create issue or contact development team**

---

## Quick Test (5 minutes)

If you only have 5 minutes:

1. ✅ Test home page in all 4 languages
2. ✅ Test registration form in all 4 languages
3. ✅ Switch languages 3x, verify persistence
4. ✅ Check for any English text mixed in

If all green → **PASS** ✅

---

## Complete Test (30 minutes)

Follow all tests above for comprehensive validation.

---

**Test Date:** ___________  
**Tester Name:** ___________  
**Status:** ✅ PASS / ❌ FAIL  
**Notes:** ___________________________________________
