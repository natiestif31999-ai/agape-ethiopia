# Canonical Schema Inventory (extracted from migrations)

This file lists the current tables, primary columns, types (as declared in migrations), notable indexes, and RLS notes.

## beneficiaries
- id: uuid (PRIMARY KEY)
- registration_number: text
- registration_date: date
- first_name: text
- middle_name / fathers_name: text (duplicate risk)
- last_name / grandfathers_name: text (duplicate risk)
- date_of_birth: date
- gender: text
- phone: text
- region: text
- region_code: text (new draft)
- kifle_ketema: text
- kebele / keble: text (inconsistency)
- house_number: text
- disability_type: text
- referral_source: text
- photo_url: text
- notes: text
- status: text DEFAULT 'registered'
- created_at: timestamptz DEFAULT now()
- updated_at: timestamptz DEFAULT now()

Indexes: idx_beneficiaries_registration_number_unique (unique on registration_number)
RLS: policies exist; several migrations use `auth.role()` and `users` table lookups.

## assessments
- id: uuid PRIMARY KEY
- beneficiary_id: uuid REFERENCES beneficiaries(id)
- hip_width: text
- seat_depth: text
- back_height: text
- seat_width: text
- armrest_height: text
- footrest_length: text
- overall_height: text
- weight: text
- measurements: text
- wheelchair_fit: text
- recommended_equipment: text
- recommended_size: text
- assessor_name: text
- assessment_date: date
- recommendations: text
- notes: text
- created_at: timestamptz DEFAULT now()

Notes: Many measurement columns currently stored as `text` — numeric typed columns recommended.

## equipment_distributions
- id: uuid PRIMARY KEY
- beneficiary_id: uuid REFERENCES beneficiaries(id)
- equipment_type: text
- equipment_size: text
- distribution_date: date DEFAULT CURRENT_DATE
- distribution_location: text
- received_by: text
- signature_confirmed: boolean DEFAULT false
- notes: text
- created_at: timestamptz DEFAULT now()

## delivery_confirmations
- id: uuid PRIMARY KEY
- beneficiary_id: uuid REFERENCES beneficiaries(id)
- beneficiary_name: text
- registration_number: text
- gender: text
- phone: text
- address: text
- wheelchair_type: text
- wheelchair_size: text
- serial_number: text
- delivery_date: date DEFAULT CURRENT_DATE
- beneficiary_signature: text
- partner_signature: text
- created_by: uuid
- created_at: timestamptz DEFAULT now()

Indexes: idx_delivery_confirmations_beneficiary
RLS: conservative policy created in migrations.

## inventory, follow_ups, requests, donations, users, site_settings, audit_logs
- See migrations for columns; indexes present (idx_requests_status, idx_inventory_status, idx_followups_beneficiary, idx_audit_logs_entity).

## organizations / organization_agreements
- organization_agreements appears defined across multiple migrations with variations; needs consolidation.

## New support tables (drafts added)
- registration_counters (region_code text PK, counter bigint)
- import_jobs (id uuid PK, filename, file_url, uploader, status, mapping jsonb, summary jsonb, errors jsonb)
- report_exports (id uuid PK, report_type, parameters jsonb, file_url, format, requested_by, status)
- delivery_signatures (id uuid PK, delivery_confirmation_id FK, signer_type, signature_url, signature_data)
- sync_queue (id uuid PK, operation_type, payload jsonb, source_device, status, attempts)
- wheelchair_models (id uuid PK, model_name, device_type, default_size, attributes jsonb)
- guardians (id uuid PK, beneficiary_id FK, name, relation, phone, address)

---
Generated: 2026-08-05
