# AGAPE MOBILITY ETHIOPIA - QUICK START TESTING GUIDE

## Prerequisites
- Node.js installed
- Supabase project configured
- Environment variables set in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  ```

## Running the Application

### Start Development Server
```bash
cd /workspaces/agape-ethiopia/agape-ethiopia
npm run dev
```
Application runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run start
```

## Quick Authentication Test Flow

### Step 1: Setup Test Accounts
Before testing, ensure you have test accounts in your Supabase project:

**In Supabase Dashboard:**
1. Go to Auth > Users
2. Create test accounts:
   - `staff@test.com` (password: `TestPass123`)
   - `admin@test.com` (password: `AdminPass123`)

3. Go to SQL Editor
4. Run these commands:

```sql
-- Create staff user profile
INSERT INTO public.users (id, email, role, is_disabled, password_change_required)
SELECT id, 'staff@test.com', 'Staff', false, false
FROM auth.users 
WHERE email = 'staff@test.com'
ON CONFLICT (id) DO NOTHING;

-- Create admin user profile  
INSERT INTO public.users (id, email, role, is_disabled, password_change_required)
SELECT id, 'admin@test.com', 'Admin', false, false
FROM auth.users
WHERE email = 'admin@test.com'
ON CONFLICT (id) DO NOTHING;
```

### Step 2: Test Staff Login
```
1. Navigate to http://localhost:3000/login
2. Enter: staff@test.com / TestPass123
3. Click "Sign In"
4. Expected: Redirects to /dashboard/staff
5. Expected: See "Staff Dashboard" with KPIs
```

### Step 3: Test Admin Login
```
1. Navigate to http://localhost:3000/login
2. Enter: admin@test.com / AdminPass123
3. Click "Sign In"
4. Expected: Redirects to /dashboard/admin
5. Expected: See "Admin Control Center" with admin-specific KPIs
```

### Step 4: Test Password Change Required
```
1. In Supabase, update staff user:
   UPDATE public.users 
   SET password_change_required = true 
   WHERE email = 'staff@test.com';

2. Logout (from /dashboard/staff, click sign out)
3. Navigate to http://localhost:3000/login
4. Enter: staff@test.com / TestPass123
5. Expected: Redirects to /change-password
6. Enter current password: TestPass123
7. Enter new password: NewPass123! (must have upper, lower, digit)
8. Confirm password: NewPass123!
9. Expected: Redirects to /dashboard/staff
10. Verify you can now use the dashboard
```

### Step 5: Test Session Persistence
```
1. Login as staff
2. Arrive at /dashboard/staff
3. Press Ctrl+R (refresh page)
4. Expected: Still at /dashboard/staff
5. Close entire browser
6. Open browser and go to /dashboard/staff
7. Expected: Redirected to /login (session expired)
```

### Step 6: Test Unauthorized Access
```
1. Login as staff
2. In browser address bar, type: http://localhost:3000/dashboard/admin
3. Expected: Redirected to /login OR see error
4. Never see admin dashboard
```

### Step 7: Test Mobile Responsiveness
```
1. Press F12 to open DevTools
2. Click mobile icon (toggle device toolbar)
3. Select iPhone SE (375px wide)
4. Login as staff
5. Expected: See drawer navigation (not sidebar)
6. Click menu button (☰)
7. Expected: Drawer opens with navigation
8. Click a navigation link
9. Expected: Drawer closes, page navigates
10. Resize to tablet (768px)
11. Expected: Responsive grid layout adapts
```

## Verification Checklist

### Login Page
- [ ] Form accepts email and password
- [ ] "Sign In" button is clickable
- [ ] "Signing in..." message appears
- [ ] Invalid credentials show error
- [ ] Valid credentials redirect to dashboard

### Staff Dashboard
- [ ] Shows "Staff Dashboard" title
- [ ] Displays KPI cards with real numbers
- [ ] "Total Beneficiaries" card shows count
- [ ] "New Registrations" shows count
- [ ] "Pending Approvals" shows count
- [ ] Quick action buttons visible
- [ ] Recent beneficiaries table visible
- [ ] Navigation menu shows staff links only
- [ ] No admin-specific links visible

