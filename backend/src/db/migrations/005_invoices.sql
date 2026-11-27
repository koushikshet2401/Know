CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES client_subscriptions(id),
  invoice_number  VARCHAR(50) UNIQUE NOT NULL,
  amount_inr      NUMERIC(10,2) NOT NULL,
  gst_amount      NUMERIC(10,2) NOT NULL,
  total_inr       NUMERIC(10,2) NOT NULL,
  status          VARCHAR(20) DEFAULT 'paid'
                    CHECK (status IN ('paid','pending','cancelled')),
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  due_at          TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ
);
