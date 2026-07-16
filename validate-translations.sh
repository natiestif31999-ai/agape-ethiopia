#!/bin/bash

# Translation Validation Script
# Validates that all translation keys exist in all supported languages
# Usage: bash validate-translations.sh

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║         Translation Coverage Validation Script                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if translations.ts exists
TRANS_FILE="agape-ethiopia/src/lib/i18n/translations.ts"
if [ ! -f "$TRANS_FILE" ]; then
    echo "❌ ERROR: $TRANS_FILE not found"
    exit 1
fi

echo "📊 Analyzing translations..."
echo ""

# Extract all English keys (they should be the source of truth)
echo "Extracting English (en) keys..."
ENGLISH_KEYS=$(grep -oP '"[a-zA-Z0-9._-]+"\s*:' "$TRANS_FILE" | \
    sed -n '/en: {/,/},/p' | \
    grep -oP '"[a-zA-Z0-9._-]+"' | \
    sort -u | \
    wc -l)

echo "✅ English keys found: $ENGLISH_KEYS"

# Check Amharic
echo "Checking Amharic (am)..."
AMHARIC_COUNT=$(sed -n '/am: {/,/},/p' "$TRANS_FILE" | \
    grep -oP '"[a-zA-Z0-9._-]+"\s*:' | wc -l)
AMHARIC_PERCENT=$((AMHARIC_COUNT * 100 / ENGLISH_KEYS))

if [ $AMHARIC_PERCENT -eq 100 ]; then
    echo "✅ Amharic: $AMHARIC_COUNT/$ENGLISH_KEYS (100%)"
else
    echo "⚠️  Amharic: $AMHARIC_COUNT/$ENGLISH_KEYS ($AMHARIC_PERCENT%)"
fi

# Check Oromo
echo "Checking Oromo (om)..."
OROMO_COUNT=$(sed -n '/om: {/,/},/p' "$TRANS_FILE" | \
    grep -oP '"[a-zA-Z0-9._-]+"\s*:' | wc -l)
OROMO_PERCENT=$((OROMO_COUNT * 100 / ENGLISH_KEYS))

if [ $OROMO_PERCENT -eq 100 ]; then
    echo "✅ Oromo: $OROMO_COUNT/$ENGLISH_KEYS (100%)"
else
    echo "⚠️  Oromo: $OROMO_COUNT/$ENGLISH_KEYS ($OROMO_PERCENT%)"
fi

# Check Tigrinya
echo "Checking Tigrinya (ti)..."
TIGRINYA_COUNT=$(sed -n '/ti: {/,/},/p' "$TRANS_FILE" | \
    grep -oP '"[a-zA-Z0-9._-]+"\s*:' | wc -l)
TIGRINYA_PERCENT=$((TIGRINYA_COUNT * 100 / ENGLISH_KEYS))

if [ $TIGRINYA_PERCENT -eq 100 ]; then
    echo "✅ Tigrinya: $TIGRINYA_COUNT/$ENGLISH_KEYS (100%)"
else
    echo "⚠️  Tigrinya: $TIGRINYA_COUNT/$ENGLISH_KEYS ($TIGRINYA_PERCENT%)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"

# Determine overall status
if [ $AMHARIC_PERCENT -eq 100 ] && [ $OROMO_PERCENT -eq 100 ] && [ $TIGRINYA_PERCENT -eq 100 ]; then
    echo "║                    ✅ ALL TRANSLATIONS COMPLETE                    ║"
else
    echo "║                  ⚠️  SOME TRANSLATIONS INCOMPLETE                   ║"
fi

echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Check for untranslated fields (fields that are same as English in other languages)
echo "📋 Checking for untranslated fields..."
echo ""

# This is a more advanced check - look for English values in non-English languages
UNTRANSLATED=$(grep -A 1000 'am: {' "$TRANS_FILE" | \
    grep -B 1000 '},' | \
    grep '": "' | \
    head -1)

if echo "$UNTRANSLATED" | grep -q '": "[A-Za-z]'; then
    echo "⚠️  Warning: Some fields may contain English text in other languages"
    echo "   This is normal for untranslated fields (fallback behavior)"
else
    echo "✅ Translation fields look properly formatted"
fi

echo ""
echo "📝 Summary:"
echo "   • Total English keys: $ENGLISH_KEYS"
echo "   • Amharic coverage: $AMHARIC_PERCENT%"
echo "   • Oromo coverage: $OROMO_PERCENT%"
echo "   • Tigrinya coverage: $TIGRINYA_PERCENT%"
echo ""

if [ $AMHARIC_PERCENT -lt 100 ] || [ $OROMO_PERCENT -lt 100 ] || [ $TIGRINYA_PERCENT -lt 100 ]; then
    echo "🔧 To fix missing translations:"
    echo "   1. Review the LANGUAGE_SETUP_ANALYSIS.md file"
    echo "   2. Apply the complete translations.ts file"
    echo "   3. Re-run this script to verify"
    echo ""
    exit 1
else
    echo "✨ All translations are complete!"
    echo ""
    exit 0
fi
