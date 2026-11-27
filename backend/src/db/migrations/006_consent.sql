CREATE TABLE IF NOT EXISTS consent_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID REFERENCES clients(id) ON DELETE CASCADE,
  email             VARCHAR(255) NOT NULL,
  consent_given     BOOLEAN NOT NULL DEFAULT FALSE,
  consent_given_at  TIMESTAMPTZ,
  consent_text      TEXT NOT NULL,
  ip_address        INET,
  withdrawn_at      TIMESTAMPTZ,
  data_deleted_at   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
