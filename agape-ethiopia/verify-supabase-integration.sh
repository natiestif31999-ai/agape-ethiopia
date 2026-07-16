#!/bin/bash

# Supabase Integration Diagnostic & Verification Script
# This script verifies that your Supabase integration is working correctly
# Usage: bash verify-supabase-integration.sh

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║    Supabase Integration Verification & Diagnostics Script         ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.local exists
echo "📋 Step 1: Checking Environment Configuration..."
if [ ! -f ".env.local" ]; then
    echo "❌ ERROR: .env.local not found in current directory"
    echo "   Please create .env.local with Supabase credentials"
    exit 1
fi
echo "✅ .env.local file found"

# Load environment variables
export $(grep -v '^#' .env.local | xargs 2>/dev/null || true)

# Verify required environment variables
echo ""
echo "📋 Step 2: Verifying Environment Variables..."

MISSING_VARS=()

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_URL")
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:40}..."
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    MISSING_VARS+=("SUPABASE_SERVICE_ROLE_KEY")
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY is missing (optional for some operations)"
else
    echo "✅ SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required environment variables: ${MISSING_VARS[*]}"
    echo "   Please add them to .env.local"
    exit 1
fi

echo ""
echo "📋 Step 3: Checking Migration Files..."

MIGRATIONS=(
    "2026-06-29-consolidated-schema.sql"
    "2026-07-16-fix-rls-policies.sql"
)

for migration in "${MIGRATIONS[@]}"; do
    if [ -f "../migrations/$migration" ]; then
        echo "✅ Migration found: $migration"
    else
        echo "⚠️  Migration missing: $migration"
    fi
done

echo ""
echo "📋 Step 4: Checking Project Structure..."

REQUIRED_DIRS=(
    "src/lib/supabase"
    "src/lib/auth"
    "src/app/api"
    "../migrations"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Directory found: $dir"
    else
        echo "❌ Directory missing: $dir"
    fi
done

echo ""
echo "📋 Step 5: Checking API Routes..."

API_ROUTES=(
    "src/app/api/beneficiaries/route.ts"
    "src/app/api/assessments"
    "src/app/api/equipment-distributions"
    "src/app/api/inventory"
    "src/app/api/follow-ups"
    "src/app/api/requests"
    "src/app/api/donations"
    "src/app/api/auth/user/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -e "$route" ]; then
        echo "✅ API route found: $route"
    else
        echo "⚠️  API route missing or incomplete: $route"
    fi
done

echo ""
echo "📋 Step 6: Testing Supabase Connection..."

# Try to detect curl or use Node.js if available
if command -v curl &> /dev/null; then
    echo "Testing with curl..."
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
        "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ]; then
        echo "✅ Supabase API is responding"
    else
        echo "⚠️  Supabase API responded with code: $RESPONSE"
    fi
else
    echo "⚠️  curl not found, skipping connectivity test"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    Verification Complete                          ║"
echo "╚════════════════════════════════════════════════════════════════════╝"

echo ""
echo "✨ Next Steps:"
echo "   1. Go to: https://app.supabase.com"
echo "   2. Select your project"
echo "   3. Apply migrations:"
echo "      • SQL Editor → New Query → Copy from 2026-06-29-consolidated-schema.sql → Run"
echo "      • SQL Editor → New Query → Copy from 2026-07-16-fix-rls-policies.sql → Run"
echo "   4. Verify tables exist: Table Editor → Check all 9 tables"
echo "   5. Test the app: npm run dev"
echo ""
echo "📖 For detailed instructions, see: SUPABASE_INTEGRATION_FIX.md"
