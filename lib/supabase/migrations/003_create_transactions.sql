-- Migration 3: Transactions table
CREATE TYPE transaction_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pixel_id UUID REFERENCES pixels(id),
  amount INT NOT NULL, -- amount in cents
  dodo_payment_id TEXT,
  status transaction_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_dodo ON transactions(dodo_payment_id);