### Admin Dashboard
- [ ] Shows "Admin Control Center" title
- [ ] Displays different KPIs than staff
- [ ] Shows "Active Staff" count
- [ ] Shows "Donations" information
- [ ] Staff Management link present
- [ ] Navigation menu shows admin links
- [ ] Can see both staff and admin options

### Navigation
- [ ] Staff menu shows 6+ navigation items
- [ ] Admin menu shows 6+ navigation items
- [ ] Active link is highlighted
- [ ] Links navigate to correct pages
- [ ] Change Password option visible

### Mobile
- [ ] Drawer button visible on mobile
- [ ] Drawer opens/closes on click
- [ ] Content is readable on mobile
- [ ] No horizontal scrolling needed
- [ ] Buttons are tap-friendly (48px+)

### Security
- [ ] Cannot access /dashboard/admin as staff
- [ ] Cannot access /dashboard/staff as public
- [ ] Logout actually ends session
- [ ] Refresh doesn't expose other users' data
- [ ] No sensitive data in browser console

## Debugging Tips

### Check Session in Browser
```javascript
// In browser console:
fetch('/api/auth/user').then(r => r.json()).then(d => console.log(d))
```
Should show current user profile with role.

### Check Middleware Logs
Look for messages like:
- "Checking admin path /dashboard/admin"
- "User role: Admin"
- "Redirecting to /login"

### Check Supabase Logs
In Supabase dashboard > SQL Editor:
```sql
-- View recent user logins
SELECT * FROM auth.audit_log_entries 
WHERE event = 'token_refreshed' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Browser Console Checks
Press F12 and look in Console tab for:
- ❌ Red errors = problems to fix
- ⚠️ Yellow warnings = usually safe
- ✅ No errors/warnings = good!

## Common Test Scenarios

### Scenario 1: Fresh User First Login (with password change)
```
1. Admin creates new staff account
2. Sets password_change_required = true
3. Staff receives login credentials
4. Staff logs in
5. Redirected to change password page
6. Staff updates password
7. Redirected to dashboard
8. Staff can use dashboard
RESULT: ✅ Should work perfectly
```

### Scenario 2: Disabled Account Lockout
```
1. Login as staff
2. Admin disables the account in Supabase
3. Current session may still work (until refresh)
4. Try logging in again with same credentials
5. Should see error message
6. Or be redirected to login on next page load
RESULT: ✅ Should prevent access
```

### Scenario 3: Role Change Mid-Session
```
1. Staff is logged in and on dashboard
2. Admin changes role from Staff to Admin
3. Staff refreshes page
4. Middleware checks role
5. Staff should stay authorized (now as admin)
6. Admin dashboard should be accessible
RESULT: ✅ Should reflect new role on refresh
```

## Performance Testing

### Check Page Load Time
1. Open DevTools (F12)
2. Go to Network tab
3. Load dashboard
4. Check timing:
   - Document: ~100-200ms
   - Data queries: ~200-500ms
   - Total: ~500-1000ms
5. If slow, check:
   - Supabase response time
   - Browser network
   - Server performance

### Monitor Memory Usage
1. DevTools > Memory tab
2. Take heap snapshot before login
3. Login and navigate
4. Take another snapshot
5. Should not grow indefinitely
6. If growing, check for memory leaks

## Cleanup After Testing

### Reset Supabase Data
```sql
-- Delete test users
DELETE FROM auth.users WHERE email LIKE '%@test.com';

-- Or just clear users table
TRUNCATE public.users;
```

### Clear Browser Data
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
document.cookie = '';
```

---

## Support

If testing reveals issues:
1. Check [AUTHENTICATION_REPAIR_REPORT.md](../AUTHENTICATION_REPAIR_REPORT.md) for detailed troubleshooting
2. Review server logs: `npm run dev` shows detailed output
3. Check browser console (F12 > Console tab)
4. Check Supabase logs and error details
5. Verify database schema and RLS policies

---

**Last Updated:** August 17, 2026  
**Version:** 1.0
