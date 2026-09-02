# SUPABASE MIGRATIONS - MANUAL APPLICATION GUIDE

**Status:** Direct PostgreSQL connection not available from dev container. Migrations must be applied manually via Supabase Dashboard.

**Timeline:** 2026-09-02  
**Total Migrations:** 5 (in execution order)

---

## ⚠️ IMPORTANT: APPLICATION ORDER IS CRITICAL

Apply migrations in this EXACT order:

1. **2026-09-02-fix-registration-number-format.sql** — Must run first (creates counters, functions)
2. **2026-09-02-fix-phone-normalization.sql** — Depends on beneficiaries table existing
3. **2026-09-02-fix-rls-policies.sql** — Creates auth helpers, may conflict if tables not ready
4. **2026-09-02-implement-status-workflow.sql** — Operates on beneficiaries.status column
5. **2026-09-02-create-cms-infrastructure.sql** — Creates new tables (site_settings, blog_posts)

---

## 🚀 HOW TO APPLY

### Method 1: Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com
2. Select your project: **agape-ethiopia**
3. Navigate to: **SQL Editor** (left sidebar)
4. Click: **New Query**
5. For each migration file (in order above):
   - Read the entire SQL file
   - Paste into the editor
   - Click **Run**
   - Wait for success notification
   - If error: STOP and review error message
6. After all 5 migrations succeed, verify schema changes (see Verification section below)

### Method 2: Via CLI (If psql is available in your environment)

```bash
cd /workspaces/agape-ethiopia
export PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY"

# Run each migration in order
for migration in \
    "2026-09-02-fix-registration-number-format.sql" \
    "2026-09-02-fix-phone-normalization.sql" \
    "2026-09-02-fix-rls-policies.sql" \
    "2026-09-02-implement-status-workflow.sql" \
    "2026-09-02-create-cms-infrastructure.sql"
do
    echo "Applying: $migration"
    psql -h rrejnfpvspjnpisgdhmb.supabase.co \
         -U postgres \
         -d postgres \
         -f "migrations/$migration"
done
```

---

## 📋 MIGRATION DETAILS

### Migration 1: Fix Registration Number Format

**File:** `migrations/2026-09-02-fix-registration-number-format.sql`  
**Purpose:** Unify registration number format to AG-B-REGION-NNNNNN  
**Size:** ~250 lines

**What it does:**
- Drops old `registration_counters` table from 2026-08-05 (which created AG-MO-ETH- format)
- Creates new `beneficiary_identifier_counters` table (per-region atomic counters)
- Replaces `generate_registration_number_per_region()` with `generate_beneficiary_registration_number()` 
- Changes format from `AG-MO-ETH-AMH-000001` to `AG-B-AMH-000001`
- Regenerates any existing AG-MO-ETH- numbers to new format
- Assigns registration numbers to any null entries
- Enforces uniqueness with CHECK constraint: `^AG-B-[A-Z]{2,5}-[0-9]{6}$`

**Objects created:**
- Table: `beneficiary_identifier_counters(region_code, counter, updated_at)`
- Function: `normalize_beneficiary_region_code(text) → text`
- Function: `generate_beneficiary_registration_number(text) → text`
- Function: `sync_registration_number() → trigger`
- Trigger: `trg_sync_registration_number` on beneficiaries (BEFORE INSERT/UPDATE)
- Index: `idx_beneficiaries_registration_number_unique` (UNIQUE)
- Constraint: `beneficiaries_registration_number_format_check`

**Key impact:**
- ✅ Existing AG-B- format numbers preserved
- ✅ Existing AG-MO-ETH- format numbers converted to AG-B-
- ✅ Future inserts auto-generate AG-B- format
- ✅ Drops deprecated `beneficiary_id` column
- ✅ Per-region counters prevent conflicts across regions

---

### Migration 2: Fix Phone Normalization

**File:** `migrations/2026-09-02-fix-phone-normalization.sql`  
**Purpose:** Accept ANY valid phone format (not just Ethiopian)  
**Size:** ~200 lines

**What it does:**
- Replaces `normalize_ethiopian_phone()` from 2026-08-29 with `normalize_phone_for_comparison()`
- New function accepts international formats: +251900000000, 0900000000, 00251900000000, +14155552671, etc.
- All numbers normalized to +NNNNNNNNNNNN format for consistent duplicate detection
- Recreates phone indexes and unique constraint
- Recreates `beneficiary_phone_conflicts` view for duplicate detection

**Objects created/replaced:**
- Function: `normalize_phone_for_comparison(text) → text`
- Function: `sync_phone_normalized() → trigger`
- Trigger: `trg_sync_phone_normalized` on beneficiaries (BEFORE INSERT/UPDATE OF phone)
- Index: `idx_beneficiaries_phone_normalized` (non-unique)
- Index: `idx_beneficiaries_phone_normalized_unique` (UNIQUE)
- View: `beneficiary_phone_conflicts` (shows duplicate phone_normalized values)

