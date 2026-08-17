# AGAPE ETHIOPIA — OPERATIONAL TESTING GUIDE

## Prerequisites
- The app is running on a development server
- Supabase is configured and accessible
- The following test accounts exist in Supabase Auth:
  - **Admin Account**: admin@agapeethiopia.org / [password]
  - **Staff Account 1**: natiestif31999@gmail.com / [password]
  - **Staff Account 2**: agape@gmail.com / [password]
  - **Staff Account 3**: natiestif@gmail.com / [password]

---

## STAFF WORKFLOW TEST

### Step 1: Login as Staff
1. Navigate to `/login`
2. Enter: `natiestif31999@gmail.com`
3. Enter password
4. Click "Sign In"
5. **Expected Result**: Redirect to `/dashboard/staff` (Staff Dashboard)
6. **Verify**: 
   - Dashboard title shows "Staff Dashboard"
   - Real KPI data is displayed (Total Beneficiaries, Pending Approvals, etc.)
   - The numbers match the actual Supabase data

### Step 2: View Staff Dashboard
1. At `/dashboard/staff`, observe:
   - KPI cards showing real data
   - Recent Beneficiaries table
   - Quick action buttons
2. **Verify**: All data loads correctly and displays real Supabase records

### Step 3: Navigate to Beneficiaries
1. Click "Search Beneficiary" or navigate to `/dashboard/staff`
2. Scroll to "Recent Beneficiaries" table
3. Click "View" on any existing beneficiary
4. **Expected Result**: Navigates to `/beneficiaries/[id]/details`

### Step 4: Open Existing Beneficiary
1. You should now see the beneficiary profile page
2. **Verify**:
   - Beneficiary name, registration #, status are displayed
   - Tabs show: Profile, Assessments, Distributions
   - Data loads from Supabase

### Step 5: Edit Beneficiary Field
1. On the Profile tab, click the "Edit" button
2. Modify an editable field (e.g., "Notes" or "Phone")
3. Make a visible change
4. **Verify**: Input field becomes active for editing

### Step 6: Save Changes
1. Click "Save Changes" button
2. **Expected Result**:
   - Loading state appears briefly
   - Success message or page updates
   - Edit button disappears, view mode returns

### Step 7: Verify Supabase Change
Open your Supabase console (or use a SQL query tool):
```sql
SELECT id, first_name, last_name, notes, updated_at 
FROM beneficiaries 
WHERE id = '[beneficiary_id_from_test]'
LIMIT 1;
```
**Expected Result**: The field you edited shows the new value with an updated timestamp

### Step 8: Navigate to Partners
1. Go back to `/dashboard/staff`
2. Look for "Partners" or "Partnerships" section link
3. Click to navigate to partners management
4. **Verify**: Page loads with partnership data if any exists

### Step 9: Logout
1. Click "Logout" button (usually in top-right or sidebar)
2. **Expected Result**: Redirect to `/login`
3. **Verify**: You are logged out and session is cleared

---

## ADMIN WORKFLOW TEST

### Step 1: Login as Admin
1. Navigate to `/login`
2. Enter: `admin@agapeethiopia.org`
3. Enter password
4. Click "Sign In"
5. **Expected Result**: Redirect to `/dashboard/admin` (Admin Control Center)
6. **Verify**: 
   - Page title shows "Admin Control Center"
   - Sidebar shows all admin menu items
   - Real system KPI data is displayed

### Step 2: View Admin Dashboard Overview
1. At `/dashboard/admin`, observe:
   - System Metrics KPI cards (Total Beneficiaries, Registrations, Pending Approvals, etc.)
   - Approval Status cards
   - Staff Management cards
   - Donation Overview cards
   - Quick Admin Actions
   - Staff Directory table
2. **Verify**: All data loads correctly and displays real values from Supabase

### Step 3: Navigate Users & Staff Section
1. On the sidebar, click "Users & Staff" (or similar)
2. **Expected Result**: Navigate to `/dashboard/admin/staff`
3. **Verify**:
   - Page loads with staff list or management interface
   - Shows all staff members with their roles and status

### Step 4: Navigate Beneficiaries Section
1. On the sidebar, click "Beneficiaries"
2. **Expected Result**: Navigate to `/dashboard/admin/beneficiaries`
3. **Verify**:
   - Page loads showing all beneficiaries
   - Filter options work (All, Approved, Pending, Rejected)
   - Real data is displayed in table

### Step 5: Navigate Registrations Section
1. On the sidebar, click "Registrations"
2. **Expected Result**: Navigate to `/dashboard/admin/registrations`
3. **Verify**:
   - Pending registrations are displayed
   - Data shows real Supabase records

### Step 6: Navigate Assessments Section
1. On the sidebar, click "Assessments"
2. **Expected Result**: Navigate to `/dashboard/admin/assessments`
3. **Verify**:
   - Assessment records are displayed
   - Real data from assessments table is shown

### Step 7: Navigate Equipment Section
1. On the sidebar, click "Equipment"
2. **Expected Result**: Navigate to `/dashboard/admin/equipment`
3. **Verify**: Page shows equipment management interface

