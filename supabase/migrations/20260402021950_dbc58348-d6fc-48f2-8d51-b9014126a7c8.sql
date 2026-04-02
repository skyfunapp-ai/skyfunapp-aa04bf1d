
-- 1. Trigger to prevent authenticated users from modifying skoin_balance
CREATE OR REPLACE FUNCTION public.protect_skoin_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.skoin_balance IS DISTINCT FROM OLD.skoin_balance THEN
    IF current_setting('role') != 'service_role' THEN
      RAISE EXCEPTION 'skoin_balance cannot be modified directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_skoin_balance_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_skoin_balance();

-- 2. Revoke direct UPDATE on skoin_balance from authenticated role
REVOKE UPDATE (skoin_balance) ON public.profiles FROM authenticated;

-- 3. Protect email: revoke SELECT on email from authenticated, then grant SELECT on all other columns
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (id, created_at, updated_at, skoin_balance, name, occupation, hobbies, interested_in, favorite_food, profile_photo, current_airport, destination_airport) ON public.profiles TO authenticated;
