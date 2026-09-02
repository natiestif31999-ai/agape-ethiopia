#!/usr/bin/env python3
import os
import psycopg2
import sys

def get_connection():
    """Connect to Supabase PostgreSQL."""
    url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '').strip()
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '').strip()
    
    if not url or not key:
        print("❌ Missing Supabase config")
        return None
    
    # Extract host from https://XXXX.supabase.co
    host = url.replace('https://', '').split('/')[0].replace('.supabase.co', '') + '.supabase.co'
    
    print(f"🔗 Connecting to: {host}")
    
    try:
        conn = psycopg2.connect(
            host=host,
            port=5432,
            database="postgres",
            user="postgres",
            password=key,
            sslmode="require",
            connect_timeout=10
        )
        print("✅ Connected")
        return conn
    except Exception as e:
        print(f"❌ Failed: {e}")
        return None

def apply_migration(conn, filepath, name):
    """Apply one migration."""
    print(f"\n📄 {name}...", end=" ")
    
    with open(filepath) as f:
        sql = f.read()
    
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        print("✅")
        return True
    except Exception as e:
        print(f"❌\n   {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()

conn = get_connection()
if not conn:
    sys.exit(1)

migrations = [
    ("migrations/2026-09-02-fix-registration-number-format.sql", "Registration Number"),
    ("migrations/2026-09-02-fix-phone-normalization.sql", "Phone Normalization"),
    ("migrations/2026-09-02-fix-rls-policies.sql", "RLS Policies"),
    ("migrations/2026-09-02-implement-status-workflow.sql", "Status Workflow"),
    ("migrations/2026-09-02-create-cms-infrastructure.sql", "CMS Infrastructure"),
]

results = []
for path, name in migrations:
    results.append((name, apply_migration(conn, path, name)))

print(f"\n{'='*50}")
passed = sum(1 for _, r in results if r)
print(f"Applied: {passed}/{len(migrations)}")
for name, result in results:
    print(f"  {'✅' if result else '❌'} {name}")

conn.close()
