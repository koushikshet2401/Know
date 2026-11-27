CREATE TABLE IF NOT EXISTS plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  price_inr       NUMERIC(10,2) NOT NULL,
  conversations   INTEGER NOT NULL,
  websites        INTEGER NOT NULL,
  agents          INTEGER NOT NULL,
  web_crawling    BOOLEAN DEFAULT FALSE,
  human_handoff   BOOLEAN DEFAULT FALSE,
  duration_days   INTEGER NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS client_subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID REFERENCES clients(id) ON DELETE CASCADE,
  plan_id             UUID REFERENCES plans(id),
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at             TIMESTAMPTZ NOT NULL,
  status              VARCHAR(20) DEFAULT 'active'
                        CHECK (status IN ('active','expired','cancelled','suspended')),
  conversations_used  INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
