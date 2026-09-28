BEGIN;

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS hip_width text,
  ADD COLUMN IF NOT EXISTS hip_width_value numeric,
  ADD COLUMN IF NOT EXISTS seat_width text,
  ADD COLUMN IF NOT EXISTS seat_width_value numeric,
  ADD COLUMN IF NOT EXISTS seat_depth text,
  ADD COLUMN IF NOT EXISTS seat_depth_value numeric,
  ADD COLUMN IF NOT EXISTS back_height text,
  ADD COLUMN IF NOT EXISTS back_height_value numeric,
  ADD COLUMN IF NOT EXISTS armrest_height text,
  ADD COLUMN IF NOT EXISTS arm_rest_height_value numeric,
  ADD COLUMN IF NOT EXISTS footrest_length text,
  ADD COLUMN IF NOT EXISTS foot_rest_height_value numeric,
  ADD COLUMN IF NOT EXISTS overall_height text,
  ADD COLUMN IF NOT EXISTS height_value numeric,
  ADD COLUMN IF NOT EXISTS weight text,
  ADD COLUMN IF NOT EXISTS weight_value numeric,
  ADD COLUMN IF NOT EXISTS recommended_equipment text,
  ADD COLUMN IF NOT EXISTS recommended_size text,
  ADD COLUMN IF NOT EXISTS measurements text,
  ADD COLUMN IF NOT EXISTS wheelchair_fit text,
  ADD COLUMN IF NOT EXISTS recommendations text;

NOTIFY pgrst, 'reload schema';

COMMIT;