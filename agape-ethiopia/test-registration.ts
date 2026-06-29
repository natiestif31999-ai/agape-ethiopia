/**
 * Test script to verify registration data posting to Supabase
 * Run: npx ts-node test-registration.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === "your-service-role-key-here") {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set properly");
  console.error("   Get it from: https://app.supabase.com → Settings → API → Service Role");
  process.exit(1);
}

console.log("✅ Environment variables loaded:");
console.log("   - SUPABASE_URL:", SUPABASE_URL);
console.log("   - SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY.substring(0, 20) + "...");
console.log("   - SERVICE_ROLE_KEY: ****");
console.log("");

// Create clients
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testRegistration() {
  console.log("🧪 Testing Registration Data Flow...\n");

  // 1. Test Supabase connection
  console.log("1️⃣  Testing Supabase connection...");
  try {
    const { data, error } = await anonClient.from("beneficiaries").select("id").limit(1);
    if (error) {
      console.error("❌ Connection failed:", error.message);
      return;
    }
    console.log("✅ Connected to Supabase successfully");
    console.log(`   Current beneficiaries count: ${data?.length || 0}\n`);
  } catch (err) {
    console.error("❌ Connection error:", err);
    return;
  }

  // 2. Insert test beneficiary
  console.log("2️⃣  Inserting test beneficiary...");
  const testData = {
    registration_date: new Date().toISOString().split("T")[0],
    registration_number: `TEST-${Date.now()}`,
    first_name: "Test",
    middle_name: "Registration",
    last_name: "User",
    date_of_birth: "2000-01-01",
    gender: "male",
    phone: "+251987654321",
    region: "Addis Ababa",
    kifle_ketema: "Test Kifle",
    kebele: "Test Kebele",
    house_number: "123",
    notes: "This is a test registration record",
  };

  try {
    const { data, error } = await serviceClient
      .from("beneficiaries")
      .insert([testData])
      .select();

    if (error) {
      console.error("❌ Insertion failed:", error.message);
      console.error("   Details:", error.details);
      return;
    }

    const inserted = data?.[0];
    console.log("✅ Test beneficiary inserted successfully!");
    console.log(`   ID: ${inserted?.id}`);
    console.log(`   Registration Number: ${inserted?.registration_number}`);
    console.log(`   Name: ${inserted?.first_name} ${inserted?.middle_name} ${inserted?.last_name}\n`);

    // 3. Verify data was saved
    console.log("3️⃣  Verifying data in database...");
    const { data: verifyData, error: verifyError } = await anonClient
      .from("beneficiaries")
      .select("*")
      .eq("id", inserted?.id)
      .single();

    if (verifyError) {
      console.error("❌ Verification failed:", verifyError.message);
      return;
    }

    console.log("✅ Data verified in database!");
    console.log("   Retrieved data:", JSON.stringify(verifyData, null, 2));

    // 4. Cleanup (optional)
    console.log("\n4️⃣  Cleaning up test record...");
    const { error: deleteError } = await serviceClient
      .from("beneficiaries")
      .delete()
      .eq("id", inserted?.id);

    if (deleteError) {
      console.error("⚠️  Cleanup warning:", deleteError.message);
      return;
    }

    console.log("✅ Test record deleted\n");
    console.log("✅ ALL TESTS PASSED! Registration flow is working correctly.");
  } catch (err) {
    console.error("❌ Test error:", err);
  }
}

testRegistration();
