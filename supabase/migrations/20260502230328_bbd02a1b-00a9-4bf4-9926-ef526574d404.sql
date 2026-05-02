ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles(last_seen);