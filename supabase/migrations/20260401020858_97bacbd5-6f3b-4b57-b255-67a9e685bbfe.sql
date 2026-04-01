
-- Create skoin_transactions table for payment idempotency
CREATE TABLE public.skoin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  coins INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skoin_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.skoin_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No insert/update/delete from client — only service role (edge functions) writes to this table
