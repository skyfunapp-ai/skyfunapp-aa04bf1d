
-- 1. Fix public bucket listing: drop the broad SELECT policy on storage.objects.
-- Direct file access via getPublicUrl still works because the bucket is public
-- (public URLs bypass RLS); dropping this policy prevents listing/enumeration via the API.
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;

-- 2. Convert text ID columns to uuid with FK to profiles for referential integrity.
-- Clean up any rows that don't parse as uuid before conversion.
DELETE FROM public.connections WHERE connected_user_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
DELETE FROM public.blocked_users WHERE blocked_user_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE public.connections
  ALTER COLUMN connected_user_id TYPE uuid USING connected_user_id::uuid;
ALTER TABLE public.blocked_users
  ALTER COLUMN blocked_user_id TYPE uuid USING blocked_user_id::uuid;

ALTER TABLE public.connections
  ADD CONSTRAINT connections_connected_user_id_fkey
  FOREIGN KEY (connected_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.blocked_users
  ADD CONSTRAINT blocked_users_blocked_user_id_fkey
  FOREIGN KEY (blocked_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Restrict profile visibility: authenticated users only, and exclude users
-- involved in a mutual block relationship. Own profile always visible.
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view non-blocked profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR NOT EXISTS (
    SELECT 1 FROM public.blocked_users b
    WHERE (b.user_id = auth.uid() AND b.blocked_user_id = profiles.id)
       OR (b.user_id = profiles.id AND b.blocked_user_id = auth.uid())
  )
);
