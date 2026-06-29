/**
 * Test API endpoint for registration
 * Run: node test-api.js (after starting the dev server with npm run dev)
 */

const API_URL = "http://localhost:3000";

async function testRegistrationAPI() {
  console.log("🧪 Testing Registration API Endpoint\n");

  // 1. Test registration endpoint
  console.log("1️⃣  Testing POST /api/beneficiaries...");

  const testPayload = {
    registration_date: new Date().toISOString().split("T")[0],
    first_name: "API",
    middle_name: "Test",
    last_name: "User",
    date_of_birth: "2000-01-01",
    gender: "male",
    phone: "+251987654321",
    region: "Addis Ababa",
    kifle_ketema: "Test Kifle",
    kebele: "Test Kebele",
    house_number: "456",
    notes: "This is an API test registration record",
  };

  try {
    const response = await fetch(`${API_URL}/api/beneficiaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    console.log(`   Response Status: ${response.status}`);

    const responseData = await response.json();

    if (!response.ok) {
      console.error("❌ API request failed!");
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${responseData?.error || "Unknown error"}`);
      console.error(`   Details:`, responseData);

      if (response.status === 401) {
        console.log("\n⚠️  You're not authenticated!");
        console.log("   Solution: Login through the application first, then run this test");
      }
      return;
    }

    const insertedRecord = responseData?.data?.[0];
    console.log("✅ Registration successful!");
    console.log(`   Record ID: ${insertedRecord?.id}`);
    console.log(`   Registration Number: ${insertedRecord?.registration_number}`);
    console.log(`   Name: ${insertedRecord?.first_name} ${insertedRecord?.last_name}`);
    console.log(`   Created At: ${insertedRecord?.created_at}\n`);

    // 2. Test GET endpoint
    console.log("2️⃣  Fetching beneficiaries list...");
    const getResponse = await fetch(`${API_URL}/api/beneficiaries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      console.error("❌ Failed to fetch list");
      const errorData = await getResponse.json();
      console.error(`   Error: ${errorData?.error || "Unknown error"}`);
      return;
    }

    const listData = await getResponse.json();
    console.log(`✅ Fetched beneficiaries list`);
    console.log(`   Total records: ${listData?.data?.length || 0}\n`);

    if (listData?.data?.length > 0) {
      console.log("📋 Recent beneficiaries:");
      listData.data.slice(0, 3).forEach((record, idx) => {
        console.log(`   ${idx + 1}. ${record.first_name} ${record.last_name} (ID: ${record.id})`);
      });
    }

    console.log("\n✅ ALL TESTS PASSED!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    console.log("\n💡 Make sure:");
    console.log("   1. Dev server is running: npm run dev");
    console.log("   2. You're logged in (authentication cookie is set)");
    console.log("   3. Environment variables are correct in .env.local");
  }
}

testRegistrationAPI();
