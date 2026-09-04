# Mobile Build Status

## Current phase
Phase 2: Expo/React Native shell and offline registration foundation.

## Complete
- Separate Expo TypeScript project at `apps/mobile`
- Consistent Android/iOS identifier: `com.agapemobilityethiopia`
- Native SQLite local database schema for beneficiary drafts
- Offline record states: LOCAL, PENDING_SYNC, SYNCING, SYNCED, FAILED
- Mobile navigation shell and role-aware home preview
- Supabase public client configuration without service-role secrets
- Camera/gallery dependency and permission declarations

## Incomplete
- Dependencies need installation in the mobile project
- Authentication screens are preview-only in this phase
- Supabase sync endpoint and idempotency contract require live-schema/API verification
- Native Android/iOS folders are not generated yet
- No APK or AAB has been built
- EAS project ID and signing are not configured
- Partnership, staff/admin detail workflows and four-language catalog are not implemented yet

## Safety
No web files, Supabase migrations, database objects, auth schema, or RLS policies were changed.
