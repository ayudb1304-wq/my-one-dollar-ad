-- Migration 4: Row Level Security policies
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Public can read active pixels (needed for grid display)
CREATE POLICY "Anyone can view active pixels"
  ON pixels FOR SELECT USING (status = 'active');

-- Service role manages all pixel operations (checkout, webhooks)
CREATE POLICY "Service role manages pixels"
  ON pixels FOR ALL USING (auth.role() = 'service_role');

-- Users can view own profile
CREATE POLICY "Users view own profile"
  ON users FOR SELECT USING (auth.uid() = id);

-- Service role manages users
CREATE POLICY "Service role manages users"
  ON users FOR ALL USING (auth.role() = 'service_role');

-- Users can view own transactions
CREATE POLICY "Users view own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Service role manages transactions
CREATE POLICY "Service role manages transactions"
  ON transactions FOR ALL USING (auth.role() = 'service_role');
