# 🌍 i18n (Internationalization) Setup Guide

**For:** Agape Ethiopia Application  
**Status:** ✅ Complete Setup with 4 Languages  
**Last Updated:** 2026-07-16

---

## Overview

Your application supports **4 languages**:
- 🇬🇧 **English (en)** - English
- 🇪🇹 **Amharic (am)** - አማርኛ
- 🇪🇹 **Oromo (om)** - Afaan Oromo
- 🇪🇹 **Tigrinya (ti)** - ትግርኛ

All UI text is fully localized to each language.

---

## Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│              LanguageProvider (Context)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Stores current locale (en/am/om/ti)              │  │
│  │ • Persists to localStorage                         │  │
│  │ • Detects browser locale on first load             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│             useLanguage() Hook in Components               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • get current locale                                │  │
│  │ • access t() function for translations             │  │
│  │ • call setLocale() to change language              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│          translations.ts (Translation Data)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ {                                                    │  │
│  │   en: { "home": "Home", ... },                      │  │
│  │   am: { "home": "ቤት", ... },                       │  │
│  │   om: { "home": "Mana", ... },                      │  │
│  │   ti: { "home": "ዓዲ", ... }                        │  │
│  │ }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```
User Selects Language
        ↓
LanguageProvider.setLocale(locale)
        ↓
Update state + localStorage
        ↓
Re-render all components
        ↓
Components call useLanguage().t(key)
        ↓
Lookup: translations[locale][key]
        ↓
Fallback: translations.en[key] if not found
        ↓
Display translated text
```

---

## Core Files

### 1. LanguageProvider.tsx

**Location:** `/src/components/layout/LanguageProvider.tsx`

**Responsibilities:**
- ✅ Manage current locale state
- ✅ Persist locale to localStorage
- ✅ Detect browser locale on app start
- ✅ Provide translation function
- ✅ Provide context to all components

**Key Functions:**
```typescript
function getInitialLocale(): Locale
  // Returns: saved locale → browser locale → "en"

function useLanguage(): LanguageContextValue
  // Returns: { locale, setLocale, t, locales, localeLabels }
```

### 2. LanguageSelector.tsx

**Location:** `/src/components/layout/LanguageSelector.tsx`

**Responsibilities:**
- ✅ Display language dropdown
- ✅ Show language names in each language
- ✅ Handle language change
- ✅ Accessible UI component

**Usage:**
```typescript
<LanguageSelector />
// Renders: "Language: [Dropdown with en/am/om/ti]"
```

### 3. translations.ts

**Location:** `/src/lib/i18n/translations.ts`

**Structure:**
```typescript
export type Locale = "en" | "am" | "om" | "ti";

export const supportedLocales = ["en", "am", "om", "ti"];

export const localeLabels = {
  en: "English",
  am: "አማርኛ",
  om: "Afaan Oromo",
  ti: "ትግርኛ"
};

export const translations = {
  en: { /* 405+ keys */ },
  am: { /* 405+ keys */ },
  om: { /* 405+ keys */ },
  ti: { /* 405+ keys */ }
};
```

---

## Using Translations in Components

### Basic Usage

```typescript
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function MyComponent() {
  const { t, locale } = useLanguage();

  return (
    <div>
      <h1>{t("home")}</h1>
      <p>{t("welcomeMessage")}</p>
      <span>Current language: {locale}</span>
    </div>
  );
}
```

### With Locale-Specific Logic

```typescript
export default function DateDisplay() {
  const { t, locale } = useLanguage();

  const formatDate = (date: Date) => {
    if (locale === "en") {
      return date.toLocaleDateString("en-US");
    } else if (locale === "am") {
      return date.toLocaleDateString("am-ET");
    }
    // ... other locales
  };

  return <p>{formatDate(new Date())}</p>;
}
```

### Never Use Hardcoded Strings

❌ **Bad:**
```typescript
return <h1>Welcome</h1>;  // Hard to translate!
```

✅ **Good:**
```typescript
return <h1>{t("welcome")}</h1>;  // Easy to translate!
```

---

## Adding New Translations

### Step 1: Add Key to All Languages

Edit `/src/lib/i18n/translations.ts`:

