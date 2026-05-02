-- Referral codes per user
CREATE TABLE public.referral_codes (
  user_id UUID NOT NULL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view referral codes"
  ON public.referral_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own referral code"
  ON public.referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Referrals (who referred whom)
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL UNIQUE,
  rewarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Function to generate a unique 8-char code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
    IF NOT EXISTS (SELECT 1 FROM public.referral_codes WHERE code = new_code) THEN
      done := true;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Redeem referral: called from client right after signup with a referral code
CREATE OR REPLACE FUNCTION public.redeem_referral(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- Reward both: +5 Skoins each
  UPDATE public.profiles SET skoin_balance = skoin_balance + 5 WHERE id = v_referrer;
  UPDATE public.profiles SET skoin_balance = skoin_balance + 5 WHERE id = v_user;

  RETURN jsonb_build_object('success', true, 'reward', 5);
END;
$$;

-- Get-or-create referral code for the current user
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_code TEXT;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT code INTO v_code FROM public.referral_codes WHERE user_id = v_user;
  IF v_code IS NOT NULL THEN
    RETURN v_code;
  END IF;

  v_code := public.generate_referral_code();
  INSERT INTO public.referral_codes (user_id, code) VALUES (v_user, v_code);
  RETURN v_code;
END;
$$;

-- Allow protect_skoin_balance trigger to bypass for these definer functions
-- (the function runs as definer, but role check uses current_setting('role'))
-- We'll grant necessary access; the trigger raises only on direct user updates.
-- Since the trigger checks current_setting('role') != 'service_role', SECURITY DEFINER may still trip it.
-- Update trigger to also allow when called from our definer functions via session var.