**Key impact:**
- ✅ Old Ethiopian-only validation removed
- ✅ International numbers now accepted
- ✅ Duplicate detection works across formats
- ✅ Existing data re-normalized automatically

---

### Migration 3: Fix RLS Policies

**File:** `migrations/2026-09-02-fix-rls-policies.sql`  
**Purpose:** Enforce proper authorization, restrict public access  
**Size:** ~350 lines

**What it does:**
- Creates/verifies `auth.is_admin()` and `auth.is_staff()` helper functions
- Drops all existing RLS policies and creates new stricter ones
- Beneficiaries: Staff/Admin can SELECT/UPDATE, public cannot SELECT, anyone can INSERT (self-registration)
- Assessments, Equipment, Follow-ups: Staff/Admin only
- Inventory: Staff can SELECT, Admin can INSERT/UPDATE
- Requests: Staff/Admin full access, anyone can INSERT (self-service)
- Donations: Anyone can INSERT (self-service), Staff/Admin can SELECT
- Site_settings: Public can SELECT, Admin can INSERT/UPDATE/DELETE
- Blog_posts: Public can SELECT published, Staff can manage
- Users: Admin only
- Enables RLS on all tables

**Security model:**
```
ADMIN  → Can do anything (SELECT/INSERT/UPDATE/DELETE all tables)
STAFF  → Can view/edit beneficiaries, not delete, can manage assessments/equipment
PUBLIC → Can register (beneficiary), donate, request, view published content only
```

**Objects created:**
- Function: `auth.is_admin() → boolean`
- Function: `auth.is_staff() → boolean`
- Policies: ~20 new RLS policies replacing old ones
- RLS: ENABLED on all core tables

**Key impact:**
- ✅ Public beneficiary list NOT accessible
- ✅ Only staff can view/search beneficiaries
- ✅ Self-registration still works (public INSERT)
- ✅ Admin-only deletion enforced
- ✅ No service-role credentials exposed to client

---

### Migration 4: Implement Status Workflow

**File:** `migrations/2026-09-02-implement-status-workflow.sql`  
**Purpose:** Enable PENDING→APPROVED beneficiary status workflow  
**Size:** ~200 lines

**What it does:**
- Ensures `status` column exists on beneficiaries (DEFAULT 'Pending Review')
- Defines valid statuses: 'Pending Review', 'Approved', 'Rejected', 'On Hold', 'Archived'
- Sets all NULL status values to 'Pending Review'
- Creates `update_beneficiaries_updated_at()` trigger to maintain timestamps
- Creates `log_beneficiary_status_change()` trigger to log status transitions
- Creates convenience views: `pending_beneficiaries`, `approved_beneficiaries`

**Objects created:**
- Column: `beneficiaries.status` (VARCHAR, DEFAULT 'Pending Review')
- Column: `beneficiaries.updated_at` (TIMESTAMPTZ, DEFAULT now())
- Constraint: `beneficiaries_status_check` (CHECK status IN allowed values)
- Function: `update_beneficiaries_updated_at() → trigger`
- Function: `log_beneficiary_status_change() → trigger`
- Trigger: `trg_update_beneficiaries_updated_at` (BEFORE UPDATE)
- Trigger: `trg_log_status_change` (AFTER UPDATE OF status)
- View: `pending_beneficiaries` (WHERE status = 'Pending Review')
- View: `approved_beneficiaries` (WHERE status = 'Approved')
- Index: `idx_beneficiaries_status`

**Key impact:**
- ✅ All new beneficiaries start as PENDING
- ✅ Staff/Admin can approve via API: `/api/beneficiaries/[id]/approval`
- ✅ Status changes logged to `beneficiary_audit_log` (if exists)
- ✅ Views provide fast access to pending/approved lists
- ✅ Timestamps auto-maintained

---

### Migration 5: Create CMS Infrastructure

**File:** `migrations/2026-09-02-create-cms-infrastructure.sql`  
**Purpose:** Enable admin content management for Home/About/Blog  
**Size:** ~250 lines

**What it does:**
- Creates `site_settings` table for admin to manage Home/About content
- Creates `blog_posts` table for homepage announcements
- Inserts default settings: homepage_hero_title, homepage_social_links, about_mission, etc.
- Creates auto-update triggers for `updated_at` timestamps
- Creates performance indexes on key/category/status/slug/published_at
- Enables RLS: Public reads all, Admin manages settings, Staff manages blog_posts