```typescript
export const translations = {
  en: {
    // ... existing keys
    "myNewKey": "My new text",
  },
  am: {
    // ... existing keys
    "myNewKey": "የእኔ ልምምድ ጽሑፍ",
  },
  om: {
    // ... existing keys
    "myNewKey": "Baxxii koo haaraa",
  },
  ti: {
    // ... existing keys
    "myNewKey": "ሓድሽ ጽሑፈይ",
  }
};
```

### Step 2: Use in Component

```typescript
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function MyComponent() {
  const { t } = useLanguage();
  return <p>{t("myNewKey")}</p>;
}
```

### Step 3: Verify Coverage

```bash
bash validate-translations.sh
```

Should show 100% coverage for all languages.

### Step 4: Test All Languages

1. Start dev server: `npm run dev`
2. Go to app: http://localhost:3000
3. Change language to each option
4. Verify your new text appears correctly

---

## Translation Guidelines

### Key Naming Convention

```
"verb" or "nounAction" = imperative/action
"status" + Status = state/condition
"settings.key" = settings category

Examples:
"save" → "Save" (button)
"saveProfile" → "Save profile"
"statusActive" → "Active"
"settings.saved" → "Settings saved"
```

### Translation Tips

1. **Keep Translations Concise**
   - Avoid wordiness
   - Match English length approximately
   - Consider UI space constraints

2. **Maintain Consistency**
   - Use same terms throughout
   - Create a glossary of key terms
   - Share with all translators

3. **Account for Text Expansion**
   - Amharic/Tigrinya might be longer
   - Oromo varies by context
   - Test UI layout in each language

4. **Include Context**
   - Use descriptive key names
   - Include placeholders in comments
   - Example: `"save": "Save beneficiary"` not just `"save": "Save"`

5. **Special Characters**
   - Use proper language-specific characters
   - Avoid Latin letters for Ge'ez scripts
   - Include diacritics for Oromo

---

## Common Translation Keys

### Navigation
```
"home" - Home page
"beneficiaries" - Beneficiaries list
"dashboard" - Main dashboard
"settings" - Settings page
"login" - Login page
"logout" - Sign out
```

### Forms & Actions
```
"save" - Save button
"cancel" - Cancel button
"delete" - Delete
"edit" - Edit
"search" - Search
"submit" - Submit form
```

### Status & Messages
```
"saved" - Item saved
"error" - Error message
"success" - Success message
"loading" - Loading indicator
"noResults" - No results found
```

### User Management
```
"roleAdmin" - Administrator
"roleStaff" - Staff member
"active" - Active user
"disabled" - Disabled user
```

---

## Testing Translations

### Manual Testing Checklist

```
For each language (en, am, om, ti):
☐ Navigate to each page
☐ Verify all text is in that language
☐ Check for any hardcoded English text
☐ Test forms and buttons
☐ Check error messages
☐ Verify special characters display
☐ Test on mobile (small screens)
☐ Test browser zoom levels
```

### Automated Testing (Optional)

```typescript
// Example Jest test
describe("Translations", () => {
  it("should have all keys in all languages", () => {
    const englishKeys = Object.keys(translations.en);
    const languages = ["am", "om", "ti"];

    languages.forEach(lang => {
      englishKeys.forEach(key => {
        expect(translations[lang as Locale][key])
          .toBeDefined();
      });
    });
  });

  it("should have no undefined values", () => {
    Object.values(translations).forEach(lang => {
      Object.entries(lang).forEach(([key, value]) => {
        expect(value).toBeDefined();
        expect(value).not.toBe("");
      });
    });
  });
});
```

---

## Troubleshooting

### Issue: Language Not Persisting

**Problem:** Language resets after page refresh

**Solution:**
```typescript
// Check browser localStorage
console.log(localStorage.getItem("agape-ethiopia-locale"));

// Clear and try again
localStorage.clear();
location.reload();
```

### Issue: Text Not Translating

**Problem:** Component shows English even when language changed

**Solution:**
1. Verify key exists in translation:
   ```bash
   grep '"myKey"' agape-ethiopia/src/lib/i18n/translations.ts
   ```
2. Ensure `useLanguage()` is called
3. Check component is inside `LanguageProvider`

