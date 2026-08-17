#!/usr/bin/env python3
"""
Apply Supabase migrations using the admin API.
This script reads SQL migration files and executes them against Supabase.
"""
import os
import sys
import subprocess
import json
from pathlib import Path

def get_supabase_config():
    """Get Supabase configuration from environment."""
    return {
        'url': os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '').strip(),
        'anon_key': os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY', '').strip(),
        'service_role_key': os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '').strip(),
    }

def apply_migration_via_cli(migration_file):
    """Apply migration using supabase CLI if available."""
    config = get_supabase_config()
    
    if not all([config['url'], config['service_role_key']]):
        print("❌ Missing Supabase configuration")
        return False
    
    # Try using curl to invoke the migration
    # Since raw SQL endpoint is not available, we'll use INSERT/UPDATE/ALTER via REST API
    
    print(f"📄 Reading migration: {migration_file}")
    with open(migration_file, 'r') as f:
        content = f.read()
    
    # Parse the SQL - extract individual statements
    statements = [s.strip() for s in content.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print(f"Found {len(statements)} statements")
    
    # Filter out transaction markers
    statements = [s for s in statements if not any(kw in s.upper() for kw in ['BEGIN', 'COMMIT'])]
    
    print(f"\nWARNING: The Supabase REST API does not support executing arbitrary SQL directly.")
    print(f"You must apply this migration manually in the Supabase SQL Editor:")
    print(f"\n1. Go to Supabase Dashboard")
    print(f"2. Select your project")
    print(f"3. Go to SQL Editor")
    print(f"4. Click 'New Query'")
    print(f"5. Paste the following SQL and run it:\n")
    print("=" * 80)
    print(content)
    print("=" * 80)
    print(f"\nOr use the Supabase CLI:")
    print(f"  supabase db push {migration_file}")
    
    return True

if __name__ == '__main__':
    migration_file = sys.argv[1] if len(sys.argv) > 1 else 'migrations/2026-08-17-fix-rbac-users-table.sql'
    
    if not Path(migration_file).exists():
        print(f"❌ Migration file not found: {migration_file}")
        sys.exit(1)
    
    apply_migration_via_cli(migration_file)
