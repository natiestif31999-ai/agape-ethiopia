#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Automatically applies all SQL migrations from the migrations/ folder
 * 
 * Usage:
 *   node apply-migrations.js
 * 
 * Requirements:
 *   - .env.local must have SUPABASE_SERVICE_ROLE_KEY set
 *   - All .sql files in migrations/ folder will be applied in order
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "agape-ethiopia", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local not found at:", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && !key.startsWith("#")) {
    env[key.trim()] = value?.trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing environment variables:");
  if (!SUPABASE_URL) console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (
  SUPABASE_SERVICE_ROLE_KEY === "your-service-role-key" ||
  SUPABASE_SERVICE_ROLE_KEY === "your-service-role-key-here"
) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY is still a placeholder!\n"
  );
  console.error("   Please get your real Service Role Key from:");
  console.error(
    "   https://app.supabase.com → Settings → API → Service Role"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function applyMigrations() {
  console.log("🚀 Supabase Migration Runner");
  console.log("================================\n");

  // Read all SQL files from migrations folder
  const migrationsDir = path.join(__dirname, "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.error("❌ migrations/ folder not found");
    process.exit(1);
  }

  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (sqlFiles.length === 0) {
    console.log("⚠️  No migration files found in migrations/ folder");
    return;
  }

  console.log(`📋 Found ${sqlFiles.length} migration file(s):\n`);
  sqlFiles.forEach((file) => console.log(`   - ${file}`));
  console.log("\n🔄 Applying migrations...\n");

  let applied = 0;
  let failed = 0;

  for (const file of sqlFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log(`⏳ Applying: ${file}`);

    try {
      const { error } = await supabase.rpc("exec", { sql });

      if (error) {
        // Try direct query if rpc fails
        try {
          await supabase.rpc("query", { query: sql });
          console.log(`   ✅ Applied successfully\n`);
          applied++;
        } catch (err2) {
          // Some databases don't support RPC, try alternative
          console.warn(
            `   ⚠️  Warning: RPC may not be available. Please apply manually in Supabase SQL Editor`
          );
          console.warn(`   Error: ${error.message}\n`);
          failed++;
        }
      } else {
        console.log(`   ✅ Applied successfully\n`);
        applied++;
      }
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}\n`);
      failed++;
    }
  }

  console.log("================================");
  console.log(`✅ Applied: ${applied}/${sqlFiles.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${sqlFiles.length}`);
    console.log(
      "\n💡 If migrations failed, apply them manually in Supabase:"
    );
    console.log("   1. Go to: https://app.supabase.com");
    console.log("   2. Select your project");
    console.log("   3. Click SQL Editor → New Query");
    console.log("   4. Copy & paste the SQL from each migration file");
    console.log("   5. Click Run");
  }
}

applyMigrations();
