BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE id = 'blog-images';

DROP POLICY IF EXISTS blog_images_public_select ON storage.objects;
DROP POLICY IF EXISTS blog_images_admin_insert ON storage.objects;
DROP POLICY IF EXISTS blog_images_admin_update ON storage.objects;
DROP POLICY IF EXISTS blog_images_admin_delete ON storage.objects;

CREATE POLICY blog_images_public_select
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY blog_images_admin_insert
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'Admin'
    )
  );

CREATE POLICY blog_images_admin_update
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'Admin'
    )
  )
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'Admin'
    )
  );

CREATE POLICY blog_images_admin_delete
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'Admin'
    )
  );

COMMIT;