### Step 8: Navigate Partners Section
1. On the sidebar, click "Partners"
2. **Expected Result**: Navigate to `/dashboard/admin/partners`
3. **Verify**: Partner management page loads

### Step 9: Navigate Donations Section
1. On the sidebar, click "Donations"
2. **Expected Result**: Navigate to `/dashboard/admin/donations`
3. **Verify**:
   - Donation records are displayed with amounts and dates
   - Total donation amount is calculated and shown
   - Real Supabase data is used

### Step 10: Navigate Reports Section
1. On the sidebar, click "Reports"
2. **Expected Result**: Navigate to `/dashboard/admin/reports`
3. **Verify**: Report generation options are displayed

### Step 11: Navigate Audit Logs Section
1. On the sidebar, click "Audit Logs"
2. **Expected Result**: Navigate to `/dashboard/admin/audit`
3. **Verify**:
   - Audit log entries are displayed
   - Real logs from audit_logs table are shown

### Step 12: Navigate Settings Section
1. On the sidebar, click "Settings"
2. **Expected Result**: Navigate to `/dashboard/admin/settings`
3. **Verify**: System settings page loads

### Step 13: Sidebar Toggle (Optional)
1. Click the collapse button in the sidebar (◀)
2. **Expected Result**: Sidebar collapses to icon-only view
3. Click again (▶) to expand
4. **Verify**: Sidebar expands back to full width

### Step 14: Logout
1. Click "Logout" button
2. **Expected Result**: Redirect to `/login`
3. **Verify**: Admin session is cleared

---

## VERIFICATION CHECKLIST

### Authentication ✅
- [ ] Staff login redirects to `/dashboard/staff`
- [ ] Admin login redirects to `/dashboard/admin`
- [ ] Logout clears session and redirects to `/login`
- [ ] Invalid credentials show error message

### Staff Dashboard ✅
- [ ] Dashboard loads with real data
- [ ] KPI numbers match Supabase counts
- [ ] Recent Beneficiaries table shows real records
- [ ] Quick action links work

### Beneficiary Management ✅
- [ ] Existing beneficiaries can be opened
- [ ] Edit mode activates when clicking "Edit"
- [ ] Fields can be edited in the form
- [ ] Save Changes button persists changes
- [ ] Supabase database reflects changes
- [ ] Updated timestamp updates in database

### Admin Dashboard ✅
- [ ] Dashboard loads with real data
- [ ] All KPI cards show real Supabase values
- [ ] Staff Directory table shows real staff
- [ ] System alerts appear if applicable

### Admin Navigation ✅
- [ ] Sidebar displays all 11 sections
- [ ] Each section link navigates correctly
- [ ] Pages load without errors
- [ ] Real data is displayed in each section

### Data Integrity ✅
- [ ] Beneficiary edits persist in Supabase
- [ ] Staff list shows correct roles (Admin/Staff)
- [ ] Donation data is accurate
- [ ] Audit logs record actions

### Authorization ✅
- [ ] Staff cannot access `/dashboard/admin`
- [ ] Admin can access all sections
- [ ] Middleware redirects unauthorized access

---

## SUPABASE VERIFICATION COMMANDS

### Check Beneficiaries
```sql
SELECT COUNT(*) as total_count,
       SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
       SUM(CASE WHEN status = 'pending' OR status = 'registered' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
FROM beneficiaries;
```

### Check Recent Changes
```sql
SELECT id, first_name, last_name, updated_at
FROM beneficiaries
ORDER BY updated_at DESC
LIMIT 5;
```

### Check Staff Users
```sql
SELECT id, email, role, is_disabled
FROM public.users
WHERE role IN ('Admin', 'Staff')
ORDER BY created_at;
```

### Check Audit Logs
```sql
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Check Donations
```sql
SELECT COUNT(*) as count, SUM(amount) as total
FROM donations;
```

---

## TROUBLESHOOTING

### Staff Dashboard Shows "Signing in..."
- Check that the staff user has a corresponding row in `public.users` with role='Staff'
- Verify the Supabase session is active
- Check browser console for errors

### Admin Dashboard Not Loading
- Verify you're logged in as admin@agapeethiopia.org
- Check that the admin user has role='Admin' in `public.users`
- Check Supabase Auth and profile sync

### Beneficiary Edit Not Saving
- Check that RLS policies allow UPDATE on beneficiaries table
- Verify the user role has permissions for the operation
- Check browser network tab for API errors

### Navigation Sidebar Issues
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache and cookies
- Verify JavaScript is enabled

### Data Not Loading
- Check Supabase connection status
- Verify tables exist: beneficiaries, users, donations, assessments, audit_logs
- Check RLS policies allow SELECT for authenticated users
- Check browser console for API errors

---

## NEXT STEPS AFTER TESTING

1. Document any issues or missing features
2. Make note of any performance issues
3. Verify all data persistence
4. Test on mobile/tablet if needed
5. Create additional test accounts if needed
6. Document any business logic issues

---

## CONTACT & SUPPORT

For issues or questions:
- Check Supabase logs for API errors
- Check browser console for JavaScript errors
- Review application build output for warnings
- Check middleware logs for authorization issues