**Objects created:**
- Table: `site_settings(id, key UNIQUE, value, category, is_json, created_at, updated_at)`
- Table: `blog_posts(id, title, slug UNIQUE, content, excerpt, featured_image_url, author_id, status, is_featured, published_at, created_at, updated_at)`
- Functions: `update_site_settings_updated_at()`, `update_blog_posts_updated_at()`
- Triggers: `trg_update_site_settings_updated_at`, `trg_update_blog_posts_updated_at`
- Indexes: 6 indexes on key fields
- Default settings: 13 entries (homepage_hero_title, homepage_social_links, about_mission, etc.)

**Key impact:**
- ✅ Admin can manage Home/About text via `/api/site-settings`
- ✅ Staff can create blog posts via `/api/blog-posts`
- ✅ Public sees published content
- ✅ JSON settings supported (social links, visit us info)

---

## ✅ VERIFICATION CHECKLIST

After applying all 5 migrations, verify in Supabase:

### 1. Registration Number Format
```sql
-- Should show only AG-B-REGION-NNNNNN format
SELECT COUNT(*) as "AG-B- count" FROM beneficiaries 
WHERE registration_number ~ '^AG-B-[A-Z]{2,5}-[0-9]{6}$';

-- Should return 0
SELECT COUNT(*) as "Old AG-MO-ETH- count" FROM beneficiaries 
WHERE registration_number ~ '^AG-MO-ETH-';
```

### 2. Phone Normalization
```sql
-- Should show international +NNNNNN format
SELECT phone, phone_normalized FROM beneficiaries 
WHERE phone IS NOT NULL LIMIT 5;

-- Should show phone conflict view (if duplicates exist)
SELECT * FROM beneficiary_phone_conflicts LIMIT 5;
```

### 3. RLS Policies Enabled
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('beneficiaries', 'assessments', 'users') 
AND schemaname = 'public';

-- Should return 't' for each table
```

### 4. Status Workflow
```sql
-- Should show valid statuses
SELECT DISTINCT status FROM beneficiaries;

-- Should show pending beneficiaries
SELECT COUNT(*) FROM pending_beneficiaries;
```

### 5. CMS Infrastructure
```sql
-- Should return settings
SELECT key, value FROM site_settings LIMIT 5;

-- Should return blog posts table exists
SELECT COUNT(*) FROM blog_posts;
```

---

## 🔍 CONFLICT RESOLUTION

### What if a migration fails?

1. **Read the error message carefully** — it will tell you exactly what failed
2. **Check if the object already exists** — some IF NOT EXISTS checks may need manual drops
3. **Review the specific step** — the migration is divided into numbered steps
4. **Common issues:**
   - `Constraint already exists` → Use `DROP CONSTRAINT IF EXISTS` before adding
   - `Function already exists` → Use `CREATE OR REPLACE` (already in migration)
   - `Trigger already exists` → Use `DROP TRIGGER IF EXISTS` before creating

### If you need to rollback

```sql
-- Drop objects created by migrations (in reverse order)
DROP TRIGGER IF EXISTS trg_sync_registration_number ON beneficiaries;
DROP TABLE IF EXISTS beneficiary_identifier_counters;
DROP FUNCTION IF EXISTS generate_beneficiary_registration_number(text);

-- etc. for other migrations
```

---

## 📊 EXPECTED RESULTS

After all 5 migrations:

| Feature | Status | API Endpoint | Database |
|---------|--------|--------------|----------|
| Registration Number | AG-B-REGION-NNNNNN | ✅ Auto-generated | ✅ Unique index |
| Phone Normalization | Any format accepted | ✅ Auto-normalized | ✅ Unique index |
| RLS Policies | Staff/Admin only | ✅ Enforced | ✅ Enabled |
| Status Workflow | PENDING→APPROVED | ✅ `/api/.../approval` | ✅ Views & triggers |
| CMS Infrastructure | Site settings editable | ✅ `/api/site-settings` | ✅ Tables & indexes |

---

## 🚀 NEXT STEPS AFTER MIGRATION

1. ✅ Migrations applied
2. ⏳ Test registration workflow (create beneficiary, check AG-B- format)
3. ⏳ Test phone deduplication (try duplicate phone)
4. ⏳ Test RLS (unauthorized access fails)
5. ⏳ Test approval workflow (create, approve, verify)
6. ⏳ Complete approval UI (currently API-only)
7. ⏳ Complete search UI (currently API-only)
8. ⏳ Implement .xlsx export (currently CSV)
9. ⏳ Complete CMS admin UI
10. ⏳ Test end-to-end workflows

---

**Last Updated:** 2026-09-02  
**Prepared By:** Agape Mobility Ethiopia - Phase 2-8 Implementation  
**Status:** Ready for manual application via Supabase SQL Editor