### Issue: Special Characters Show as ?

**Problem:** Foreign characters display incorrectly

**Solution:**
- Verify file is UTF-8 encoded
- Check browser accepts UTF-8
- Test in different browser

### Issue: Text Too Long for UI

**Problem:** Translated text breaks layout

**Solution:**
- Use shorter alternative translation
- Adjust CSS for text wrapping
- Test layout in all languages

---

## Internationalization Best Practices

### ✅ DO

- ✅ Use `t()` function for all user-facing text
- ✅ Keep keys short and descriptive
- ✅ Test in all 4 languages
- ✅ Use consistent terminology
- ✅ Include context with keys
- ✅ Update translations when code changes
- ✅ Run validation script before deploy
- ✅ Review translations with native speakers

### ❌ DON'T

- ❌ Hardcode text in components
- ❌ Use overly long key names
- ❌ Mix languages in single string
- ❌ Forget to add new keys to all languages
- ❌ Use `any` type for translations
- ❌ Deploy with untranslated keys
- ❌ Assume English will work for everyone
- ❌ Ignore RTL language considerations

---

## Language Support Matrix

| Feature | English | Amharic | Oromo | Tigrinya |
|---------|---------|---------|-------|----------|
| UI Text | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |
| Forms | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Error Messages | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Date Formatting | ✅ Partial | ✅ Basic | ✅ Basic | ✅ Basic |
| RTL Support | ❌ No | ❌ No | ❌ No | ❌ No |

### Notes:
- **Date Formatting:** Basic support via `toLocaleDateString()`
- **RTL:** Not implemented (all languages LTR)
- **Number Formatting:** Uses browser defaults

---

## Deployment Checklist

Before deploying:

```
☐ All new keys added to all 4 languages
☐ Validation script passes (100% coverage)
☐ Tested in all 4 languages
☐ No hardcoded English text found
☐ Special characters display correctly
☐ localStorage working
☐ Browser locale detection working
☐ Language selector functional
☐ Mobile layout tested
☐ Performance acceptable
```

---

## Useful Commands

### Check Translation Coverage
```bash
bash validate-translations.sh
```

### Search for Missing Translations
```bash
grep -r "t(\"" agape-ethiopia/src --include="*.tsx" | \
  cut -d'"' -f2 | sort -u > keys-used.txt

grep -oP '"[a-zA-Z0-9._-]+"\s*:' agape-ethiopia/src/lib/i18n/translations.ts | \
  grep -oP '"[^"]+"' | tr -d '"' > keys-defined.txt

comm -23 keys-used.txt keys-defined.txt
```

### Validate UTF-8 Encoding
```bash
file -i agape-ethiopia/src/lib/i18n/translations.ts
# Should show: UTF-8 Unicode text
```

---

## FAQ

**Q: Can I add a new language?**  
A: Yes! Add to `Locale` type, `supportedLocales` array, `localeLabels`, and translation object.

**Q: What if a translation key is missing?**  
A: Falls back to English, then shows key if English missing. No errors thrown.

**Q: How do I handle pluralization?**  
A: Use suffixes: `"item"` vs `"items"`, then choose key in component:
```typescript
const key = count === 1 ? "item" : "items";
return <p>{t(key)}</p>;
```

**Q: Can I use variables in translations?**  
A: Not built-in, but you can interpolate:
```typescript
const name = "John";
const greeting = t("hello").replace("{name}", name);
```

**Q: Does it support right-to-left (RTL) languages?**  
A: Not currently - all languages use LTR. RTL support requires CSS changes.

---

## Resources

- **React Context API:** https://react.dev/reference/react/useContext
- **localStorage API:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **UTF-8 Encoding:** https://en.wikipedia.org/wiki/UTF-8
- **Internationalization Best Practices:** https://www.w3.org/International/

---

## Support

For issues or questions about translations:

1. **Check LANGUAGE_SETUP_ANALYSIS.md** for issues and fixes
2. **Run validate-translations.sh** to check coverage
3. **Review this guide** for implementation help
4. **Test in all 4 languages** before reporting issues

---

**Last Updated:** 2026-07-16  
**Version:** 1.0  
**Status:** ✅ Complete & Verified
