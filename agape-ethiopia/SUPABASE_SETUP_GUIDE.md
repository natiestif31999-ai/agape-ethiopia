# Supabase Registration Setup & Testing Guide

## Overview
This guide helps you configure Supabase properly and test the registration data flow end-to-end.

---

## 1. ✅ Environment Variable Setup

### Step 1: Get Your Supabase Keys

1. Go to: https://app.supabase.com/projects
2. Click on your project: **rrejnfpvspjnpisgdhmb**
3. Go to **Settings** → **API**
4. Copy the following keys:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** (public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Update `.env.local`

Your `.env.local` should look like this:

```env
# Supabase config
NEXT_PUBLIC_SUPABASE_URL=https://rrejnfpvspjnpisgdhmb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-actual-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-actual-service-role-key>

# Public site URL for Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

✅ **IMPORTANT**: Never commit the service role key to Git!

---

## 2. 🧪 Testing the Registration Flow

### Option A: Test Direct Supabase Connection (Requires Service Role Key)

```bash
cd agape-ethiopia
npm install ts-node typescript @types/node --save-dev
npx ts-node test-registration.ts
```

**What this test does:**
- ✅ Verifies environment variables
- ✅ Connects to Supabase
- ✅ Inserts a test beneficiary record
- ✅ Verifies the record was saved
- ✅ Cleans up the test record

**Expected output:**
```
✅ Environment variables loaded
✅ Connected to Supabase successfully
✅ Test beneficiary inserted successfully!
✅ Data verified in database!
✅ Test record deleted
✅ ALL TESTS PASSED!
```

### Option B: Test API Endpoint (Requires Authentication)

1. Start the dev server:
```bash
cd agape-ethiopia
npm run dev
```

2. In another terminal, run:
```bash
node test-api.js
```

**What this test does:**
- ✅ Tests the POST /api/beneficiaries endpoint
- ✅ Tests the GET /api/beneficiaries endpoint
- ✅ Verifies data insertion via API

**Note**: You must be logged in first (the API requires staff/admin role).

---

## 3. 🎯 Manual Testing in the UI

1. Start the dev server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Navigate to **Register Beneficiary**

4. Fill in the form:
   ```
   First Name: John
   Middle Name: Test
   Last Name: Beneficiary
   Date of Birth: 2000-01-15
   Gender: Male
   Phone: +251987654321
   Region: Addis Ababa
   Kifle Ketema: Nifas Silk
   Kebele: Test Kebele
   House Number: 123
   Notes: Test registration from UI
   ```

5. Click **Save**

6. Check browser console (F12) for logs:
   ```
   [REGISTRATION] Starting form submission...
   [REGISTRATION] Supabase client initialized: true
   [REGISTRATION] Payload prepared: {...}
   [REGISTRATION] Attempting to submit beneficiary record...
   [REGISTRATION] Submit response - Status: 200
   [REGISTRATION] Submit succeeded with data: {...}
   ```

7. ✅ If you see "Beneficiary registered successfully!", the data was saved to Supabase!

---

## 4. 📊 Verify Data in Supabase Dashboard

1. Go to: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** or go to **Table Editor**
4. Select the **beneficiaries** table
5. You should see your newly registered beneficiaries!

---

## 5. 🔍 Troubleshooting

### Error: "Missing Supabase environment variables"
**Solution**: Check your `.env.local` file is in the correct location: `/agape-ethiopia/.env.local`

### Error: "Unauthorized" (401)
**Solution**: 
- You need to be logged in with a valid user account
- Check that your user has "Staff" or "Admin" role in the database

### Error: "SUPABASE_SERVICE_ROLE_KEY is not set properly"
**Solution**:
- Get your real service role key from Supabase Dashboard
- Don't use the placeholder value

### Data not appearing in Supabase
**Solution**:
- Check the browser console for error messages (F12)
- Verify the API endpoint is returning status 200
- Check that all required fields are filled in the form

### Connection timeout
**Solution**:
- Verify your Internet connection
- Check if Supabase project is active (not paused)
- Confirm the URL is correct

---

## 6. 📝 Registration Data Flow

```
User Form
   ↓
BeneficiaryRegistrationForm (Client)
   ↓
POST /api/beneficiaries (API Route)
   ↓
getSupabaseServerClient()
   ↓
Insert into "beneficiaries" table
   ↓
✅ Data saved to Supabase
```

---

## 7. ⚙️ API Endpoint Details

**URL**: `POST /api/beneficiaries`

**Required Fields**:
- `first_name` (string)
- `last_name` (string)
- `gender` (string: 'male' or 'female')
- `phone` (string)
- `region` (string)
- `kebele` (string)

**Optional Fields**:
- `registration_date` (string: YYYY-MM-DD)
- `middle_name` (string)
- `date_of_birth` (string: YYYY-MM-DD)
- `kifle_ketema` (string)
- `house_number` (string)
- `notes` (string)
- `photo_url` (string)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "registration_number": "BEN-1234567890",
      "first_name": "John",
      "last_name": "Beneficiary",
      "created_at": "2026-06-29T10:30:00Z",
      ...
    }
  ]
}
```

---

## 8. ✅ Checklist Before Production

- [ ] Service Role Key is set in `.env.local`
- [ ] Anon Key is correct
- [ ] URL is correct
- [ ] `test-registration.ts` passes all tests
- [ ] Manual registration through UI works
- [ ] Data appears in Supabase Dashboard
- [ ] All required fields validation works
- [ ] Photo upload works (if used)

---

## 📞 Next Steps

1. **Get your Service Role Key** from Supabase
2. **Update `.env.local`** with real keys
3. **Run `test-registration.ts`** to verify connection
4. **Test registration through UI** and verify data in Supabase

Good luck! 🚀
