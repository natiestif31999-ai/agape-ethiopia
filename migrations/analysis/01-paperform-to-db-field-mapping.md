# Paper Form → Database Field Mapping

This mapping compares the official Agape paper registration and assessment fields to current DB columns and marks status.

Columns: Status = Existing / Missing / Needs Renaming / New Table

## Registration Form Fields
- Registration Number: Existing (`beneficiaries.registration_number`) — Needs format migration to AG-MO-ETH-REGION-000001
- Registration Date: Existing (`beneficiaries.registration_date`)
- First Name: Existing (`beneficiaries.first_name`)
- Middle Name: Existing (`beneficiaries.middle_name`) — consider rename to `fathers_name` if semantics require
- Last Name: Existing (`beneficiaries.last_name`) / `grandfathers_name` present — duplicate fields exist
- Date of Birth: Existing (`beneficiaries.date_of_birth`)
- Age: Missing (can be derived from `date_of_birth` — recommend computed view or application-level calculation)
- Gender: Existing (`beneficiaries.gender`)
- Phone: Existing (`beneficiaries.phone`)
- Region: Existing (`beneficiaries.region`) — add normalized `region_code` (draft added)
- Zone / Woreda: Partial (`woreda_zone` or `kifle_ketema`) — Needs Renaming / split into `zone` and `woreda`
- Kebele: Existing (`beneficiaries.kebele` or `keble`) — normalize spelling
- House Number: Existing (`beneficiaries.house_number`)
- Disability Type: Existing (`beneficiaries.disability_type`)
- Wheelchair Type: Partial — equipment assignment tables exist but a distinct field on registration may be Missing
- Wheelchair Size: Partial — equipment_distributions and delivery_confirmations include size fields
- Guardian Information: Missing (`guardians` table draft added)
- Registration Location: Missing (create `locations` table or `registration_location` column)
- Registration Officer: Missing (`created_by` or `created_at` are present; explicit `registration_officer_id` recommended)
- Registration Status: Existing (`beneficiaries.status`)
- Notes: Existing (`beneficiaries.notes`)
- Photo upload: Existing (`beneficiaries.photo_url`) — storage bucket must be ensured

## Assessment Form Fields
- Seat Width: Partial (`assessments.seat_width` text) — Needs numeric (`seat_width_value`) (draft added)
- Seat Depth: Partial (`assessments.seat_depth`) — Needs numeric
- Back Height: Partial (`assessments.back_height`) — Needs numeric
- Lower Leg Length: Missing — Added as `lower_leg_length_value` in draft
- Upper Leg Length: Missing — Added as `upper_leg_length_value` in draft
- Hip Width: Partial (`assessments.hip_width`) — Needs numeric
- Shoulder Width: Missing — Added as `shoulder_width_value` in draft
- Weight: Partial (`assessments.weight`) — Needs numeric
- Height: Missing — Added as `height_value` in draft
- Cushion Recommendation: Partial (`cushion_recommendation` added)
- Foot Rest Height: Added as `foot_rest_height_value` in draft
- Arm Rest Height: Added as `arm_rest_height_value` in draft
- Head Support: Added as `head_support` boolean in draft
- Lateral Support: Added as `lateral_support` boolean in draft
- Special Needs: Added as `special_needs` text in draft
- Assessment Notes: Existing (`assessments.notes`)
- Recommendation: Existing (`assessments.recommendations` / `recommended_equipment`) — ensure history by keeping records

## Delivery Confirmation / Sign Sheet Fields
- Delivery Date: Existing (`delivery_confirmations.delivery_date`)
- Beneficiary Signature: Existing (`delivery_confirmations.beneficiary_signature`) — likely needs secure storage reference; `delivery_signatures` table added
- Staff Signature: Existing (`delivery_confirmations.partner_signature` or created_by) — `delivery_signatures` supports multiple signers
- Registration Number: Existing
- Wheelchair Size / Type: Existing in `delivery_confirmations`

## Supplemental Tables / Features Needed
- Excel import metadata: New (`import_jobs`) — draft added
- Export metadata / backups: New (`report_exports`) — draft added
- Offline sync queue: New (`sync_queue`) — draft added
- Guardians: New (`guardians`) — draft added
- Wheelchair models catalog: New (`wheelchair_models`) — draft added

---
Generated: 2026-08-05
