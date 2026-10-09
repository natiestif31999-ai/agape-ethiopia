-- Add optional mobility metadata to the beneficiaries table.
-- These columns are additive and preserve the current diagnosis field (`disability_type`).

ALTER TABLE public.beneficiaries
  ADD COLUMN IF NOT EXISTS wheelchair_size text
    CHECK (wheelchair_size IN ('XL', 'Large', 'Middle', 'Small') OR wheelchair_size IS NULL),
  ADD COLUMN IF NOT EXISTS specific_apparatus_need text
    CHECK (specific_apparatus_need IN ('Wheelchair', 'Walker') OR specific_apparatus_need IS NULL);

COMMENT ON COLUMN public.beneficiaries.wheelchair_size IS 'Optional wheelchair size selection for the beneficiary.';
COMMENT ON COLUMN public.beneficiaries.specific_apparatus_need IS 'Optional specific apparatus need declared for the beneficiary.';
