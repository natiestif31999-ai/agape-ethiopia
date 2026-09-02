#!/usr/bin/env python3
"""
Apply Supabase migrations in the correct order with verification.
Connects directly to Supabase PostgreSQL instance.
"""
import os
import sys
import psycopg2
from pathlib import Path
import json
from datetime import datetime

def get_supabase_connection():
    """Create connection to Supabase PostgreSQL."""
    url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '').strip()
    
    if not url:
        print("❌ NEXT_PUBLIC_SUPABASE_URL not set")
        sys.exit(1)
    
    print(f"🔗 Connecting to Supabase: {url}")
    
    # Extract hostname from Supabase URL
    # Format: https://XXXX.supabase.co
    hostname = url.replace('https://', '').replace('/rest/v1', '').strip('/')
    if hostname.endswith('.supabase.co'):
        hostname = hostname.replace('.supabase.co', '')
    
    print(f"   Hostname base: {hostname}")
    
    # Use service role key for PostgreSQL connection (use as password)
    service_role_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '').strip()
    
    if not service_role_key:
        print("❌ SUPABASE_SERVICE_ROLE_KEY not set")
        sys.exit(1)

def read_migration(filepath):
    """Read migration SQL file."""
    if not os.path.exists(filepath):
        print(f"❌ Migration file not found: {filepath}")
        return None
    
    with open(filepath, 'r') as f:
        return f.read()

def apply_migration(conn, migration_file, migration_name):
    """Apply a single migration file."""
    print(f"\n{'='*80}")
    print(f"📄 Applying: {migration_name}")
    print(f"{'='*80}")
    
    sql = read_migration(migration_file)
    if not sql:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Execute the entire migration as a single transaction
        print(f"Executing migration ({len(sql)} bytes)...")
        cursor.execute(sql)
        
        conn.commit()
        print(f"✅ {migration_name} applied successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error applying {migration_name}:")
        print(f"   {type(e).__name__}: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()

def verify_schema(conn, migration_name):
    """Verify that migration changes were applied."""
    cursor = conn.cursor()
    try:
        # Check migration-specific objects
        checks = {
            "2026-09-02-fix-registration-number-format": [
                ("function", "generate_beneficiary_registration_number"),
                ("table", "beneficiary_identifier_counters"),
                ("trigger", "trg_sync_registration_number"),
            ],
            "2026-09-02-fix-phone-normalization": [
                ("function", "normalize_phone_for_comparison"),
                ("trigger", "trg_sync_phone_normalized"),
                ("view", "beneficiary_phone_conflicts"),
            ],
            "2026-09-02-fix-rls-policies": [
                ("function", "auth.is_admin"),
                ("function", "auth.is_staff"),
            ],
            "2026-09-02-implement-status-workflow": [
                ("view", "pending_beneficiaries"),
                ("view", "approved_beneficiaries"),
                ("trigger", "trg_log_status_change"),
            ],
            "2026-09-02-create-cms-infrastructure": [
                ("table", "site_settings"),
                ("table", "blog_posts"),
            ],
        }
        
        if migration_name not in checks:
            print(f"ℹ️  No specific checks defined for {migration_name}")
            return True
        
        objects_to_check = checks[migration_name]
        all_exist = True
        
        for obj_type, obj_name in objects_to_check:
            if obj_type == "function":
                schema, func = ("auth", obj_name.split('.')[1]) if '.' in obj_name else ("public", obj_name)
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.routines 
                        WHERE routine_schema = %s AND routine_name = %s
                    )
                """, (schema, func))
            elif obj_type == "table":
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.tables 
                        WHERE table_name = %s
                    )
                """, (obj_name,))
            elif obj_type == "trigger":
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.triggers 
                        WHERE trigger_name = %s
                    )
                """, (obj_name,))
            elif obj_type == "view":
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.views 
                        WHERE table_name = %s
                    )
                """, (obj_name,))
            
            exists = cursor.fetchone()[0]
            status = "✅" if exists else "❌"
            print(f"  {status} {obj_type}: {obj_name}")
            all_exist = all_exist and exists
        
        return all_exist
        
    except Exception as e:
        print(f"⚠️  Could not verify: {e}")
        return False
    finally:
        cursor.close()

def main():
    """Apply all migrations in order."""
    # Define migrations in correct order
    migrations = [
        ("migrations/2026-09-02-fix-registration-number-format.sql", "Phase 2: Registration Number Format"),
        ("migrations/2026-09-02-fix-phone-normalization.sql", "Phase 3: Phone Normalization"),
        ("migrations/2026-09-02-fix-rls-policies.sql", "Phase 4: RLS Policies"),
        ("migrations/2026-09-02-implement-status-workflow.sql", "Phase 5: Status Workflow"),
        ("migrations/2026-09-02-create-cms-infrastructure.sql", "Phase 8: CMS Infrastructure"),
    ]
    
    conn = get_supabase_connection()
    
    results = []
    
    for migration_file, migration_name in migrations:
        success = apply_migration(conn, migration_file, migration_name)
        
        if success:
            # Verify
            verified = verify_schema(conn, migration_file.split('/')[-1].replace('.sql', ''))
            status = "✅ Applied & Verified" if verified else "✅ Applied (Verification Incomplete)"
        else:
            status = "❌ Failed"
            verified = False
        
        results.append({
            "migration": migration_name,
            "file": migration_file,
            "success": success,
            "verified": verified,
            "status": status
        })
    
    # Summary
    print(f"\n{'='*80}")
    print("📊 MIGRATION SUMMARY")
    print(f"{'='*80}")
    
    for result in results:
        print(f"{result['status']:30} {result['migration']}")
    
    applied = sum(1 for r in results if r['success'])
    verified = sum(1 for r in results if r['verified'])
    
    print(f"\n✅ Applied: {applied}/{len(migrations)}")
    print(f"✅ Verified: {verified}/{len(migrations)}")
    
    if applied == len(migrations):
        print(f"\n🎉 All migrations applied successfully!")
    else:
        print(f"\n⚠️  Some migrations failed. Review the output above.")
    
    conn.close()

if __name__ == "__main__":
    main()
