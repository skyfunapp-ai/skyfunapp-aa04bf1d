DROP POLICY IF EXISTS "Users can view their own profile photo object" ON storage.objects;

CREATE POLICY "Users can view their own profile photo object"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);