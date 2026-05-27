
-- 1. Create owner-only skoin_balances table
CREATE TABLE public.skoin_balances (
  user_id UUID NOT NULL PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.skoin_balances TO authenticated;
GRANT ALL ON public.skoin_balances TO service_role;

ALTER TABLE public.skoin_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own balance" ON public.skoin_balances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- No INSERT/UPDATE policies for authenticated => only service_role / SECURITY DEFINER funcs can modify

-- 2. Migrate data from profiles
INSERT INTO public.skoin_balances (user_id, balance)
SELECT id, skoin_balance FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 3. Update get_my_skoin_balance to read from new table
CREATE OR REPLACE FUNCTION public.get_my_skoin_balance()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT balance FROM public.skoin_balances WHERE user_id = auth.uid();
$function$;

-- 4. Update redeem_referral to use new table
CREATE OR REPLACE FUNCTION public.redeem_referral(p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_referrer UUID;
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT user_id INTO v_referrer FROM public.referral_codes WHERE code = upper(p_code);
  IF v_referrer IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  IF v_referrer = v_user THEN
    RETURN jsonb_build_object('success', false, 'error', 'self_referral');
  END IF;

  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = v_user) THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_referred');
  END IF;

  INSERT INTO public.referrals (referrer_id, referred_id, rewarded)
  VALUES (v_referrer, v_user, true);

  INSERT INTO public.skoin_balances (user_id, balance) VALUES (v_referrer, 5)
    ON CONFLICT (user_id) DO UPDATE SET balance = public.skoin_balances.balance + 5, updated_at = now();
  INSERT INTO public.skoin_balances (user_id, balance) VALUES (v_user, 5)
    ON CONFLICT (user_id) DO UPDATE SET balance = public.skoin_balances.balance + 5, updated_at = now();

  RETURN jsonb_build_object('success', true, 'reward', 5);
END;
$function$;

-- 5. Update handle_new_user to create row in skoin_balances
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.skoin_balances (user_id, balance) VALUES (NEW.id, 5)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- 6. Drop the protect trigger function dependency and remove the column from profiles
DROP FUNCTION IF EXISTS public.protect_skoin_balance() CASCADE;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS skoin_balance;
