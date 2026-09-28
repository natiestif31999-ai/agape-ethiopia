BEGIN;

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS assessor_name text,
  ADD COLUMN IF NOT EXISTS assessment_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'Pending Review',
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.assessments'::regclass
      AND conname = 'assessments_review_status_check'
  ) THEN
    ALTER TABLE public.assessments
      ADD CONSTRAINT assessments_review_status_check
      CHECK (review_status IN ('Pending Review', 'Approved', 'Rejected'));
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS assessments_review_status_date_idx
  ON public.assessments(review_status, assessment_date DESC);

COMMIT;