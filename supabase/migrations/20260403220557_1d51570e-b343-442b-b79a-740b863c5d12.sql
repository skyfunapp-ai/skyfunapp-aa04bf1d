
-- Remove email column from profiles to prevent exposure
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update the handle_new_user trigger to stop storing email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, skoin_balance)
  VALUES (NEW.id, 5);
  RETURN NEW;
END;
$function$;
