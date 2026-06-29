#!/bin/bash
# Supabase Configuration Checker
# Run: bash check-supabase-config.sh

echo "🔍 Supabase Configuration Checker"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "   Please create .env.local in the agape-ethiopia directory"
    exit 1
fi

echo "✅ .env.local file found"
echo ""

# Read environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

# Check NEXT_PUBLIC_SUPABASE_URL
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
fi

# Check NEXT_PUBLIC_SUPABASE_ANON_KEY
if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."
fi

# Check SUPABASE_SERVICE_ROLE_KEY
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
elif [ "$SUPABASE_SERVICE_ROLE_KEY" = "your-service-role-key-here" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY is set to placeholder value"
    echo "   Get the real key from: https://app.supabase.com → Settings → API"
else
    echo "✅ SUPABASE_SERVICE_ROLE_KEY is set (****)"
fi

# Check NEXT_PUBLIC_SITE_URL
if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_SITE_URL is not set (optional)"
else
    echo "✅ NEXT_PUBLIC_SITE_URL: $NEXT_PUBLIC_SITE_URL"
fi

echo ""
echo "=================================="
echo "📋 Next steps:"
echo ""
echo "1. If any required variables are missing, update your .env.local file"
echo "2. Run: npm run dev"
echo "3. Test registration: npx ts-node test-registration.ts"
echo "4. Or test API: node test-api.js"
echo ""
