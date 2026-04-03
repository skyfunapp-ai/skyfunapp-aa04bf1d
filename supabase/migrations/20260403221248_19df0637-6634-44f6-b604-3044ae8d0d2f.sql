
-- 1. Create the missing trigger for protect_skoin_balance
CREATE TRIGGER enforce_skoin_balance_protection
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_skoin_balance();

-- 2. Enable RLS on skoin_transactions table
ALTER TABLE public.skoin_transactions ENABLE ROW LEVEL SECURITY;
