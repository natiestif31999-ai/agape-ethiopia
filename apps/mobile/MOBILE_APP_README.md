# Agape Mobility Ethiopia Mobile

Separate Expo + React Native + TypeScript application for field work. The existing Next.js web app remains outside this project.

## Start

```bash
cd apps/mobile
cp .env.example .env
npm install
npx expo start
```

Use Expo Go on a physical Android/iOS device by scanning the terminal QR code. An Android emulator requires Android SDK tooling and a configured emulator. This container currently has neither `adb` nor an Android SDK.

## Architecture

- `App.tsx`: mobile navigation and first-phase screens
- `src/storage.ts`: SQLite-backed local beneficiary records
- `src/supabase.ts`: public Supabase client only
- `src/sync.ts`: pending-record synchronization through the existing web API
- `src/types.ts`: sync and domain types
- `src/regions.ts`: centralized region map for the mobile client

The mobile app must not ship `SUPABASE_SERVICE_ROLE_KEY`. Official registration-number assignment and duplicate-phone enforcement remain backend responsibilities. Set `EXPO_PUBLIC_WEB_API_URL` to the existing web origin before enabling network sync. The existing endpoint does not yet accept an idempotency key, so duplicate-safe synchronization remains a backend contract requirement and is not claimed complete here.

## Builds

Native folders can be generated with `npx expo prebuild` after dependencies are installed. EAS can later produce an APK for internal testing and an AAB for Play Store submission, but this repository does not yet contain signing credentials or an EAS project ID.
