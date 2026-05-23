
-- 1. Restrict skoin_balance column from being readable by other users
REVOKE SELECT (skoin_balance) ON public.profiles FROM anon, authenticated;

-- Owner-only function to read their own balance
CREATE OR REPLACE FUNCTION public.get_my_skoin_balance()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT skoin_balance FROM public.profiles WHERE id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_skoin_balance() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_my_skoin_balance() TO authenticated;

-- 2. Restrict referral_codes SELECT to owner
DROP POLICY IF EXISTS "Anyone can view referral codes" ON public.referral_codes;
CREATE POLICY "Users can view own referral code"
  ON public.referral_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Prevent listing all profile photos via storage API. Public URLs still work because the bucket is public.
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;
