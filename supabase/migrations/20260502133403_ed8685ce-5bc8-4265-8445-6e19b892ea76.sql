CREATE OR REPLACE FUNCTION public.protect_skoin_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.skoin_balance IS DISTINCT FROM OLD.skoin_balance THEN
    -- Allow when running inside a SECURITY DEFINER function owned by postgres
    -- (session_user = 'postgres' indicates a trusted server-side context)
    IF current_setting('role', true) = 'service_role' OR session_user = 'postgres' THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'skoin_balance cannot be modified directly';
  END IF;
  RETURN NEW;
END;
$$;